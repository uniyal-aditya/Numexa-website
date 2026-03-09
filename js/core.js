/* ================================================================
   NUMEXA — core.js
   Math evaluation, history, toast, cursor, background, nav routing
   ================================================================ */

// ── MATH LIBRARY WAIT ──
function whenMath(cb) {
  if (typeof math !== 'undefined') { cb(); return; }
  const t = setInterval(() => {
    if (typeof math !== 'undefined') { clearInterval(t); cb(); }
  }, 50);
}

// ── EVALUATE ──
function evaluateExpr(expr, cb) {
  if (!expr || !expr.trim()) { cb('', false); return; }
  whenMath(() => {
    try {
      const dMatch = expr.match(/^derivative\(\s*(.+?)\s*,\s*([a-z])\s*\)$/i);
      if (dMatch) {
        const d = math.derivative(dMatch[1], dMatch[2]);
        cb(d.toString(), false); return;
      }
      if (/^integrate\(/i.test(expr)) {
        cb('Symbolic integration requires server-side engine. Try: derivative(x^3,x)', true); return;
      }
      const result = math.evaluate(expr);
      if (typeof result === 'object' && result !== null && result.isMatrix) {
        cb(math.format(result, { notation: 'fixed', precision: 6 }), false);
      } else {
        cb(math.format(result, { notation: 'auto', precision: 10 }), false);
      }
    } catch(e) {
      cb('Error: ' + (e.message || 'invalid expression'), true);
    }
  });
}
window.evaluateExpr = evaluateExpr;

// ── HISTORY ──
const HIST_KEY = 'numexa_hist_v2';
function histLoad() {
  try { return JSON.parse(localStorage.getItem(HIST_KEY) || '[]'); } catch { return []; }
}
function histSave(a) {
  try { localStorage.setItem(HIST_KEY, JSON.stringify(a)); } catch {}
}
function histAdd(expr, result) {
  if (!expr) return;
  const a = histLoad();
  a.unshift({ expr, result, ts: Date.now() });
  if (a.length > 200) a.splice(200);
  histSave(a);
  renderHistoryPanel();
}
function histClear() { localStorage.removeItem(HIST_KEY); renderHistoryPanel(); }
function renderHistoryPanel() {
  const el = document.getElementById('historyList');
  if (!el) return;
  const a = histLoad();
  if (!a.length) {
    el.innerHTML = '<div style="color:var(--muted);font-family:var(--mono);font-size:.82rem;padding:8px">No history yet</div>';
    return;
  }
  el.innerHTML = a.slice(0, 30).map(it => `
    <div class="history-item" onclick="reuseHistory(${JSON.stringify(it.expr)})">
      <div class="history-expr">${escHtml(it.expr)}</div>
      <div class="history-result">= ${escHtml(it.result)}</div>
      <div class="history-time">${new Date(it.ts).toLocaleTimeString()}</div>
    </div>`).join('');
}
function reuseHistory(expr) { /* overridden by each view */ }
window.histAdd = histAdd;
window.histClear = histClear;
window.renderHistoryPanel = renderHistoryPanel;

// ── UTILITIES ──
function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
window.escHtml = escHtml;

// ── TOAST ──
function showToast(msg, type = '') {
  const c = document.getElementById('toast-container');
  if (!c) return;
  const t = document.createElement('div');
  t.className = 'toast ' + type;
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}
window.showToast = showToast;

// ── BACKGROUND CANVAS ──
function initBg() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let tick = 0;
  function resize() {
    canvas.width  = window.innerWidth  * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    canvas.style.width  = window.innerWidth  + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.scale(devicePixelRatio, devicePixelRatio);
  }
  resize();
  window.addEventListener('resize', resize);
  function frame() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    const step = 64;
    ctx.strokeStyle = 'rgba(6,182,212,0.018)'; ctx.lineWidth = 1;
    const off = (tick * 0.18) % step;
    for (let x = off; x < window.innerWidth;  x += step) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,window.innerHeight); ctx.stroke(); }
    for (let y = off; y < window.innerHeight; y += step) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(window.innerWidth,y);   ctx.stroke(); }
    const g = ctx.createRadialGradient(window.innerWidth/2, 0, 0, window.innerWidth/2, 0, window.innerHeight * 0.6);
    g.addColorStop(0, 'rgba(6,182,212,0.04)'); g.addColorStop(1, 'transparent');
    ctx.fillStyle = g; ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    tick++; requestAnimationFrame(frame);
  }
  frame();

  // spawn floating symbols
  const syms = ['π','∫','Σ','√','∞','x²','sin','cos','∇','⊕','λ','∂','φ','ℝ','∈','e^x','Δ','∮'];
  for (let i = 0; i < 14; i++) {
    const el = document.createElement('div');
    el.className = 'floating';
    el.textContent = syms[i % syms.length];
    el.style.left = (Math.random() * 95) + '%';
    el.style.animationDuration = (14 + Math.random() * 18) + 's';
    el.style.animationDelay = (-Math.random() * 20) + 's';
    el.style.fontSize = (1 + Math.random() * 1.2) + 'rem';
    document.body.appendChild(el);
  }
}

// ── CURSOR ──
function initCursor() {
  const dot  = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;
  let mx = -999, my = -999, rx = mx, ry = my;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
    dot.style.opacity = '1'; ring.style.opacity = '1';
  });
  (function animRing() {
    rx += (mx - rx) * 0.15; ry += (my - ry) * 0.15;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(animRing);
  })();
  document.addEventListener('mousedown', () => {
    dot.style.transform = 'translate(-50%,-50%) scale(0.6)';
    ring.style.width = '40px'; ring.style.height = '40px';
  });
  document.addEventListener('mouseup', () => {
    dot.style.transform = 'translate(-50%,-50%) scale(1)';
    ring.style.width = '28px'; ring.style.height = '28px';
  });
  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
  document.addEventListener('mouseover', e => {
    if (e.target.closest('a,button')) {
      ring.style.width = '48px'; ring.style.height = '48px'; ring.style.borderColor = 'var(--accent)';
    } else {
      ring.style.width = '28px'; ring.style.height = '28px'; ring.style.borderColor = 'rgba(6,182,212,0.4)';
    }
  });
  document.documentElement.classList.add('custom-cursor');
}

// ── NAV ──
let activeView = 'home';
function navigate(view) {
  activeView = view;
  document.querySelectorAll('.nav-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.view === view)
  );
  const app = document.getElementById('app');
  app.classList.add('transitioning');
  requestAnimationFrame(() => {
    app.classList.remove('transitioning');
    const views = {
      home:       window.renderHome,
      playground: window.renderPlayground,
      preview:    window.renderPreview,
      features:   window.renderFeatures,
      docs:       window.renderDocs,
      api:        window.renderAPI
    };
    (views[view] || window.renderHome)();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
window.navigate = navigate;

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  initBg();
  initCursor();
  document.querySelectorAll('.nav-btn').forEach(btn =>
    btn.addEventListener('click', () => navigate(btn.dataset.view))
  );
  document.querySelector('.brand')?.addEventListener('click', () => navigate('home'));
  navigate('home');
});

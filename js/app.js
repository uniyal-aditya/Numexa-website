/* ================================================================
   NUMEXA — app.js  |  Shared utilities
   ================================================================ */

// ── MATH LIBRARY ──
function whenMath(cb) {
  if (typeof math !== 'undefined') { cb(); return; }
  const t = setInterval(() => { if (typeof math !== 'undefined') { clearInterval(t); cb(); } }, 50);
}

function evaluateExpr(expr, cb) {
  if (!expr || !expr.trim()) { cb('', false); return; }
  whenMath(() => {
    try {
      const dMatch = expr.match(/^derivative\(\s*(.+?)\s*,\s*([a-z])\s*\)$/i);
      if (dMatch) { const d = math.derivative(dMatch[1], dMatch[2]); cb(d.toString(), false); return; }
      if (/^integrate\(/i.test(expr)) { cb('Symbolic integration not yet supported. Try: derivative(x^3,x)', true); return; }
      const result = math.evaluate(expr);
      if (typeof result === 'object' && result !== null && result.isMatrix)
        cb(math.format(result, { notation: 'fixed', precision: 6 }), false);
      else
        cb(math.format(result, { notation: 'auto', precision: 10 }), false);
    } catch(e) { cb('Error: ' + (e.message || 'invalid expression'), true); }
  });
}

// ── HISTORY ──
const HIST_KEY = 'numexa_hist_v2';
function histLoad() { try { return JSON.parse(localStorage.getItem(HIST_KEY) || '[]'); } catch { return []; } }
function histSave(a) { try { localStorage.setItem(HIST_KEY, JSON.stringify(a)); } catch {} }
function histAdd(expr, result) {
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
    el.innerHTML = '<div style="color:var(--muted);font-size:.82rem;padding:8px;font-family:var(--mono)">No history yet</div>';
    return;
  }
  el.innerHTML = a.slice(0, 30).map(it => `
    <div class="history-item" onclick="reuseHistory(${JSON.stringify(it.expr)})">
      <div class="history-expr">${escHtml(it.expr)}</div>
      <div class="history-result">= ${escHtml(it.result)}</div>
      <div class="history-time">${new Date(it.ts).toLocaleTimeString()}</div>
    </div>`).join('');
}
function reuseHistory(expr) {
  const el = document.getElementById('calcInput') || document.getElementById('typeEditor');
  if (el) { el.value = expr; el.focus(); }
}

// ── UTILITIES ──
function escHtml(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function showToast(msg, type = '') {
  const c = document.getElementById('toast-container');
  if (!c) return;
  const t = document.createElement('div');
  t.className = 'toast ' + type;
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

// ── BACKGROUND ──
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
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(devicePixelRatio, devicePixelRatio);
  }
  resize();
  window.addEventListener('resize', resize);
  (function frame() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    const step = 64, off = (tick * 0.18) % step;
    ctx.strokeStyle = 'rgba(6,182,212,0.018)'; ctx.lineWidth = 1;
    for (let x = off; x < window.innerWidth;  x += step) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, window.innerHeight); ctx.stroke(); }
    for (let y = off; y < window.innerHeight; y += step) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(window.innerWidth, y); ctx.stroke(); }
    const g = ctx.createRadialGradient(window.innerWidth / 2, 0, 0, window.innerWidth / 2, 0, window.innerHeight * 0.6);
    g.addColorStop(0, 'rgba(6,182,212,0.04)'); g.addColorStop(1, 'transparent');
    ctx.fillStyle = g; ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    tick++; requestAnimationFrame(frame);
  })();
  // floating symbols
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
// left/top = exact mouse coords. CSS translate(-50%,-50%) centres both elements.
// Ring follows via rAF lerp. firstMove guard prevents ring sliding from off-screen.
function initCursor() {
  const dot  = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;
  let ready = false;          // don't animate ring until first mouse event
  let hoverSize = '28px';

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    if (!ready) { rx = mx; ry = my; ready = true; }  // snap ring on first move
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });

  // Ring lerps after cursor — position only via rAF, size/color via CSS transition
  (function animRing() {
    if (ready) {
      rx += (mx - rx) * 0.13;
      ry += (my - ry) * 0.13;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
    }
    requestAnimationFrame(animRing);
  })();

  document.addEventListener('mousedown', () => {
    dot.classList.add('cursor-click');
    ring.style.width  = '38px';
    ring.style.height = '38px';
  });
  document.addEventListener('mouseup', () => {
    dot.classList.remove('cursor-click');
    ring.style.width  = hoverSize;
    ring.style.height = hoverSize;
  });
  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });

  document.addEventListener('mouseover', e => {
    const isInteractive = e.target.closest('a, button, input, textarea, select, [onclick], label');
    hoverSize = isInteractive ? '46px' : '28px';
    ring.style.width       = hoverSize;
    ring.style.height      = hoverSize;
    ring.style.borderColor = isInteractive ? 'rgba(6,182,212,0.9)' : 'rgba(6,182,212,0.55)';
  });

  document.documentElement.classList.add('custom-cursor');
}

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  initBg();
  initCursor();
  renderHistoryPanel();
});

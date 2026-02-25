// app.js - SPA routing + page rendering
document.addEventListener('DOMContentLoaded', importInit);


function spawnMathSymbols() {
  if (document.querySelector('.floating')) return;
  const symbols = ["π", "∫", "Σ", "√", "∞", "x²", "sin(x)"];
  for (let i = 0; i < 12; i++) {
    const el = document.createElement("div");
    el.className = "floating";
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    el.style.left = Math.random() * 100 + "%";
    el.style.animationDuration = 12 + Math.random() * 10 + "s";
    document.body.appendChild(el);
  }
}
function importInit() {
  spawnMathSymbols();
  setupNav();
  registerViews();
  loadView('home');
  requestAnimationFrame(startBg);
}





/* ---------- navigation ---------- */
function setupNav() {
  document.querySelectorAll('.nav .menu .nav-btn').forEach(btn => {
    btn.addEventListener('click', () => loadView(btn.dataset.view));
  });
  // also allow header menu buttons loaded directly (some setups)
  document.querySelectorAll('.nav-btn').forEach(b => {
    b.addEventListener('click', () => loadView(b.dataset.view));
  });
}

/* ---------- view registry ---------- */
function registerViews() {
  window.views = {
    home: renderHome,
    playground: renderPlayground,
    preview: renderPreview,
    features: renderFeatures,
    docs: renderDocs,
    api: renderAPI,
    changelog: renderChangelog
  };
}

function loadView(name) {
  const fn = window.views[name] || renderHome;
  fn();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ---------- helpers ---------- */
const app = document.getElementById('app');

// placeholder, we populate carefully

/* ---------- HOME (long) ---------- */
function renderHome() {
  app.innerHTML = `
    <section class="section hero">
      <div>
        <h1>Scientific Calculator Built for Power</h1>
        <p class="lead">Compute, visualize, and solve advanced mathematics instantly — on the web and inside Discord.</p>
        <div class="panel long-article">
          <h3>Why Numexa?</h3>
          <p class="long-article">When math gets symbolic, matrix-heavy, or visual — common calculators fail. Numexa combines precision, symbolic solving, and an intuitive web playground so you can solve and share complex work quickly.</p>
          <div class="section-divider"></div>
          <h4>Explore</h4>
          <div class="features-grid" style="margin-top:14px">
            <div class="feature">Symbolic Math<br><small class="muted">Simplify, factor, solve</small></div>
            <div class="feature">Calculus Engine<br><small class="muted">Integrals & derivatives</small></div>
            <div class="feature">Matrix Ops<br><small class="muted">Solve linear systems</small></div>
            <div class="feature">Plotting<br><small class="muted">Interactive graphs</small></div>
            <div class="feature">Discord Integration<br><small class="muted">Slash commands</small></div>
            <div class="feature">Export & Share<br><small class="muted">PNG, LaTeX</small></div>
          </div>
        </div>
      </div>

      <div>
        <div class="panel calc-box">
          <label for="homeExpr" class="muted">Try a quick expression</label>
          <input id="homeExpr" placeholder="Type expression, e.g. integrate(sin(x), x)" aria-label="Expression input">
          <div class="calc-actions" style="margin-top:10px;display:flex;gap:8px">
            <button class="demo-btn" data-example="2^6 + 10">2^6 + 10</button>
            <button class="demo-btn" data-example="derivative(x^3, x)">d/dx x^3</button>
            <button class="demo-btn" data-example="integrate(sin(x), x)">∫ sin(x)</button>
          </div>
          <div class="out calc-output" id="homeResult">Result will appear here</div>
        </div>

        <div class="panel" style="margin-top:18px">
          <h3>Quick Demo</h3>
          <p class="muted">Press Enter to evaluate. Use functions like <code>sin(x)</code>, <code>integrate(expr, x)</code>, <code>derivative(expr, x)</code>, and matrix expressions using arrays.</p>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="panel">
        <h2>Interactive Demo Strip</h2>
        <p class="muted">Scroll through the examples and run them live with the Try buttons.</p>
        <div class="section-divider"></div>

        <div style="display:flex;gap:18px;flex-wrap:wrap">
          <div class="panel" style="flex:1;min-width:260px">
            <h4>Symbolic</h4>
            <p class="muted">Simplify, expand and factor expressions.</p>
            <div style="margin-top:10px">
              <code>simplify((x^2-1)/(x-1))</code><br>
              <button class="try-btn" data-e="simplify((x^2-1)/(x-1))">Try</button>
            </div>
          </div>

          <div class="panel" style="flex:1;min-width:260px">
            <h4>Linear Algebra</h4>
            <p class="muted">Matrix inversion and solving.</p>
            <div style="margin-top:10px">
              <code>inv([[1,2],[3,4]])</code><br>
              <button class="try-btn" data-e="inv([[1,2],[3,4]])">Try</button>
            </div>
          </div>

          <div class="panel" style="flex:1;min-width:260px">
            <h4>Plot</h4>
            <p class="muted">Plot single-variable functions.</p>
            <div style="margin-top:10px">
              <code>sin(x) + 0.3*sin(3x)</code><br>
              <button class="plot-btn" data-fn="sin(x) + 0.3*sin(3*x)">Plot</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="panel">
        <h2>Numexa + Discord</h2>
        <p class="muted">A first-class Discord experience: slash commands that return rich math results, LaTeX render previews, and plot images.</p>

        <div class="section-divider"></div>

        <div class="discord-card">
          <div class="discord-msg">
            <div class="discord-avatar">N</div>
            <div>
              <div style="font-weight:700">Numexa</div>
              <div class="muted">/calc integrate sin(x) dx</div>
            </div>
          </div>

          <div class="discord-msg">
            <div class="discord-avatar">N</div>
            <div>
              <div style="font-weight:700">Numexa</div>
              <div class="muted">Result: -cos(x) + C</div>
            </div>
          </div>

          <div style="margin-top:14px">
            <img src="assets/discord/command.png" alt="Discord command screenshot" style="max-width:380px;border-radius:8px;border:1px solid rgba(255,255,255,0.03)">
            <img src="assets/discord/result.png" alt="Discord result screenshot" style="max-width:380px;border-radius:8px;border:1px solid rgba(255,255,255,0.03);margin-left:12px">
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="panel">
        <h2>What You'll Enjoy Exploring</h2>
        <ul class="long-article">
          <li>Run symbolic transforms and inspect steps.</li>
          <li>Create and share plots with interactive pan/zoom.</li>
          <li>Save sessions in your browser for research or school.</li>
          <li>Instantly try commands and copy them to use in Discord.</li>
        </ul>
      </div>
    </section>

    <section class="section">
      <div class="panel cta-panel" style="text-align:center">
        <h2>Get Started</h2>
        <p class="muted">Open the full playground or invite the bot to your server.</p>
        <a class="cta invite" href="#playground" onclick="loadView('playground')">Open Playground</a>
        <a class="cta invite" href="#invite" style="margin-left:12px">Invite Bot</a>
      </div>
    </section>
  `;

  // wire up quick interactions after render
  wireHomeInteractions();
}

/* ---------- Playgorund view (long & app-like) ---------- */

function renderPlayground() {
  window.setCursorContext && window.setCursorContext("playground");

  app.innerHTML = `
    <section class="section">
      <div class="panel">
        <h1>Playground</h1>
        <p class="muted">Switch between Calculator UI and Type Mode.</p>

        <div style="display:flex;gap:10px;align-items:center;margin:12px 0">
          <span class="muted">Calculator</span>
          <input type="checkbox" id="modeToggle">
          <span class="muted">Type</span>
        </div>

        <div id="playgroundArea"></div>
      </div>
    </section>
  `;

  const area = document.getElementById("playgroundArea");
  const toggle = document.getElementById("modeToggle");

  toggle.onchange = () => {
    toggle.checked ? renderTypeMode(area) : renderCalculatorUI(area);
  };

  renderCalculatorUI(area);




}

function renderCalculatorUI(area) {
  window.setCursorContext && window.setCursorContext("playground");

  area.innerHTML = `
    <div class="calculator">
      <div class="calc-display">
        <div id="calcExpr">0</div>
      </div>

      <div class="calc-keys">
        <button class="op">C</button>
        <button class="op">⌫</button>
        <button class="op">%</button>
        <button class="op">÷</button>

        <button>7</button><button>8</button><button>9</button><button class="op">×</button>
        <button>4</button><button>5</button><button>6</button><button class="op">−</button>
        <button>1</button><button>2</button><button>3</button><button class="op">+</button>

        <button class="wide">0</button>
        <button>.</button>
        <button class="equals">=</button>
      </div>
    </div>
  `;

  function initCalculatorUI() {
    const display = document.getElementById("calcExpr");
    let expr = "";
    let justEvaluated = false;

    document.querySelectorAll(".calc-keys button").forEach(btn => {
      btn.onclick = () => {
        const t = btn.textContent;

        if (t === "C") {
          expr = "";
          justEvaluated = false;
        }

        else if (t === "⌫") {
          expr = expr.slice(0, -1);
        }

        else if (t === "=") {
          evaluateAndRender(
            expr.replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-"),
            r => {
              expr = r;
              justEvaluated = true;
              display.textContent = expr || "0";
            }
          );
          return;
        }

        else if (t === "%") {
          expr = expr.replace(/(\d+\.?\d*)$/, v => String(Number(v) / 100));
        }

        else {
          if (justEvaluated) {
            expr = "";
            justEvaluated = false;
          }
          expr += t.replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-");
        }

        display.textContent = expr || "0";
      };
    });
  }


  initCalculatorUI();
}



function renderTypeMode(area) {
  area.innerHTML = `
      <textarea id="editor" class="editor" placeholder="Type expressions here..."></textarea>
      <button id="runAll" class="btn" style="margin-top:10px">Run</button>
      <pre id="typeOut" class="panel" style="margin-top:10px"></pre>
    `;
  document.getElementById("runAll").onclick = () => {
    evaluateAndRender(
      document.getElementById("editor").value,
      r => document.getElementById("typeOut").textContent = r
    );
  };

}




/* ---------- Live Bot Preview (full page) ---------- */
function renderPreview() {
  window.setCursorContext && window.setCursorContext("preview");

  app.innerHTML = `
  <section class="section">
    <div class="panel discord-card">
      <h1>Live Bot Preview</h1>

      <div class="discord-msg">
        <div class="discord-avatar">N</div>
        <div>
          <div class="muted">/calc</div>
          <input id="discordInput" class="editor" placeholder="integrate sin(x)">
        </div>
      </div>

      <div class="discord-msg">
        <div class="discord-avatar">N</div>
        <div id="discordResult" class="muted">Result appears here</div>
      </div>

      <button id="discordRun" class="btn" style="margin-top:10px">Run</button>
    </div>
  </section>
  `;

  document.getElementById("discordRun").onclick = () => {
    const v = document.getElementById("discordInput").value;
    evaluateAndRender(v, r => {
      document.getElementById("discordResult").textContent = r;
    });
  };
}

/* ---------- Features, Docs, API, Changelog (long pages) ---------- */
function renderFeatures() {
  app.innerHTML = `
    <section class="section">
      <div class="panel">
        <h1>Features</h1>
        <p class="muted">A deep explanation of all core capabilities — each block expands with examples you can try directly.</p>
        <div class="section-divider"></div>
        <div class="features-grid">
          <div class="feature panel explore"><strong>Scientific & Symbolic</strong><div class="muted">Integrals, derivatives, symbolic simplification</div></div>
          <div class="feature panel explore"><strong>Matrix & Linear Algebra</strong><div class="muted">Inverse, det, solve</div></div>
          <div class="feature panel explore"><strong>Plotting</strong><div class="muted">Interactive graphs with pan/zoom</div></div>
          <div class="feature panel explore"><strong>Export</strong><div class="muted">PNG figures, LaTeX export</div></div>
          <div class="feature panel explore"><strong>Playground</strong><div class="muted">Multi-line workspace and history</div></div>
          <div class="feature panel explore"><strong>Discord</strong><div class="muted">Slash commands, images & embeds</div></div>
        </div>
      </div>
    </section>
  `;
}

function renderDocs() {
  app.innerHTML = `
    <section class="section">
      <div class="panel">
        <h1>Docs</h1>
        <p class="muted">Show usage, command reference and examples.</p>
        <div class="section-divider"></div>
        <h3>Quick examples</h3>
        <pre><code>/calc integrate sin(x) dx
/plot sin(x), -10, 10
/calc simplify((x^2-1)/(x-1))</code></pre>
      </div>
    </section>
  `;
}

function renderAPI() {
  app.innerHTML = `
    <section class="section">
      <div class="panel">
        <h1>API</h1>
        <p class="muted">Documented endpoints for programmatic evaluation (future: API keys)</p>
        <div class="section-divider"></div>
        <p class="muted">POST /api/evaluate { expression: 'sin(pi/2)' }</p>
      </div>
    </section>
  `;
}

function renderChangelog() {
  app.innerHTML = `
    <section class="section">
      <div class="panel">
        <h1>Changelog</h1>
        <p class="muted">Versioned updates & release notes</p>
        <div class="section-divider"></div>
        <ul class="long-article">
          <li>v1.0 — Initial release: playground, live preview, plotting</li>
        </ul>
      </div>
    </section>
  `;
}

/* ---------- wiring / interactions (home page QuickUI) ---------- */
function wireHomeInteractions() {
  // demo buttons
  document.querySelectorAll('.demo-btn').forEach(b => {
    b.addEventListener('click', (e) => {
      const ex = e.currentTarget.dataset.example;
      const inp = document.getElementById('homeExpr');
      inp.value = ex;
      evaluateAndRenderHome();
    });
  });

  // try buttons
  document.querySelectorAll('.try-btn').forEach(b => {
    b.addEventListener('click', () => {
      evaluateAndRender(b.dataset.e, (out) => showToast(out));
    });
  });

  document.querySelectorAll('.plot-btn').forEach(b => {
    b.addEventListener('click', () => {
      loadView('playground');
      setTimeout(() => { // after playground loads
        const canvas = document.getElementById('plotCanvas');
        plotExpression(b.dataset.fn, canvas);
      }, 200);
    });
  });

  // input evaluation
  const inp = document.getElementById('homeExpr');
  if (inp) {
    inp.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter') evaluateAndRenderHome();
    });
  }
}

function evaluateAndRenderHome() {
  const v = document.getElementById('homeExpr').value;
  evaluateAndRender(v, (out) => {
    const el = document.getElementById('homeResult');
    el.textContent = out;
    addHistory(v, out);
  });
}

/* ---------- utility: evaluate using math.js and fallbacks ---------- */
function evaluateAndRender(expression, cb) {
  try {
    const cleaned = expression.replace(/\^/g, "**");
    const result = math.evaluate(cleaned);
    cb(Array.isArray(result) ? JSON.stringify(result) : String(result));
  } catch {
    cb("Error: could not evaluate expression");
  }
}

/* ---------- history & toast ---------- */
function showToast(text) {
  console.log('toast:', text);
}


/* ---------- background canvas (simple animation) ---------- */
function startBg() {
  if (window.__bgRunning) return;
  window.__bgRunning = true;
  const canvas = document.getElementById('bgCanvas') || createBgCanvas();
  const ctx = canvas.getContext('2d');
  resizeCanvas(canvas);
  window.addEventListener('resize', () => resizeCanvas(canvas));

  let t = 0;
  function frame() {
    t += 1;
    drawGridLines(ctx, canvas.width, canvas.height, t);
    setTimeout(frame, 30);
  }
  frame();
}
function createBgCanvas() {
  const el = document.createElement('canvas');
  el.id = 'bgCanvas';
  el.className = 'math-bg';
  document.body.appendChild(el);
  return el;
}
function resizeCanvas(c) {
  c.width = window.innerWidth * devicePixelRatio;
  c.height = window.innerHeight * devicePixelRatio;
  c.style.width = (window.innerWidth) + 'px';
  c.style.height = (window.innerHeight) + 'px';
  c.getContext('2d').scale(devicePixelRatio, devicePixelRatio);
}
function drawGridLines(ctx, w, h, t) {
  // Clear
  ctx.clearRect(0, 0, w, h);
  const W = w / devicePixelRatio;
  const H = h / devicePixelRatio;
  // subtle moving grid
  const step = 60;
  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,0.015)';
  ctx.lineWidth = 1;
  const offset = (t * 0.2) % step;
  for (let x = offset; x < W; x += step) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = offset; y < H; y += step) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }
  ctx.restore();
}

/* ---------- simple toast/console helpers ---------- */
function addHistory(expr, result) {
  if (!window.historyAdd || !expr) return;
  historyAdd({ expr, result, ts: Date.now() });
}

/* ---------- expose functions used by modules ---------- */
window.evaluateAndRender = evaluateAndRender;
window.loadView = loadView;
window.plotExpression = function (fn, canvas) {
  if (window._plotExpression) {
    window._plotExpression(fn, canvas);
  }
};


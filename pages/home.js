/* ================================================================
   NUMEXA — pages/home.js  |  Home page render + interactions
   ================================================================ */

function renderHome() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <section class="section hero">
      <div>
        <div class="hero-eyebrow"><span class="pulse-dot"></span> v1.2 · Now with Discord slash commands</div>
        <h1>Scientific Math,<br><span class="grad">Beautifully Solved</span></h1>
        <p class="hero-lead">Compute derivatives, plot functions, solve matrices, and run symbolic math — directly in the browser and inside Discord.</p>
        <div class="hero-btns">
          <button class="btn-primary" onclick="navigate('playground')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5,3 19,12 5,21"/></svg>
            Open Playground
          </button>
          <button class="btn-outline" onclick="navigate('docs')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
            View Docs
          </button>
        </div>
      </div>
      <div>
        <div style="position:relative;display:flex;justify-content:center;align-items:center;margin-bottom:18px">
          <div style="position:absolute;width:220px;height:220px;border-radius:50%;background:radial-gradient(circle,rgba(6,182,212,.18) 0%,transparent 70%);animation:pulse 3s infinite"></div>
          <img src="assets/favicon.png" alt="Numexa π" style="width:130px;height:130px;border-radius:20px;position:relative;z-index:1;box-shadow:0 0 60px rgba(6,182,212,.3),0 20px 40px rgba(0,0,0,.5)">
        </div>
        <div class="calc-box panel-glow">
          <div class="calc-box-header">
            <div class="dots"><div class="dot dot-r"></div><div class="dot dot-y"></div><div class="dot dot-g"></div></div>
            <span>numexa &gt; expression evaluator</span>
          </div>
          <input id="homeExpr" placeholder="Try: derivative(x^3,x) or 2^10 + sin(pi/2)" aria-label="Expression input" autocomplete="off" spellcheck="false">
          <div class="calc-example-btns">
            <button class="demo-btn" data-ex="2^10">2^10</button>
            <button class="demo-btn" data-ex="derivative(x^3,x)">d/dx x³</button>
            <button class="demo-btn" data-ex="inv([[1,2],[3,4]])">Matrix Inv</button>
            <button class="demo-btn" data-ex="sqrt(2) * pi">√2·π</button>
            <button class="demo-btn" data-ex="sin(pi/6)">sin(π/6)</button>
          </div>
          <div class="calc-out pending" id="homeResult">↑ Press Enter or click an example</div>
        </div>
      </div>
    </section>

    <section class="section" style="padding-top:0">
      <h2 style="font-size:1.6rem;font-weight:800;margin-bottom:20px">What Numexa Can Do</h2>
      <div class="features-grid">
        <div class="feature-card"><div class="feature-icon">∫</div><div class="feature-title">Calculus Engine</div><div class="feature-desc">Symbolic derivatives via math.js. Numerical integration support coming in v1.3.</div></div>
        <div class="feature-card"><div class="feature-icon">⊞</div><div class="feature-title">Linear Algebra</div><div class="feature-desc">Matrix inverse, determinant, transpose, eigenvalues and linear system solving.</div></div>
        <div class="feature-card"><div class="feature-icon">📈</div><div class="feature-title">Function Plotter</div><div class="feature-desc">Plot any single-variable function on an interactive canvas with axes and glow.</div></div>
        <div class="feature-card"><div class="feature-icon">🤖</div><div class="feature-title">Discord Bot</div><div class="feature-desc">Slash commands in any server. Returns formatted embeds with results and plots.</div></div>
        <div class="feature-card"><div class="feature-icon">⌨️</div><div class="feature-title">Playground</div><div class="feature-desc">Full calculator UI or multi-line text mode with persistent history.</div></div>
        <div class="feature-card"><div class="feature-icon">🔢</div><div class="feature-title">Scientific Mode</div><div class="feature-desc">Complex numbers, units, statistics, bitwise, and combinatorics all supported.</div></div>
      </div>
    </section>

    <section class="section" style="padding-top:0">
      <div class="panel panel-glow">
        <h2 style="font-size:1.3rem;font-weight:800;margin-bottom:6px">Try Examples Live</h2>
        <p style="color:var(--muted);font-size:.88rem;margin-bottom:20px">Click any Try button to evaluate instantly</p>
        <div class="section-divider"></div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px">
          ${[
            ['Symbolic',      'simplify((x^2-1)/(x-1))',    'Simplify a rational expression'],
            ['Calculus',      'derivative(sin(x)*x^2,x)',   'Product rule derivative'],
            ['Linear Algebra','det([[3,2],[1,4]])',           'Matrix determinant'],
            ['Statistics',    'mean([2,4,6,8,10])',          'Mean of a list'],
            ['Complex',       '(3+4i) * (1-2i)',             'Complex multiplication'],
            ['Units',         '5 km to m',                   'Unit conversion'],
          ].map(([label, expr, desc]) => `
            <div class="panel" style="padding:16px">
              <div style="font-size:.72rem;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);font-family:var(--mono);margin-bottom:6px">${label}</div>
              <code style="font-size:.82rem">${escHtml(expr)}</code>
              <p style="font-size:.78rem;color:var(--muted);margin:6px 0 10px">${desc}</p>
              <button class="try-btn" data-e="${escHtml(expr)}" style="background:rgba(6,182,212,.07);border:1px solid var(--border-bright);color:var(--accent);padding:5px 12px;border-radius:6px;font-family:var(--mono);font-size:.75rem;cursor:pointer">▶ Try</button>
            </div>`).join('')}
        </div>
      </div>
    </section>

    <section class="section" style="padding-top:0">
      <div class="panel panel-glow" style="text-align:center;padding:48px 32px">
        <div style="font-size:2rem;margin-bottom:8px">🚀</div>
        <h2 style="font-size:1.6rem;font-weight:800;margin-bottom:10px">Add Numexa to Discord</h2>
        <p style="color:var(--muted);max-width:480px;margin:0 auto 24px">Invite the bot to your server and run <code>/calc</code>, <code>/plot</code>, and <code>/help</code> in any channel.</p>
        <div class="hero-btns" style="justify-content:center">
          <a class="btn-primary" href="https://discord.com/oauth2/authorize" target="_blank" rel="noopener">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.09.12 18.12.145 18.14a19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z"/></svg>
            Invite to Discord
          </a>
          <button class="btn-outline" onclick="navigate('preview')">See Bot Preview</button>
        </div>
      </div>
    </section>`;

  // wire interactions
  const inp = document.getElementById('homeExpr');
  const out = document.getElementById('homeResult');
  function runHome() {
    const v = inp.value.trim(); if (!v) return;
    out.className = 'calc-out pending'; out.textContent = 'Evaluating…';
    evaluateExpr(v, (res, isErr) => {
      out.className = 'calc-out' + (isErr ? ' error' : '');
      out.textContent = isErr ? res : '= ' + res;
      if (!isErr) histAdd(v, res);
    });
  }
  inp.addEventListener('keydown', e => { if (e.key === 'Enter') runHome(); });
  document.querySelectorAll('.demo-btn').forEach(b =>
    b.addEventListener('click', () => { inp.value = b.dataset.ex; runHome(); })
  );
  document.querySelectorAll('.try-btn').forEach(b =>
    b.addEventListener('click', () =>
      evaluateExpr(b.dataset.e, (res, isErr) =>
        showToast((isErr ? '⚠ ' : '= ') + res, isErr ? 'error' : 'success')
      )
    )
  );
}
window.renderHome = renderHome;

/* ================================================================
   NUMEXA — pages/playground.js
   ================================================================ */

function renderPlayground() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <section class="section">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:16px;margin-bottom:20px">
        <div>
          <h1 style="font-size:1.8rem;font-weight:800;margin-bottom:4px">Playground</h1>
          <p style="color:var(--muted);font-size:.88rem">Full calculator or type mode · history saved locally</p>
        </div>
        <div class="mode-toggle-wrap">
          <span>Calculator</span>
          <div class="toggle" id="modeToggle"><div class="toggle-knob"></div></div>
          <span>Type Mode</span>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 320px;gap:20px;align-items:start" id="pgLayout">
        <div id="pgMain"></div>
        <div>
          <div class="panel panel-sm" style="margin-bottom:14px">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
              <span style="font-size:.75rem;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);font-family:var(--mono)">History</span>
              <button onclick="histClear()" style="background:none;border:none;color:var(--muted);font-size:.75rem;cursor:pointer;font-family:var(--mono)">Clear</button>
            </div>
            <div id="historyList" class="history-list"></div>
          </div>
          <div class="panel panel-sm">
            <div style="font-size:.75rem;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);font-family:var(--mono);margin-bottom:10px">Plot a Function</div>
            <div class="plot-wrap">
              <div class="plot-toolbar">
                <input id="plotInput" placeholder="sin(x) + 0.3*cos(3*x)" value="sin(x)">
                <button onclick="runPlot()">Plot</button>
              </div>
              <canvas id="plotCanvas" class="plot-canvas" width="300" height="200"></canvas>
              <div class="plot-info" id="plotInfo">Enter a function and click Plot</div>
            </div>
          </div>
        </div>
      </div>
    </section>`;

  if (window.innerWidth < 900) {
    document.getElementById('pgLayout').style.gridTemplateColumns = '1fr';
  }

  renderCalcUI();
  renderHistoryPanel();

  const toggle = document.getElementById('modeToggle');
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    toggle.classList.contains('active') ? renderTypeMode() : renderCalcUI();
  });

  window.reuseHistory = (expr) => {
    const el = document.getElementById('calcInput') || document.getElementById('typeEditor');
    if (el) { el.value = expr; el.focus(); }
  };

  setTimeout(() => runPlot(true), 300);
}
window.renderPlayground = renderPlayground;

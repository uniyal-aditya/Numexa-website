/* ================================================================
   NUMEXA — pages/preview.js  |  Discord bot preview
   ================================================================ */

function renderPreview() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <section class="section">
      <h1 style="font-size:1.8rem;font-weight:800;margin-bottom:6px">Live Bot Preview</h1>
      <p style="color:var(--muted);margin-bottom:24px">Simulate exactly how Numexa responds in your Discord server.</p>
      <div style="display:grid;grid-template-columns:1.2fr 1fr;gap:24px;align-items:start;flex-wrap:wrap">
        <div class="discord-shell">
          <div class="discord-titlebar"><span>#math-bot</span> &nbsp;|&nbsp; Numexa Bot · Online</div>
          <div class="discord-body" id="discordFeed">
            <div class="discord-msg">
              <div class="discord-avatar avatar-bot">N</div>
              <div class="discord-msg-content">
                <div class="name">Numexa <span class="bot-tag">BOT</span></div>
                <div class="msg-text">👋 Hi! Use <code>/calc</code> to evaluate math, <code>/plot</code> for graphs, or <code>/help</code> for all commands.</div>
              </div>
            </div>
          </div>
          <div class="discord-input-row">
            <div class="discord-slash">/calc &nbsp;</div>
            <input class="discord-input" id="discordIn" placeholder="integrate sin(x) dx" autocomplete="off">
            <button class="discord-run-btn" onclick="runDiscord()">Send</button>
          </div>
        </div>
        <div>
          <div class="panel panel-sm panel-glow" style="margin-bottom:14px">
            <div style="font-size:.75rem;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);font-family:var(--mono);margin-bottom:10px">Command Reference</div>
            <table class="cmd-table">
              <tr><th>Command</th><th>Description</th></tr>
              <tr><td>/calc [expr]</td><td>Evaluate any math expression</td></tr>
              <tr><td>/plot [fn]</td><td>Plot a function graph</td></tr>
              <tr><td>/derive [f] [x]</td><td>Differentiate with respect to x</td></tr>
              <tr><td>/matrix [A]</td><td>Matrix operations</td></tr>
              <tr><td>/help</td><td>List all commands</td></tr>
            </table>
          </div>
          <div class="panel panel-sm">
            <div style="font-size:.75rem;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);font-family:var(--mono);margin-bottom:10px">Quick Examples</div>
            ${[['2^32','Integer power'],['derivative(x^4,x)','Differentiation'],['det([[1,2],[3,4]])','Determinant'],['sin(pi/3)','Trig values'],['factorial(10)','Factorial']]
              .map(([e, d]) => `<div style="margin-bottom:8px">
                <button onclick="document.getElementById('discordIn').value='${e}';runDiscord()" style="background:rgba(6,182,212,.07);border:1px solid var(--border);color:var(--accent);padding:5px 10px;border-radius:6px;font-family:var(--mono);font-size:.75rem;cursor:pointer">${e}</button>
                <span style="color:var(--muted);font-size:.78rem;margin-left:6px">${d}</span>
              </div>`).join('')}
          </div>
        </div>
      </div>
    </section>`;

  document.getElementById('discordIn').addEventListener('keydown', e => { if (e.key === 'Enter') runDiscord(); });
}

function runDiscord() {
  const inp  = document.getElementById('discordIn');
  const feed = document.getElementById('discordFeed');
  if (!inp || !feed) return;
  const expr = inp.value.trim(); if (!expr) return;

  const userMsg = document.createElement('div');
  userMsg.className = 'discord-msg';
  userMsg.innerHTML = `
    <div class="discord-avatar avatar-user">U</div>
    <div class="discord-msg-content">
      <div class="name">You</div>
      <div class="msg-text"><span class="discord-slash">/calc </span>${escHtml(expr)}</div>
    </div>`;
  feed.appendChild(userMsg);

  evaluateExpr(expr, (res, isErr) => {
    const botMsg = document.createElement('div');
    botMsg.className = 'discord-msg';
    botMsg.innerHTML = `
      <div class="discord-avatar avatar-bot">N</div>
      <div class="discord-msg-content">
        <div class="name">Numexa <span class="bot-tag">BOT</span></div>
        <div class="discord-embed">
          <div class="embed-title">${isErr ? '⚠ Error' : '✅ Result'}</div>
          <div class="embed-field"><strong>Input:</strong> ${escHtml(expr)}</div>
          <div class="embed-field" style="margin-top:4px"><strong>${isErr ? 'Error' : 'Output'}:</strong>
            <span style="color:${isErr ? 'var(--red)' : 'var(--accent-2)'}">${escHtml(res)}</span>
          </div>
        </div>
      </div>`;
    feed.appendChild(botMsg);
    feed.scrollTop = feed.scrollHeight;
    if (!isErr) histAdd(expr, res);
  });
  inp.value = '';
  feed.scrollTop = feed.scrollHeight;
}

window.renderPreview = renderPreview;
window.runDiscord    = runDiscord;

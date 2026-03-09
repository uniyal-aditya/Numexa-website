/* ================================================================
   NUMEXA — pages/api.js
   ================================================================ */

function renderAPI() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <section class="section">
      <div style="margin-bottom:28px">
        <div class="hero-eyebrow"><span class="pulse-dot"></span> Developer API</div>
        <h1 style="font-size:1.8rem;font-weight:800;margin-bottom:8px">Numexa REST API</h1>
        <p style="color:var(--muted);max-width:560px">Integrate Numexa's computation engine into your own applications. API key system planned for v1.3.</p>
      </div>

      <div style="display:grid;grid-template-columns:1fr 340px;gap:24px;align-items:start">
        <div>
          <div class="panel panel-glow" style="margin-bottom:16px">

            <div class="api-endpoint">
              <div><span class="method-badge method-post">POST</span><span class="endpoint-path">/api/evaluate</span></div>
              <p style="color:var(--muted);font-size:.85rem;margin:10px 0 12px">Evaluate a mathematical expression. Returns the result or an error message.</p>
              <h4 style="font-size:.8rem;color:var(--text-dim);margin-bottom:8px">Request Body</h4>
              <pre>{
  "expression": "derivative(x^3, x)",
  "format": "auto"
}</pre>
              <h4 style="font-size:.8rem;color:var(--text-dim);margin:12px 0 8px">Response</h4>
              <pre>{
  "success": true,
  "result": "3 * x ^ 2",
  "type": "symbolic",
  "elapsed_ms": 4
}</pre>
            </div>

            <div class="api-endpoint" style="border-color:rgba(245,158,11,.15);background:rgba(245,158,11,.03)">
              <div><span class="method-badge method-get">GET</span><span class="endpoint-path">/api/health</span></div>
              <p style="color:var(--muted);font-size:.85rem;margin:10px 0 12px">Check API status and version.</p>
              <pre>{
  "status": "ok",
  "version": "1.2.0",
  "engine": "mathjs@11.8"
}</pre>
            </div>

            <div class="api-endpoint">
              <div><span class="method-badge method-post">POST</span><span class="endpoint-path">/api/plot</span></div>
              <p style="color:var(--muted);font-size:.85rem;margin:10px 0 12px">Generate a plot image for a function. Returns base64 PNG.</p>
              <pre>{
  "fn": "sin(x) + 0.5*cos(2*x)",
  "xMin": -10,
  "xMax": 10,
  "width": 600,
  "height": 300
}</pre>
            </div>

          </div>
        </div>

        <div>
          <div class="panel panel-glow panel-sm" style="margin-bottom:14px">
            <h4 style="font-size:.88rem;font-weight:700;margin-bottom:12px">Live API Tester</h4>
            <textarea id="apiReqBody" class="code-editor" style="min-height:100px;font-size:.8rem"
              placeholder='{"expression": "sin(pi/4)"}'></textarea>
            <button onclick="runApiTest()" class="run-btn" style="margin-top:10px;width:100%">▶ Test Locally</button>
            <div id="apiOut" class="output-block" style="margin-top:10px;font-size:.8rem"></div>
          </div>

          <div class="panel panel-glow panel-sm">
            <h4 style="font-size:.88rem;font-weight:700;margin-bottom:10px">Rate Limits</h4>
            <table class="cmd-table" style="font-size:.8rem">
              <tr><th>Tier</th><th>Req/min</th></tr>
              <tr><td>Free</td><td>60</td></tr>
              <tr><td>Pro (planned)</td><td>600</td></tr>
              <tr><td>Enterprise</td><td>Unlimited</td></tr>
            </table>
            <p style="color:var(--muted);font-size:.78rem;margin-top:10px">API keys and authentication coming in v1.3. Currently in open beta.</p>
          </div>
        </div>
      </div>
    </section>`;
}

function runApiTest() {
  const body = document.getElementById('apiReqBody')?.value?.trim();
  const out  = document.getElementById('apiOut');
  if (!out) return;
  let parsed;
  try { parsed = JSON.parse(body || '{}'); }
  catch { out.textContent = 'Invalid JSON body'; out.style.color = 'var(--red)'; return; }
  const expr = parsed.expression || '';
  if (!expr) { out.textContent = 'No "expression" field provided'; out.style.color = 'var(--red)'; return; }
  out.textContent = 'Running…'; out.style.color = 'var(--muted)';
  const t0 = performance.now();
  evaluateExpr(expr, (res, isErr) => {
    const elapsed = Math.round(performance.now() - t0);
    out.style.color = isErr ? 'var(--red)' : 'var(--accent-2)';
    out.textContent = JSON.stringify({ success: !isErr, result: res, type: 'evaluated', elapsed_ms: elapsed }, null, 2);
  });
}

window.renderAPI   = renderAPI;
window.runApiTest  = runApiTest;

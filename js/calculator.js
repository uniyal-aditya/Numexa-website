/* ================================================================
   NUMEXA — calculator.js  |  Calculator UI + Type Mode logic
   ================================================================ */

function renderCalcUI() {
  const area = document.getElementById('pgMain');
  if (!area) return;
  area.innerHTML = `
    <div style="display:flex;gap:16px;align-items:flex-start;flex-wrap:wrap">
      <div class="calculator">
        <div class="calc-display">
          <div class="calc-display-sub" id="calcSub"></div>
          <div class="calc-display-main" id="calcMain">0</div>
        </div>
        <div class="calc-keys" id="calcKeys">
          <button class="fn">sin</button><button class="fn">cos</button><button class="fn">√</button><button class="op">C</button>
          <button class="fn">tan</button><button class="fn">log</button><button class="fn">π</button><button class="op">⌫</button>
          <button class="op">%</button><button class="op">(</button><button class="op">)</button><button class="op">÷</button>
          <button>7</button><button>8</button><button>9</button><button class="op">×</button>
          <button>4</button><button>5</button><button>6</button><button class="op">−</button>
          <button>1</button><button>2</button><button>3</button><button class="op">+</button>
          <button class="wide">0</button><button>.</button><button class="equals">=</button>
        </div>
      </div>
      <div style="flex:1;min-width:200px">
        <div class="panel panel-sm">
          <div style="font-size:.75rem;color:var(--muted);font-family:var(--mono);margin-bottom:8px">Quick Input</div>
          <input id="calcInput" placeholder="Type any expression…" autocomplete="off" spellcheck="false"
            style="width:100%;padding:10px 12px;background:#030710;border:1px solid var(--border);border-radius:8px;color:var(--text);font-family:var(--mono);font-size:.88rem;outline:none;transition:border-color .15s">
          <button onclick="runCalcInput()" class="run-btn" style="margin-top:10px;width:100%">Evaluate ↵</button>
          <div id="calcInputOut" class="output-block" style="margin-top:10px"></div>
        </div>
      </div>
    </div>`;
  initCalcButtons();
  const inp = document.getElementById('calcInput');
  if (inp) inp.addEventListener('keydown', e => { if (e.key === 'Enter') runCalcInput(); });
}

function runCalcInput() {
  const v   = document.getElementById('calcInput')?.value?.trim();
  const out = document.getElementById('calcInputOut');
  if (!v || !out) return;
  out.textContent = 'Evaluating…'; out.style.color = 'var(--muted)';
  evaluateExpr(v, (res, isErr) => {
    out.textContent = isErr ? res : '= ' + res;
    out.style.color = isErr ? 'var(--red)' : 'var(--accent-2)';
    if (!isErr) histAdd(v, res);
  });
}

function initCalcButtons() {
  const main = document.getElementById('calcMain');
  const sub  = document.getElementById('calcSub');
  let expr = '', lastResult = false;
  if (!main) return;

  document.querySelectorAll('#calcKeys button').forEach(btn => {
    btn.addEventListener('click', () => {
      const t = btn.textContent.trim();
      if (t === 'C')  { expr = ''; lastResult = false; sub.textContent = ''; main.textContent = '0'; return; }
      if (t === '⌫')  { expr = expr.slice(0, -1); main.textContent = expr || '0'; return; }
      if (t === '=')  {
        const raw = expr.replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-').replace(/π/g,'pi');
        sub.textContent = expr + ' =';
        evaluateExpr(raw, (res, isErr) => {
          main.textContent = isErr ? 'Error' : res;
          if (!isErr) { histAdd(expr, res); expr = res; lastResult = true; }
        });
        return;
      }
      if (['sin','cos','tan','log'].includes(t)) {
        if (lastResult) { expr = ''; lastResult = false; }
        expr += t + '(';
      } else if (t === '√') {
        if (lastResult) { expr = ''; lastResult = false; }
        expr += 'sqrt(';
      } else if (t === 'π') {
        if (lastResult) { expr = ''; lastResult = false; }
        expr += 'pi';
      } else {
        if (lastResult && /[0-9.]/.test(t)) { expr = ''; lastResult = false; }
        expr += t.replace('×','*').replace('÷','/').replace('−','-');
      }
      main.textContent = expr || '0';
    });
  });
}

function renderTypeMode() {
  const area = document.getElementById('pgMain');
  if (!area) return;
  area.innerHTML = `
    <div class="panel">
      <div style="font-size:.78rem;color:var(--muted);font-family:var(--mono);margin-bottom:10px">Multi-line expression editor</div>
      <div class="editor-wrap">
        <div>
          <textarea id="typeEditor" class="code-editor"
            placeholder="// One expression per line&#10;2^10&#10;derivative(x^3, x)&#10;sin(pi/4)&#10;inv([[1,2],[3,4]])"></textarea>
          <button class="run-btn" onclick="runTypeMode()" style="margin-top:10px">▶ Run All</button>
          <div id="typeOut" class="output-block" style="margin-top:10px"></div>
        </div>
        <div class="editor-sidebar">
          <h4>Functions</h4>
          ${['sin(x)','cos(x)','tan(x)','sqrt(x)','log(x)','abs(x)','ceil(x)','floor(x)',
             'round(x)','exp(x)','sign(x)','factorial(n)','derivative(f,x)',
             'inv(A)','det(A)','transpose(A)','mean([…])','std([…])']
            .map(f => `<span class="fn-chip" onclick="insertFn('${f}')">${f.split('(')[0]}</span>`)
            .join('')}
        </div>
      </div>
    </div>`;

  window.insertFn = (fn) => {
    const ed = document.getElementById('typeEditor');
    if (!ed) return;
    const p = ed.selectionStart;
    ed.value = ed.value.slice(0, p) + fn + ed.value.slice(p);
    ed.selectionStart = ed.selectionEnd = p + fn.length;
    ed.focus();
  };
}

function runTypeMode() {
  const ed  = document.getElementById('typeEditor');
  const out = document.getElementById('typeOut');
  if (!ed || !out) return;
  const lines = ed.value.split('\n').filter(l => l.trim() && !l.trim().startsWith('//'));
  if (!lines.length) { out.textContent = 'Nothing to run.'; return; }
  out.textContent = 'Running…';
  let i = 0; const results = [];
  function next() {
    if (i >= lines.length) { out.textContent = results.join('\n'); return; }
    const l = lines[i++];
    evaluateExpr(l, (res, isErr) => {
      results.push((isErr ? '⚠ ' : '» ') + l + '\n  = ' + res);
      if (!isErr) histAdd(l, res);
      next();
    });
  }
  next();
}

window.renderCalcUI  = renderCalcUI;
window.renderTypeMode = renderTypeMode;
window.runCalcInput  = runCalcInput;
window.runTypeMode   = runTypeMode;

/* ================================================================
   NUMEXA — pages/docs.js
   ================================================================ */

function renderDocs() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <section class="section">
      <h1 style="font-size:1.8rem;font-weight:800;margin-bottom:4px">Documentation</h1>
      <p style="color:var(--muted);margin-bottom:28px">Complete reference for all Numexa capabilities</p>
      <div class="docs-grid">
        <div class="docs-nav panel panel-sm">
          ${['Getting Started','Calculator','Calculus','Linear Algebra','Statistics','Discord Commands','Keyboard Shortcuts']
            .map((s, i) => `<div class="docs-nav-item${i===0?' active':''}" onclick="highlightDocNav(this)">${s}</div>`)
            .join('')}
        </div>
        <div class="docs-content">

          <div class="panel panel-glow" style="margin-bottom:16px">
            <h2>Getting Started</h2>
            <p>Numexa is a web-based scientific calculator and Discord bot powered by <a href="https://mathjs.org" target="_blank">math.js</a>. Open the Playground to use the calculator UI or write multi-line expressions.</p>
            <h3>Quick Start</h3>
            <pre>// Basic arithmetic
2^10 + sqrt(144)

// Trigonometry (radians by default)
sin(pi / 6)   // → 0.5

// Derivatives
derivative(x^3 + 2*x, x)  // → 3x² + 2</pre>
          </div>

          <div class="panel panel-glow" style="margin-bottom:16px">
            <h2>Calculator</h2>
            <p>The Playground has two modes: Calculator UI (button grid) and Type Mode (multi-line editor).</p>
            <h3>Supported Operators</h3>
            <table class="cmd-table">
              <tr><th>Operator</th><th>Meaning</th><th>Example</th></tr>
              <tr><td>+  -  *  /</td><td>Basic arithmetic</td><td>3 + 4 * 2</td></tr>
              <tr><td>^  or  **</td><td>Exponent</td><td>2^8</td></tr>
              <tr><td>%</td><td>Modulo</td><td>17 % 5</td></tr>
              <tr><td>( )</td><td>Grouping</td><td>(3+4)*2</td></tr>
            </table>
            <h3>Constants</h3>
            <table class="cmd-table">
              <tr><th>Constant</th><th>Value</th></tr>
              <tr><td>pi</td><td>3.14159265…</td></tr>
              <tr><td>e</td><td>2.71828182…</td></tr>
              <tr><td>i</td><td>√−1 (imaginary unit)</td></tr>
              <tr><td>Infinity</td><td>∞</td></tr>
            </table>
          </div>

          <div class="panel panel-glow" style="margin-bottom:16px">
            <h2>Calculus</h2>
            <p>Symbolic derivatives are supported via the math.js <code>derivative()</code> function.</p>
            <h3>Derivatives</h3>
            <pre>derivative(x^4, x)           // → 4x³
derivative(sin(x), x)        // → cos(x)
derivative(x*e^x, x)         // → e^x + x*e^x
derivative(log(x), x)        // → 1/x</pre>
            <h3>Integration</h3>
            <p>Symbolic integration requires a server-side CAS engine (planned). Numerical integration with defined bounds will be added in v1.3.</p>
          </div>

          <div class="panel panel-glow" style="margin-bottom:16px">
            <h2>Linear Algebra</h2>
            <p>Use array syntax <code>[[row1], [row2]]</code> for matrices.</p>
            <pre>inv([[1,2],[3,4]])            // Inverse
det([[1,2],[3,4]])            // Determinant → -2
transpose([[1,2,3],[4,5,6]])  // Transpose
lusolve([[1,0],[0,1]], [1,2]) // Solve Ax=b</pre>
          </div>

          <div class="panel panel-glow" style="margin-bottom:16px">
            <h2>Statistics</h2>
            <p>Statistical functions accept arrays in <code>[...]</code> syntax.</p>
            <pre>mean([1,2,3,4,5])      // 3
std([1,2,3,4,5])       // 1.414...
variance([1,2,3])      // 0.667
median([3,1,4,1,5])    // 3
max([1,9,3]) / min([1,9,3])  // 9</pre>
          </div>

          <div class="panel panel-glow" style="margin-bottom:16px">
            <h2>Discord Commands</h2>
            <table class="cmd-table">
              <tr><th>Command</th><th>Usage</th><th>Description</th></tr>
              <tr><td>/calc</td><td>/calc 2^10</td><td>Evaluate expression</td></tr>
              <tr><td>/plot</td><td>/plot sin(x)</td><td>Plot function graph</td></tr>
              <tr><td>/derive</td><td>/derive x^3 x</td><td>Differentiate</td></tr>
              <tr><td>/matrix</td><td>/matrix inv [[1,2],[3,4]]</td><td>Matrix operation</td></tr>
              <tr><td>/help</td><td>/help</td><td>Show all commands</td></tr>
            </table>
          </div>

          <div class="panel panel-glow">
            <h2>Keyboard Shortcuts</h2>
            <table class="cmd-table">
              <tr><th>Key</th><th>Action</th></tr>
              <tr><td>Enter</td><td>Evaluate expression</td></tr>
              <tr><td>↑ / ↓</td><td>Navigate history (type mode)</td></tr>
              <tr><td>Ctrl+L</td><td>Clear display</td></tr>
              <tr><td>Escape</td><td>Cancel / clear input</td></tr>
            </table>
          </div>

        </div>
      </div>
    </section>`;
}

function highlightDocNav(el) {
  document.querySelectorAll('.docs-nav-item').forEach(i => i.classList.remove('active'));
  el.classList.add('active');
}

window.renderDocs       = renderDocs;
window.highlightDocNav  = highlightDocNav;

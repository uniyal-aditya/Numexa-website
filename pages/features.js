/* ================================================================
   NUMEXA — pages/features.js
   ================================================================ */

function renderFeatures() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <section class="section">
      <div style="margin-bottom:36px">
        <div class="hero-eyebrow"><span class="pulse-dot"></span> Capabilities</div>
        <h1 style="font-size:2rem;font-weight:800;margin-bottom:8px">Everything Numexa Can Do</h1>
        <p style="color:var(--muted);max-width:560px">A complete scientific computation suite — in your browser and in Discord.</p>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:20px">

        <div class="panel panel-glow">
          <div class="feature-icon">∫</div>
          <div class="feature-title" style="font-size:1.1rem;margin-bottom:8px">Calculus</div>
          <p style="color:var(--muted);font-size:.88rem;margin-bottom:14px">Symbolic differentiation powered by math.js. Chain rule, product rule, quotient rule — all handled automatically.</p>
          <pre>derivative(x^4, x)           // 4 * x^3
derivative(sin(x) * x, x)   // cos(x)*x + sin(x)
derivative(log(x^2), x)     // 2 / x</pre>
        </div>

        <div class="panel panel-glow">
          <div class="feature-icon">⊞</div>
          <div class="feature-title" style="font-size:1.1rem;margin-bottom:8px">Linear Algebra</div>
          <p style="color:var(--muted);font-size:.88rem;margin-bottom:14px">Full matrix operations using array syntax. Supports any size matrix.</p>
          <pre>inv([[1,2],[3,4]])            // Inverse
det([[1,2],[3,4]])            // -2
transpose([[1,2],[3,4]])      // [[1,3],[2,4]]
lusolve([[2,0],[0,3]], [4,9]) // [2, 3]</pre>
        </div>

        <div class="panel panel-glow">
          <div class="feature-icon">📈</div>
          <div class="feature-title" style="font-size:1.1rem;margin-bottom:8px">Function Plotter</div>
          <p style="color:var(--muted);font-size:.88rem;margin-bottom:14px">Interactive canvas plotter with glowing curves, grid, and axis labels. Plot any single-variable function instantly.</p>
          <pre>sin(x) + 0.5 * cos(2*x)
x^3 - 3*x
1 / (1 + exp(-x))   // sigmoid</pre>
        </div>

        <div class="panel panel-glow">
          <div class="feature-icon">🔢</div>
          <div class="feature-title" style="font-size:1.1rem;margin-bottom:8px">Complex Numbers</div>
          <p style="color:var(--muted);font-size:.88rem;margin-bottom:14px">Full support for complex arithmetic using <code>i</code> as the imaginary unit.</p>
          <pre>(3 + 4i) * (1 - 2i)    // 11 - 2i
abs(3 + 4i)            // 5
sqrt(-1)               // i
exp(pi * i)            // -1  (Euler!)</pre>
        </div>

        <div class="panel panel-glow">
          <div class="feature-icon">📊</div>
          <div class="feature-title" style="font-size:1.1rem;margin-bottom:8px">Statistics</div>
          <p style="color:var(--muted);font-size:.88rem;margin-bottom:14px">Descriptive statistics on arrays. Works with any list of numbers.</p>
          <pre>mean([2, 4, 6, 8, 10])       // 6
std([2, 4, 6, 8, 10])        // 2.83...
variance([1, 2, 3])          // 0.667
median([5, 1, 9, 3])         // 4</pre>
        </div>

        <div class="panel panel-glow">
          <div class="feature-icon">📐</div>
          <div class="feature-title" style="font-size:1.1rem;margin-bottom:8px">Units & Constants</div>
          <p style="color:var(--muted);font-size:.88rem;margin-bottom:14px">Built-in unit conversions and physical/mathematical constants.</p>
          <pre>5 km to m                    // 5000 m
100 mph to km/h              // 160.934...
pi                           // 3.14159...
e                            // 2.71828...
phi                          // 1.61803... (golden ratio)</pre>
        </div>

        <div class="panel panel-glow">
          <div class="feature-icon">🤖</div>
          <div class="feature-title" style="font-size:1.1rem;margin-bottom:8px">Discord Integration</div>
          <p style="color:var(--muted);font-size:.88rem;margin-bottom:14px">All features available via Discord slash commands with rich embed responses.</p>
          <pre>/calc derivative(x^3, x)
/plot sin(x) * exp(-x/5)
/derive x^4 * log(x)  x
/matrix inv [[1,2],[3,4]]</pre>
        </div>

        <div class="panel panel-glow">
          <div class="feature-icon">⌨️</div>
          <div class="feature-title" style="font-size:1.1rem;margin-bottom:8px">Combinatorics</div>
          <p style="color:var(--muted);font-size:.88rem;margin-bottom:14px">Factorials, combinations, permutations and number theory functions.</p>
          <pre>factorial(10)                // 3628800
combinations(10, 3)          // 120
permutations(5, 2)           // 20
gcd(48, 18)                  // 6
lcm(4, 6)                    // 12</pre>
        </div>

      </div>

      <div class="panel panel-glow" style="margin-top:24px;text-align:center;padding:36px">
        <h2 style="font-size:1.4rem;font-weight:800;margin-bottom:8px">Ready to explore?</h2>
        <p style="color:var(--muted);margin-bottom:20px">Open the Playground and start computing instantly — no install needed.</p>
        <div class="hero-btns" style="justify-content:center">
          <button class="btn-primary" onclick="navigate('playground')">Open Playground</button>
          <button class="btn-outline" onclick="navigate('docs')">Read the Docs</button>
        </div>
      </div>
    </section>`;
}
window.renderFeatures = renderFeatures;

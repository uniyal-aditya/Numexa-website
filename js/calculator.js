// calculator.js - high-level helpers for UI evaluation
// Requires math.js loaded as `math`

// Evaluate a string expression and return result (promise-like via callback)
function evaluateExpression(expr) {
    return new Promise((resolve) => {
        if (!expr || !expr.trim()) { resolve(''); return; }
        try {
            // basic pre-process
            const cleaned = expr.replace(/\^/g, '**');
            // math.evaluate handles many functions: sin, cos, matrix ops, etc.
            const out = math.evaluate(expr);
            if (Array.isArray(out)) resolve(JSON.stringify(out));
            else resolve(String(out));
        } catch (err) {
            // try parse & simplify where possible
            try {
                const res = math.evaluate(expr);
                resolve(String(res));
            } catch (e) {
                resolve('Error: could not evaluate');
            }
        }
    });
}

// small UI adaptor used by app.js
function evaluateAndRender(expr, cb) {
    // prefer symbolic helpers with mathjs where possible
    // (mathjs does not provide symbolic integrate in browser by default)
    // We return a useful message for symbolic requests
    if (!expr || !expr.trim()) { cb('No expression'); return; }
    // detect easy commands
    const lower = expr.trim().toLowerCase();
    if (lower.startsWith('integrate(') || lower.startsWith('derivative(') || /d\/dx/.test(lower)) {
        // lightweight handling: for derivative we can use math.derivative if possible
        try {
            if (lower.startsWith('derivative(')) {
                // derivative(expr, symbol)
                const parsed = expr.match(/^derivative\((.*),(.*)\)/i);
                if (parsed) {
                    const inner = parsed[1].trim();
                    const sym = parsed[2].trim();
                    const d = math.derivative(inner, sym);
                    cb(String(d));
                    return;
                }
            }
            // integrate fallback
            if (lower.startsWith('integrate(')) {
                cb('Symbolic integrals require a server-side engine; numeric integration not yet implemented in browser.');
                return;
            }
        } catch (e) { }
    }

    // default: numeric/symbolic evaluation via mathjs
    evaluateExpression(expr).then(res => cb(res));
}
function initCalcButtons() {
    const input = document.getElementById("calcInput");
    document.querySelectorAll(".btn").forEach(btn => {
        btn.onclick = () => {
            if (btn.textContent === "=") {
                evaluateAndRender(input.value, r => input.value = r);
            } else {
                input.value += btn.textContent;
            }
        };
    });
}

function initTypeMode() {
    const editor = document.getElementById("editor");
    const out = document.getElementById("typeOut");
    document.getElementById("runAll").onclick = () => {
        evaluateAndRender(editor.value, r => out.textContent = r);
    };
}

function initCalculatorUI() {
    const display = document.getElementById("calcExpr");
    let expr = "";

    document.querySelectorAll(".calc-keys button").forEach(btn => {
        btn.onclick = () => {
            const t = btn.textContent;

            if (t === "C") {
                expr = "";
            } else if (t === "⌫") {
                expr = expr.slice(0, -1);
            } else if (t === "=") {
                evaluateAndRender(
                    expr.replace("×", "*").replace("÷", "/").replace("−", "-"),
                    r => expr = r
                );
            } else {
                expr += t
                    .replace("×", "*")
                    .replace("÷", "/")
                    .replace("−", "-");
            }

            display.textContent = expr || "0";
        };
    });
}


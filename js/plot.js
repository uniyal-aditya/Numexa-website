// plot.js - simple function plotter (single variable)
function initPlotCanvas() {
    const c = document.getElementById('plotCanvas');
    if (c) {
        plotGrid(c);
    }
}

function plotExpression(expression, canvas) {
    if (!canvas) canvas = document.getElementById('plotCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    // size
    const W = canvas.clientWidth;
    const H = canvas.clientHeight;
    canvas.width = W * devicePixelRatio;
    canvas.height = H * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);

    // try compile function
    let compiled;
    try {
        // compile expression into function of x
        compiled = math.compile(expression);
    } catch (e) {
        // error: show message
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = '#ffffff';
        ctx.fillText('Invalid expression', 10, 20);
        return;
    }

    // sampling range
    const xmin = -10, xmax = 10;
    const samples = W; // one per pixel
    const dx = (xmax - xmin) / samples;
    const points = [];
    for (let i = 0; i < samples; i++) {
        const x = xmin + i * dx;
        let y;
        try {
            y = compiled.evaluate({ x });
            if (!isFinite(y)) y = NaN;
        } catch (e) { y = NaN; }
        points.push({ x, y });
    }

    // find y range
    let ymin = Infinity, ymax = -Infinity;
    points.forEach(p => { if (!isNaN(p.y)) { ymin = Math.min(ymin, p.y); ymax = Math.max(ymax, p.y); } });
    if (ymin === Infinity) { ymin = -1; ymax = 1; }
    // expand slightly
    const pad = (ymax - ymin) * 0.15 || 1;
    ymin -= pad; ymax += pad;

    // maps
    const mapX = x => (x - xmin) / (xmax - xmin) * W;
    const mapY = y => H - ((y - ymin) / (ymax - ymin) * H);

    // clear
    ctx.clearRect(0, 0, W, H);

    // grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.lineWidth = 1;
    for (let gx = Math.ceil(xmin); gx <= Math.floor(xmax); gx++) {
        ctx.beginPath(); ctx.moveTo(mapX(gx), 0); ctx.lineTo(mapX(gx), H); ctx.stroke();
    }
    // horizontal grid
    for (let gy = Math.ceil(ymin); gy <= Math.floor(ymax); gy++) {
        ctx.beginPath(); ctx.moveTo(0, mapY(gy)); ctx.lineTo(W, mapY(gy)); ctx.stroke();
    }

    // draw axis
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.beginPath();
    ctx.moveTo(mapX(0), 0); ctx.lineTo(mapX(0), H); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, mapY(0)); ctx.lineTo(W, mapY(0)); ctx.stroke();

    // draw function
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 2;
    ctx.beginPath();
    let started = false;
    for (let i = 0; i < points.length; i++) {
        const p = points[i];
        if (isNaN(p.y)) { started = false; continue; }
        const sx = mapX(p.x), sy = mapY(p.y);
        if (!started) { ctx.moveTo(sx, sy); started = true; } else ctx.lineTo(sx, sy);
    }
    ctx.stroke();
    // done
}

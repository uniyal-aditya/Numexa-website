/* ================================================================
   NUMEXA — plot.js  |  Canvas function plotter
   ================================================================ */

function runPlot(silent) {
  const canvas = document.getElementById('plotCanvas');
  const input  = document.getElementById('plotInput');
  const info   = document.getElementById('plotInfo');
  if (!canvas) return;

  const fn = input ? input.value.trim() : 'sin(x)';
  if (!fn) return;

  whenMath(() => {
    const ctx = canvas.getContext('2d');
    const W = canvas.clientWidth || 300;
    const H = canvas.clientHeight || 200;
    canvas.width  = W * devicePixelRatio;
    canvas.height = H * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);

    let compiled;
    try { compiled = math.compile(fn); }
    catch(e) {
      if (!silent && info) info.textContent = 'Invalid: ' + e.message;
      return;
    }

    const xMin = -10, xMax = 10, N = W * 2;
    const pts = [];
    for (let i = 0; i <= N; i++) {
      const x = xMin + i / N * (xMax - xMin);
      try {
        const y = compiled.evaluate({ x });
        pts.push({ x, y: isFinite(y) ? y : NaN });
      } catch { pts.push({ x, y: NaN }); }
    }

    const validY = pts.map(p => p.y).filter(v => !isNaN(v) && isFinite(v));
    if (!validY.length) { if (info) info.textContent = 'No valid points'; return; }

    let yMin = Math.min(...validY), yMax = Math.max(...validY);
    if (yMin === yMax) { yMin -= 1; yMax += 1; }
    const pad = (yMax - yMin) * 0.12;
    yMin -= pad; yMax += pad;

    const px = x => (x - xMin) / (xMax - xMin) * W;
    const py = y => H - (y - yMin) / (yMax - yMin) * H;

    // background
    ctx.fillStyle = '#030710';
    ctx.fillRect(0, 0, W, H);

    // grid
    ctx.strokeStyle = 'rgba(6,182,212,0.06)'; ctx.lineWidth = 1;
    for (let gx = Math.ceil(xMin);  gx <= xMax;  gx++) { ctx.beginPath(); ctx.moveTo(px(gx), 0); ctx.lineTo(px(gx), H); ctx.stroke(); }
    for (let gy = Math.ceil(yMin);  gy <= yMax;  gy++) { ctx.beginPath(); ctx.moveTo(0, py(gy)); ctx.lineTo(W, py(gy)); ctx.stroke(); }

    // axes
    ctx.strokeStyle = 'rgba(6,182,212,0.2)'; ctx.lineWidth = 1.5;
    if (yMin <= 0 && yMax >= 0) { ctx.beginPath(); ctx.moveTo(0, py(0)); ctx.lineTo(W, py(0)); ctx.stroke(); }
    if (xMin <= 0 && xMax >= 0) { ctx.beginPath(); ctx.moveTo(px(0), 0); ctx.lineTo(px(0), H); ctx.stroke(); }

    // axis labels
    ctx.fillStyle = 'rgba(107,140,174,0.7)';
    ctx.font = '10px "Space Mono", monospace';
    ctx.textAlign = 'center';
    for (let gx = xMin; gx <= xMax; gx += 2) {
      ctx.fillText(gx, px(gx), Math.min(H - 4, py(0) + 14));
    }

    // curve with glow
    ctx.shadowColor = 'rgba(6,182,212,0.5)'; ctx.shadowBlur = 8;
    ctx.strokeStyle = '#22d3ee'; ctx.lineWidth = 2; ctx.lineJoin = 'round';
    ctx.beginPath();
    let started = false;
    for (const p of pts) {
      if (isNaN(p.y)) { started = false; continue; }
      const sx = px(p.x), sy = py(p.y);
      if (!started) { ctx.moveTo(sx, sy); started = true; } else ctx.lineTo(sx, sy);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    if (info) info.textContent = `f(x) = ${fn}  ·  x ∈ [${xMin}, ${xMax}]`;
    if (!silent) showToast('Plotted: ' + fn, 'success');
  });
}
window.runPlot = runPlot;

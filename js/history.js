// history.js - store history locally
const HISTORY_KEY = 'numexa_history_v1';

function historyLoad() {
    try {
        const raw = localStorage.getItem(HISTORY_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
}

function historySave(arr) {
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(arr)); } catch (e) { }
}

function historyAdd(item) {
    const arr = historyLoad();
    arr.unshift(item);
    if (arr.length > 200) arr.splice(200);
    historySave(arr);
    renderHistory();
}

function historyClear() { localStorage.removeItem(HISTORY_KEY); renderHistory(); }

function renderHistory() {
    const el = document.getElementById('historyList');
    if (!el) return;
    const arr = historyLoad();
    el.innerHTML = arr.map(it => `<div style="padding:8px;border-radius:6px;margin-bottom:6px;background:rgba(255,255,255,0.02);font-family:var(--mono)">${it.expr} → <span style="color:var(--muted)">${it.result}</span></div>`).join('');
}

// Expose to global
window.historyAdd = historyAdd;
window.renderHistory = renderHistory;
window.historyClear = historyClear;

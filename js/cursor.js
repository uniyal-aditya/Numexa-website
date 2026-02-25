// cursor.js — ultra-low-latency math cursor

(function () {
    if ("ontouchstart" in window || navigator.maxTouchPoints > 0) return;

    const cursor = document.getElementById("cursor");
    if (!cursor) return;

    document.documentElement.classList.add("has-custom-cursor");

    let x = 0, y = 0;
    let tx = 0, ty = 0;

    cursor.textContent = "π";

    const symbols = {
        home: "π",
        playground: "√",
        preview: "Σ",
        calculus: "∫",
        default: "π"
    };

    window.setCursorContext = (ctx) => {
        cursor.textContent = symbols[ctx] || symbols.default;
    };

    window.addEventListener("mousemove", (e) => {
        x = e.clientX;
        y = e.clientY;
        cursor.style.opacity = "1";
    });

    function loop() {
        // MUCH faster follow (almost 1:1)
        tx += (x - tx) * 0.55;
        ty += (y - ty) * 0.55;

        cursor.style.left = tx + "px";
        cursor.style.top = ty + "px";

        requestAnimationFrame(loop);
    }
    loop();

    window.addEventListener("mousedown", () => cursor.classList.add("click"));
    window.addEventListener("mouseup", () => cursor.classList.remove("click"));
    window.addEventListener("mouseleave", () => cursor.style.opacity = "0");
})();

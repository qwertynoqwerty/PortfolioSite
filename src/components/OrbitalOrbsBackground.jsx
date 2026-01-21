import { useEffect, useRef } from "react";

/**
 * OrbitalOrbsBackground — СТАТИЧНЫЙ Canvas-фон.
 * Поведение:
 * - один раз отрисовали (при появлении/перезайзе) и всё, без движения
 * - никакого RAF-цикла, никакого движения, никакой реакции на курсор
 * - лёгкая "появлялка" (opacity transition)
 */
export default function OrbitalOrbsBackground({
                                                  countScale = 1.2,
                                                  hueShift = 210,
                                                  brightness = 0.75,
                                              }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const cv = canvasRef.current;
        if (!cv) return;

        const ctx = cv.getContext("2d", { alpha: true });

        const DPR_CAP = 1.6;
        let dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
        let w = 0;
        let h = 0;

        const mem = navigator.deviceMemory || 4;
        const cores = navigator.hardwareConcurrency || 4;
        const lowPower = mem <= 4 || cores <= 4;

        const prefersReduced =
            window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches || false;

        const qualityFactor =
            (lowPower ? 0.75 : 1.0) *
            (prefersReduced ? 0.85 : 1.0);

        const resize = () => {
            const parent = cv.parentElement || cv;
            w = parent.clientWidth;
            h = parent.clientHeight;
            dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
            cv.width = Math.floor(w * dpr);
            cv.height = Math.floor(h * dpr);
            cv.style.width = w + "px";
            cv.style.height = h + "px";
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        const dim = (a) => `hsla(${hueShift},14%,62%,${a * brightness})`;

        const makeSprite = () => {
            const spriteSize = 64;
            const off =
                typeof OffscreenCanvas !== "undefined"
                    ? new OffscreenCanvas(spriteSize, spriteSize)
                    : document.createElement("canvas");

            off.width = spriteSize;
            off.height = spriteSize;

            const octx = off.getContext("2d");
            const g = octx.createRadialGradient(
                spriteSize / 2,
                spriteSize / 2,
                0,
                spriteSize / 2,
                spriteSize / 2,
                spriteSize / 2
            );

            g.addColorStop(0.0, `hsla(${hueShift},90%,85%,${0.65 * brightness})`);
            g.addColorStop(0.5, `hsla(${hueShift},70%,70%,${0.25 * brightness})`);
            g.addColorStop(1.0, `hsla(${hueShift},60%,60%,0)`);

            octx.fillStyle = g;
            octx.fillRect(0, 0, spriteSize, spriteSize);

            return off;
        };

        const drawStatic = () => {
            if (w <= 0 || h <= 0) return;

            ctx.clearRect(0, 0, w, h);

            // Центры (фиксированные, без дрейфа)
            const cell = Math.max(180, Math.min(w, h) / 5);
            const cols = Math.max(2, Math.floor(w / cell));
            const rows = Math.max(2, Math.floor(h / cell));
            const centers = [];

            for (let gy = 0; gy < rows; gy++) {
                for (let gx = 0; gx < cols; gx++) {
                    const cx = (gx + 0.5) * (w / cols);
                    const cy = (gy + 0.5) * (h / rows);
                    centers.push({
                        x: cx + (Math.random() - 0.5) * (w / cols) * 0.35,
                        y: cy + (Math.random() - 0.5) * (h / rows) * 0.35,
                    });
                }
            }

            const area = w * h;
            const baseCount = Math.max(60, Math.round(Math.pow(area / 12000, 0.92)));
            const count = Math.floor(baseCount * countScale * qualityFactor);

            const sprite = makeSprite();
            const spriteSize = 64;

            // Рисуем "орбитальные" точки (один кадр, без движения)
            for (let i = 0; i < count; i++) {
                const c = centers[Math.floor(Math.random() * centers.length)];

                const r = 60 + Math.random() * 260;
                const a = Math.random() * Math.PI * 2;

                const nx = c.x + Math.cos(a) * r;
                const ny = c.y + Math.sin(a) * r;

                const size = (Math.random() * 2.0 + 1.0) * 3.4;
                const half = (size * spriteSize) / 64 / 2;

                ctx.globalAlpha = (0.45 + Math.random() * 0.18) * brightness;
                ctx.drawImage(sprite, nx - half, ny - half, half * 2, half * 2);
            }

            // Лёгкая "пыль" точками
            ctx.globalAlpha = 1;
            ctx.fillStyle = dim(0.26);
            ctx.beginPath();

            const dustCount = Math.floor(count * 0.35);
            for (let i = 0; i < dustCount; i++) {
                const x = Math.random() * w;
                const y = Math.random() * h;
                const r = 0.6 + Math.random() * 0.6;
                ctx.moveTo(x + r, y);
                ctx.arc(x, y, r, 0, Math.PI * 2);
            }

            ctx.fill();
            ctx.globalAlpha = 1;
        };

        // Resize + draw
        resize();
        drawStatic();

        // Плавное появление (один раз)
        cv.style.opacity = "0";
        cv.style.transition = prefersReduced ? "none" : "opacity 350ms ease-out";
        requestAnimationFrame(() => {
            cv.style.opacity = "1";
        });

        const ro = new ResizeObserver(() => {
            resize();
            drawStatic();
        });
        ro.observe(cv.parentElement || cv);

        // Если хочешь ещё легче — можно убрать этот listener
        const onDpr = () => {
            resize();
            drawStatic();
        };
        window.addEventListener("resize", onDpr, { passive: true });

        return () => {
            ro.disconnect();
            window.removeEventListener("resize", onDpr);
        };
    }, [countScale, hueShift, brightness]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 w-full h-full pointer-events-none"
            aria-hidden="true"
        />
    );
}

import { useEffect, useRef } from "react";

export default function OrbitalOrbsBackground({
    countScale = 1.2,
    hueShift = 210,
    brightness = 0.75,
}) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return undefined;
        }

        const ctx = canvas.getContext("2d", { alpha: true });
        if (!ctx) {
            return undefined;
        }

        const dprCap = 1.6;
        let dpr = Math.min(window.devicePixelRatio || 1, dprCap);
        let width = 0;
        let height = 0;

        const mem = navigator.deviceMemory || 4;
        const cores = navigator.hardwareConcurrency || 4;
        const lowPower = mem <= 4 || cores <= 4;
        const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches || false;
        const qualityFactor = (lowPower ? 0.75 : 1) * (prefersReduced ? 0.85 : 1);

        const resize = () => {
            const parent = canvas.parentElement || canvas;
            width = parent.clientWidth;
            height = parent.clientHeight;
            dpr = Math.min(window.devicePixelRatio || 1, dprCap);
            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        const dim = (alpha) => `hsla(${hueShift},14%,62%,${alpha * brightness})`;

        const makeSprite = () => {
            const spriteSize = 64;
            const offscreen =
                typeof OffscreenCanvas !== "undefined"
                    ? new OffscreenCanvas(spriteSize, spriteSize)
                    : document.createElement("canvas");

            offscreen.width = spriteSize;
            offscreen.height = spriteSize;

            const offCtx = offscreen.getContext("2d");
            if (!offCtx) {
                return offscreen;
            }

            const gradient = offCtx.createRadialGradient(
                spriteSize / 2,
                spriteSize / 2,
                0,
                spriteSize / 2,
                spriteSize / 2,
                spriteSize / 2,
            );

            gradient.addColorStop(0, `hsla(${hueShift},90%,85%,${0.65 * brightness})`);
            gradient.addColorStop(0.5, `hsla(${hueShift},70%,70%,${0.25 * brightness})`);
            gradient.addColorStop(1, `hsla(${hueShift},60%,60%,0)`);

            offCtx.fillStyle = gradient;
            offCtx.fillRect(0, 0, spriteSize, spriteSize);

            return offscreen;
        };

        const drawStatic = () => {
            if (width <= 0 || height <= 0) {
                return;
            }

            ctx.clearRect(0, 0, width, height);

            const cell = Math.max(180, Math.min(width, height) / 5);
            const cols = Math.max(2, Math.floor(width / cell));
            const rows = Math.max(2, Math.floor(height / cell));
            const centers = [];

            for (let gy = 0; gy < rows; gy += 1) {
                for (let gx = 0; gx < cols; gx += 1) {
                    const cx = (gx + 0.5) * (width / cols);
                    const cy = (gy + 0.5) * (height / rows);

                    centers.push({
                        x: cx + (Math.random() - 0.5) * (width / cols) * 0.35,
                        y: cy + (Math.random() - 0.5) * (height / rows) * 0.35,
                    });
                }
            }

            const area = width * height;
            const baseCount = Math.max(60, Math.round(Math.pow(area / 12000, 0.92)));
            const count = Math.floor(baseCount * countScale * qualityFactor);

            const sprite = makeSprite();
            const spriteSize = 64;

            for (let i = 0; i < count; i += 1) {
                const center = centers[Math.floor(Math.random() * centers.length)];
                const radius = 60 + Math.random() * 260;
                const angle = Math.random() * Math.PI * 2;

                const x = center.x + Math.cos(angle) * radius;
                const y = center.y + Math.sin(angle) * radius;
                const size = (Math.random() * 2 + 1) * 3.4;
                const half = ((size * spriteSize) / 64) / 2;

                ctx.globalAlpha = (0.45 + Math.random() * 0.18) * brightness;
                ctx.drawImage(sprite, x - half, y - half, half * 2, half * 2);
            }

            ctx.globalAlpha = 1;
            ctx.fillStyle = dim(0.26);
            ctx.beginPath();

            const dustCount = Math.floor(count * 0.35);
            for (let i = 0; i < dustCount; i += 1) {
                const x = Math.random() * width;
                const y = Math.random() * height;
                const radius = 0.6 + Math.random() * 0.6;
                ctx.moveTo(x + radius, y);
                ctx.arc(x, y, radius, 0, Math.PI * 2);
            }

            ctx.fill();
            ctx.globalAlpha = 1;
        };

        resize();
        drawStatic();

        canvas.style.opacity = "0";
        canvas.style.transition = prefersReduced ? "none" : "opacity 350ms ease-out";
        requestAnimationFrame(() => {
            canvas.style.opacity = "1";
        });

        const resizeObserver = new ResizeObserver(() => {
            resize();
            drawStatic();
        });
        resizeObserver.observe(canvas.parentElement || canvas);

        const onResize = () => {
            resize();
            drawStatic();
        };

        window.addEventListener("resize", onResize, { passive: true });

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener("resize", onResize);
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

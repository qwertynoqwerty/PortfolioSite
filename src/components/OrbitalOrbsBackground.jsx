import { useEffect, useRef } from "react";

/**
 * OrbitalOrbsBackground — Canvas-фон с «звёздами/орбитами».
 * Важное: pointer-events: none (не блокирует клики), адаптация под CPU/память,
 * respects prefers-reduced-motion. Никаких обработчиков скролла/колеса.
 */
export default function OrbitalOrbsBackground({
                                                  countScale = 1.9,
                                                  mouseRadius = 260,
                                                  hueShift = 210,
                                                  respondStrength = 0.6,
                                                  speedScale = 1.15,
                                                  brightness = 0.75,
                                              }) {
    const canvasRef = useRef(null);
    const rafRef = useRef(0);

    useEffect(() => {
        const cv = canvasRef.current;
        if (!cv) return;
        const ctx = cv.getContext("2d", { alpha: true });

        // ====== БАЗА ======
        const DPR_CAP = 1.75;
        let dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
        let w = 0, h = 0;
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
        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(cv.parentElement || cv);

        // ====== ВВОД ======
        const cursor = { x: -9999, y: -9999, active: false };
        const setCursor = (cx, cy) => {
            const r = cv.getBoundingClientRect();
            cursor.x = cx - r.left;
            cursor.y = cy - r.top;
            cursor.active = true;
        };
        const onMove = (e) => setCursor(e.clientX, e.clientY);
        const onTouch = (e) => {
            const t = e.touches?.[0];
            if (t) setCursor(t.clientX, t.clientY);
        };
        const onLeave = () => { cursor.active = false; };
        window.addEventListener("mousemove", onMove, { passive: true });
        window.addEventListener("touchmove", onTouch, { passive: true });
        window.addEventListener("mouseout", onLeave, { passive: true });
        window.addEventListener("touchend", onLeave, { passive: true });

        // ====== АДАПТАЦИЯ ======
        const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches || false;
        const mem = navigator.deviceMemory || 4;
        const cores = navigator.hardwareConcurrency || 4;
        const qualityFactor =
            (mem >= 8 ? 1 : mem >= 4 ? 0.85 : 0.7) *
            (cores >= 8 ? 1 : cores >= 4 ? 0.9 : 0.75);

        // ====== СЕТКА ЦЕНТРОВ ======
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
                    drift: Math.random() * 0.4 + 0.2,
                    phase: Math.random() * Math.PI * 2,
                });
            }
        }

        // ====== ЧАСТИЦЫ ======
        const area = w * h;
        const baseCount = Math.max(60, Math.round(Math.pow(area / 12000, 0.92)));
        const COUNT = Math.floor(baseCount * (prefersReduced ? 0.6 : countScale) * qualityFactor);

        const nodes = [];
        const totalCenters = centers.length;
        for (let i = 0; i < COUNT; i++) {
            const idx = Math.floor(Math.random() * totalCenters);
            const baseAvDeg = (Math.random() * 0.32 + 0.16) * (Math.random() < 0.5 ? 1 : -1);
            const baseAv = ((baseAvDeg * Math.PI) / 180) * speedScale;
            nodes.push({
                centerIdx: idx,
                r: 60 + Math.random() * 260,
                a: Math.random() * Math.PI * 2,
                av: baseAv,
                baseAv,
                size: Math.random() * 2.0 + 1.0,
                pulse: Math.random() * 0.8 + 0.4,
                rand: Math.random(),         // постоянный «вес» для мягкого отбора
            });
        }

        // ====== СПРАЙТ-СВЕЧЕНИЕ ======
        const spriteSize = 64;
        const makeSprite = () => {
            const off = (typeof OffscreenCanvas !== "undefined")
                ? new OffscreenCanvas(spriteSize, spriteSize)
                : document.createElement("canvas");
            off.width = spriteSize; off.height = spriteSize;
            const octx = off.getContext("2d");
            const g = octx.createRadialGradient(
                spriteSize / 2, spriteSize / 2, 0,
                spriteSize / 2, spriteSize / 2, spriteSize / 2
            );
            g.addColorStop(0.0, `hsla(${hueShift},90%,85%,${0.65 * brightness})`);
            g.addColorStop(0.5, `hsla(${hueShift},70%,70%,${0.25 * brightness})`);
            g.addColorStop(1.0, `hsla(${hueShift},60%,60%,0)`);
            octx.fillStyle = g;
            octx.fillRect(0, 0, spriteSize, spriteSize);
            return off;
        };
        const sprite = makeSprite();
        const dim = (a) => `hsla(${hueShift},14%,62%,${a * brightness})`;

        // ====== ПЛАВНАЯ ПЛОТНОСТЬ РЕНДЕРА ======
        // вместо stride: плавно меняем «долю видимых» частиц (fade in/out)
        let renderWeight = 1.0;       // текущая плотность (0..1)
        let renderTarget = 1.0;       // целевая плотность
        const LERP = (a, b, t) => a + (b - a) * t;
        // ширина «зоны смешивания», в которой частица плавно исчезает/появляется
        const BLEND_BAND = 0.12;

        // функция мягкой прозрачности: >0 если rand < renderWeight
        const softAlpha = (weight, r) => {
            const d = weight - r;                       // насколько «внутри» набора
            const t = (d / BLEND_BAND) + 0.5;           // переносим в 0..1 с зоной
            return Math.max(0, Math.min(1, t));         // clamp 0..1
        };

        // ====== FPS CAP + ADAPT ======
        let running = true;
        let visible = true;
        let last = performance.now();
        let lastFpsCheck = last;
        let fpsFrames = 0;

        const TARGET_FPS = 55;
        let skipUntil = 0;
        const mR2 = mouseRadius * mouseRadius;

        const trackFps = (now) => {
            fpsFrames++;
            if (now - lastFpsCheck >= 800) {
                const fps = (fpsFrames * 1000) / (now - lastFpsCheck);
                // адаптируем целевую плотность
                if (fps < 48) renderTarget = Math.max(0.35, renderTarget * 0.85);
                else if (fps > 58) renderTarget = Math.min(1.0, renderTarget * 1.06);
                lastFpsCheck = now;
                fpsFrames = 0;
            }
        };

        // ====== РЕНДЕР ======
        const render = (now) => {
            if (!running || !visible) return;

            // cap FPS
            if (now < skipUntil) {
                rafRef.current = requestAnimationFrame(render);
                return;
            }
            const minDelta = 1000 / TARGET_FPS;
            skipUntil = now + minDelta;

            const dt = Math.min(0.033, (now - last) / 1000);
            last = now;

            // плавно тянем renderWeight к renderTarget
            renderWeight = LERP(renderWeight, renderTarget, 0.08);

            ctx.clearRect(0, 0, w, h);

            // дрейф центров (дёшево)
            for (let i = 0; i < centers.length; i++) {
                const c = centers[i];
                c.phase += 0.6 * c.drift * dt;
                c.x += Math.cos(c.phase * 0.9) * 2 * dt;
                c.y += Math.sin(c.phase * 0.7) * 2 * dt;
            }

            // частицы
            for (let i = 0; i < nodes.length; i++) {
                const n = nodes[i];
                const c = centers[n.centerIdx];

                // апдейт орбиты
                n.av = n.av * 0.985 + n.baseAv * 0.015;
                n.a += n.av * dt;

                const cs = Math.cos(n.a);
                const sn = Math.sin(n.a);
                const nx = c.x + cs * n.r;
                const ny = c.y + sn * n.r;

                // реакция на курсор
                if (cursor.active) {
                    const dx = cursor.x - nx, dy = cursor.y - ny;
                    const dist2 = dx * dx + dy * dy;
                    if (dist2 < mR2) {
                        const dist = Math.max(12, Math.sqrt(dist2));
                        const proj = dx * (-sn) + dy * cs; // тангенс
                        n.av += (respondStrength * 0.0026) * (proj / (dist + 1)) * (1 - dist / mouseRadius);
                    }
                }

                // мягкая альфа по плотности
                const aSoft = softAlpha(renderWeight, n.rand);
                if (aSoft < 0.03) continue; // почти невидим — не рисуем

                // свечение спрайтом
                const s = n.size * 3.4;
                const half = (s * spriteSize) / 64 / 2;
                ctx.globalAlpha =
                    aSoft * (0.5 + Math.sin(now * 0.002 + n.a) * 0.12 * n.pulse) * brightness;
                ctx.drawImage(sprite, nx - half, ny - half, half * 2, half * 2);
            }

            // ядрышки
            ctx.globalAlpha = 1;
            ctx.fillStyle = dim(0.28);
            ctx.beginPath();
            for (let i = 0; i < nodes.length; i++) {
                const n = nodes[i];
                if (softAlpha(renderWeight, n.rand) < 0.25) continue;
                const c = centers[n.centerIdx];
                const cs = Math.cos(n.a);
                const sn = Math.sin(n.a);
                const nx = c.x + cs * n.r;
                const ny = c.y + sn * n.r;
                const r = n.size * 0.6;
                ctx.moveTo(nx + r, ny);
                ctx.arc(nx, ny, r, 0, Math.PI * 2);
            }
            ctx.fill();

            trackFps(now);
            rafRef.current = requestAnimationFrame(render);
        };

        // ====== ВИДИМОСТЬ/ПАУЗА ======
        const onVisibility = () => {
            if (document.hidden) {
                running = false;
                cancelAnimationFrame(rafRef.current);
            } else {
                if (!running) {
                    running = true;
                    last = performance.now();
                    lastFpsCheck = last;
                    fpsFrames = 0;
                    rafRef.current = requestAnimationFrame(render);
                }
            }
        };
        document.addEventListener("visibilitychange", onVisibility);

        const io = new IntersectionObserver(
            (entries) => {
                const e = entries[0];
                visible = e?.isIntersecting ?? true;
                if (visible && running) {
                    last = performance.now();
                    lastFpsCheck = last;
                    fpsFrames = 0;
                    rafRef.current = requestAnimationFrame(render);
                } else {
                    cancelAnimationFrame(rafRef.current);
                }
            },
            { root: null, threshold: 0.02 }
        );
        io.observe(cv);

        // старт
        last = performance.now();
        lastFpsCheck = last;
        fpsFrames = 0;
        rafRef.current = requestAnimationFrame(render);

        // ====== CLEANUP ======
        return () => {
            document.removeEventListener("visibilitychange", onVisibility);
            cancelAnimationFrame(rafRef.current);
            ro.disconnect();
            io.disconnect();
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("touchmove", onTouch);
            window.removeEventListener("mouseout", onLeave);
            window.removeEventListener("touchend", onLeave);
        };
    }, [countScale, mouseRadius, hueShift, respondStrength, speedScale, brightness]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 w-full h-full pointer-events-none"
            aria-hidden="true"
        />
    );
}

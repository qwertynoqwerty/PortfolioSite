import React, { useMemo } from "react";

/**
 * InfinityAccent — декоративный знак «∞» под заголовком Hero.
 * Требования: ровная геометрия, лёгкий наклон, мягкий «шум»/градиент внутри.
 * Никакой бизнес-логики; только рендер.
 */
export default function InfinityAccent({
                                           width = 980,
                                           height = 480,
                                           thickness = 64,
                                           opacity = 0.68,
                                       }) {
    // === Геометрия кривой ===
    const pathData = useMemo(() => {
        const w = width;
        const h = height;
        const cx = w / 2;
        const cy = h / 2;
        const pad = Math.max(thickness, 40);
        const a = Math.min((w - pad * 2) / 2.4, (h - pad * 2) / 1.2);

        const N = 720;
        const pts = [];
        for (let i = 0; i <= N; i++) {
            const t = (i / N) * Math.PI * 2;
            const s = Math.sin(t);
            const c = Math.cos(t);
            const denom = 1 + s * s;
            const x = (a * c) / denom;
            const y = (a * s * c) / denom;
            pts.push([cx + x, cy + y]);
        }

        let d = `M ${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)}`;
        for (let i = 1; i < pts.length; i++) {
            d += ` L ${pts[i][0].toFixed(2)} ${pts[i][1].toFixed(2)}`;
        }
        d += " Z";
        return d;
    }, [width, height, thickness]);

    return (
        <div
            aria-hidden="true"
            role="img"
            style={{
                width,
                height,
                // 👇 лёгкий наклон и растяжение по X, даёт "перспективу"
                transform: "rotateX(18deg) scaleX(1.2)",
                transformOrigin: "center",
                filter: "blur(6px)",
            }}
        >
            <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}>
                <defs>
                    <linearGradient id="inf-metal" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%"   stopColor="rgba(229,229,229,0.03)" />
                        <stop offset="50%"  stopColor="rgba(229,229,229,0.10)" />
                        <stop offset="100%" stopColor="rgba(229,229,229,0.03)" />
                    </linearGradient>

                    <linearGradient id="inf-sheen" x1="-20%" y1="0%" x2="20%" y2="0%">
                        <stop offset="0%"   stopColor="rgba(255,255,255,0)" />
                        <stop offset="50%"  stopColor="rgba(255,255,255,0.14)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                        <animate attributeName="x1" values="-20%;100%;-20%" dur="14s" repeatCount="indefinite" />
                        <animate attributeName="x2" values="20%;140%;20%"  dur="14s" repeatCount="indefinite" />
                    </linearGradient>

                    <filter id="inf-grain" x="-10%" y="-10%" width="120%" height="120%">
                        <feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves="2" seed="4" result="n">
                            <animate attributeName="baseFrequency" values="0.008;0.010;0.008" dur="8s" repeatCount="indefinite" />
                        </feTurbulence>
                        <feDisplacementMap in="SourceGraphic" in2="n" scale="1.3" />
                        <feGaussianBlur stdDeviation="0.55" />
                        <feColorMatrix type="matrix" values="
              1 0 0 0 0
              0 1 0 0 0
              0 0 1 0 0
              0 0 0 .20 0" />
                    </filter>

                    <mask id="inf-mask" maskUnits="userSpaceOnUse">
                        <rect width={width} height={height} fill="black" />
                        <path
                            d={pathData}
                            fill="none"
                            stroke="white"
                            strokeWidth={thickness}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </mask>
                </defs>

                <path
                    d={pathData}
                    fill="none"
                    stroke="url(#inf-metal)"
                    strokeWidth={thickness}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity={opacity}
                />

                <g mask="url(#inf-mask)">
                    <rect width={width} height={height} fill="rgba(255,255,255,0.65)" filter="url(#inf-grain)" />
                    <rect width={width} height={height} fill="url(#inf-sheen)" />
                </g>

                <path
                    d={pathData}
                    fill="none"
                    stroke="rgba(229,229,229,0.08)"
                    strokeWidth={Math.max(1, thickness * 0.45)}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.55"
                />
            </svg>
        </div>
    );
}

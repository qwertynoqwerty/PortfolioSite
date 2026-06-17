import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";

export default function StatCounter({ value, label, suffix = "" }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, amount: 0.6 });
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        if (!inView) {
            return undefined;
        }

        const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
        if (reduce) {
            setDisplay(value);
            return undefined;
        }

        const controls = animate(0, value, {
            duration: 1.4,
            ease: "easeOut",
            onUpdate: (latest) => setDisplay(Math.round(latest)),
        });

        return () => controls.stop();
    }, [inView, value]);

    return (
        <div
            ref={ref}
            className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-6 text-center transition-colors duration-300 hover:border-white/20 hover:bg-white/[0.05]"
        >
            <div className="text-4xl md:text-5xl font-semibold leading-none text-white tabular-nums">
                {display}
                {suffix}
            </div>
            <div className="mt-3 text-[13px] md:text-sm leading-tight text-white/55">{label}</div>
        </div>
    );
}

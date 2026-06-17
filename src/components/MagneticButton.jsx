import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const SPRING = { stiffness: 260, damping: 18, mass: 0.5 };

export default function MagneticButton({ as = "a", className = "", children, strength = 0.35, ...rest }) {
    const ref = useRef(null);
    const mx = useMotionValue(0);
    const my = useMotionValue(0);
    const x = useSpring(mx, SPRING);
    const y = useSpring(my, SPRING);

    const allow = () =>
        typeof window !== "undefined" &&
        window.matchMedia?.("(pointer: fine)")?.matches &&
        !window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    const handleMove = (event) => {
        const node = ref.current;
        if (!node || !allow()) {
            return;
        }
        const rect = node.getBoundingClientRect();
        mx.set((event.clientX - (rect.left + rect.width / 2)) * strength);
        my.set((event.clientY - (rect.top + rect.height / 2)) * strength);
    };

    const reset = () => {
        mx.set(0);
        my.set(0);
    };

    const Component = motion[as] || motion.a;

    return (
        <Component
            ref={ref}
            onMouseMove={handleMove}
            onMouseLeave={reset}
            style={{ x, y }}
            className={className}
            {...rest}
        >
            {children}
        </Component>
    );
}

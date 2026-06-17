import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const SPRING = { stiffness: 220, damping: 22, mass: 0.6 };

export default function TiltCard({ children, className = "", max = 6, scale = 1.012 }) {
    const ref = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [max, -max]), SPRING);
    const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-max, max]), SPRING);

    const allowTilt = () =>
        typeof window !== "undefined" &&
        window.matchMedia?.("(pointer: fine)")?.matches &&
        !window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    const handleMove = (event) => {
        const node = ref.current;
        if (!node || !allowTilt()) {
            return;
        }

        const rect = node.getBoundingClientRect();
        x.set((event.clientX - rect.left) / rect.width - 0.5);
        y.set((event.clientY - rect.top) / rect.height - 0.5);
    };

    const reset = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMove}
            onMouseLeave={reset}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d", transformPerspective: 900 }}
            whileHover={{ scale }}
            transition={{ type: "spring", ...SPRING }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

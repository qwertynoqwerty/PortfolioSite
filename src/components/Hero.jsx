import { motion } from "framer-motion";
import InfinityAccent from "./InfinityAccent";

/**
 * Hero — главный экран: имя, роль и ∞-акцент.
 */
export default function Hero() {
    return (
        <motion.section
            id="hero"
            className="relative min-h-screen flex items-center isolate"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
        >
            {/* нижний мягкий градиент */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-b from-transparent to-[#0D0D0F]" />

            <div className="mx-auto max-w-6xl px-6 w-full">
                <div className="relative text-center">
                    {/* фон-инфинити акцент */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-90">
                        <InfinityAccent />
                    </div>

                    {/* имя */}
                    <motion.h2
                        className="relative z-10 text-2xl sm:text-3xl font-semibold text-white/70 mt-2 tracking-wide"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
                    >
                        Maxim Moiseev
                    </motion.h2>

                    {/* роль */}
                    <motion.h1
                        className="relative z-10 text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mt-3"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: "easeOut", delay: 0.25 }}
                    >
                        VR / AR Developer
                    </motion.h1>
                </div>
            </div>
        </motion.section>
    );
}

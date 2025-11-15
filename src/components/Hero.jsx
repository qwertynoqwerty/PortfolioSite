import { motion } from "framer-motion";
import InfinityAccent from "./InfinityAccent";

/**
 * Hero — главный экран: имя, роль, краткое описание и ∞-акцент.
 * Плавное появление, минимум визуального шума.
 */
export default function Hero() {
    return (
        <motion.section
            id="hero"
            className="relative min-h-screen flex items-center isolate"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
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
                        transition={{ duration: 1.1, ease: "easeOut", delay: 0.1 }}
                    >
                        Maxim Moiseev
                    </motion.h2>

                    {/* роль */}
                    <motion.h1
                        className="relative z-10 text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mt-3"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, ease: "easeOut", delay: 0.25 }}
                    >
                        VR / AR Developer
                    </motion.h1>

                    {/* описание */}
                    <motion.p
                        className="relative z-10 mt-6 mx-auto max-w-2xl text-white/80 text-lg leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.1, ease: "easeOut", delay: 0.45 }}
                    >
                        Проектирую и разрабатываю VR/AR-системы на Unity и C#:
                        интерактив, инструменты, оптимизация и чистая архитектура.
                        Фокус — UX, производительность и устойчивость проектов.
                    </motion.p>

                </div>
            </div>
        </motion.section>
    );
}

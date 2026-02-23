import { motion } from "framer-motion";
import InfinityAccent from "./InfinityAccent";

export default function Hero() {
    return (
        <motion.section
            id="hero"
            className="relative w-full min-h-screen flex items-center isolate"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
        >
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-b from-transparent to-[#0D0D0F]" />

            <div className="mx-auto max-w-6xl px-6 w-full">
                <div className="relative text-center">
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-90">
                        <InfinityAccent />
                    </div>

                    <motion.h2
                        className="relative z-10 text-2xl sm:text-3xl font-semibold text-white/70 mt-2 tracking-wide"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
                    >
                        Maxim Moiseev
                    </motion.h2>

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

            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 right-4 sm:right-6 lg:right-8 z-20 hidden sm:flex items-center"
            >
                <motion.div
                    className="flex flex-col items-center gap-3 text-white/60"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut", delay: 0.65 }}
                >
                    {[0, 1, 2].map((i) => (
                        <motion.svg
                            key={i}
                            viewBox="0 0 24 24"
                            className="w-9 h-9 lg:w-10 lg:h-10"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            animate={{ opacity: [0.18, 0.95, 0.18], scale: [0.97, 1, 0.97] }}
                            transition={{
                                duration: 1.8,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: i * 0.18,
                            }}
                        >
                            <path d="M5 8l7 8 7-8" />
                        </motion.svg>
                    ))}
                </motion.div>
            </div>
        </motion.section>
    );
}

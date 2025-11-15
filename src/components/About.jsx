import { motion } from "framer-motion";
import SkillsCross from "./SkillsCross";

/**
 * About — блок «Обо мне».
 * Левая колонка — иллюстрация + текст.
 * Правая колонка — сетка навыков.
 */
function CapsuleIllustration() {
    return (
        <div className="flex justify-center w-full">
            <svg viewBox="0 0 520 520" className="w-[420px] md:w-[520px] h-auto" preserveAspectRatio="xMidYMid meet" aria-hidden>
                <defs>
                    <linearGradient id="capsule-g" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#7DD3FC" />
                        <stop offset="50%" stopColor="#C084FC" />
                        <stop offset="100%" stopColor="#F472B6" />
                    </linearGradient>
                </defs>
                <g fill="none" stroke="url(#capsule-g)" strokeWidth="3" opacity="0.9">
                    <circle cx="260" cy="260" r="160" opacity="0.9" />
                    <path d="M130 260 q130 -130 260 0" opacity="0.75" />
                    <path d="M150 260 q110 -90 220 0" opacity="0.6" />
                    <circle cx="260" cy="260" r="190" strokeDasharray="10 10" opacity="0.25" />
                </g>
            </svg>
        </div>
    );
}

export default function About() {
    return (
        <motion.section
            id="about"
            className="relative min-h-[92vh] flex flex-col justify-center py-20"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
        >
            {/* Заголовок + линии */}
            <div className="mx-auto max-w-[100rem] px-6 mb-14 -translate-y-16 md:-translate-y-20 text-center">
                <h2 className="text-[40px] md:text-[48px] font-bold leading-none">Обо мне</h2>
                <div className="mt-3 flex flex-col items-center gap-2">
                    <div className="h-[3px] w-40 bg-white/30 rounded-full" />
                    <div className="h-[3px] w-32 bg-white/20 rounded-full" />
                    <div className="h-[3px] w-48 bg-white/15 rounded-full" />
                </div>
            </div>

            {/* Колонки */}
            <div className="mx-auto max-w-[100rem] px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-40 xl:gap-56 items-center">

                {/* Левая колонка */}
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="flex flex-col items-center lg:items-start text-left"
                >
                    <CapsuleIllustration />

                    <div className="mt-8 max-w-[640px] text-[18px] leading-relaxed text-white/85">

                        <p>
                            Работаю с VR/AR/MR/3D/2D на Unity: создаю взаимодействия, интерфейсы,
                            инструменты и системную логику. Фокус — стабильность, UX
                            и высокая производительность.
                        </p>

                        <p className="mt-4 text-white/75">
                            Оптимизирую сцены, освещение и ресурсы. Выстраиваю аккуратную,
                            читаемую и поддерживаемую архитектуру — надёжную в долгосрочных проектах.
                        </p>

                    </div>
                </motion.div>

                {/* Правая колонка — навыки */}
                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
                    className="flex justify-center lg:justify-end"
                >
                    <div className="w-full max-w-[640px]">
                        <SkillsCross />
                    </div>
                </motion.div>

            </div>
        </motion.section>
    );
}

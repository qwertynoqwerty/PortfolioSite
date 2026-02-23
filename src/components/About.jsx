import { motion } from "framer-motion";
import SkillsCross from "./SkillsCross";
import SectionTitle from "./SectionTitle";
import { SECTION_IN, SLIDE_IN_LEFT, SLIDE_IN_RIGHT } from "../utils/motionPresets";

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
            initial={SECTION_IN.hidden}
            whileInView={SECTION_IN.show}
            viewport={{ once: true, amount: 0.3 }}
        >
            <SectionTitle title="Обо мне" className="mx-auto max-w-[100rem] px-6 mb-14 -translate-y-16 md:-translate-y-20 text-center" />

            <div className="mx-auto max-w-[100rem] px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-40 xl:gap-56 items-center">
                <motion.div
                    initial={SLIDE_IN_LEFT.hidden}
                    whileInView={SLIDE_IN_LEFT.show}
                    viewport={{ once: true, amount: 0.3 }}
                    className="flex flex-col items-center lg:items-start text-left"
                >
                    <CapsuleIllustration />

                    <div className="mt-8 max-w-[640px] text-[18px] leading-relaxed text-white/85">
                        <p>
                            Работаю с VR/AR на Unity: реализую пользовательские взаимодействия, интерфейсы и системную
                            логику для VR/MR-приложений.
                        </p>

                        <p className="mt-4 text-white/75">
                            Пространственная логика сцены, интерактивные элементы и пользовательские состояния, а также
                            настройка UI и взаимодействий под реальные устройства.
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    initial={SLIDE_IN_RIGHT.hidden}
                    whileInView={SLIDE_IN_RIGHT.show}
                    viewport={{ once: true, amount: 0.3 }}
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

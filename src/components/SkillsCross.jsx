import { motion } from "framer-motion";
import { SiUnity, SiDotnet, SiBlender, SiFigma, SiGit } from "react-icons/si";
import { TILE } from "../utils/motionPresets";

function IconUltimateXR({ className = "w-12 h-12" }) {
    return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden>
            <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="4" />
                <path d="M7 8v5a3 3 0 0 0 6 0V8M13 12l4 4M17 12l-4 4" />
            </g>
        </svg>
    );
}
function IconMetaAllInOne({ className = "w-12 h-12" }) {
    return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden>
            <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" opacity=".35" />
                <path d="M4 12c2-6 6-6 8 0s6 6 8 0" />
            </g>
        </svg>
    );
}

const item = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => TILE(i).show,
};

function Tile({ icon, label }) {
    return (
        <div
            className="flex flex-col items-center justify-center
                 w-[184px] h-[184px] rounded-xl
                 border border-white/12 bg-white/[0.04] hover:bg-white/[0.07]
                 text-white/90 transition"
        >
            <div className="mb-3">{icon}</div>
            <div className="text-[14px] font-medium text-center leading-tight">{label}</div>
        </div>
    );
}
/**
 * SkillsCross — блок навыков в виде «креста»/сетки с подсветкой при наведении.
 */
export default function SkillsCross() {
    const iconSize = "w-12 h-12";

    const row1 = [
        { label: "Unity", icon: <SiUnity className={iconSize} /> },
        { label: "C#", icon: <SiDotnet className={iconSize} /> },
    ];
    const row2 = [
        { label: "UltimateXR", icon: <IconUltimateXR className={iconSize} /> },
        { label: "Git", icon: <SiGit className={iconSize} /> }, // 🔄 теперь Git в центре
        { label: "Meta XR (All-in-One)", icon: <IconMetaAllInOne className={iconSize} /> },
    ];
    const row3 = [
        { label: "Blender", icon: <SiBlender className={iconSize} /> },
        { label: "Figma", icon: <SiFigma className={iconSize} /> },
    ];

    return (
        <div className="mt-8 flex flex-col items-center gap-8">
            <div className="flex gap-8">
                {row1.map((s, i) => (
                    <motion.div key={s.label} variants={item} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}>
                        <Tile {...s} />
                    </motion.div>
                ))}
            </div>

            <div className="flex gap-8">
                {row2.map((s, i) => (
                    <motion.div key={s.label} variants={item} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i + 2}>
                        <Tile {...s} />
                    </motion.div>
                ))}
            </div>

            <div className="flex gap-8">
                {row3.map((s, i) => (
                    <motion.div key={s.label} variants={item} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i + 5}>
                        <Tile {...s} />
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

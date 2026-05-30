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

function Tile({ icon, label, href }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={`${label} website`}
            className="flex flex-col items-center justify-center
                 w-[clamp(92px,27vw,184px)] h-[clamp(92px,27vw,184px)] rounded-xl
                 border border-white/12 bg-white/[0.04] hover:bg-white/[0.07]
                 text-white/90 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
            <div className="mb-3">{icon}</div>
            <div className="text-[14px] font-medium text-center leading-tight">{label}</div>
        </a>
    );
}

export default function SkillsCross() {
    const iconSize = "w-12 h-12";

    const row1 = [
        { label: "Unity", icon: <SiUnity className={iconSize} />, href: "https://unity.com/" },
        { label: "C#", icon: <SiDotnet className={iconSize} />, href: "https://dotnet.microsoft.com/" },
    ];
    const row2 = [
        { label: "UltimateXR", icon: <IconUltimateXR className={iconSize} />, href: "https://www.ultimatexr.io/" },
        { label: "Git", icon: <SiGit className={iconSize} />, href: "https://git-scm.com/" },
        { label: "Meta SDK", icon: <IconMetaAllInOne className={iconSize} />, href: "https://developers.meta.com/horizon/downloads/package/meta-xr-sdk-all-in-one-upm/" },
    ];
    const row3 = [
        { label: "Blender", icon: <SiBlender className={iconSize} />, href: "https://www.blender.org/" },
        { label: "Figma", icon: <SiFigma className={iconSize} />, href: "https://www.figma.com/" },
    ];

    return (
        <div className="mt-8 flex flex-col items-center gap-8">
            <div className="flex gap-[clamp(8px,2vw,32px)]">
                {row1.map((skill, index) => (
                    <motion.div key={skill.label} variants={item} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={index}>
                        <Tile {...skill} />
                    </motion.div>
                ))}
            </div>

            <div className="flex gap-[clamp(8px,2vw,32px)]">
                {row2.map((skill, index) => (
                    <motion.div key={skill.label} variants={item} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={index + 2}>
                        <Tile {...skill} />
                    </motion.div>
                ))}
            </div>

            <div className="flex gap-[clamp(8px,2vw,32px)]">
                {row3.map((skill, index) => (
                    <motion.div key={skill.label} variants={item} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={index + 5}>
                        <Tile {...skill} />
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

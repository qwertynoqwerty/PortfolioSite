import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

const SECTIONS = [
    { id: "about", label: "Обо мне" },
    { id: "projects", label: "Проекты" },
    { id: "catalog", label: "Каталог" },
    { id: "contacts", label: "Контакты" },
];

export default function Navbar() {
    const [activeId, setActiveId] = useState("");
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const { scrollYProgress } = useScroll();
    const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.3 });

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        const targets = SECTIONS.map((section) => document.getElementById(section.id)).filter(Boolean);

        if (targets.length === 0) {
            return undefined;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

                if (visible[0]) {
                    setActiveId(visible[0].target.id);
                }
            },
            { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] },
        );

        targets.forEach((target) => observer.observe(target));
        return () => observer.disconnect();
    }, []);

    const handleNav = (event, id) => {
        event.preventDefault();
        setMenuOpen(false);
        const node = document.getElementById(id);
        if (node) {
            node.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <motion.header
            initial={{ y: -64, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="fixed inset-x-0 top-0 z-[60]"
            style={{ height: "var(--nav-h)" }}
        >
            <div
                className={`absolute inset-0 transition-colors duration-300 ${
                    scrolled ? "bg-[#0D0D0F]/70 backdrop-blur-xl border-b border-white/10" : "border-b border-transparent"
                }`}
            />

            <nav className="relative mx-auto flex h-full max-w-[100rem] items-center justify-end px-4 md:px-8">
                <ul className="hidden md:flex items-center gap-1">
                    {SECTIONS.map((section) => {
                        const isActive = activeId === section.id;
                        return (
                            <li key={section.id}>
                                <a
                                    href={`#${section.id}`}
                                    onClick={(event) => handleNav(event, section.id)}
                                    aria-current={isActive ? "true" : undefined}
                                    className={`relative inline-flex min-h-9 items-center px-3 text-sm transition-colors ${
                                        isActive ? "text-white" : "text-white/50 hover:text-white/80"
                                    }`}
                                >
                                    {section.label}
                                    {isActive && (
                                        <motion.span
                                            layoutId="nav-active"
                                            className="absolute inset-x-2 -bottom-0.5 h-px bg-white"
                                            transition={{ type: "spring", stiffness: 320, damping: 30 }}
                                        />
                                    )}
                                </a>
                            </li>
                        );
                    })}
                </ul>

                <button
                    type="button"
                    onClick={() => setMenuOpen((open) => !open)}
                    aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
                    aria-expanded={menuOpen}
                    className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 text-white/80 hover:bg-white/10 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                    <span className="sr-only">Меню</span>
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 8h16M4 16h16" />}
                    </svg>
                </button>
            </nav>

            {menuOpen && (
                <motion.ul
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:hidden absolute inset-x-0 top-full mx-4 mt-2 rounded-2xl border border-white/10 bg-[#0D0D0F]/95 backdrop-blur-xl p-2"
                >
                    {SECTIONS.map((section) => (
                        <li key={section.id}>
                            <a
                                href={`#${section.id}`}
                                onClick={(event) => handleNav(event, section.id)}
                                className={`block rounded-lg px-4 py-3 text-sm transition-colors ${
                                    activeId === section.id ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5"
                                }`}
                            >
                                {section.label}
                            </a>
                        </li>
                    ))}
                </motion.ul>
            )}

            <motion.div
                className="absolute bottom-0 left-0 h-px origin-left bg-white/70"
                style={{ scaleX: progress, width: "100%" }}
                aria-hidden="true"
            />
        </motion.header>
    );
}

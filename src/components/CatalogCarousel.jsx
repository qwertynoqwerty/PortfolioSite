import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import projects from "../data/projects.json";
import ProjectCard from "./ProjectCard";
import ShowcaseImageModal from "./ShowcaseImageModal";
import ShowcaseVideoModal from "./ShowcaseVideoModal";

const ytId = (v) => {
    if (!v) return "";
    const m = String(v).match(/(?:v=|youtu\.be\/|embed\/)([\w-]{6,})/);
    return m?.[1] ?? String(v);
};

const sectionIn = {
    initial: { opacity: 0, y: 60 },
    inView: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.25, 0.1, 0.25, 1] } },
};

const headerIn = {
    initial: { opacity: 0, y: 30 },
    inView: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const pop = (delay) => ({
    initial: { opacity: 0, y: 18 },
    inView: { opacity: 1, y: 0, transition: { duration: 0.65, ease: "easeOut", delay } },
});

export default function CatalogCarousel() {
    const items = useMemo(() => projects.filter((p) => !p.featured), []);

    const [imageOpen, setImageOpen] = useState(false);
    const [videoOpen, setVideoOpen] = useState(false);
    const [currentTitle, setCurrentTitle] = useState("");
    const [currentImages, setCurrentImages] = useState([]);
    const [currentYoutubeId, setCurrentYoutubeId] = useState("");

    const railRef = useRef(null);
    const trackRef = useRef(null);

    const [atStart, setAtStart] = useState(true);
    const [atEnd, setAtEnd] = useState(false);

    const stepRef = useRef(600);
    const rafRef = useRef(0);

    const openImages = (e, p) => {
        e.preventDefault();
        if (p.images?.length) {
            setCurrentTitle(p.title);
            setCurrentImages(p.images);
            setImageOpen(true);
        }
    };

    const openVideo = (e, p) => {
        e.preventDefault();
        const id = ytId(p.youtubeId);
        if (id) {
            setCurrentTitle(p.title);
            setCurrentYoutubeId(id);
            setVideoOpen(true);
        }
    };

    const openRepo = (e, p) => {
        e.preventDefault();
        if (p.repo) window.open(p.repo, "_blank", "noopener,noreferrer");
    };

    const stopAnim = () => {
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = 0;
        }
    };

    const animateScrollTo = (el, targetLeft) => {
        if (!el) return;

        stopAnim();

        const startLeft = el.scrollLeft;
        const maxLeft = Math.max(0, el.scrollWidth - el.clientWidth);
        const clampedTarget = Math.max(0, Math.min(targetLeft, maxLeft));
        const delta = clampedTarget - startLeft;

        if (Math.abs(delta) < 0.5) return;

        const durationMs = 520;
        const t0 = performance.now();

        const easeInOutCubic = (t) => {
            if (t < 0.5) return 4 * t * t * t;
            return 1 - Math.pow(-2 * t + 2, 3) / 2;
        };

        const tick = (now) => {
            const t = Math.min(1, (now - t0) / durationMs);
            el.scrollLeft = startLeft + delta * easeInOutCubic(t);

            if (t < 1) {
                rafRef.current = requestAnimationFrame(tick);
            } else {
                rafRef.current = 0;
            }
        };

        rafRef.current = requestAnimationFrame(tick);
    };

    useEffect(() => {
        const rail = railRef.current;
        const track = trackRef.current;

        if (!rail || !track) return;

        const updateEdges = () => {
            const max = rail.scrollWidth - rail.clientWidth - 1;
            setAtStart(rail.scrollLeft <= 0);
            setAtEnd(rail.scrollLeft >= max);
        };

        const calcStep = () => {
            const firstCell = track.querySelector("[data-card-cell='1']");
            if (!firstCell) return;

            const cellRect = firstCell.getBoundingClientRect();
            const trackStyle = getComputedStyle(track);

            const gap =
                parseFloat(trackStyle.columnGap || "0") ||
                parseFloat(trackStyle.gap || "0") ||
                0;

            stepRef.current = Math.max(120, Math.round(cellRect.width + gap));
            updateEdges();
        };

        const ro = new ResizeObserver(() => {
            requestAnimationFrame(() => {
                calcStep();
                updateEdges();
            });
        });

        ro.observe(rail);
        ro.observe(track);

        rail.addEventListener("scroll", updateEdges, { passive: true });

        requestAnimationFrame(() => {
            rail.scrollLeft = 0;
            calcStep();
            updateEdges();
        });

        return () => {
            stopAnim();
            ro.disconnect();
            rail.removeEventListener("scroll", updateEdges);
        };
    }, [items.length]);

    const scrollByStep = (dir) => {
        const rail = railRef.current;
        if (!rail) return;

        const step = stepRef.current || 600;
        animateScrollTo(rail, rail.scrollLeft + dir * step);
    };

    if (items.length === 0) return null;

    return (
        <motion.section
            id="catalog"
            className="mx-auto max-w-[100rem] px-4 md:px-8 pt-8 pb-28"
            initial={sectionIn.initial}
            whileInView={sectionIn.inView}
            viewport={{ once: true, amount: 0.22 }}
        >
            {/* Заголовок */}
            <motion.div
                className="mb-10 text-center"
                initial={headerIn.initial}
                whileInView={headerIn.inView}
                viewport={{ once: true, amount: 0.65 }}
            >
                <h2 className="text-[40px] md:text-[48px] font-bold leading-none">Каталог</h2>
                <div className="mt-3 flex flex-col items-center gap-2">
                    <div className="h-[3px] w-40 bg-white/30 rounded-full" />
                    <div className="h-[3px] w-32 bg-white/20 rounded-full" />
                    <div className="h-[3px] w-48 bg-white/15 rounded-full" />
                </div>
            </motion.div>

            <div className="relative overflow-visible">
                {/* 1) Левая кнопка */}
                <motion.button
                    type="button"
                    aria-label="Назад"
                    title="Назад"
                    onClick={() => scrollByStep(-1)}
                    disabled={atStart}
                    initial={pop(0.00).initial}
                    whileInView={pop(0.00).inView}
                    viewport={{ once: true, amount: 0.25 }}
                    className={`absolute z-40 -left-8 md:-left-10 top-1/2 -translate-y-1/2 rounded-full border border-white/15 bg-white/10 px-3 py-3 backdrop-blur text-lg leading-none shadow-lg transition-opacity ${
                        atStart ? "opacity-40 cursor-not-allowed pointer-events-none" : "hover:bg-white/20"
                    }`}
                >
                    ‹
                </motion.button>

                {/* 2) Каталог (лента) */}
                <motion.div
                    initial={pop(0.12).initial}
                    whileInView={pop(0.12).inView}
                    viewport={{ once: true, amount: 0.20 }}
                >
                    <div
                        ref={railRef}
                        className="relative z-20 overflow-x-hidden overflow-y-hidden py-2 [scrollbar-width:none] [-ms-overflow-style:none]"
                        style={{
                            WebkitOverflowScrolling: "touch",
                            overscrollBehaviorX: "contain",
                            overscrollBehaviorY: "auto",
                            touchAction: "pan-y",
                        }}
                        aria-label="Лента проектов каталога"
                        onWheelCapture={(e) => {
                            // Важно: не preventDefault — колесо остаётся для скролла страницы
                            e.stopPropagation();
                        }}
                    >
                        <style>{`[data-hide-scrollbar]::-webkit-scrollbar{display:none}`}</style>

                        <div ref={trackRef} data-hide-scrollbar className="flex items-stretch gap-5 md:gap-6 lg:gap-8">
                            {items.map((p, i) => (
                                <div key={p.id} data-card-cell={i === 0 ? "1" : "0"} className="shrink-0">
                                    <ProjectCard
                                        project={p}
                                        compact
                                        onOpenImages={(ev) => openImages(ev, p)}
                                        onOpenVideo={(ev) => openVideo(ev, p)}
                                        onOpenRepo={(ev) => openRepo(ev, p)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* 3) Правая кнопка */}
                <motion.button
                    type="button"
                    aria-label="Вперёд"
                    title="Вперёд"
                    onClick={() => scrollByStep(1)}
                    disabled={atEnd}
                    initial={pop(0.24).initial}
                    whileInView={pop(0.24).inView}
                    viewport={{ once: true, amount: 0.25 }}
                    className={`absolute z-40 -right-8 md:-right-10 top-1/2 -translate-y-1/2 rounded-full border border-white/15 bg-white/10 px-3 py-3 backdrop-blur text-lg leading-none shadow-lg transition-opacity ${
                        atEnd ? "opacity-40 cursor-not-allowed" : "hover:bg-white/20"
                    }`}
                >
                    ›
                </motion.button>
            </div>

            <ShowcaseImageModal
                open={imageOpen}
                title={currentTitle}
                images={currentImages}
                onClose={() => setImageOpen(false)}
            />
            <ShowcaseVideoModal
                open={videoOpen}
                title={currentTitle}
                youtubeId={currentYoutubeId}
                onClose={() => setVideoOpen(false)}
            />
        </motion.section>
    );
}

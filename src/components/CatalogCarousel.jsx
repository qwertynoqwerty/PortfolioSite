import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import projects from "../data/projects.json";
import ProjectCard from "./ProjectCard";
import ShowcaseImageModal from "./ShowcaseImageModal";
import ShowcaseVideoModal from "./ShowcaseVideoModal";

/**
 * CatalogCarousel — горизонтальная лента «остальных» проектов.
 * Скролл колесом/тачем/drag отключён — перелистывание ТОЛЬКО кнопками ←/→.
 * Шаг прокрутки = ширина карточки + gap, вычисляется динамически.
 */
const containerAnim = { hidden: { opacity: 0, y: 60 }, show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: "easeOut" } } };
const ytId = (v) => (v ? (String(v).match(/(?:v=|youtu\.be\/|embed\/)([\w-]{6,})/)?.[1] ?? String(v)) : "");

export default function CatalogCarousel() {
    const items = useMemo(() => projects.filter((p) => !p.featured), []);
    const [imageOpen, setImageOpen] = useState(false);
    const [videoOpen, setVideoOpen] = useState(false);
    const [currentTitle, setCurrentTitle] = useState("");
    const [currentImages, setCurrentImages] = useState([]);
    const [currentYoutubeId, setCurrentYoutubeId] = useState("");

    const railRef = useRef(null);
    const [atStart, setAtStart] = useState(true);
    const [atEnd, setAtEnd] = useState(false);
    const stepRef = useRef(600); // заменим реальной шириной карточки + gap

    const openImages = (e, p) => { e.preventDefault(); if (p.images?.length){ setCurrentTitle(p.title); setCurrentImages(p.images); setImageOpen(true);} };
    const openVideo  = (e, p) => { e.preventDefault(); const id = ytId(p.youtubeId); if (id){ setCurrentTitle(p.title); setCurrentYoutubeId(id); setVideoOpen(true);} };
    const openRepo   = (e, p) => { e.preventDefault(); if (p.repo) window.open(p.repo, "_blank", "noopener,noreferrer"); };

    // Шаг и края
    useEffect(() => {
        const rail = railRef.current; if (!rail) return;

        const calcStep = () => {
            const first = rail.querySelector("[data-card-cell='1']"); if (!first) return;
            const rect = first.getBoundingClientRect();
            const gap =
                parseFloat(getComputedStyle(rail.firstElementChild).columnGap || 0) ||
                parseFloat(getComputedStyle(rail.firstElementChild).gap || 0) || 0;
            stepRef.current = Math.max(120, Math.round(rect.width + gap));
            updateEdges();
        };
        const updateEdges = () => {
            const max = rail.scrollWidth - rail.clientWidth - 1;
            setAtStart(rail.scrollLeft <= 0);
            setAtEnd(rail.scrollLeft >= max);
        };

        const ro = new ResizeObserver(() => requestAnimationFrame(() => { calcStep(); updateEdges(); }));
        ro.observe(rail); if (rail.firstElementChild) ro.observe(rail.firstElementChild);
        rail.addEventListener("scroll", updateEdges, { passive: true });

        requestAnimationFrame(() => { rail.scrollLeft = 0; calcStep(); updateEdges(); });
        return () => { ro.disconnect(); rail.removeEventListener("scroll", updateEdges); };
    }, [items.length]);

    const scrollByStep = (dir) => { const rail = railRef.current; if (rail) rail.scrollBy({ left: dir * stepRef.current, behavior: "smooth" }); };

    // Полностью блокируем wheel/тач внутри ленты
    useEffect(() => {
        const rail = railRef.current; if (!rail) return;
        const stop = (e) => e.preventDefault();
        rail.addEventListener("wheel", stop, { passive: false });
        rail.addEventListener("touchmove", stop, { passive: false });
        return () => { rail.removeEventListener("wheel", stop); rail.removeEventListener("touchmove", stop); };
    }, []);

    if (items.length === 0) return null;

    return (
        <motion.section id="catalog" className="mx-auto max-w-[100rem] px-4 md:px-8 pt-8 pb-28"
                        variants={containerAnim} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
            {/* Заголовок и линии — единый размер */}
            <div className="mb-10 text-center">
                <h2 className="text-[40px] md:text-[48px] font-bold leading-none">Каталог</h2>
                <div className="mt-3 flex flex-col items-center gap-2">
                    <div className="h-[3px] w-40 bg-white/30 rounded-full" />
                    <div className="h-[3px] w-32 bg-white/20 rounded-full" />
                    <div className="h-[3px] w-48 bg-white/15 rounded-full" />
                </div>
            </div>


            {/* Внешняя обёртка: стрелки вынесены ВНЕ рельсы (overflow их не режет) */}
            <div className="relative overflow-visible">
                {/* Рельса — программный горизонтальный скролл */}
                <div
                    ref={railRef}
                    className="relative z-20 overflow-x-auto overflow-y-hidden py-2 [scrollbar-width:none] [-ms-overflow-style:none]"
                    style={{
                        WebkitOverflowScrolling: "touch",
                        overscrollBehaviorX: "contain",
                        overscrollBehaviorY: "none",
                        touchAction: "none"
                    }}
                    aria-label="Лента проектов каталога"
                >
                    <style>{`[data-hide-scrollbar]::-webkit-scrollbar{display:none}`}</style>
                    <div data-hide-scrollbar className="flex items-stretch gap-5 md:gap-6 lg:gap-8">
                        {items.map((p, i) => (
                            <div key={p.id} data-card-cell={i === 0 ? "1" : "0"} className="shrink-0">
                                <ProjectCard
                                    project={p}
                                    compact
                                    onOpenImages={(e) => openImages(e, p)}
                                    onOpenVideo={(e) => openVideo(e, p)}
                                    onOpenRepo={(e) => openRepo(e, p)}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Стрелки навигации */}
                <button type="button" aria-label="Назад" title="Назад" onClick={() => scrollByStep(-1)}
                        disabled={atStart}
                        className={`absolute z-40 -left-8 md:-left-10 top-1/2 -translate-y-1/2 rounded-full border border-white/15 bg-white/10 px-3 py-3 backdrop-blur text-lg leading-none shadow-lg transition-opacity ${atStart ? "opacity-40 cursor-not-allowed pointer-events-none" : "hover:bg-white/20"}`}>‹</button>
                <button type="button" aria-label="Вперёд" title="Вперёд" onClick={() => scrollByStep(1)} disabled={atEnd}
                        className={`absolute z-40 -right-8 md:-right-10 top-1/2 -translate-y-1/2 rounded-full border border-white/15 bg-white/10 px-3 py-3 backdrop-blur text-lg leading-none shadow-lg transition-opacity ${atEnd ? "opacity-40 cursor-not-allowed" : "hover:bg-white/20"}`}>›</button>
            </div>

            {/* Общие модалки */}
            <ShowcaseImageModal open={imageOpen} title={currentTitle} images={currentImages} onClose={()=>setImageOpen(false)} />
            <ShowcaseVideoModal  open={videoOpen}  title={currentTitle} youtubeId={currentYoutubeId} onClose={()=>setVideoOpen(false)} />
        </motion.section>
    );
}

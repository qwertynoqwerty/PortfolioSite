import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import projects from "../data/projects.json";
import ProjectCard from "./ProjectCard";
import ShowcaseImageModal from "./ShowcaseImageModal";
import ShowcaseVideoModal from "./ShowcaseVideoModal";
import SectionTitle from "./SectionTitle";
import useProjectMediaModals from "../utils/useProjectMediaModals";
import { HEADER_IN, SECTION_IN } from "../utils/motionPresets";

const pop = (delay) => ({
    initial: { opacity: 0, y: 18 },
    inView: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut", delay } },
});
const navButtonClass =
    "relative z-30 flex h-12 w-12 items-center justify-center justify-self-center rounded-full border text-lg leading-none backdrop-blur transition-[transform,opacity,background-color,border-color,color,box-shadow,filter] duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

function getVisibleCount(width) {
    if (width < 640) {
        return 1;
    }
    if (width < 1024) {
        return 2;
    }
    return 3;
}

export default function CatalogCarousel() {
    const items = useMemo(() => projects.filter((project) => !project.featured), []);
    const { openImages, openVideo, openRepo, imageModalProps, videoModalProps } = useProjectMediaModals();

    const viewportRef = useRef(null);
    const trackRef = useRef(null);
    const swipeStart = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [slideWidth, setSlideWidth] = useState(0);
    const [trackGap, setTrackGap] = useState(24);
    const [visibleCount, setVisibleCount] = useState(3);

    const maxIndex = Math.max(0, items.length - visibleCount);
    const translateX = Math.round(activeIndex * (slideWidth + trackGap));
    const isPrevDisabled = activeIndex === 0;
    const isNextDisabled = activeIndex >= maxIndex;
    const activeButtonStyle = {
        borderColor: "rgba(255,255,255,0.2)",
        backgroundColor: "rgba(17,17,20,0.92)",
        color: "rgb(255,255,255)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
        opacity: 1,
        filter: "none",
    };
    const disabledButtonStyle = {
        borderColor: "rgba(255,255,255,0.1)",
        backgroundColor: "rgba(17,17,20,0.92)",
        color: "rgba(255,255,255,0.55)",
        boxShadow: "none",
        opacity: 1,
        filter: "none",
    };

    const updateLayout = () => {
        const viewport = viewportRef.current;
        const track = trackRef.current;

        if (!viewport || !track) {
            return;
        }

        const viewportWidth = viewport.clientWidth;
        const nextVisible = getVisibleCount(viewportWidth);
        const computedStyle = getComputedStyle(track);
        const gap = Math.round(parseFloat(computedStyle.columnGap || computedStyle.gap || "0") || 0);
        const nextSlideWidth =
            viewportWidth > 0
                ? Math.max(0, Math.floor((viewportWidth - gap * (nextVisible - 1)) / nextVisible))
                : 0;

        setVisibleCount(nextVisible);
        setTrackGap(gap);
        setSlideWidth(nextSlideWidth);
    };

    useLayoutEffect(() => {
        updateLayout();
    }, [items.length]);

    useEffect(() => {
        const viewport = viewportRef.current;

        if (!viewport) {
            return undefined;
        }

        const resizeObserver = new ResizeObserver(() => {
            window.requestAnimationFrame(updateLayout);
        });

        resizeObserver.observe(viewport);

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    useEffect(() => {
        if (activeIndex > maxIndex) {
            setActiveIndex(maxIndex);
        }
    }, [activeIndex, maxIndex]);

    useEffect(() => {
        const onKeyDown = (event) => {
            if (event.key === "ArrowLeft") {
                moveTo(activeIndex - 1);
            }

            if (event.key === "ArrowRight") {
                moveTo(activeIndex + 1);
            }
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [activeIndex, maxIndex]);

    const moveTo = (nextIndex) => {
        const clampedIndex = Math.max(0, Math.min(maxIndex, nextIndex));
        setActiveIndex(clampedIndex);
    };

    const goPrev = () => moveTo(activeIndex - 1);
    const goNext = () => moveTo(activeIndex + 1);

    const onPointerDown = (event) => {
        if (event.pointerType === "mouse" && event.button !== 0) {
            return;
        }
        swipeStart.current = { x: event.clientX, y: event.clientY };
    };

    const onPointerUp = (event) => {
        const start = swipeStart.current;
        swipeStart.current = null;
        if (!start) {
            return;
        }

        const dx = event.clientX - start.x;
        const dy = event.clientY - start.y;
        if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
            if (dx < 0) {
                goNext();
            } else {
                goPrev();
            }
        }
    };

    if (items.length === 0) {
        return null;
    }

    return (
        <motion.section
            id="catalog"
            className="mx-auto max-w-[100rem] px-4 md:px-8 pt-8 pb-28"
            initial={SECTION_IN.hidden}
            whileInView={SECTION_IN.show}
            viewport={{ once: true, amount: 0.22 }}
        >
            <motion.div
                className="mb-10"
                initial={HEADER_IN.hidden}
                whileInView={HEADER_IN.show}
                viewport={{ once: true, amount: 0.65 }}
            >
                <SectionTitle title="Каталог" eyebrow="все работы" />
            </motion.div>

            <div className="grid grid-cols-[48px_minmax(0,1fr)_48px] md:grid-cols-[56px_minmax(0,1fr)_56px] items-center gap-3 md:gap-4 overflow-visible">
                <motion.button
                    type="button"
                    aria-label="Назад"
                    title="Назад"
                    onClick={goPrev}
                    disabled={isPrevDisabled}
                    aria-disabled={isPrevDisabled}
                    data-state={isPrevDisabled ? "disabled" : "active"}
                    initial={pop(0).initial}
                    whileInView={pop(0).inView}
                    viewport={{ once: true, amount: 0.25 }}
                    className={navButtonClass}
                    style={isPrevDisabled ? disabledButtonStyle : activeButtonStyle}
                >
                    ‹
                </motion.button>

                <motion.div
                    initial={pop(0.12).initial}
                    whileInView={pop(0.12).inView}
                    viewport={{ once: true, amount: 0.2 }}
                >
                    <div
                        ref={viewportRef}
                        onPointerDown={onPointerDown}
                        onPointerUp={onPointerUp}
                        className="relative z-20 overflow-hidden rounded-[28px] px-0 py-2 touch-pan-y"
                        aria-label="Лента проектов каталога"
                    >
                        <motion.div
                            ref={trackRef}
                            className="flex items-stretch gap-4 md:gap-6 lg:gap-8"
                            animate={{ x: -translateX }}
                            transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
                        >
                            {items.map((project) => (
                                <div
                                    key={project.id}
                                    className="shrink-0 min-w-0"
                                    style={{
                                        width: slideWidth ? `${slideWidth}px` : "100%",
                                        flexBasis: slideWidth ? `${slideWidth}px` : "100%",
                                    }}
                                >
                                    <ProjectCard
                                        project={project}
                                        compact
                                        onOpenImages={openImages}
                                        onOpenVideo={openVideo}
                                        onOpenRepo={openRepo}
                                    />
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </motion.div>

                <motion.button
                    type="button"
                    aria-label="Вперёд"
                    title="Вперёд"
                    onClick={goNext}
                    disabled={isNextDisabled}
                    aria-disabled={isNextDisabled}
                    data-state={isNextDisabled ? "disabled" : "active"}
                    initial={pop(0.24).initial}
                    whileInView={pop(0.24).inView}
                    viewport={{ once: true, amount: 0.25 }}
                    className={navButtonClass}
                    style={isNextDisabled ? disabledButtonStyle : activeButtonStyle}
                >
                    ›
                </motion.button>
            </div>

            {maxIndex > 0 && (
                <div className="mt-8 flex items-center justify-center gap-2" role="tablist" aria-label="Страницы каталога">
                    {Array.from({ length: maxIndex + 1 }).map((_, dotIndex) => {
                        const isActive = dotIndex === activeIndex;
                        return (
                            <button
                                key={dotIndex}
                                type="button"
                                aria-label={`Перейти к позиции ${dotIndex + 1}`}
                                aria-selected={isActive}
                                onClick={() => moveTo(dotIndex)}
                                className={`h-1.5 rounded-full transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                                    isActive ? "w-7 bg-white/80" : "w-1.5 bg-white/25 hover:bg-white/45"
                                }`}
                            />
                        );
                    })}
                </div>
            )}

            <ShowcaseImageModal {...imageModalProps} />
            <ShowcaseVideoModal {...videoModalProps} />
        </motion.section>
    );
}

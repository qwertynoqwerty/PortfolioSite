import { useEffect, useMemo, useRef, useState } from "react";
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
    inView: { opacity: 1, y: 0, transition: { duration: 0.65, ease: "easeOut", delay } },
});

export default function CatalogCarousel() {
    const items = useMemo(() => projects.filter((project) => !project.featured), []);
    const { openImages, openVideo, openRepo, imageModalProps, videoModalProps } = useProjectMediaModals();

    const railRef = useRef(null);
    const trackRef = useRef(null);
    const stepRef = useRef(600);
    const rafRef = useRef(0);

    const [atStart, setAtStart] = useState(true);
    const [atEnd, setAtEnd] = useState(false);

    const stopAnim = () => {
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = 0;
        }
    };

    const animateScrollTo = (element, targetLeft) => {
        if (!element) {
            return;
        }

        stopAnim();

        const startLeft = element.scrollLeft;
        const maxLeft = Math.max(0, element.scrollWidth - element.clientWidth);
        const clampedTarget = Math.max(0, Math.min(targetLeft, maxLeft));
        const delta = clampedTarget - startLeft;

        if (Math.abs(delta) < 0.5) {
            return;
        }

        const durationMs = 520;
        const startTime = performance.now();

        const easeInOutCubic = (t) => {
            if (t < 0.5) {
                return 4 * t * t * t;
            }

            return 1 - Math.pow(-2 * t + 2, 3) / 2;
        };

        const tick = (now) => {
            const t = Math.min(1, (now - startTime) / durationMs);
            element.scrollLeft = startLeft + delta * easeInOutCubic(t);

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

        if (!rail || !track) {
            return undefined;
        }

        const updateEdges = () => {
            const max = rail.scrollWidth - rail.clientWidth - 1;
            setAtStart(rail.scrollLeft <= 0);
            setAtEnd(rail.scrollLeft >= max);
        };

        const calcStep = () => {
            const firstCell = track.querySelector("[data-card-cell='1']");
            if (!firstCell) {
                return;
            }

            const cellRect = firstCell.getBoundingClientRect();
            const trackStyle = getComputedStyle(track);
            const gap =
                parseFloat(trackStyle.columnGap || "0") ||
                parseFloat(trackStyle.gap || "0") ||
                0;

            stepRef.current = Math.max(120, Math.round(cellRect.width + gap));
            updateEdges();
        };

        const resizeObserver = new ResizeObserver(() => {
            requestAnimationFrame(() => {
                calcStep();
                updateEdges();
            });
        });

        resizeObserver.observe(rail);
        resizeObserver.observe(track);
        rail.addEventListener("scroll", updateEdges, { passive: true });

        requestAnimationFrame(() => {
            rail.scrollLeft = 0;
            calcStep();
            updateEdges();
        });

        return () => {
            stopAnim();
            resizeObserver.disconnect();
            rail.removeEventListener("scroll", updateEdges);
        };
    }, [items.length]);

    const scrollByStep = (dir) => {
        const rail = railRef.current;
        if (!rail) {
            return;
        }

        animateScrollTo(rail, rail.scrollLeft + dir * (stepRef.current || 600));
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
                <SectionTitle title="Каталог" />
            </motion.div>

            <div className="relative overflow-visible">
                <motion.button
                    type="button"
                    aria-label="Назад"
                    title="Назад"
                    onClick={() => scrollByStep(-1)}
                    disabled={atStart}
                    initial={pop(0).initial}
                    whileInView={pop(0).inView}
                    viewport={{ once: true, amount: 0.25 }}
                    className={`absolute z-40 -left-8 md:-left-10 top-1/2 -translate-y-1/2 rounded-full border border-white/15 bg-white/10 px-3 py-3 backdrop-blur text-lg leading-none shadow-lg transition-opacity ${
                        atStart ? "opacity-40 cursor-not-allowed pointer-events-none" : "hover:bg-white/20"
                    }`}
                >
                    ‹
                </motion.button>

                <motion.div
                    initial={pop(0.12).initial}
                    whileInView={pop(0.12).inView}
                    viewport={{ once: true, amount: 0.2 }}
                >
                    <div
                        ref={railRef}
                        className="relative z-20 overflow-x-hidden overflow-y-hidden py-2 hide-scrollbar"
                        style={{
                            WebkitOverflowScrolling: "touch",
                            overscrollBehaviorX: "contain",
                            overscrollBehaviorY: "auto",
                            touchAction: "pan-y",
                        }}
                        aria-label="Лента проектов каталога"
                        onWheelCapture={(event) => {
                            event.stopPropagation();
                        }}
                    >
                        <div ref={trackRef} className="flex items-stretch gap-5 md:gap-6 lg:gap-8">
                            {items.map((project, index) => (
                                <div key={project.id} data-card-cell={index === 0 ? "1" : "0"} className="shrink-0">
                                    <ProjectCard
                                        project={project}
                                        compact
                                        onOpenImages={openImages}
                                        onOpenVideo={openVideo}
                                        onOpenRepo={openRepo}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

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

            <ShowcaseImageModal {...imageModalProps} />
            <ShowcaseVideoModal {...videoModalProps} />
        </motion.section>
    );
}

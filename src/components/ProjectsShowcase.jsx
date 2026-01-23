import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import projects from "../data/projects.json";
import ShowcaseImageModal from "./ShowcaseImageModal";
import ShowcaseVideoModal from "./ShowcaseVideoModal";
import SmartImage from "./SmartImage";

const formatMonthYear = (dateStr, year) => {
    try {
        if (dateStr && typeof dateStr === "string") {
            const iso = dateStr.length === 7 ? `${dateStr}-01` : dateStr;
            const d = new Date(iso);
            if (!isNaN(d)) return d.toLocaleDateString("ru-RU", { month: "long", year: "numeric" });
        }
    } catch {}
    return year ? String(year) : "";
};

const ytId = (val) => {
    if (!val) return "";
    const m = String(val).match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{6,})/);
    return m?.[1] ?? String(val);
};

const sectionIn = {
    initial: { opacity: 0, y: 60 },
    inView: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.25, 0.1, 0.25, 1] } },
};

const headerIn = {
    initial: { opacity: 0, y: 30 },
    inView: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const projectIn = {
    initial: { opacity: 0, y: 36 },
    inView: { opacity: 1, y: 0, transition: { duration: 0.85, ease: "easeOut" } },
};

const leftColIn = {
    initial: { opacity: 0, x: -26 },
    inView: { opacity: 1, x: 0, transition: { duration: 0.75, ease: "easeOut" } },
};

const rightColIn = {
    initial: { opacity: 0, x: 26 },
    inView: { opacity: 1, x: 0, transition: { duration: 0.75, ease: "easeOut", delay: 0.08 } },
};

export default function ProjectsShowcase() {
    const list = useMemo(() => projects.filter((p) => p.featured), []);

    const [imageOpen, setImageOpen] = useState(false);
    const [videoOpen, setVideoOpen] = useState(false);
    const [currentTitle, setCurrentTitle] = useState("");
    const [currentImages, setCurrentImages] = useState([]);
    const [currentYoutubeId, setCurrentYoutubeId] = useState("");

    const closeFocusRef = useRef(null);

    const openImages = (e, p) => {
        e.preventDefault();
        e.stopPropagation();

        if (p.images?.length) {
            setCurrentTitle(p.title);
            setCurrentImages(p.images);
            setImageOpen(true);
        }
    };

    const openVideo = (e, p) => {
        e.preventDefault();
        e.stopPropagation();

        const id = ytId(p.youtubeId);
        if (id) {
            setCurrentTitle(p.title);
            setCurrentYoutubeId(id);
            setVideoOpen(true);
        }
    };

    const openRepo = (e, p) => {
        e.preventDefault();
        e.stopPropagation();

        if (p.repo) window.open(p.repo, "_blank", "noopener,noreferrer");
    };

    return (
        <motion.section
            id="projects"
            className="mx-auto max-w-[100rem] px-4 md:px-8 pt-16 pb-28"
            initial={sectionIn.initial}
            whileInView={sectionIn.inView}
            viewport={{ once: true, amount: 0.22 }}
        >
            {/* 1) Сначала заголовок */}
            <motion.div
                className="mb-20 text-center"
                initial={headerIn.initial}
                whileInView={headerIn.inView}
                viewport={{ once: true, amount: 0.65 }}
            >
                <h2 className="text-[40px] md:text-[48px] font-bold leading-none">Проекты</h2>
                <div className="mt-3 flex flex-col items-center gap-2">
                    <div className="h-[3px] w-40 bg-white/30 rounded-full" />
                    <div className="h-[3px] w-32 bg-white/20 rounded-full" />
                    <div className="h-[3px] w-48 bg-white/15 rounded-full" />
                </div>
            </motion.div>

            {/* 2) Потом верхний проект, 3) потом нижний (каждый сам по себе whileInView) */}
            <div className="flex flex-col gap-32">
                {list.map((p, idx) => {
                    const imageLeft = idx % 2 === 0;

                    return (
                        <motion.div
                            key={p.id}
                            className="grid items-start md:grid-cols-2 gap-14 md:gap-28 lg:gap-44 xl:gap-56"
                            initial={projectIn.initial}
                            whileInView={projectIn.inView}
                            viewport={{ once: true, amount: 0.35 }}
                        >
                            {/* Картинка */}
                            <motion.div
                                initial={(imageLeft ? leftColIn : rightColIn).initial}
                                whileInView={(imageLeft ? leftColIn : rightColIn).inView}
                                viewport={{ once: true, amount: 0.40 }}
                                className={`rounded-2xl border border-white/10 bg-white/5 p-1 ${imageLeft ? "" : "md:order-2"}`}
                            >
                                <div className="overflow-hidden rounded-xl">
                                    {p.cover ? (
                                        <div className="w-full aspect-[16/9] bg-black">
                                            <SmartImage
                                                src={p.cover}
                                                alt={p.title}
                                                className="w-full h-full object-cover bg-black"
                                                width={1600}
                                                height={900}
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-full aspect-[16/9] bg-white/5" />
                                    )}
                                </div>

                                <div className="flex justify-center gap-3 px-4 py-3">
                                    <button
                                        type="button"
                                        onClick={(e) => openImages(e, p)}
                                        disabled={!p.images || p.images.length === 0}
                                        className={`px-3 py-1.5 rounded-lg border text-sm ${
                                            p.images?.length ? "border-white/20 hover:bg-white/10" : "border-white/10 opacity-60 cursor-not-allowed"
                                        }`}
                                    >
                                        Изображения
                                    </button>

                                    <button
                                        type="button"
                                        onClick={(e) => openVideo(e, p)}
                                        disabled={!p.youtubeId}
                                        className={`px-3 py-1.5 rounded-lg border text-sm ${
                                            p.youtubeId ? "border-white/20 hover:bg-white/10" : "border-white/10 opacity-60 cursor-not-allowed"
                                        }`}
                                    >
                                        Видео
                                    </button>

                                    <button
                                        type="button"
                                        onClick={(e) => openRepo(e, p)}
                                        disabled={!p.repo}
                                        className={`px-3 py-1.5 rounded-lg border text-sm ${
                                            p.repo ? "border-white/20 hover:bg-white/10" : "border-white/10 opacity-60 cursor-not-allowed"
                                        }`}
                                    >
                                        Репозиторий
                                    </button>
                                </div>
                            </motion.div>

                            {/* Текст */}
                            <motion.div
                                initial={(imageLeft ? rightColIn : leftColIn).initial}
                                whileInView={(imageLeft ? rightColIn : leftColIn).inView}
                                viewport={{ once: true, amount: 0.40 }}
                                className={`${imageLeft ? "" : "md:order-1"}`}
                            >
                                <div className="flex items-baseline justify-between gap-8">
                                    <h3 className="text-2xl md:text-3xl font-semibold">{p.title}</h3>
                                    <span className="text-sm text-white/60">{formatMonthYear(p.date, p.year)}</span>
                                </div>

                                {p.summary && (
                                    <p className="mt-6 text-[17px] md:text-[18px] leading-relaxed text-white/80">
                                        {p.summary}
                                    </p>
                                )}
                            </motion.div>
                        </motion.div>
                    );
                })}
            </div>

            <ShowcaseImageModal
                open={imageOpen}
                title={currentTitle}
                images={currentImages}
                onClose={() => setImageOpen(false)}
                initialFocusRef={closeFocusRef}
            />
            <ShowcaseVideoModal
                open={videoOpen}
                title={currentTitle}
                youtubeId={currentYoutubeId}
                onClose={() => setVideoOpen(false)}
                initialFocusRef={closeFocusRef}
            />
        </motion.section>
    );
}

import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import projects from "../data/projects.json";
import ShowcaseImageModal from "./ShowcaseImageModal";
import ShowcaseVideoModal from "./ShowcaseVideoModal";
import SmartImage from "./SmartImage";
import { SECTION, ITEM, STAGGER } from "../utils/motionPresets";

const formatMonthYear = (dateStr, year) => {
    try {
        if (dateStr && typeof dateStr === "string") {
            const iso = dateStr.length === 7 ? `${dateStr}-01` : dateStr;
            const d = new Date(iso);
            if (!isNaN(d)) return d.toLocaleDateString("ru-RU", { month: "long", year: "numeric" });
        }
    } catch {}
    if (year) return String(year);
    return "";
};

const ytId = (val) => {
    if (!val) return "";
    const m = String(val).match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{6,})/);
    return m?.[1] ?? String(val);
};

const container = { ...SECTION, ...STAGGER(0.12) };
const item = ITEM;

/**
 * ProjectsShowcase — 5 топ-проектов (featured: true), чередование лево/право.
 * Кнопки по центру: Изображения / Видео / Репозиторий.
 * Дата — «месяц год» из date (YYYY-MM) или просто из year.
 */
export default function ProjectsShowcase() {
    const list = useMemo(() => projects.filter((p) => p.featured), []);

    const [imageOpen, setImageOpen] = useState(false);
    const [videoOpen, setVideoOpen] = useState(false);
    const [currentTitle, setCurrentTitle] = useState("");
    const [currentImages, setCurrentImages] = useState([]);
    const [currentYoutubeId, setCurrentYoutubeId] = useState("");

    const closeFocusRef = useRef(null);

    const openImages = (e, p) => {
        e.preventDefault(); e.stopPropagation();
        if (p.images?.length) {
            setCurrentTitle(p.title);
            setCurrentImages(p.images);
            setImageOpen(true);
        }
    };
    const openVideo = (e, p) => {
        e.preventDefault(); e.stopPropagation();
        const id = ytId(p.youtubeId);
        if (id) {
            setCurrentTitle(p.title);
            setCurrentYoutubeId(id);
            setVideoOpen(true);
        }
    };
    const openRepo = (e, p) => {
        e.preventDefault(); e.stopPropagation();
        if (p.repo) window.open(p.repo, "_blank", "noopener,noreferrer");
    };

    return (
        <motion.section
            id="projects"
            className="mx-auto max-w-[100rem] px-4 md:px-8 pt-16 pb-28"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
        >
            {/* Заголовок и линии — единый размер */}
            <div className="mb-20 text-center">
                <h2 className="text-[40px] md:text-[48px] font-bold leading-none">Проекты</h2>
                <div className="mt-3 flex flex-col items-center gap-2">
                    <div className="h-[3px] w-40 bg-white/30 rounded-full" />
                    <div className="h-[3px] w-32 bg-white/20 rounded-full" />
                    <div className="h-[3px] w-48 bg-white/15 rounded-full" />
                </div>
            </div>


            {/* равные колонки + широкий центральный зазор; оба столбца крупнее */}
            <div className="flex flex-col gap-32">
                {list.map((p, idx) => {
                    const imageLeft = idx % 2 === 0;
                    return (
                        <motion.div
                            key={p.id}
                            className="grid items-start md:grid-cols-2 gap-14 md:gap-28 lg:gap-44 xl:gap-56"
                            variants={item}
                        >
                            {/* cover 16:9, крупный */}
                            <div className={`rounded-2xl border border-white/10 bg-white/5 p-1 ${imageLeft ? "" : "md:order-2"}`}>
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

                                    ) : <div className="w-full aspect-[16/9] bg-white/5"/>}
                                </div>

                                <div className="flex justify-center gap-3 px-4 py-3">
                                <button type="button" onClick={(e) => openImages(e, p)}
                                            disabled={!p.images || p.images.length === 0}
                                            className={`px-3 py-1.5 rounded-lg border text-sm ${p.images?.length ? "border-white/20 hover:bg-white/10" : "border-white/10 opacity-60 cursor-not-allowed"}`}>
                                        Изображения
                                    </button>
                                    <button type="button" onClick={(e) => openVideo(e, p)}
                                            disabled={!p.youtubeId}
                                            className={`px-3 py-1.5 rounded-lg border text-sm ${p.youtubeId ? "border-white/20 hover:bg-white/10" : "border-white/10 opacity-60 cursor-not-allowed"}`}>
                                        Видео
                                    </button>
                                    <button type="button" onClick={(e) => openRepo(e, p)}
                                            disabled={!p.repo}
                                            className={`px-3 py-1.5 rounded-lg border text-sm ${p.repo ? "border-white/20 hover:bg-white/10" : "border-white/10 opacity-60 cursor-not-allowed"}`}>
                                        Репозиторий
                                    </button>
                                </div>
                            </div>

                            {/* текст — зеркально, «воздух» сохраняем */}
                            <div className={`${imageLeft ? "" : "md:order-1"}`}>
                                <div className="flex items-baseline justify-between gap-8">
                                    <h3 className="text-2xl md:text-3xl font-semibold">{p.title}</h3>
                                    <span className="text-sm text-white/60">{formatMonthYear(p.date, p.year)}</span>
                                </div>
                                {p.summary && <p className="mt-6 text-[17px] md:text-[18px] leading-relaxed text-white/80">{p.summary}</p>}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* модалки */}
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

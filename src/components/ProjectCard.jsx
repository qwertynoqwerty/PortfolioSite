import SmartImage from "./SmartImage";

const formatMonthYear = (dateStr, year) => {
    try {
        if (dateStr && typeof dateStr === "string") {
            const iso = dateStr.length === 7 ? `${dateStr}-01` : dateStr;
            const d = new Date(iso);
            if (!isNaN(d)) {
                return d.toLocaleDateString("ru-RU", { month: "long", year: "numeric" });
            }
        }
    } catch {}
    return year ? String(year) : "";
};

export default function ProjectCard({
                                        project,
                                        onOpenImages,
                                        onOpenVideo,
                                        onOpenRepo,
                                        compact = false,
                                    }) {
    const cardWidthClass   = compact ? "w-[36rem] max-w-[86vw]" : "w-[58rem] max-w-[86vw]";
    const aspectClass      = compact ? "aspect-[16/10]"        : "aspect-[16/9]";
    const titleClass       = compact ? "text-base md:text-lg"  : "text-lg md:text-xl";
    const summaryTextClass = compact ? "text-[13px] md:text-sm" : "text-sm md:text-[15px]";
    const btnBase          = "inline-flex items-center justify-center text-xs md:text-sm rounded-lg border transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white px-3 py-1.5";

    const hasImages = (project.images?.length || 0) > 0;
    const hasVideo  = !!project.youtubeId;
    const hasRepo   = !!project.repo;

    const cls = (enabled) =>
        `${btnBase} ${enabled ? "border-white/20 hover:bg-white/10" : "border-white/10 opacity-60 cursor-not-allowed"}`;

    return (
        <div className={`${cardWidthClass} rounded-2xl border border-white/10 bg-white/[0.05] p-1`}>
            <div className="overflow-hidden rounded-xl">
                <div className={`w-full ${aspectClass}`}>
                    {project.cover ? (
                        <SmartImage
                            src={project.cover}
                            alt={project.title}
                            className="w-full h-full object-cover"
                            width={1600}
                            height={aspectClass.includes("16/9") ? 900 : 1000}
                        />
                    ) : (
                        <div className="w-full h-full bg-white/5" />
                    )}
                </div>
            </div>

            <div className="px-5 pt-4 pb-5">
                <div className="flex items-baseline justify-between gap-6">
                    <h3 className={`font-semibold ${titleClass}`}>{project.title}</h3>
                    <span className="text-xs md:text-sm text-white/60">
            {formatMonthYear(project.date, project.year)}
          </span>
                </div>

                {project.summary && (
                    <p className={`mt-2 leading-relaxed text-white/75 ${summaryTextClass}`}>
                        {project.summary}
                    </p>
                )}

                <div className="mt-3 flex gap-3">
                    {/* Изображения */}
                    <button
                        type="button"
                        onClick={hasImages ? (e) => onOpenImages?.(e, project) : undefined}
                        disabled={!hasImages}
                        className={cls(hasImages)}
                    >
                        Изображения
                    </button>

                    {/* Видео */}
                    <button
                        type="button"
                        onClick={hasVideo ? (e) => onOpenVideo?.(e, project) : undefined}
                        disabled={!hasVideo}
                        className={cls(hasVideo)}
                    >
                        Видео
                    </button>

                    {/* Репозиторий */}
                    <button
                        type="button"
                        onClick={hasRepo ? (e) => onOpenRepo?.(e, project) : undefined}
                        disabled={!hasRepo}
                        className={cls(hasRepo)}
                    >
                        Репозиторий
                    </button>
                </div>
            </div>
        </div>
    );
}

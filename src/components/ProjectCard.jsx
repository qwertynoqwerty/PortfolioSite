import SmartImage from "./SmartImage";
import ProjectActions from "./ProjectActions";
import { formatMonthYear } from "../utils/projectHelpers";

export default function ProjectCard({
    project,
    onOpenImages,
    onOpenVideo,
    onOpenRepo,
    compact = false,
}) {
    const cardWidthClass = compact ? "w-full min-w-0" : "w-[58rem] max-w-[86vw]";
    const aspectClass = compact ? "aspect-[16/10]" : "aspect-[16/9]";
    const titleClass = compact ? "text-[1.05rem] md:text-[1.12rem]" : "text-lg md:text-xl";
    const summaryTextClass = compact ? "text-xs md:text-[13px]" : "text-sm md:text-[15px]";

    return (
        <div className={`${cardWidthClass} h-full rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.03] p-1 shadow-[0_18px_48px_rgba(0,0,0,0.18)]`}>
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

            <div className="px-4 sm:px-5 pt-4 pb-5 min-w-0 flex h-full flex-col">
                <div className="flex items-baseline justify-between gap-6">
                    <h3 className={`font-semibold ${titleClass}`}>{project.title}</h3>
                    <span className="text-[11px] md:text-xs text-white/60">{formatMonthYear(project.date, project.year)}</span>
                </div>

                {project.summary && (
                    <p className={`mt-2 leading-relaxed text-white/75 ${summaryTextClass} ${compact ? "min-h-[7.5rem] md:min-h-[6.8rem]" : ""}`}>
                        {project.summary}
                    </p>
                )}

                <ProjectActions
                    project={project}
                    onOpenImages={onOpenImages}
                    onOpenVideo={onOpenVideo}
                    onOpenRepo={onOpenRepo}
                    className="mt-auto pt-3 flex flex-wrap gap-2"
                    buttonClassName="inline-flex min-h-10 items-center justify-center rounded-lg border px-3 py-2 text-[11px] md:text-xs transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                />
            </div>
        </div>
    );
}

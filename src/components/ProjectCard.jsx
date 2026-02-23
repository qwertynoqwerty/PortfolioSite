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
    const cardWidthClass = compact ? "w-[36rem] max-w-[86vw]" : "w-[58rem] max-w-[86vw]";
    const aspectClass = compact ? "aspect-[16/10]" : "aspect-[16/9]";
    const titleClass = compact ? "text-base md:text-lg" : "text-lg md:text-xl";
    const summaryTextClass = compact ? "text-[13px] md:text-sm" : "text-sm md:text-[15px]";

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
                    <span className="text-xs md:text-sm text-white/60">{formatMonthYear(project.date, project.year)}</span>
                </div>

                {project.summary && (
                    <p className={`mt-2 leading-relaxed text-white/75 ${summaryTextClass}`}>
                        {project.summary}
                    </p>
                )}

                <ProjectActions
                    project={project}
                    onOpenImages={onOpenImages}
                    onOpenVideo={onOpenVideo}
                    onOpenRepo={onOpenRepo}
                    className="mt-3 flex gap-3"
                    buttonClassName="inline-flex items-center justify-center text-xs md:text-sm rounded-lg border transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white px-3 py-1.5"
                />
            </div>
        </div>
    );
}

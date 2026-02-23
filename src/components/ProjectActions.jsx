export default function ProjectActions({
    project,
    onOpenImages,
    onOpenVideo,
    onOpenRepo,
    className = "flex gap-3",
    buttonClassName = "px-3 py-1.5 rounded-lg border text-sm",
}) {
    const hasImages = (project?.images?.length || 0) > 0;
    const hasVideo = Boolean(project?.youtubeId);
    const hasRepo = Boolean(project?.repo);

    const getButtonClass = (enabled) =>
        `${buttonClassName} ${enabled ? "border-white/20 hover:bg-white/10" : "border-white/10 opacity-60 cursor-not-allowed"}`;

    return (
        <div className={className}>
            <button
                type="button"
                onClick={hasImages ? (event) => onOpenImages?.(event, project) : undefined}
                disabled={!hasImages}
                className={getButtonClass(hasImages)}
            >
                Изображения
            </button>

            <button
                type="button"
                onClick={hasVideo ? (event) => onOpenVideo?.(event, project) : undefined}
                disabled={!hasVideo}
                className={getButtonClass(hasVideo)}
            >
                Видео
            </button>

            <button
                type="button"
                onClick={hasRepo ? (event) => onOpenRepo?.(event, project) : undefined}
                disabled={!hasRepo}
                className={getButtonClass(hasRepo)}
            >
                Репозиторий
            </button>
        </div>
    );
}

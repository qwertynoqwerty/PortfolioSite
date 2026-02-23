export default function SectionTitle({ title, className = "text-center", titleClassName = "text-[40px] md:text-[48px] font-bold leading-none" }) {
    return (
        <div className={className}>
            <h2 className={titleClassName}>{title}</h2>
            <div className="mt-3 flex flex-col items-center gap-2">
                <div className="h-[3px] w-40 bg-white/30 rounded-full" />
                <div className="h-[3px] w-32 bg-white/20 rounded-full" />
                <div className="h-[3px] w-48 bg-white/15 rounded-full" />
            </div>
        </div>
    );
}

export default function TechTags({ tags, className = "", limit }) {
    if (!Array.isArray(tags) || tags.length === 0) {
        return null;
    }

    const list = typeof limit === "number" ? tags.slice(0, limit) : tags;

    return (
        <ul className={`flex flex-wrap gap-1.5 ${className}`}>
            {list.map((tag) => (
                <li
                    key={tag}
                    className="font-mono text-[11px] leading-none tracking-tight text-white/65 border border-white/12 bg-white/[0.04] rounded-full px-2.5 py-1 backdrop-blur-sm"
                >
                    {tag}
                </li>
            ))}
        </ul>
    );
}

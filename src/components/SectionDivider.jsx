export default function SectionDivider() {
    return (
        <div className="relative h-24">
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-white/10" />
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent pointer-events-none" />
        </div>
    );
}

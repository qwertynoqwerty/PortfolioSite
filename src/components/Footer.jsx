const LINKS = [
    { label: "Telegram", href: "https://t.me/qwertynoqwerty" },
    { label: "GitHub", href: "https://github.com/qwertynoqwerty" },
];

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer id="contacts" className="relative mt-20 border-t border-white/10 scroll-mt-24">
            <div className="mx-auto max-w-[100rem] px-4 md:px-8 py-20 md:py-24 text-center">
                <div className="font-mono text-[11px] uppercase tracking-[0.4em] text-white/40">Контакты</div>
                <h2 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight">Давайте поработаем вместе</h2>
                <p className="mx-auto mt-5 max-w-xl text-white/65">
                    Открыт к проектам и сотрудничеству в области VR / AR / MR на Unity.
                </p>

                <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                    {LINKS.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="inline-flex min-h-12 items-center rounded-full border border-white/20 px-6 text-sm font-medium text-white/85 transition-colors hover:bg-white/10 hover:border-white/35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>
            </div>

            <div className="border-t border-white/10">
                <div className="mx-auto max-w-[100rem] px-4 md:px-8 py-6 text-center">
                    <p className="font-mono text-xs text-white/50">© {currentYear} · Maxim Moiseev</p>
                </div>
            </div>
        </footer>
    );
}

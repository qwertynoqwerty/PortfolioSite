export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer id="contacts" className="mt-20 border-t border-white/10">
            <div className="mx-auto max-w-6xl px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-white/70">© {currentYear} · Maxim Moiseev</p>
                <div className="flex items-center gap-5">
                    <a
                        className="inline-flex min-h-11 items-center text-white/80 hover:text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        href="https://t.me/qwertynoqwerty"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Telegram
                    </a>
                    <a
                        className="inline-flex min-h-11 items-center text-white/80 hover:text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        href="https://github.com/qwertynoqwerty"
                        target="_blank"
                        rel="noreferrer"
                    >
                        GitHub
                    </a>
                </div>
            </div>
        </footer>
    );
}

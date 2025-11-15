/**
 * Footer — финальный блок: Made by…, © 2025, иконки GitHub/Telegram.
 * Ссылки — target="_blank" rel="noopener noreferrer".
 */
export default function Footer() {
    return (
        <footer id="contacts" className="mt-20 border-t border-white/10">
            <div className="mx-auto max-w-6xl px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-white/70">© 2025 · Maxim Moiseev</p>
                <div className="flex items-center gap-5">
                    <a
                        className="text-white/80 hover:text-white transition"
                        href="https://t.me/zxcqwertyww"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Telegram
                    </a>
                    <a
                        className="text-white/80 hover:text-white transition"
                        href="https://github.com/qwertyzxcww"
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

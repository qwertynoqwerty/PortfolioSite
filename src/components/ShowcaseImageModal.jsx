import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect } from "react";
import useLockBodyScroll from "../utils/useLockBodyScroll";
import SmartImage from "./SmartImage";

/**
 * ShowcaseImageModal — модалка 2/3 с галереей картинок.
 * Важно:
 * - Блокируем скролл body, сохраняем позицию.
 * - Не автоскроллим страницу (никаких window.scrollTo).
 * - Карточная сетка фиксирована, без вложенных скроллов.
 */
export default function ShowcaseImageModal({ open, title, images = [], onClose, initialFocusRef }) {
    useLockBodyScroll(open);

    // на открытие — остаёмся в текущей позиции; побочных эффектов нет
    useEffect(() => {}, [open]);

    return (
        <Transition appear show={open} as={Fragment}>
            <Dialog as="div" className="relative z-[100]" onClose={onClose} initialFocus={initialFocusRef || undefined}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100"
                    leave="ease-in duration-150"  leaveFrom="opacity-100" leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-[2px]" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-start justify-center p-6">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-200" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
                            leave="ease-in duration-150"  leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-[min(92rem,92vw)] rounded-2xl border border-white/10 bg-[#121214] p-6 md:p-7 shadow-xl">
                                <div className="flex items-center justify-between">
                                    <Dialog.Title className="text-lg md:text-xl font-semibold">
                                        {title} — изображения
                                    </Dialog.Title>
                                    <button
                                        ref={initialFocusRef || undefined}
                                        onClick={onClose}
                                        className="px-3 py-1.5 rounded-lg border border-white/20 hover:bg-white/10 text-sm"
                                    >
                                        Закрыть
                                    </button>
                                </div>

                                {/* сетка: 2 колонки сверху, затем 3, затем 2 — как в референсе */}
                                <div className="mt-5 grid gap-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {images.slice(0, 2).map((src, i) => (
                                            <div key={`top-${i}`} className="aspect-[16/9] rounded-xl border border-white/10 overflow-hidden bg-white/[0.04]">
                                                <SmartImage src={src} alt="" className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {images.slice(2, 5).map((src, i) => (
                                            <div key={`mid-${i}`} className="aspect-[16/9] rounded-xl border border-white/10 overflow-hidden bg-white/[0.04]">
                                                <SmartImage src={src} alt="" className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {images.slice(5, 7).map((src, i) => (
                                            <div key={`bot-${i}`} className="aspect-[16/9] rounded-xl border border-white/10 overflow-hidden bg-white/[0.04]">
                                                <SmartImage src={src} alt="" className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}

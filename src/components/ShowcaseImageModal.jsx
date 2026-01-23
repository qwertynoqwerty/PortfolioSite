import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import useLockBodyScroll from "../utils/useLockBodyScroll";
import SmartImage from "./SmartImage";

/**
 * ShowcaseImageModal
 * 1) Галерея (сеткой)
 * 2) Viewer (полноформат): верхняя панель ВСЕГДА сверху, фото ВСЕГДА по центру
 * Исправления:
 * - Навигация 1..N без зацикливания, кнопки отключаются на границах
 * - Закрытие viewer по клику на пустое место (вне контента)
 */
export default function ShowcaseImageModal({ open, title, images = [], onClose, initialFocusRef }) {
    useLockBodyScroll(open);

    const list = useMemo(() => (Array.isArray(images) ? images : []), [images]);

    const [viewerOpen, setViewerOpen] = useState(false);
    const [viewerIndex, setViewerIndex] = useState(0);

    const closeGalleryRef = useRef(null);
    const closeViewerRef = useRef(null);

    useEffect(() => {
        if (open == false) {
            setViewerOpen(false);
            setViewerIndex(0);
        }
    }, [open]);

    const openViewer = (index) => {
        if (list.length == 0) {
            return;
        }

        const safe = Math.max(0, Math.min(index, list.length - 1));
        setViewerIndex(safe);
        setViewerOpen(true);
    };

    const closeViewer = () => {
        setViewerOpen(false);
    };

    const goPrev = () => {
        if (list.length == 0) {
            return;
        }

        if (viewerIndex > 0) {
            setViewerIndex(viewerIndex - 1);
        }
    };

    const goNext = () => {
        if (list.length == 0) {
            return;
        }

        if (viewerIndex < list.length - 1) {
            setViewerIndex(viewerIndex + 1);
        }
    };

    const currentSrc = list.length > 0 ? list[viewerIndex] : "";

    const atFirst = viewerIndex <= 0;
    const atLast = list.length > 0 ? viewerIndex >= list.length - 1 : true;

    const navBtnBase = "px-3 py-1.5 rounded-lg border text-sm";
    const navBtnEnabled = "border-white/20 hover:bg-white/10";
    const navBtnDisabled = "border-white/10 opacity-50 cursor-not-allowed";

    return (
        <>
            {/* GALLERY MODAL */}
            <Transition appear show={open} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-[100]"
                    onClose={onClose}
                    initialFocus={initialFocusRef || closeGalleryRef || undefined}
                >
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-200"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/70 backdrop-blur-[2px]" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-screen items-center justify-center px-6 py-10">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-200"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-[min(92rem,92vw)] rounded-2xl border border-white/10 bg-[#121214] p-6 md:p-7 shadow-xl">
                                    <div className="flex items-center justify-between">
                                        <Dialog.Title className="text-lg md:text-xl font-semibold">
                                            {title}
                                        </Dialog.Title>
                                        <button
                                            ref={closeGalleryRef}
                                            onClick={onClose}
                                            className="px-3 py-1.5 rounded-lg border border-white/20 hover:bg-white/10 text-sm"
                                        >
                                            Закрыть
                                        </button>
                                    </div>

                                    <div className="mt-2 text-xs md:text-sm text-white/60">
                                        Нажмите на изображение, чтобы открыть в полном размере
                                    </div>

                                    {/* сетка: 2 / 3 / 2 */}
                                    <div className="mt-5 grid gap-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {list.slice(0, 2).map((src, i) => (
                                                <button
                                                    key={`top-${i}`}
                                                    type="button"
                                                    onClick={() => openViewer(i)}
                                                    className="aspect-[16/9] rounded-xl border border-white/10 overflow-hidden bg-black text-left cursor-zoom-in transition-transform duration-200 hover:scale-[1.01]"
                                                >
                                                    <SmartImage src={src} alt="" className="w-full h-full object-cover bg-black" />
                                                </button>
                                            ))}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {list.slice(2, 5).map((src, i) => (
                                                <button
                                                    key={`mid-${i}`}
                                                    type="button"
                                                    onClick={() => openViewer(i + 2)}
                                                    className="aspect-[16/9] rounded-xl border border-white/10 overflow-hidden bg-black text-left cursor-zoom-in transition-transform duration-200 hover:scale-[1.01]"
                                                >
                                                    <SmartImage src={src} alt="" className="w-full h-full object-cover bg-black" />
                                                </button>
                                            ))}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {list.slice(5, 7).map((src, i) => (
                                                <button
                                                    key={`bot-${i}`}
                                                    type="button"
                                                    onClick={() => openViewer(i + 5)}
                                                    className="aspect-[16/9] rounded-xl border border-white/10 overflow-hidden bg-black text-left cursor-zoom-in transition-transform duration-200 hover:scale-[1.01]"
                                                >
                                                    <SmartImage src={src} alt="" className="w-full h-full object-cover bg-black" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            {/* VIEWER MODAL */}
            <Transition appear show={viewerOpen} as={Fragment}>
                <Dialog as="div" className="relative z-[120]" onClose={closeViewer} initialFocus={closeViewerRef}>
                    {/* Backdrop: только визуал, клики не перехватывает */}
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-200"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/85 backdrop-blur-[2px] pointer-events-none" />
                    </Transition.Child>

                    {/* Кликабельный слой на весь экран: клик по пустому месту закрывает */}
                    <div className="fixed inset-0" onClick={closeViewer}>
                        {/* Верхняя панель (клик по ней не закрывает) */}
                        <div
                            className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between gap-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="text-xs md:text-sm text-white/80">
                                {title} — {list.length > 0 ? `${viewerIndex + 1}/${list.length}` : ""}
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={goPrev}
                                    disabled={atFirst}
                                    className={`${navBtnBase} ${atFirst ? navBtnDisabled : navBtnEnabled}`}
                                >
                                    ‹
                                </button>

                                <button
                                    type="button"
                                    onClick={goNext}
                                    disabled={atLast}
                                    className={`${navBtnBase} ${atLast ? navBtnDisabled : navBtnEnabled}`}
                                >
                                    ›
                                </button>

                                <button
                                    ref={closeViewerRef}
                                    type="button"
                                    onClick={closeViewer}
                                    className={`${navBtnBase} ${navBtnEnabled}`}
                                >
                                    Закрыть
                                </button>
                            </div>
                        </div>

                        {/* Центр: фото (клик по фото/рамке не закрывает) */}
                        <div className="flex h-full w-full items-center justify-center px-4 md:px-8 pt-16 pb-8">
                            <div
                                className="rounded-2xl border border-white/10 bg-black/30 p-2 md:p-3"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <SmartImage
                                    src={currentSrc}
                                    alt=""
                                    className="max-w-[92vw] max-h-[80vh] object-contain bg-black rounded-xl"
                                />
                            </div>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}

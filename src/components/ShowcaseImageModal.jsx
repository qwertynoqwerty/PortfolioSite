import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import useLockBodyScroll from "../utils/useLockBodyScroll";
import SmartImage from "./SmartImage";

export default function ShowcaseImageModal({ open, title, images = [], onClose, initialFocusRef }) {
    useLockBodyScroll(open);

    const list = useMemo(() => (Array.isArray(images) ? images : []), [images]);
    const [viewerOpen, setViewerOpen] = useState(false);
    const [viewerIndex, setViewerIndex] = useState(0);

    const closeGalleryRef = useRef(null);
    const closeViewerRef = useRef(null);

    useEffect(() => {
        if (!open) {
            setViewerOpen(false);
            setViewerIndex(0);
        }
    }, [open]);

    const openViewer = (index) => {
        if (list.length === 0) {
            return;
        }

        const safeIndex = Math.max(0, Math.min(index, list.length - 1));
        setViewerIndex(safeIndex);
        setViewerOpen(true);
    };

    const closeViewer = () => {
        setViewerOpen(false);
    };

    const goPrev = () => {
        setViewerIndex((prev) => Math.max(0, prev - 1));
    };

    const goNext = () => {
        setViewerIndex((prev) => Math.min(list.length - 1, prev + 1));
    };

    const currentSrc = list.length > 0 ? list[viewerIndex] : "";
    const atFirst = viewerIndex <= 0;
    const atLast = list.length > 0 ? viewerIndex >= list.length - 1 : true;

    const navBtnBase = "px-3 py-1.5 rounded-lg border text-sm";
    const navBtnEnabled = "border-white/20 hover:bg-white/10";
    const navBtnDisabled = "border-white/10 opacity-50 cursor-not-allowed";
    const rowPattern = [2, 3];

    const rows = useMemo(() => {
        const result = [];
        let offset = 0;
        let patternIndex = 0;

        while (offset < list.length) {
            const desired = rowPattern[patternIndex % rowPattern.length];
            const remaining = list.length - offset;
            const size = Math.min(desired, remaining);

            result.push({
                count: size,
                startIndex: offset,
                items: list.slice(offset, offset + size),
            });

            offset += size;
            patternIndex += 1;
        }

        return result;
    }, [list]);

    return (
        <>
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
                                            type="button"
                                            onClick={onClose}
                                            className="px-3 py-1.5 rounded-lg border border-white/20 hover:bg-white/10 text-sm focus:outline-none focus-visible:outline-none"
                                        >
                                            Закрыть
                                        </button>
                                    </div>

                                    <div className="mt-2 text-xs md:text-sm text-white/60">
                                        Нажмите на изображение, чтобы открыть в полном размере
                                    </div>

                                    <div className="mt-5 grid gap-4">
                                        {rows.map((row, rowIndex) => (
                                            <div
                                                key={`row-${rowIndex}-${row.startIndex}`}
                                                className={`grid grid-cols-1 gap-4 ${row.count === 1 ? "md:grid-cols-1" : row.count === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}
                                            >
                                                {row.items.map((src, indexInRow) => {
                                                    const imageIndex = row.startIndex + indexInRow;

                                                    return (
                                                        <button
                                                            key={`${src}-${imageIndex}`}
                                                            type="button"
                                                            onClick={() => openViewer(imageIndex)}
                                                            className="aspect-[16/9] rounded-xl border border-white/10 overflow-hidden bg-black text-left cursor-zoom-in transition-transform duration-200 hover:scale-[1.01] focus:outline-none focus-visible:outline-none"
                                                        >
                                                            <SmartImage
                                                                src={src}
                                                                alt={`${title} ${imageIndex + 1}`}
                                                                className="w-full h-full object-cover bg-black"
                                                            />
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        ))}
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            <Transition appear show={viewerOpen} as={Fragment}>
                <Dialog as="div" className="relative z-[120]" onClose={closeViewer} initialFocus={closeViewerRef}>
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

                    <div className="fixed inset-0" onClick={closeViewer}>
                        <div
                            className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between gap-4"
                            onClick={(event) => event.stopPropagation()}
                        >
                            <div className="text-xs md:text-sm text-white/80">
                                {title} {list.length > 0 ? `— ${viewerIndex + 1}/${list.length}` : ""}
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={goPrev}
                                    disabled={atFirst}
                                    className={`${navBtnBase} ${atFirst ? navBtnDisabled : navBtnEnabled} focus:outline-none focus-visible:outline-none`}
                                >
                                    ‹
                                </button>

                                <button
                                    type="button"
                                    onClick={goNext}
                                    disabled={atLast}
                                    className={`${navBtnBase} ${atLast ? navBtnDisabled : navBtnEnabled} focus:outline-none focus-visible:outline-none`}
                                >
                                    ›
                                </button>

                                <button
                                    ref={closeViewerRef}
                                    type="button"
                                    onClick={closeViewer}
                                    className={`${navBtnBase} ${navBtnEnabled} focus:outline-none focus-visible:outline-none`}
                                >
                                    Закрыть
                                </button>
                            </div>
                        </div>

                        <div className="flex h-full w-full items-center justify-center px-4 md:px-8 pt-16 pb-8">
                            <div
                                className="rounded-2xl border border-white/10 bg-black/30 p-2 md:p-3"
                                onClick={(event) => event.stopPropagation()}
                            >
                                <SmartImage
                                    src={currentSrc}
                                    alt={title || ""}
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

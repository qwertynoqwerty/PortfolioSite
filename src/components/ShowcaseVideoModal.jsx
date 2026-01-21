import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import useLockBodyScroll from "../utils/useLockBodyScroll";

export default function ShowcaseVideoModal({ open, onClose, title, youtubeId, initialFocusRef }) {
    useLockBodyScroll(open);

    const src = youtubeId
        ? `https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1&iv_load_policy=3`
        : "";

    return (
        <Transition show={open} as={Fragment}>
            <Dialog onClose={onClose} initialFocus={initialFocusRef} className="relative z-50">
                <Transition.Child as={Fragment} enter="transition-opacity duration-200" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-black/70" />
                </Transition.Child>

                <div className="fixed inset-0 p-4 md:p-8 flex items-center justify-center">
                    <Transition.Child as={Fragment} enter="transition-transform duration-200" enterFrom="opacity-0 scale-100" enterTo="opacity-100 scale-100" leave="transition-transform duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-100">
                        <Dialog.Panel className="w-full max-w-6xl rounded-2xl border border-white/10 bg-[#111215]/95 backdrop-blur p-4 md:p-6">
                            <div className="flex items-center justify-between">
                                <Dialog.Title className="text-lg md:text-xl font-semibold">{title} — видео</Dialog.Title>
                                <button ref={initialFocusRef} type="button" onClick={onClose}
                                        className="text-sm px-3 py-1.5 rounded-lg border border-white/15 hover:bg-white/10">
                                    Закрыть
                                </button>
                            </div>

                            <div className="mt-4 aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-black">
                                {src
                                    ? <iframe title={title} src={src} className="w-full h-full" frameBorder="0"
                                              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                              allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
                                    : <div className="w-full h-full grid place-items-center text-white/60 text-sm">Видео недоступно</div>}
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
}

import { useRef, useState } from "react";
import { extractYoutubeId } from "./projectHelpers";

export default function useProjectMediaModals() {
    const [imageOpen, setImageOpen] = useState(false);
    const [videoOpen, setVideoOpen] = useState(false);
    const [currentTitle, setCurrentTitle] = useState("");
    const [currentImages, setCurrentImages] = useState([]);
    const [currentYoutubeId, setCurrentYoutubeId] = useState("");
    const closeFocusRef = useRef(null);

    const stopEvent = (event) => {
        event?.preventDefault?.();
        event?.stopPropagation?.();
    };

    const openImages = (event, project) => {
        stopEvent(event);

        if (project?.images?.length) {
            setCurrentTitle(project.title);
            setCurrentImages(project.images);
            setImageOpen(true);
        }
    };

    const openVideo = (event, project) => {
        stopEvent(event);

        const id = extractYoutubeId(project?.youtubeId);
        if (id) {
            setCurrentTitle(project.title);
            setCurrentYoutubeId(id);
            setVideoOpen(true);
        }
    };

    const openRepo = (event, project) => {
        stopEvent(event);

        if (project?.repo) {
            window.open(project.repo, "_blank", "noopener,noreferrer");
        }
    };

    return {
        openImages,
        openVideo,
        openRepo,
        imageModalProps: {
            open: imageOpen,
            title: currentTitle,
            images: currentImages,
            onClose: () => setImageOpen(false),
            initialFocusRef: closeFocusRef,
        },
        videoModalProps: {
            open: videoOpen,
            title: currentTitle,
            youtubeId: currentYoutubeId,
            onClose: () => setVideoOpen(false),
            initialFocusRef: closeFocusRef,
        },
    };
}

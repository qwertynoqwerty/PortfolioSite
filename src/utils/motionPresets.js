export const EASE = "easeOut";

export const SECTION_IN = {
    hidden: { opacity: 0, y: 60 },
    show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};

export const HEADER_IN = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

export const PROJECT_IN = {
    hidden: { opacity: 0, y: 36 },
    show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE } },
};

export const SLIDE_IN_LEFT = {
    hidden: { opacity: 0, x: -26 },
    show: { opacity: 1, x: 0, transition: { duration: 0.75, ease: EASE } },
};

export const SLIDE_IN_RIGHT = {
    hidden: { opacity: 0, x: 26 },
    show: { opacity: 1, x: 0, transition: { duration: 0.75, ease: EASE, delay: 0.08 } },
};

export const TILE = (i) => ({
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.7, ease: EASE } },
});

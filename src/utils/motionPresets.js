export const EASE = "easeOut";

export const SECTION_IN = {
    hidden: { opacity: 0, y: 48 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

export const HEADER_IN = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

export const PROJECT_IN = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

export const SLIDE_IN_LEFT = {
    hidden: { opacity: 0, x: -26 },
    show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE } },
};

export const SLIDE_IN_RIGHT = {
    hidden: { opacity: 0, x: 26 },
    show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE, delay: 0.06 } },
};

export const TILE = (i) => ({
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.5, ease: EASE } },
});

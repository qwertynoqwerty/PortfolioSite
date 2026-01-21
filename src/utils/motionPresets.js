export const EASE = "easeOut";

export const SECTION = {
    hidden: { opacity: 0, y: 60 },
    show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};

export const ITEM = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

export const STAGGER = (stagger = 0.12) => ({
    hidden: {},
    show: { transition: { when: "beforeChildren", staggerChildren: stagger } },
});

export const TILE = (i) => ({
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.7, ease: EASE } },
});

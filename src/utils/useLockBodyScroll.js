import { useEffect } from "react";

export default function useLockBodyScroll(active) {
    useEffect(() => {
        if (!active) return;

        const html = document.documentElement;
        const body = document.body;
        const scrollY = window.pageYOffset || html.scrollTop || 0;

        const prev = {
            htmlOverflow: html.style.overflow,
            bodyOverflow: body.style.overflow,
            bodyPosition: body.style.position,
            bodyTop: body.style.top,
            bodyLeft: body.style.left,
            bodyRight: body.style.right,
            bodyWidth: body.style.width,
            htmlScrollBehavior: html.style.scrollBehavior,
            bodyPaddingRight: body.style.paddingRight
        };

        html.style.scrollBehavior = "auto";
        const scrollbarW = window.innerWidth - html.clientWidth;
        if (scrollbarW > 0) body.style.paddingRight = `${scrollbarW}px`;

        html.style.overflow = "hidden";
        body.style.overflow = "hidden";
        body.style.position = "fixed";
        body.style.top = `-${scrollY}px`;
        body.style.left = "0";
        body.style.right = "0";
        body.style.width = "100%";

        return () => {
            html.style.overflow = prev.htmlOverflow;
            body.style.overflow = prev.bodyOverflow;
            body.style.position = prev.bodyPosition;
            body.style.top = prev.bodyTop;
            body.style.left = prev.bodyLeft;
            body.style.right = prev.bodyRight;
            body.style.width = prev.bodyWidth;
            html.style.scrollBehavior = prev.htmlScrollBehavior;
            body.style.paddingRight = prev.bodyPaddingRight;
            window.scrollTo(0, scrollY);
        };
    }, [active]);
}

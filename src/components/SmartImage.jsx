// SmartImage — AVIF → WEBP → JPG/PNG, стабилизируем layout + приоритет
const manifest = import.meta.glob(
    "/src/assets/**/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}",
    { eager: true, as: "url" }
);

function normalizeBase(input) {
    const raw = String(input).replace(/\\/g, "/").replace(/^\/+/, "");
    const noExt = raw.replace(/\.[a-z0-9]+$/i, "");

    if (noExt.startsWith("src/assets/")) return `/${noExt}`;
    if (noExt.startsWith("assets/")) return `/src/${noExt}`;
    return `/src/assets/${noExt}`;
}

function resolveVariants(src) {
    if (!src) return { avif: null, webp: null, orig: null };

    const base = normalizeBase(src);

    const avif = manifest[`${base}.avif`] || null;
    const webp = manifest[`${base}.webp`] || null;

    let orig = null;
    const ext = (String(src).match(/\.(jpg|jpeg|png)$/i) || [])[0];

    if (ext) {
        orig = manifest[`${base}${ext}`] || null;
    } else {
        for (const e of [".jpg", ".jpeg", ".png"]) {
            const k = `${base}${e}`;
            if (manifest[k]) {
                orig = manifest[k];
                break;
            }
        }
    }

    return { avif, webp, orig };
}

export default function SmartImage({
                                       src,
                                       alt = "",
                                       className = "",
                                       width,
                                       height,
                                       priority = false,
                                       ...rest
                                   }) {
    const { avif, webp, orig } = resolveVariants(src);
    const imgSrc = orig || webp || avif || src;

    return (
        <picture>
            {avif && <source type="image/avif" srcSet={avif} />}
            {webp && <source type="image/webp" srcSet={webp} />}
            <img
                src={imgSrc}
                alt={alt}
                className={className}
                loading={priority ? "eager" : "lazy"}
                decoding="async"
                fetchPriority={priority ? "high" : "auto"}
                width={width}
                height={height}
                {...rest}
            />
        </picture>
    );
}

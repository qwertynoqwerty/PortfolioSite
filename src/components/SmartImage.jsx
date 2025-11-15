// SmartImage — AVIF → JPG/PNG, стабилизируем layout
const manifest = import.meta.glob(
    "/src/assets/**/*.{jpg,jpeg,png,avif,JPG,JPEG,PNG,AVIF}",
    { eager: true, as: "url" }
);

function normalizeBase(input) {
    const raw = input.replace(/\\/g, "/").replace(/^\/+/, "");
    const noExt = raw.replace(/\.[a-z0-9]+$/i, "");
    if (noExt.startsWith("src/assets/")) return `/${noExt}`;
    if (noExt.startsWith("assets/"))     return `/src/${noExt}`;
    return `/src/assets/${noExt}`;
}

function resolveVariants(src) {
    if (!src) return { avif:null, orig:null };
    const base = normalizeBase(src);
    const avif = manifest[`${base}.avif`] || null;

    let orig = null;
    const ext = (src.match(/\.(jpg|jpeg|png)$/i) || [])[0];
    if (ext) orig = manifest[`${base}${ext}`] || null;
    else for (const e of [".jpg",".jpeg",".png"]) {
        const k = `${base}${e}`; if (manifest[k]) { orig = manifest[k]; break; }
    }
    return { avif, orig };
}

export default function SmartImage({ src, alt="", className="", width, height, ...rest }) {
    const { avif, orig } = resolveVariants(src);
    const imgSrc = orig || avif || src; // чтобы точно что-то показать
    return (
        <picture>
            {avif && <source type="image/avif" srcSet={avif} />}
            <img src={imgSrc} alt={alt} className={className}
                 loading="lazy" decoding="async" width={width} height={height} {...rest}/>
        </picture>
    );
}

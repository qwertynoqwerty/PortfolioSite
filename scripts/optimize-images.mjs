// scripts/optimize-images.mjs
// Конвертация PNG/JPG -> WebP (+ опционально AVIF), ресайз и дедуп по mtime.

import { globby } from "globby";
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();

// Что генерим
const GENERATE_WEBP = true;
const GENERATE_AVIF = false; // если хочешь ещё и avif — поставь true

// Качество (под портфолио обычно норм)
const WEBP_QUALITY = 78;
const AVIF_QUALITY = 48;

// Максимальные ширины по типу картинки
// Настрой под свою структуру путей, см. getTargetMaxWidth()
const MAX_WIDTH_COVER = 1600;
const MAX_WIDTH_GALLERY = 1600;
const MAX_WIDTH_THUMB = 900;

// Общие настройки ресайза
const RESIZE_OPTIONS = {
    fit: "inside",
    withoutEnlargement: true,
};

// Расширения источников
const INPUT_GLOB = ["src/assets/**/*.{jpg,jpeg,png,JPG,JPEG,PNG}"];

// Определяем “назначение” картинки по пути (можешь подстроить под свои папки)
function getTargetMaxWidth(filePath) {
    const p = filePath.replace(/\\/g, "/").toLowerCase();

    // Примеры: подстрой под свои реальные папки/нейминг
    if (p.includes("/covers/") || p.includes("/cover/")) return MAX_WIDTH_COVER;
    if (p.includes("/thumbs/") || p.includes("/thumb/") || p.includes("preview")) return MAX_WIDTH_THUMB;

    // По умолчанию считаем, что это галерея
    return MAX_WIDTH_GALLERY;
}

async function fileExists(p) {
    try {
        await fs.access(p);
        return true;
    } catch {
        return false;
    }
}

async function isUpToDate(src, out) {
    if ((await fileExists(out)) === false) return false;

    try {
        const [s, o] = await Promise.all([fs.stat(src), fs.stat(out)]);
        // если out свежее или равен src — можно пропустить
        return o.mtimeMs >= s.mtimeMs;
    } catch {
        return false;
    }
}

async function ensureDirFor(filePath) {
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });
}

async function convertOne(srcPath) {
    const absSrc = path.isAbsolute(srcPath) ? srcPath : path.join(ROOT, srcPath);

    const maxW = getTargetMaxWidth(srcPath);

    const outWebp = absSrc.replace(/\.(jpg|jpeg|png)$/i, ".webp");
    const outAvif = absSrc.replace(/\.(jpg|jpeg|png)$/i, ".avif");

    const tasks = [];

    if (GENERATE_WEBP) {
        tasks.push({ kind: "webp", out: outWebp });
    }
    if (GENERATE_AVIF) {
        tasks.push({ kind: "avif", out: outAvif });
    }

    if (tasks.length === 0) {
        return { ok: true, skipped: true, reason: "No outputs enabled" };
    }

    // Если все выходы актуальные — пропускаем
    let allUpToDate = true;
    for (const t of tasks) {
        const up = await isUpToDate(absSrc, t.out);
        if (up === false) {
            allUpToDate = false;
            break;
        }
    }
    if (allUpToDate) {
        return { ok: true, skipped: true, reason: "Up to date" };
    }

    // Грузим метаданные и решаем, нужен ли ресайз
    const img = sharp(absSrc, { failOn: "none" });
    const meta = await img.metadata();

    // Базовая цепочка трансформаций
    let pipeline = sharp(absSrc, { failOn: "none" }).rotate(); // rotate учитывает EXIF orientation

    if (meta.width && meta.width > maxW) {
        pipeline = pipeline.resize({ width: maxW, ...RESIZE_OPTIONS });
    }

    // Прозрачность: Sharp сам корректно сохраняет alpha в webp/avif
    // Прогоняем outputs
    const results = [];

    for (const t of tasks) {
        // Часто лучше создавать новый pipeline на каждый формат
        let outPipe = pipeline.clone();

        if (t.kind === "webp") {
            outPipe = outPipe.webp({
                quality: WEBP_QUALITY,
                smartSubsample: true,
                effort: 4,
            });
        } else if (t.kind === "avif") {
            outPipe = outPipe.avif({
                quality: AVIF_QUALITY,
                effort: 5,
            });
        }

        await ensureDirFor(t.out);
        await outPipe.toFile(t.out);

        results.push({ kind: t.kind, out: t.out });
    }

    return { ok: true, skipped: false, results };
}

async function main() {
    const files = await globby(INPUT_GLOB, { absolute: false });

    let converted = 0;
    let skipped = 0;
    let failed = 0;

    for (const f of files) {
        try {
            const r = await convertOne(f);

            if (r.skipped) {
                skipped += 1;
                continue;
            }

            converted += 1;
        } catch (err) {
            failed += 1;
            console.error(`[optimize-images] FAIL: ${f}`);
            console.error(err?.message || err);
        }
    }

    console.log(
        `[optimize-images] done. inputs=${files.length}, converted=${converted}, skipped=${skipped}, failed=${failed}, webp=${GENERATE_WEBP}, avif=${GENERATE_AVIF}`
    );
}

await main();

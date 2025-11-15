// scripts/optimize-images.mjs (AVIF-only)
import { globby } from 'globby';
import sharp from 'sharp';

const files = await globby(['src/assets/**/*.{jpg,jpeg,png,JPG,JPEG,PNG}']);
for (const f of files) {
    const out = f.replace(/\.(jpg|jpeg|png)$/i, '.avif');
    await sharp(f).toFormat('avif', { quality: 50 }).toFile(out);
}
console.log(`AVIF done: ${files.length}`);

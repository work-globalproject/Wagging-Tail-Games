import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// 1. Base App SVG icon (512x512)
const svgStandard = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f59e0b" />
      <stop offset="50%" stop-color="#f97316" />
      <stop offset="100%" stop-color="#ea580c" />
    </linearGradient>
    <filter id="dropShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#7c2d12" flood-opacity="0.3" />
    </filter>
  </defs>

  <!-- Background rounded rect -->
  <rect width="512" height="512" rx="112" fill="url(#bgGrad)" />

  <!-- Subtle glow ring -->
  <circle cx="256" cy="256" r="190" fill="none" stroke="#ffffff" stroke-width="6" stroke-opacity="0.25" stroke-dasharray="8 8" />

  <!-- Playful Dog Paw in pure white with shadow -->
  <g filter="url(#dropShadow)" fill="#ffffff">
    <!-- Main central paw pad -->
    <path d="M 256 250 C 205 250 170 295 185 345 C 196 380 230 400 256 400 C 282 400 316 380 327 345 C 342 295 307 250 256 250 Z" />
    <!-- Outer Left Toe -->
    <ellipse cx="160" cy="245" rx="34" ry="46" transform="rotate(-28 160 245)" />
    <!-- Inner Left Toe -->
    <ellipse cx="218" cy="180" rx="32" ry="48" transform="rotate(-10 218 180)" />
    <!-- Inner Right Toe -->
    <ellipse cx="294" cy="180" rx="32" ry="48" transform="rotate(10 294 180)" />
    <!-- Outer Right Toe -->
    <ellipse cx="352" cy="245" rx="34" ry="46" transform="rotate(28 352 245)" />
  </g>

  <!-- Sparkle stars -->
  <path d="M 390 120 Q 390 145 415 145 Q 390 145 390 170 Q 390 145 365 145 Q 390 145 390 120 Z" fill="#fef08a" />
  <path d="M 115 140 Q 115 155 130 155 Q 115 155 115 170 Q 115 155 100 155 Q 115 155 115 140 Z" fill="#ffffff" opacity="0.9" />
</svg>`;

// 2. Maskable SVG icon (with 15% safe-zone margin on all sides)
const svgMaskable = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGradFull" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f59e0b" />
      <stop offset="50%" stop-color="#f97316" />
      <stop offset="100%" stop-color="#ea580c" />
    </linearGradient>
    <filter id="dropShadowM" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#7c2d12" flood-opacity="0.35" />
    </filter>
  </defs>

  <!-- Full-bleed background for maskable -->
  <rect width="512" height="512" fill="url(#bgGradFull)" />

  <!-- Scaled content inside safe zone (72% scale, centered at 256, 256) -->
  <g transform="translate(256, 256) scale(0.72) translate(-256, -256)">
    <circle cx="256" cy="256" r="190" fill="none" stroke="#ffffff" stroke-width="6" stroke-opacity="0.25" stroke-dasharray="8 8" />

    <g filter="url(#dropShadowM)" fill="#ffffff">
      <path d="M 256 250 C 205 250 170 295 185 345 C 196 380 230 400 256 400 C 282 400 316 380 327 345 C 342 295 307 250 256 250 Z" />
      <ellipse cx="160" cy="245" rx="34" ry="46" transform="rotate(-28 160 245)" />
      <ellipse cx="218" cy="180" rx="32" ry="48" transform="rotate(-10 218 180)" />
      <ellipse cx="294" cy="180" rx="32" ry="48" transform="rotate(10 294 180)" />
      <ellipse cx="352" cy="245" rx="34" ry="46" transform="rotate(28 352 245)" />
    </g>

    <path d="M 390 120 Q 390 145 415 145 Q 390 145 390 170 Q 390 145 365 145 Q 390 145 390 120 Z" fill="#fef08a" />
    <path d="M 115 140 Q 115 155 130 155 Q 115 155 115 170 Q 115 155 100 155 Q 115 155 115 140 Z" fill="#ffffff" opacity="0.9" />
  </g>
</svg>`;

async function buildIcons() {
  const publicDir = path.resolve('public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Save SVG
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgStandard);

  const standardBuf = Buffer.from(svgStandard);
  const maskableBuf = Buffer.from(svgMaskable);

  // 192x192 standard
  await sharp(standardBuf)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));
  console.log('Created pwa-192x192.png');

  // 512x512 standard
  await sharp(standardBuf)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));
  console.log('Created pwa-512x512.png');

  // 512x512 maskable (safe-zone padded)
  await sharp(maskableBuf)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));
  console.log('Created pwa-maskable-512x512.png');

  // 180x180 Apple Touch Icon
  await sharp(standardBuf)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Created apple-touch-icon.png');

  // Favicon (32x32)
  await sharp(standardBuf)
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon.ico'));
  console.log('Created favicon.ico');

  console.log('All PWA icons successfully generated!');
}

buildIcons().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});

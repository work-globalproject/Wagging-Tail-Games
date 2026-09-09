import sharp from 'sharp';
import { readFile, mkdir, readdir } from 'node:fs/promises';
const source = await readFile(new URL('../public/icon.svg', import.meta.url));
await sharp(source).resize(1024, 1024).flatten({ background: '#F8FCFD' }).removeAlpha()
  .png().toFile('ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png');
for (const [density, size] of [['mdpi',48],['hdpi',72],['xhdpi',96],['xxhdpi',144],['xxxhdpi',192]]) {
  const folder = `android/app/src/main/res/mipmap-${density}`;
  await mkdir(folder, { recursive: true });
  for (const filename of ['ic_launcher.png','ic_launcher_round.png']) {
    await sharp(source).resize(size,size).flatten({ background: '#F8FCFD' }).png().toFile(`${folder}/${filename}`);
  }
  await sharp(source).resize(Math.round(size*2.25), Math.round(size*2.25)).png().toFile(`${folder}/ic_launcher_foreground.png`);
}
const mark = await sharp(source).resize(600, 600).png().toBuffer();
const splash = await sharp({ create: { width: 2732, height: 2732, channels: 3, background: '#F8FCFD' } })
  .composite([{ input: mark, gravity: 'center' }]).png().toBuffer();
for (const name of ['splash-2732x2732.png', 'splash-2732x2732-1.png', 'splash-2732x2732-2.png']) {
  await sharp(splash).toFile(`ios/App/App/Assets.xcassets/Splash.imageset/${name}`);
}
for (const directory of await readdir('android/app/src/main/res', { withFileTypes: true })) {
  if (!directory.isDirectory() || !directory.name.startsWith('drawable')) continue;
  const path = `android/app/src/main/res/${directory.name}/splash.png`;
  try {
    const { width, height } = await sharp(path).metadata();
    const icon = await sharp(source).resize(Math.round(Math.min(width, height) * .3)).png().toBuffer();
    await sharp({ create: { width, height, channels: 3, background: '#F8FCFD' } })
      .composite([{ input: icon, gravity: 'center' }]).png().toFile(`${path}.new.png`);
    // Replace only this known generated asset.
    const { rename } = await import('node:fs/promises'); await rename(`${path}.new.png`, path);
  } catch (error) { if (error.code !== 'ENOENT' && !String(error.message).includes('Input file is missing')) throw error; }
}

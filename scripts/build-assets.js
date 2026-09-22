import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function generateAssets() {
  const insigniaSvg = fs.readFileSync('public/assets/img/vidrieria-emergencia-logo-insignia.svg');
  const horizontalSvg = fs.readFileSync('public/assets/img/vidrieria-emergencia-logo-horizontal.svg');

  console.log('Rendering insignia PNGs...');
  const insignia512 = await sharp(insigniaSvg, { density: 300 })
    .resize(512, 512)
    .png()
    .toFile('public/assets/img/vidrieria-emergencia-logo-insignia.png');

  await sharp(insigniaSvg, { density: 300 })
    .resize(32, 32)
    .png()
    .toFile('public/favicon-32x32.png');

  await sharp(insigniaSvg, { density: 300 })
    .resize(180, 180)
    .png()
    .toFile('public/apple-touch-icon.png');

  await sharp(insigniaSvg, { density: 300 })
    .resize(192, 192)
    .png()
    .toFile('public/android-chrome-192x192.png');

  await sharp(insigniaSvg, { density: 300 })
    .resize(512, 512)
    .png()
    .toFile('public/android-chrome-512x512.png');

  console.log('Rendering horizontal PNG...');
  await sharp(horizontalSvg, { density: 300 })
    .resize(1040, 200)
    .png()
    .toFile('public/assets/img/vidrieria-emergencia-logo-horizontal.png');

  console.log('Generating OG Image 1200x630...');
  // Compose OG Image:
  // Base background from taller-vidrieria with dark overlay and branding
  const bg = await sharp('public/assets/img/taller-vidrieria.webp')
    .resize(1200, 630, { fit: 'cover', position: 'center' })
    .modulate({ brightness: 0.35 })
    .toBuffer();

  const insignia200 = await sharp(insigniaSvg, { density: 300 })
    .resize(180, 180)
    .png()
    .toBuffer();

  const ogSvgOverlay = `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ogGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#08131F" stop-opacity="0.92"/>
          <stop offset="60%" stop-color="#0F2D4A" stop-opacity="0.85"/>
          <stop offset="100%" stop-color="#08131F" stop-opacity="0.7"/>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="1200" height="630" fill="url(#ogGrad)"/>
      <rect x="60" y="60" width="1080" height="510" rx="20" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="2"/>
      
      <!-- Text content -->
      <text x="320" y="240" font-family="'Poppins', sans-serif" font-weight="800" font-size="52" fill="#FFFFFF" letter-spacing="1">Vidriería de Emergencia</text>
      <text x="320" y="305" font-family="'Poppins', sans-serif" font-weight="700" font-size="34" fill="#E5322D">Reposición a Domicilio 24 Horas</text>
      <text x="320" y="365" font-family="'Poppins', sans-serif" font-weight="400" font-size="24" fill="#9FD8FF">Todo Santiago · Las Condes · Vitacura · Providencia · Ñuñoa · Chicureo</text>
      <rect x="320" y="405" width="360" height="56" rx="28" fill="#D42A26"/>
      <text x="500" y="442" font-family="'Poppins', sans-serif" font-weight="700" font-size="24" fill="#FFFFFF" text-anchor="middle">Llamar: +56 9 3732 5405</text>
    </svg>
  `;

  await sharp(bg)
    .composite([
      { input: Buffer.from(ogSvgOverlay), top: 0, left: 0 },
      { input: insignia200, top: 215, left: 100 }
    ])
    .jpeg({ quality: 90 })
    .toFile('public/assets/img/og-image.jpg');

  console.log('All assets generated successfully!');
}

generateAssets().catch(err => {
  console.error(err);
  process.exit(1);
});

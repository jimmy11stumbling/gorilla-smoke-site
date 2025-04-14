import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create directories if they don't exist
const iconsDir = path.join(__dirname, '../public/icons');
const screenshotsDir = path.join(__dirname, '../public/screenshots');

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

// Icon sizes for PWA
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Generate PNG icons from SVG
const generateIcons = async () => {
  const svgPath = path.join(__dirname, '../public/icons/icon.svg');
  
  if (!fs.existsSync(svgPath)) {
    console.error('SVG icon not found at', svgPath);
    return;
  }
  
  console.log('Generating PWA icons...');
  
  try {
    // Create PNG icons for different sizes
    for (const size of iconSizes) {
      const outputPath = path.join(iconsDir, `icon-${size}x${size}.png`);
      
      await sharp(svgPath)
        .resize(size, size)
        .png()
        .toFile(outputPath);
      
      console.log(`Generated ${outputPath}`);
    }
    
    // Create menu icon
    await sharp(svgPath)
      .resize(192, 192)
      .composite([{
        input: Buffer.from(`
          <svg width="192" height="192" xmlns="http://www.w3.org/2000/svg">
            <rect x="56" y="80" width="80" height="10" rx="5" fill="white"/>
            <rect x="56" y="105" width="80" height="10" rx="5" fill="white"/>
            <rect x="56" y="130" width="80" height="10" rx="5" fill="white"/>
          </svg>
        `),
        blend: 'over'
      }])
      .png()
      .toFile(path.join(iconsDir, 'menu-192x192.png'));
    
    console.log('Generated menu-192x192.png');
    
    // Create order icon
    await sharp(svgPath)
      .resize(192, 192)
      .composite([{
        input: Buffer.from(`
          <svg width="192" height="192" xmlns="http://www.w3.org/2000/svg">
            <circle cx="96" cy="96" r="40" fill="white" fill-opacity="0.3"/>
            <path d="M80 96 L90 106 L110 86" stroke="white" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        `),
        blend: 'over'
      }])
      .png()
      .toFile(path.join(iconsDir, 'order-192x192.png'));
    
    console.log('Generated order-192x192.png');
    
    // Create OG image
    await sharp(svgPath)
      .resize(1200, 630)
      .composite([{
        input: Buffer.from(`
          <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="1200" height="630" fill="transparent"/>
            <text x="600" y="340" font-family="Arial" font-size="72" font-weight="bold" fill="white" text-anchor="middle">Gorilla Smoke &amp; Grill</text>
            <text x="600" y="420" font-family="Arial" font-size="36" fill="#f5a742" text-anchor="middle">Authentic BBQ in Laredo, TX</text>
          </svg>
        `),
        blend: 'over'
      }])
      .png()
      .toFile(path.join(__dirname, '../public/og-image.png'));
    
    console.log('Generated og-image.png');
    
    // Create placeholder screenshots for PWA
    for (const name of ['homepage', 'menu']) {
      await sharp(svgPath)
        .resize(1280, 720)
        .composite([{
          input: Buffer.from(`
            <svg width="1280" height="720" xmlns="http://www.w3.org/2000/svg">
              <rect x="0" y="0" width="1280" height="720" fill="transparent"/>
              <text x="640" y="360" font-family="Arial" font-size="48" fill="white" text-anchor="middle">${name === 'homepage' ? 'Gorilla Smoke &amp; Grill Homepage' : 'Gorilla Smoke &amp; Grill Menu'}</text>
            </svg>
          `),
          blend: 'over'
        }])
        .jpeg({ quality: 90 })
        .toFile(path.join(screenshotsDir, `${name}-1280x720.jpg`));
      
      console.log(`Generated ${name}-1280x720.jpg`);
    }
    
    console.log('All PWA assets generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
  }
};

generateIcons();
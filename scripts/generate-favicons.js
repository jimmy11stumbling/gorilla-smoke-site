import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create directories if they don't exist
const iconsDir = path.join(__dirname, '../public/icons');

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate small favicon sizes
const generateFavicons = async () => {
  const svgPath = path.join(__dirname, '../public/icons/icon.svg');
  
  if (!fs.existsSync(svgPath)) {
    console.error('SVG icon not found at', svgPath);
    return;
  }
  
  console.log('Generating favicon files...');
  
  try {
    // Create small PNG icons (16x16, 32x32)
    for (const size of [16, 32]) {
      const outputPath = path.join(iconsDir, `icon-${size}x${size}.png`);
      
      await sharp(svgPath)
        .resize(size, size)
        .png()
        .toFile(outputPath);
      
      console.log(`Generated ${outputPath}`);
    }
    
    // Create ICO file (multi-size icon)
    // Since we can't directly create ICO files with sharp, we'll create 
    // a simple 32x32 PNG and copy it to favicon.ico location
    await sharp(svgPath)
      .resize(32, 32)
      .png()
      .toFile(path.join(__dirname, '../public/favicon.ico'));
    
    console.log('Generated favicon.ico');
    
    console.log('All favicon files generated successfully!');
  } catch (error) {
    console.error('Error generating favicons:', error);
  }
};

generateFavicons();
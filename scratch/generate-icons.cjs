const sharp = require('sharp');
const path = require('path');

async function generateIcons() {
  const input = path.join(__dirname, 'public/favicon_original.png');
  const sizes = [192, 512];
  
  for (const size of sizes) {
    const output = path.join(__dirname, `public/favicon-${size}.png`);
    await sharp(input)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .toFile(output);
    console.log(`Generated ${output}`);
  }
}

generateIcons().catch(console.error);

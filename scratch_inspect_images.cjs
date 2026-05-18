const fs = require('fs');
const path = require('path');

// Basic PNG dimension reader
function getPngDimensions(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    // Check if it's a PNG
    if (buffer.toString('ascii', 1, 4) === 'PNG') {
      const width = buffer.readUInt32BE(16);
      const height = buffer.readUInt32BE(20);
      return { width, height };
    }
  } catch (err) {
    return { error: err.message };
  }
  return null;
}

const assetsDir = 'd:\\cctv_eccomerce_mern_project\\src\\assets';
const files = fs.readdirSync(assetsDir);
console.log('Image Files Info:');
files.forEach(file => {
  if (file.endsWith('.png')) {
    const filePath = path.join(assetsDir, file);
    const stats = fs.statSync(filePath);
    const dims = getPngDimensions(filePath);
    console.log(`- ${file}: Size = ${(stats.size / 1024).toFixed(1)} KB, Dims = ${dims ? `${dims.width}x${dims.height}` : 'N/A'}`);
  }
});

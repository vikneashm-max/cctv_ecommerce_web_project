const fs = require('fs');
const path = require('path');

function detectFormatAndSize(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    
    // Check PNG
    if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
      const width = buffer.readUInt32BE(16);
      const height = buffer.readUInt32BE(20);
      return { format: 'PNG', width, height };
    }
    
    // Check JPEG
    if (buffer[0] === 0xFF && buffer[1] === 0xD8) {
      // Find SOF0 (0xFFC0) or SOF2 (0xFFC2) to get dimensions
      let offset = 2;
      while (offset < buffer.length) {
        if (buffer[offset] === 0xFF && (buffer[offset + 1] === 0xC0 || buffer[offset + 1] === 0xC2)) {
          const height = buffer.readUInt16BE(offset + 5);
          const width = buffer.readUInt16BE(offset + 7);
          return { format: 'JPEG', width, height };
        }
        offset++;
      }
      return { format: 'JPEG', width: 'unknown', height: 'unknown' };
    }
    
    // Check WebP
    if (buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') {
      return { format: 'WEBP', width: 'unknown', height: 'unknown' };
    }
    
    return { format: 'Unknown', firstBytes: buffer.slice(0, 8).toString('hex') };
  } catch (err) {
    return { error: err.message };
  }
}

const assetsDir = 'd:\\cctv_eccomerce_mern_project\\src\\assets';
const files = fs.readdirSync(assetsDir);
console.log('Image Format & Dims Info:');
files.forEach(file => {
  if (file.endsWith('.png') || file.endsWith('.svg')) {
    const filePath = path.join(assetsDir, file);
    const info = detectFormatAndSize(filePath);
    console.log(`- ${file}:`, info);
  }
});

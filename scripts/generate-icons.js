// Run: node scripts/generate-icons.js
// Generates simple PNG icons from SVG for PWA manifest
const fs = require('fs');
// If canvas is not available, just create placeholder files
try {
  const { createCanvas } = require('canvas');
  for (const size of [192, 512]) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    // Background
    ctx.fillStyle = '#1a7a6d';
    ctx.beginPath();
    ctx.roundRect(0, 0, size, size, size * 0.15);
    ctx.fill();
    // Text
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${size * 0.5}px system-ui`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('FL', size/2, size/2 + size*0.05);
    fs.writeFileSync(`public/icon-${size}.png`, canvas.toBuffer('image/png'));
    console.log(`Generated icon-${size}.png`);
  }
} catch (e) {
  console.log('Canvas not available, creating placeholder icons');
  // Create minimal valid 1x1 PNG as placeholder
  const minPng = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
  fs.writeFileSync('public/icon-192.png', minPng);
  fs.writeFileSync('public/icon-512.png', minPng);
  console.log('Created placeholder icons');
}

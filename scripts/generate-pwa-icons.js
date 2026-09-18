import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function crc32(buf) {
  let table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  let c = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    c = table[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
  }
  return (c ^ 0xFFFFFFFF) >>> 0;
}

function makeChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(8 + len + 4);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const typeAndData = chunk.subarray(4, 8 + len);
  const crc = crc32(typeAndData);
  chunk.writeUInt32BE(crc, 8 + len);
  return chunk;
}

function createPng(width, height, pixelFn) {
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8); // 8-bit
  ihdrData.writeUInt8(6, 9); // RGBA
  ihdrData.writeUInt8(0, 10);
  ihdrData.writeUInt8(0, 11);
  ihdrData.writeUInt8(0, 12);
  const ihdrChunk = makeChunk('IHDR', ihdrData);

  const rawRows = Buffer.alloc(height * (1 + width * 4));
  let offset = 0;
  for (let y = 0; y < height; y++) {
    rawRows[offset++] = 0; // Filter: None
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = pixelFn(x, y, width, height);
      rawRows[offset++] = r;
      rawRows[offset++] = g;
      rawRows[offset++] = b;
      rawRows[offset++] = a;
    }
  }

  const compressedData = zlib.deflateSync(rawRows);
  const idatChunk = makeChunk('IDAT', compressedData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Visual renderer: Tech Hexagon + AI Core + Neural Nodes
function renderVknIcon(x, y, w, h, isMaskable = false) {
  const cx = w / 2;
  const cy = h / 2;
  const scale = isMaskable ? 0.68 : 0.85; // maskable has safe zone margin
  const maxR = (Math.min(w, h) / 2) * scale;

  // Background: Obsidian with subtle radial glow
  const dx = (x - cx) / (w / 2);
  const dy = (y - cy) / (h / 2);
  const distNorm = Math.sqrt(dx * dx + dy * dy);

  let bgR = 8, bgG = 9, bgB = 11; // #08090B
  if (distNorm < 1.0) {
    const glow = (1 - distNorm) * 0.25;
    bgR = Math.min(255, Math.floor(bgR + 124 * glow * 0.15));
    bgG = Math.min(255, Math.floor(bgG + 255 * glow * 0.25));
    bgB = Math.min(255, Math.floor(bgB + 107 * glow * 0.15));
  }

  // Hexagon distance
  const px = Math.abs(x - cx);
  const py = Math.abs(y - cy);
  const hexDist = Math.max(px * 0.866025 + py * 0.5, py);

  const hexOuter = maxR;
  const hexInner = maxR - Math.max(3, Math.round(w * 0.03));

  // Glowing Hexagon Ring
  if (hexDist <= hexOuter && hexDist >= hexInner) {
    return [124, 255, 107, 255]; // #7CFF6B
  }

  // Corner Vertex Accent Dots (at 6 vertices)
  for (let i = 0; i < 6; i++) {
    const angle = (i * 60) * (Math.PI / 180);
    const vx = cx + maxR * Math.sin(angle);
    const vy = cy - maxR * Math.cos(angle);
    const vdist = Math.sqrt((x - vx) * (x - vx) + (y - vy) * (y - vy));
    if (vdist < Math.max(4, w * 0.045)) {
      return [242, 242, 242, 255]; // #F2F2F2
    }
  }

  // Inner Central Circuit Box / Core
  const coreSize = maxR * 0.46;
  const inCoreX = px < coreSize;
  const inCoreY = py < coreSize;
  const coreBorder = Math.max(2, Math.round(w * 0.02));

  if (inCoreX && inCoreY) {
    const isBorder = px >= (coreSize - coreBorder) || py >= (coreSize - coreBorder);
    if (isBorder) {
      return [124, 255, 107, 240];
    }
    // Subtle dark core background
    return [16, 18, 22, 255]; // #101216
  }

  // Diagonal Bus lines from Core to Hexagon vertices
  const diagDist = Math.abs(px - py);
  if (diagDist < Math.max(1.5, w * 0.015) && hexDist < hexOuter && (px >= coreSize || py >= coreSize)) {
    return [124, 255, 107, 180];
  }

  // Central glowing nexus point
  const centerDist = Math.sqrt(px * px + py * py);
  if (centerDist < Math.max(3, w * 0.06)) {
    return [124, 255, 107, 255]; // Bright green node
  }

  return [bgR, bgG, bgB, 255];
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate PWA Icons
console.log('Generating PWA icons...');
const icon192 = createPng(192, 192, (x, y, w, h) => renderVknIcon(x, y, w, h, false));
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), icon192);

const icon512 = createPng(512, 512, (x, y, w, h) => renderVknIcon(x, y, w, h, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), icon512);

const iconMaskable = createPng(512, 512, (x, y, w, h) => renderVknIcon(x, y, w, h, true));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), iconMaskable);

const appleIcon = createPng(180, 180, (x, y, w, h) => renderVknIcon(x, y, w, h, false));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), appleIcon);

// Also generate a vector SVG icon
const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" rx="128" fill="#08090B"/>
  <circle cx="256" cy="256" r="220" fill="none" stroke="#24272D" stroke-width="2"/>
  <polygon points="256,66 420,161 420,351 256,446 92,351 92,161" fill="#101216" stroke="#7CFF6B" stroke-width="8" stroke-linejoin="round"/>
  <polygon points="256,120 374,188 374,324 256,392 138,324 138,188" fill="none" stroke="#24272D" stroke-width="3"/>
  <rect x="196" y="196" width="120" height="120" rx="20" fill="#15181D" stroke="#7CFF6B" stroke-width="6"/>
  <line x1="92" y1="161" x2="196" y2="196" stroke="#7CFF6B" stroke-width="4" stroke-dasharray="6 6"/>
  <line x1="420" y1="161" x2="316" y2="196" stroke="#7CFF6B" stroke-width="4" stroke-dasharray="6 6"/>
  <line x1="256" y1="446" x2="256" y2="316" stroke="#7CFF6B" stroke-width="4"/>
  <circle cx="256" cy="256" r="22" fill="#7CFF6B"/>
  <circle cx="256" cy="66" r="10" fill="#F2F2F2"/>
  <circle cx="420" cy="161" r="10" fill="#F2F2F2"/>
  <circle cx="420" cy="351" r="10" fill="#F2F2F2"/>
  <circle cx="256" cy="446" r="10" fill="#F2F2F2"/>
  <circle cx="92" cy="351" r="10" fill="#F2F2F2"/>
  <circle cx="92" cy="161" r="10" fill="#F2F2F2"/>
  <text x="256" y="485" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="22" font-weight="bold" fill="#7CFF6B" letter-spacing="4">VKN // AI</text>
</svg>`;
fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgIcon);

console.log('PWA icons created successfully.');

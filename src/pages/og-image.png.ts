import type { APIRoute } from 'astro';
import { crc32, deflateSync } from 'node:zlib';

// Imagen para compartir de 1200×630: fondo oscuro con brillos de marca, generada al compilar
// (PNG RGB sin librerías). Evita comitear un binario y no usa imágenes de stock ni de IA.
const W = 1200;
const H = 630;

function chunk(type: string, data: Buffer): Buffer {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function buildPng(): Buffer {
  const base = [7, 8, 12];
  const cyan = [34, 211, 238];
  const violet = [124, 92, 255];
  const raw = Buffer.alloc((W * 3 + 1) * H);
  let o = 0;
  for (let y = 0; y < H; y++) {
    raw[o++] = 0;
    for (let x = 0; x < W; x++) {
      const a = Math.max(0, 1 - Math.hypot(x - 300, y - 480) / 520) * 0.5;
      const b = Math.max(0, 1 - Math.hypot(x - 900, y - 150) / 560) * 0.55;
      // Línea de marca en la parte inferior.
      const bar = y > 560 && y < 570 && x > 80 && x < 1120 ? x / W : -1;
      for (let c = 0; c < 3; c++) {
        let v = (base[c] ?? 0) + (cyan[c] ?? 0) * a + (violet[c] ?? 0) * b;
        if (bar >= 0) v = (cyan[c] ?? 0) * (1 - bar) + (violet[c] ?? 0) * bar;
        raw[o++] = Math.min(255, Math.round(v));
      }
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(W, 0);
  ihdr.writeUInt32BE(H, 4);
  ihdr[8] = 8; // profundidad de bits
  ihdr[9] = 2; // RGB
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

export const GET: APIRoute = () =>
  new Response(new Uint8Array(buildPng()), { headers: { 'Content-Type': 'image/png' } });

import { describe, expect, it } from 'vitest';
import {
  clampDpr,
  nodeCountForWidth,
  project,
  rotate,
  spherePoints,
} from '../../src/lib/constellation';

describe('constellation', () => {
  it('el número de nodos está entre 80 y 150 y es menor en móvil', () => {
    for (const w of [320, 767, 768, 900, 1023, 1024, 2560]) {
      const n = nodeCountForWidth(w);
      expect(n).toBeGreaterThanOrEqual(80);
      expect(n).toBeLessThanOrEqual(150);
    }
    expect(nodeCountForWidth(360)).toBeLessThan(nodeCountForWidth(1440));
  });

  it('los puntos están en la esfera unidad y la proyección es finita', () => {
    const pts = spherePoints(100);
    expect(pts).toHaveLength(100);
    for (const p of pts) {
      expect(Math.hypot(p.x, p.y, p.z)).toBeCloseTo(1, 6);
      const r = rotate(p, 0.7, 0.3);
      expect(Math.hypot(r.x, r.y, r.z)).toBeCloseTo(1, 6);
      const q = project(r, 800, 600, 3);
      expect(Number.isFinite(q.x) && Number.isFinite(q.y) && q.scale > 0).toBe(true);
    }
  });

  it('clampDpr limita a 2 y nunca baja de 1', () => {
    expect(clampDpr(3)).toBe(2);
    expect(clampDpr(1.5)).toBe(1.5);
    expect(clampDpr(0)).toBe(1);
    expect(clampDpr(NaN)).toBe(1);
  });
});

export interface Point3 {
  x: number;
  y: number;
  z: number;
}

/** 80 nodos por debajo de 768 px, 150 desde 1024 px e interpolado entre ambos. */
export function nodeCountForWidth(width: number): number {
  if (width < 768) return 80;
  if (width >= 1024) return 150;
  return Math.round(80 + ((width - 768) / (1024 - 768)) * 70);
}

/** Espiral de Fibonacci sobre una esfera de radio 1. */
export function spherePoints(count: number): Point3[] {
  const golden = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: count }, (_, i) => {
    const y = 1 - (2 * (i + 0.5)) / count;
    const r = Math.sqrt(1 - y * y);
    const t = golden * i;
    return { x: Math.cos(t) * r, y, z: Math.sin(t) * r };
  });
}

export function rotate(p: Point3, angleY: number, angleX: number): Point3 {
  const cy = Math.cos(angleY);
  const sy = Math.sin(angleY);
  const x1 = p.x * cy + p.z * sy;
  const z1 = -p.x * sy + p.z * cy;
  const cx = Math.cos(angleX);
  const sx = Math.sin(angleX);
  return { x: x1, y: p.y * cx - z1 * sx, z: p.y * sx + z1 * cx };
}

/** Proyección en perspectiva: `fov` es la distancia de la cámara al centro. */
export function project(
  p: Point3,
  width: number,
  height: number,
  fov: number,
): { x: number; y: number; scale: number } {
  const scale = fov / (fov + p.z);
  const unit = Math.min(width, height) / 2;
  return { x: width / 2 + p.x * scale * unit, y: height / 2 + p.y * scale * unit, scale };
}

export function clampDpr(dpr: number): number {
  return Math.min(Math.max(dpr || 1, 1), 2);
}

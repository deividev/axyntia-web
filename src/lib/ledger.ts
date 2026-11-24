/** Número de línea del albarán con dos cifras como mínimo («01», «12»), para que la columna no baile. */
export function lineNumber(n: number): string {
  if (!Number.isInteger(n) || n < 1) throw new RangeError(`Número de línea no válido: ${n}`);
  return String(n).padStart(2, '0');
}

import {
  clampDpr,
  nodeCountForWidth,
  project,
  rotate,
  spherePoints,
  type Point3,
} from '../lib/constellation';

const canvas = document.querySelector<HTMLCanvasElement>('[data-hero-canvas]');
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const ctx = canvas?.getContext('2d');

if (canvas && ctx && !reduced) {
  const css = getComputedStyle(document.documentElement);
  const primary = css.getPropertyValue('--color-primary').trim() || 'currentColor';
  const secondary = css.getPropertyValue('--color-secondary').trim() || 'currentColor';

  let points: Point3[] = [];
  let width = 0;
  let height = 0;
  let dpr = 1;
  let angle = 0;
  let tilt = 0.3;
  let targetTilt = 0.3;
  let targetSpin = 0;
  let spinOffset = 0;
  let onScreen = true;
  let raf = 0;
  let last = performance.now();

  const resize = (): void => {
    dpr = clampDpr(window.devicePixelRatio);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    points = spherePoints(nodeCountForWidth(window.innerWidth));
  };

  const frame = (now: number): void => {
    raf = 0;
    const dt = Math.min(now - last, 50);
    last = now;
    angle += dt * 0.00018;
    tilt += (targetTilt - tilt) * 0.05;
    spinOffset += (targetSpin - spinOffset) * 0.05;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    const fov = 3;
    const projected = points.map((p) => {
      const r = rotate(p, angle + spinOffset, tilt);
      return { r, q: project(r, width, height, fov) };
    });

    ctx.lineWidth = 1;
    ctx.strokeStyle = primary;
    for (let i = 0; i < projected.length; i++) {
      for (let j = i + 1; j < projected.length; j++) {
        const a = projected[i];
        const b = projected[j];
        if (!a || !b) continue;
        const d = Math.hypot(a.r.x - b.r.x, a.r.y - b.r.y, a.r.z - b.r.z);
        if (d < 0.5) {
          ctx.globalAlpha = (1 - d / 0.5) * 0.35 * Math.min(a.q.scale, b.q.scale);
          ctx.beginPath();
          ctx.moveTo(a.q.x, a.q.y);
          ctx.lineTo(b.q.x, b.q.y);
          ctx.stroke();
        }
      }
    }
    for (const { r, q } of projected) {
      ctx.globalAlpha = 0.4 + 0.5 * ((1 - r.z) / 2);
      ctx.fillStyle = r.z < 0 ? primary : secondary;
      ctx.beginPath();
      ctx.arc(q.x, q.y, 1.5 * q.scale + 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    schedule();
  };

  const schedule = (): void => {
    if (!raf && onScreen && !document.hidden) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
  };

  new IntersectionObserver((entries) => {
    onScreen = entries.some((e) => e.isIntersecting);
    if (onScreen) schedule();
    else if (raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  }).observe(canvas);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    } else schedule();
  });

  window.addEventListener('pointermove', (e) => {
    targetSpin = (e.clientX / window.innerWidth - 0.5) * 0.6;
    targetTilt = 0.3 + (e.clientY / window.innerHeight - 0.5) * 0.4;
  });

  window.addEventListener('resize', resize);
  resize();
  schedule();
}

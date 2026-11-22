// Apariciones al hacer scroll, línea de progreso y brillo de las tarjetas.
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduced) {
  const items = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.05 },
    );
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach((el) => el.classList.add('is-visible'));
  }

  const line = document.querySelector<HTMLElement>('[data-progress-line]');
  const section = document.getElementById('como-trabajamos');
  if (line && section) {
    const update = (): void => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.8 - rect.top) / rect.height));
      line.style.setProperty('--progress', p.toFixed(3));
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  document.querySelectorAll<HTMLElement>('[data-card]').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--glow-x', `${e.clientX - r.left}px`);
      card.style.setProperty('--glow-y', `${e.clientY - r.top}px`);
    });
  });
}

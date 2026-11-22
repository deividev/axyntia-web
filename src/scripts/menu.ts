// Menú móvil: abre y cierra con el botón, Escape (devuelve el foco), al elegir un enlace y al
// pasar a escritorio.
const button = document.querySelector<HTMLButtonElement>('button[aria-controls="site-nav"]');
const nav = document.getElementById('site-nav');

if (button && nav) {
  const setOpen = (open: boolean): void => {
    button.setAttribute('aria-expanded', String(open));
    nav.dataset.open = String(open);
  };

  button.addEventListener('click', () => {
    setOpen(button.getAttribute('aria-expanded') !== 'true');
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      button.focus();
    }
  });

  nav.addEventListener('click', (e) => {
    if ((e.target as Element).closest('a')) setOpen(false);
  });

  window.matchMedia('(min-width: 64rem)').addEventListener('change', (e) => {
    if (e.matches) setOpen(false);
  });
}

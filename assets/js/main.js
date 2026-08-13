document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('[data-menu-toggle]');
  const overlay = document.querySelector('[data-menu-overlay]');
  const year = document.querySelector('[data-current-year]');

  if (year) year.textContent = new Date().getFullYear();
  if (!toggle || !overlay) return;

  const setMenu = (open) => {
    overlay.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Tutup menu navigasi' : 'Buka menu navigasi');
    const icon = toggle.querySelector('.icon');
    if (icon) icon.textContent = open ? '✕' : '☰';
    document.body.classList.toggle('menu-open', open);
  };

  toggle.addEventListener('click', () => setMenu(overlay.hidden));

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) setMenu(false);
  });

  overlay.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenu(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !overlay.hidden) setMenu(false);
  });
});

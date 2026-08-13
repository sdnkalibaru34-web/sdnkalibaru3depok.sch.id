document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('[data-menu-toggle]');
  const overlay = document.querySelector('[data-menu-overlay]');
  const year = document.querySelector('[data-current-year]');

  if (year) year.textContent = new Date().getFullYear();

  if (!toggle || !overlay) return;

  const closeMenu = () => {
    overlay.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  toggle.addEventListener('click', () => {
    const isOpen = !overlay.hidden;
    overlay.hidden = isOpen;
    toggle.setAttribute('aria-expanded', String(!isOpen));
    document.body.style.overflow = isOpen ? '' : 'hidden';
  });

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) closeMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !overlay.hidden) closeMenu();
  });
});

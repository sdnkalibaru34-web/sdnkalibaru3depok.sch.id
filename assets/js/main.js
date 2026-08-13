document.addEventListener('DOMContentLoaded', () => {
  const currentScript = document.querySelector('script[src*="assets/js/main.js"]');
  const siteRoot = currentScript?.src ? new URL('../../', currentScript.src) : new URL('./', document.baseURI);
  const assetUrl = (path) => new URL(path, siteRoot).href;

  if (!document.querySelector('link[data-brand-update]')) {
    const extraStyle = document.createElement('link');
    extraStyle.rel = 'stylesheet';
    extraStyle.href = assetUrl('assets/css/brand-update.css');
    extraStyle.dataset.brandUpdate = 'true';
    document.head.appendChild(extraStyle);
  }

  const oldName = 'SDN Kalibaru 3 Depok';
  const newName = 'SDN Kalibaru 3';

  document.title = document.title.replaceAll(oldName, newName);
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) metaDescription.content = metaDescription.content.replaceAll(oldName, newName);

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);
  textNodes.forEach((node) => {
    if (node.nodeValue?.includes(oldName)) node.nodeValue = node.nodeValue.replaceAll(oldName, newName);
  });

  document.querySelectorAll('[alt],[aria-label],[title]').forEach((element) => {
    ['alt', 'aria-label', 'title'].forEach((attribute) => {
      const value = element.getAttribute(attribute);
      if (value?.includes(oldName)) element.setAttribute(attribute, value.replaceAll(oldName, newName));
    });
  });

  const brand = document.querySelector('.brand');
  if (brand) {
    const existingName = brand.querySelector('[data-school="nama"]') || brand.querySelector('span');
    const nameElement = existingName || document.createElement('span');
    nameElement.classList.add('brand-name');
    nameElement.dataset.school = 'nama';
    nameElement.textContent = newName;

    brand.replaceChildren();

    const logo = document.createElement('img');
    logo.className = 'brand-logo';
    logo.src = assetUrl('assets/images/logo-kb3.svg');
    logo.alt = 'Logo SDN Kalibaru 3';

    const copy = document.createElement('span');
    copy.className = 'brand-copy';
    copy.appendChild(nameElement);

    const location = document.createElement('span');
    location.className = 'brand-location';
    location.textContent = 'Kec. Cilodong, Kota Depok, Jawa Barat';
    copy.appendChild(location);

    brand.append(logo, copy);
  }

  const footerLogo = document.querySelector('.footer-logo');
  if (footerLogo) {
    footerLogo.replaceChildren();
    const logo = document.createElement('img');
    logo.src = assetUrl('assets/images/logo-kb3.svg');
    logo.alt = 'Logo SDN Kalibaru 3';
    footerLogo.appendChild(logo);
  }

  const footerGrid = document.querySelector('.footer-grid');
  if (footerGrid && !footerGrid.querySelector('[data-social-column]')) {
    const social = document.createElement('div');
    social.className = 'footer-column';
    social.dataset.socialColumn = 'true';
    social.innerHTML = `
      <h3>Ikuti Kami</h3>
      <a class="social-link" href="https://www.youtube.com/@sdnkalibaru3335" target="_blank" rel="noopener noreferrer" aria-label="YouTube SDN Kalibaru 3">
        <span class="social-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M23 12s0-3.4-.44-5.04a3.08 3.08 0 0 0-2.18-2.18C18.74 4.34 12 4.34 12 4.34s-6.74 0-8.38.44A3.08 3.08 0 0 0 1.44 6.96C1 8.6 1 12 1 12s0 3.4.44 5.04a3.08 3.08 0 0 0 2.18 2.18c1.64.44 8.38.44 8.38.44s6.74 0 8.38-.44a3.08 3.08 0 0 0 2.18-2.18C23 15.4 23 12 23 12Zm-13.2 3.42V8.58L15.72 12 9.8 15.42Z"/></svg></span>
        <span>YouTube</span>
      </a>
      <a class="social-link" href="https://www.tiktok.com/@sdnkalibaru3depok" target="_blank" rel="noopener noreferrer" aria-label="TikTok SDN Kalibaru 3">
        <span class="social-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M14.2 2h3.05c.27 1.52 1.12 2.72 2.46 3.48.78.45 1.53.63 2.29.64v3.03a7.85 7.85 0 0 1-4.6-1.38v7.1a6.88 6.88 0 1 1-5.95-6.82v3.16a3.83 3.83 0 1 0 2.75 3.66V2Z"/></svg></span>
        <span>TikTok</span>
      </a>
      <a class="social-link" href="https://www.instagram.com/sdnkalibaru3depok/" target="_blank" rel="noopener noreferrer" aria-label="Instagram SDN Kalibaru 3">
        <span class="social-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M7.1 2h9.8A5.1 5.1 0 0 1 22 7.1v9.8a5.1 5.1 0 0 1-5.1 5.1H7.1A5.1 5.1 0 0 1 2 16.9V7.1A5.1 5.1 0 0 1 7.1 2Zm-.18 2A2.92 2.92 0 0 0 4 6.92v10.16A2.92 2.92 0 0 0 6.92 20h10.16A2.92 2.92 0 0 0 20 17.08V6.92A2.92 2.92 0 0 0 17.08 4H6.92ZM17.5 5.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"/></svg></span>
        <span>Instagram</span>
      </a>`;
    footerGrid.appendChild(social);
  }

  const copyright = document.querySelector('.copyright');
  if (copyright) copyright.innerHTML = `<span>&copy; <span data-current-year></span> SDN Kalibaru 3. Semua hak dilindungi.</span>`;

  const year = document.querySelector('[data-current-year]');
  if (year) year.textContent = new Date().getFullYear();

  const toggle = document.querySelector('[data-menu-toggle]');
  const overlay = document.querySelector('[data-menu-overlay]');
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

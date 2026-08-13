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
  if (!document.querySelector('link[data-flat-icons]')) {
    const iconStyle = document.createElement('link');
    iconStyle.rel = 'stylesheet';
    iconStyle.href = assetUrl('assets/css/flat-icons-v2.css');
    iconStyle.dataset.flatIcons = 'true';
    document.head.appendChild(iconStyle);
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
    location.dataset.school = 'lokasiHeader';
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

  const icons = {
    service: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 9h8M8 13h5M8 17h3"/>',
    announcement: '<path d="M4 11v2l11 4V7L4 11z"/><path d="M15 9c2 0 4-1 5-2v10c-1-1-3-2-5-2M7 14l1 5h3l-1-4"/>',
    calendar: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16M8 14h3M13 14h3"/>',
    document: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v5h5M9 12h6M9 16h6"/>',
    gallery: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="9" r="2"/><path d="M4 17l5-5 4 4 3-3 4 4"/>',
    scout: '<path d="M12 3l7 4v5c0 4-3 7-7 9-4-2-7-5-7-9V7z"/><path d="M9 11l2 2 4-4"/>',
    dance: '<circle cx="12" cy="5" r="2"/><path d="M12 7v6M12 9l-4 3M12 9l4 3M12 13l-3 7M12 13l4 6"/>',
    pencak: '<path d="M8 12l2-6 2 3 2-5 2 8"/><path d="M6 12h12v4c0 3-2 5-6 5s-6-2-6-5z"/>',
    football: '<circle cx="12" cy="12" r="9"/><path d="M9 9l3-2 3 2-1 4h-4zM5 10l4-1M19 10l-4-1M7 17l3-4M17 17l-3-4"/>',
    taekwondo: '<circle cx="8" cy="5" r="2"/><path d="M9 7l3 5 4-2M12 12l-2 8M12 12l7 5M6 10l5-1"/>',
    karate: '<path d="M5 13l3-5 3 2 2-5 2 4 4-1-1 8-5 5-6-2z"/><path d="M8 13h8"/>',
    character: '<path d="M12 3l7 4v5c0 4-3 7-7 9-4-2-7-5-7-9V7z"/><path d="M8.5 12l2.2 2.2L15.5 9"/>',
    talent: '<path d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8z"/><path d="M18 15l.9 2.1L21 18l-2.1.9L18 21l-.9-2.1L15 18l2.1-.9z"/>',
    collaboration: '<circle cx="8" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M2 20c0-4 2.5-7 6-7s6 3 6 7M13 20c.2-3 1.8-5 4.5-5 2.4 0 4 1.8 4.5 4.5"/>',
    trophy: '<path d="M8 4h8v5c0 4-2 6-4 6s-4-2-4-6z"/><path d="M8 6H4c0 4 2 6 5 6M16 6h4c0 4-2 6-5 6M12 15v4M8 21h8"/>',
    school: '<path d="M3 10l9-6 9 6"/><path d="M5 9v11h14V9M9 20v-6h6v6"/>',
    status: '<path d="M4 20h16M6 20V8h12v12M9 8V5h6v3"/><path d="M9 12h2M13 12h2M9 16h2M13 16h2"/>',
    classroom: '<path d="M4 5h16v12H4z"/><path d="M8 21l4-4 4 4M8 9h8M8 13h5"/>',
    teacher: '<circle cx="9" cy="8" r="3"/><path d="M3 20c0-4 2-7 6-7s6 3 6 7M16 8h5M18.5 5.5v5"/>',
    student: '<circle cx="12" cy="7" r="3"/><path d="M5 21c0-5 3-9 7-9s7 4 7 9"/><path d="M8 13l4 3 4-3"/>',
    location: '<path d="M12 21s7-6 7-12a7 7 0 1 0-14 0c0 6 7 12 7 12z"/><circle cx="12" cy="9" r="2"/>',
    email: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M4 7l8 6 8-6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v6l4 2"/>',
    book: '<path d="M4 5c3-1 5 0 8 2v13c-3-2-5-3-8-2zM20 5c-3-1-5 0-8 2v13c3-2 5-3 8-2z"/>',
    checklist: '<path d="M9 6h11M9 12h11M9 18h11M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2"/>'
  };

  const svg = (key) => `<svg class="flat-icon-svg" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${icons[key] || icons.service}</svg>`;
  const subject = (element) => `${element.closest('.card,.quick-card,.stat,.service-detail,.gallery-placeholder')?.textContent || ''} ${element.textContent || ''}`.toLowerCase();
  const choose = (text) => {
    if (text.includes('pengumuman')) return 'announcement';
    if (text.includes('agenda') || text.includes('kegiatan')) return 'calendar';
    if (text.includes('dokumen') || text.includes('unduh')) return 'document';
    if (text.includes('galeri') || text.includes('foto')) return 'gallery';
    if (text.includes('pramuka')) return 'scout';
    if (text.includes('pencak silat')) return 'pencak';
    if (text.includes('futsal') || text.includes('mini soccer')) return 'football';
    if (text.includes('taekwondo')) return 'taekwondo';
    if (text.includes('karate')) return 'karate';
    if (text.includes('tari')) return 'dance';
    if (text.includes('karakter')) return 'character';
    if (text.includes('bakat') || text.includes('potensi')) return 'talent';
    if (text.includes('kolaborasi') || text.includes('kerja sama')) return 'collaboration';
    if (text.includes('prestasi') || text.includes('pencapaian') || text.includes('apresiasi')) return 'trophy';
    if (text.includes('status satuan')) return 'status';
    if (text.includes('jenjang satuan')) return 'school';
    if (text.includes('alamat') || text.includes('lokasi')) return 'location';
    if (text.includes('email')) return 'email';
    if (text.includes('jam') || text.includes('waktu')) return 'clock';
    if (text.includes('rombel')) return 'classroom';
    if (text.includes('guru') || text.includes('tendik')) return 'teacher';
    if (text.includes('peserta didik') || text.includes('siswa')) return 'student';
    if (text.includes('tahun pelajaran')) return 'calendar';
    if (text.includes('rekap jurnal')) return 'checklist';
    if (text.includes('jurnal')) return 'book';
    if (text.includes('pembelajaran') || text.includes('belajar')) return 'book';
    if (text.includes('layanan')) return 'service';
    return 'school';
  };

  const iconSelector = '.quick-icon,.card-icon,.stat-icon,.service-detail-icon,.gallery-placeholder-icon';
  const renderFlatIcons = (root = document) => {
    root.querySelectorAll?.(iconSelector).forEach((element) => {
      const key = choose(subject(element));
      if (element.dataset.flatIconKey === key && element.classList.contains('flat-icon')) return;
      element.innerHTML = svg(key);
      element.dataset.flatIconKey = key;
      element.classList.add('flat-icon');
    });
    if (root.matches?.(iconSelector)) {
      const key = choose(subject(root));
      root.innerHTML = svg(key);
      root.dataset.flatIconKey = key;
      root.classList.add('flat-icon');
    }
  };
  renderFlatIcons();

  const iconObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => mutation.addedNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) renderFlatIcons(node);
    }));
  });
  iconObserver.observe(document.body, { childList: true, subtree: true });

  const footerGrid = document.querySelector('.footer-grid');
  if (footerGrid && !footerGrid.querySelector('[data-social-column]')) {
    const social = document.createElement('div');
    social.className = 'footer-column';
    social.dataset.socialColumn = 'true';
    social.innerHTML = `<h3>Ikuti Kami</h3><a class="social-link" href="#" data-school-href="sosial.youtube"><span class="social-icon"><svg viewBox="0 0 24 24"><path d="M23 12s0-3.4-.44-5.04a3.08 3.08 0 0 0-2.18-2.18C18.74 4.34 12 4.34 12 4.34s-6.74 0-8.38.44A3.08 3.08 0 0 0 1.44 6.96C1 8.6 1 12 1 12s0 3.4.44 5.04a3.08 3.08 0 0 0 2.18 2.18c1.64.44 8.38.44 8.38.44s6.74 0 8.38-.44a3.08 3.08 0 0 0 2.18-2.18C23 15.4 23 12 23 12Zm-13.2 3.42V8.58L15.72 12 9.8 15.42Z"/></svg></span><span>YouTube</span></a><a class="social-link" href="#" data-school-href="sosial.tiktok"><span class="social-icon"><svg viewBox="0 0 24 24"><path d="M14.2 2h3.05c.27 1.52 1.12 2.72 2.46 3.48.78.45 1.53.63 2.29.64v3.03a7.85 7.85 0 0 1-4.6-1.38v7.1a6.88 6.88 0 1 1-5.95-6.82v3.16a3.83 3.83 0 1 0 2.75 3.66V2Z"/></svg></span><span>TikTok</span></a><a class="social-link" href="#" data-school-href="sosial.instagram"><span class="social-icon"><svg viewBox="0 0 24 24"><path d="M7.1 2h9.8A5.1 5.1 0 0 1 22 7.1v9.8a5.1 5.1 0 0 1-5.1 5.1H7.1A5.1 5.1 0 0 1 2 16.9V7.1A5.1 5.1 0 0 1 7.1 2Zm-.18 2A2.92 2.92 0 0 0 4 6.92v10.16A2.92 2.92 0 0 0 6.92 20h10.16A2.92 2.92 0 0 0 20 17.08V6.92A2.92 2.92 0 0 0 17.08 4H6.92ZM17.5 5.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"/></svg></span><span>Instagram</span></a>`;
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
  overlay.addEventListener('click', (event) => { if (event.target === overlay) setMenu(false); });
  overlay.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !overlay.hidden) setMenu(false); });
});

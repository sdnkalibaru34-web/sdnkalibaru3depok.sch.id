document.addEventListener('DOMContentLoaded', () => {
  const icons = {
    star: '<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.2 5.9-.9z"/>',
    hand: '<path d="M7.5 12V7.5a1.5 1.5 0 0 1 3 0V11M10.5 11V5.5a1.5 1.5 0 0 1 3 0V11M13.5 11V6.5a1.5 1.5 0 0 1 3 0V12M16.5 12V9a1.5 1.5 0 0 1 3 0v5c0 4.5-3 7-7 7h-1c-3 0-5-1.4-6.5-3.8L3.5 15a1.6 1.6 0 0 1 2.5-2l1.5 1.2z"/>',
    phoneStylus: '<rect x="5" y="2.5" width="10" height="19" rx="2"/><path d="M8.5 5h3M9 18.5h2"/><path d="M18 7l3 3-6.8 6.8-3.7.7.7-3.7z"/>',
    book: '<path d="M4 5c3-1 5 0 8 2v13c-3-2-5-3-8-2zM20 5c-3-1-5 0-8 2v13c3-2 5-3 8-2z"/>',
    human: '<circle cx="12" cy="7" r="3"/><path d="M5 21c0-5 3-9 7-9s7 4 7 9"/>',
    community: '<circle cx="12" cy="7" r="2.5"/><circle cx="5.5" cy="9" r="2"/><circle cx="18.5" cy="9" r="2"/><path d="M7 20c.3-4 2-7 5-7s4.7 3 5 7M1.5 20c.2-3 1.5-5.5 4-5.5 1.2 0 2.2.5 3 1.3M22.5 20c-.2-3-1.5-5.5-4-5.5-1.2 0-2.2.5-3 1.3"/>',
    classroom: '<path d="M4 6h16v8H4zM8 14v7M16 14v7M6 18h12"/><path d="M9 10h6"/>',
    medical: '<rect x="4" y="6" width="16" height="14" rx="2"/><path d="M9 6V4h6v2M12 9v8M8 13h8"/>',
    leaf: '<path d="M20 4C12 4 6 8 5 15c4 1 8-.2 11-3.5C18.5 8.5 20 4 20 4z"/><path d="M4 20c2-5 6-8 12-10"/>',
    toilet: '<circle cx="7" cy="5" r="2"/><circle cx="17" cy="5" r="2"/><path d="M7 8v5M4 20l2-7h2l2 7M17 8v12M14 11h6M3 10h8"/>',
    mosque: '<path d="M4 21h16V11H4zM8 21v-6h8v6M12 3c0 2-3 2.5-3 5h6c0-2.5-3-3-3-5z"/><path d="M3 11h18M6 11V8h2M16 11V8h2"/>',
    traditionalDance: '<circle cx="12" cy="5" r="2"/><path d="M12 7v6M12 9L7 7M12 9l5-2M12 13l-4 7M12 13l4 7"/><path d="M6 6c1.2 1 2.4 1.3 3.5.8M18 6c-1.2 1-2.4 1.3-3.5.8"/>',
    food: '<path d="M6 3v7M3.5 3v4c0 2 1 3 2.5 3s2.5-1 2.5-3V3M6 10v11"/><path d="M15 3v18M15 3c3 1 5 3.5 5 6 0 2.5-2 4-5 4"/>',
    muscle: '<path d="M5 13c1.5-2 3-3 5-3l1-4 2 1-1 4h2c2.5 0 4 1.5 5 4-1 4-4 6-8 6H8c-3 0-5-2-5-5 0-1 .7-2 2-3z"/><path d="M10 10c1 2 3 3 5 3"/>',
    stat: '<path d="M4 20V10h4v10M10 20V5h4v15M16 20v-7h4v7M3 20h18"/>'
  };

  const svg = (key) => `<svg class="flat-icon-svg" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${icons[key]}</svg>`;
  const selector = '.quick-icon,.card-icon,.stat-icon,.service-detail-icon';

  function pick(el) {
    const text = `${el.closest('.card,.quick-card,.stat,.service-detail')?.textContent || ''}`.toLowerCase();
    if (text.includes('berani berusaha')) return 'muscle';
    if (text.includes('terus berkembang')) return 'stat';
    if (text.includes('ruang kelas')) return 'classroom';
    if (text.includes('uks')) return 'medical';
    if (text.includes('area olahraga') || text.includes('hijau & lingkungan')) return 'leaf';
    if (text.includes('fasilitas sanitasi')) return 'toilet';
    if (text.includes('mushola')) return 'mosque';
    if (text.includes('ruang inklusi')) return 'star';
    if (text.includes('ruang kesenian')) return 'traditionalDance';
    if (text.includes('area kantin')) return 'food';
    if (text.includes('karakter')) return 'star';
    if (text.includes('guru') || text.includes('tendik')) return 'human';
    if (text.includes('peserta didik') && el.closest('.stat')) return 'community';
    if (text.includes('jurnal 7 kebiasaan') || text.includes('jurnal 7 kaih')) return 'phoneStylus';
    if (text.includes('pembelajaran')) return 'book';
    if (text.includes('layanan') && el.closest('.quick-card')) return 'hand';
    return null;
  }

  function apply(root = document) {
    const elements = root.matches?.(selector) ? [root] : [...(root.querySelectorAll?.(selector) || [])];
    elements.forEach((el) => {
      const key = pick(el);
      if (!key || !icons[key]) return;
      el.innerHTML = svg(key);
      el.dataset.flatIconKey = `custom-${key}`;
      el.classList.add('flat-icon');
    });
  }

  apply();
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => mutation.addedNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) apply(node);
    }));
  });
  observer.observe(document.body, { childList: true, subtree: true });

  if (!document.body.classList.contains('admin-page') && !document.querySelector('script[data-site-analytics]')) {
    const currentScript = document.querySelector('script[src*="icon-custom.js"]');
    const src = currentScript?.src ? new URL('analytics.js', currentScript.src).href : '../assets/js/analytics.js';
    const analytics = document.createElement('script');
    analytics.src = src;
    analytics.defer = true;
    analytics.dataset.siteAnalytics = 'true';
    document.head.appendChild(analytics);
  }
});

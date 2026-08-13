(() => {
  const icons = {
    service:'<path d="M4 5h16v14H4z"/><path d="M8 9h8M8 13h5"/>',
    announcement:'<path d="M4 11v2l11 4V7L4 11z"/><path d="M15 9c2 0 4-1 5-2v10c-1-1-3-2-5-2M7 14l1 5h3l-1-4"/>',
    calendar:'<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/>',
    document:'<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v5h5M9 12h6M9 16h6"/>',
    gallery:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="9" r="2"/><path d="M4 17l5-5 4 4 3-3 4 4"/>',
    scout:'<path d="M12 3l7 4v5c0 4-3 7-7 9-4-2-7-5-7-9V7z"/><path d="M9 11l2 2 4-4"/>',
    dance:'<circle cx="12" cy="5" r="2"/><path d="M12 7v6M12 9l-4 3M12 9l4 3M12 13l-3 7M12 13l4 6"/>',
    sport:'<circle cx="12" cy="12" r="9"/><path d="M8 5l4 3 4-3M6 14l4-2 4 2 4-2M10 12v5M14 14v4"/>',
    martial:'<path d="M5 6h14v4H5zM8 10v10M16 10v10M6 20h12"/><path d="M10 4h4"/>',
    trophy:'<path d="M8 4h8v5c0 4-2 6-4 6s-4-2-4-6z"/><path d="M8 6H4c0 4 2 6 5 6M16 6h4c0 4-2 6-5 6M12 15v4M8 21h8"/>',
    book:'<path d="M4 5c3-1 5 0 8 2v13c-3-2-5-3-8-2zM20 5c-3-1-5 0-8 2v13c3-2 5-3 8-2z"/>',
    checklist:'<path d="M9 6h11M9 12h11M9 18h11M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2"/>',
    school:'<path d="M3 10l9-6 9 6"/><path d="M5 9v11h14V9M9 20v-6h6v6"/>',
    classroom:'<path d="M4 5h16v12H4z"/><path d="M8 21l4-4 4 4"/>',
    teacher:'<circle cx="9" cy="8" r="3"/><path d="M3 20c0-4 2-7 6-7s6 3 6 7M16 8h5M18.5 5.5v5"/>',
    student:'<circle cx="12" cy="7" r="3"/><path d="M5 21c0-5 3-9 7-9s7 4 7 9"/>',
    location:'<path d="M12 21s7-6 7-12a7 7 0 1 0-14 0c0 6 7 12 7 12z"/><circle cx="12" cy="9" r="2"/>',
    email:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M4 7l8 6 8-6"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v6l4 2"/>',
    character:'<path d="M12 3l2.3 4.7 5.2.8-3.8 3.7.9 5.2-4.6-2.5-4.6 2.5.9-5.2-3.8-3.7 5.2-.8z"/>',
    talent:'<path d="M9 18h6M10 22h4"/><path d="M8 14c-1.3-1.1-2-2.8-2-4.5a6 6 0 1 1 12 0c0 1.7-.7 3.4-2 4.5-1 .9-1.5 1.8-1.5 3h-5c0-1.2-.5-2.1-1.5-3z"/>',
    collaboration:'<circle cx="8" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M2 20c0-4 2.5-7 6-7s6 3 6 7M14 14c3.5 0 6 2.4 6 6"/>'
  };
  const svg = key => `<svg class="flat-icon-svg" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${icons[key] || icons.school}</svg>`;
  const choose = text => {
    const t=(text||'').toLowerCase();
    if(t.includes('pengumuman')) return 'announcement';
    if(t.includes('agenda')||t.includes('kegiatan')) return 'calendar';
    if(t.includes('dokumen')||t.includes('unduh')) return 'document';
    if(t.includes('galeri')||t.includes('foto')) return 'gallery';
    if(t.includes('pramuka')) return 'scout';
    if(t.includes('tari')) return 'dance';
    if(t.includes('pencak')||t.includes('silat')||t.includes('taekwondo')||t.includes('karate')||t.includes('bela diri')) return 'martial';
    if(t.includes('futsal')||t.includes('soccer')||t.includes('olahraga')) return 'sport';
    if(t.includes('prestasi')||t.includes('pencapaian')) return 'trophy';
    if(t.includes('karakter')) return 'character';
    if(t.includes('bakat')||t.includes('potensi')) return 'talent';
    if(t.includes('kolaborasi')||t.includes('kerja sama')) return 'collaboration';
    if(t.includes('alamat')) return 'location';
    if(t.includes('email')) return 'email';
    if(t.includes('jam')||t.includes('waktu')) return 'clock';
    if(t.includes('rombel')||t.includes('kelas')) return 'classroom';
    if(t.includes('guru')||t.includes('tendik')) return 'teacher';
    if(t.includes('peserta didik')||t.includes('siswa')) return 'student';
    if(t.includes('tahun pelajaran')) return 'calendar';
    if(t.includes('jurnal')||t.includes('rekap')) return 'checklist';
    if(t.includes('pembelajaran')||t.includes('belajar')) return 'book';
    if(t.includes('layanan')) return 'service';
    return 'school';
  };
  const selectors='.quick-icon,.card-icon,.stat-icon,.service-detail-icon,.gallery-placeholder-icon';
  const apply = root => {
    const elements=[];
    if(root.nodeType===1 && root.matches?.(selectors)) elements.push(root);
    root.querySelectorAll?.(selectors).forEach(el=>elements.push(el));
    elements.forEach(el=>{
      const owner=el.closest('.quick-card,.card,.stat,.service-detail,.gallery-placeholder,.gallery-item') || el.parentElement;
      const key=choose(owner?.textContent || '');
      if(el.dataset.flatIcon===key) return;
      el.innerHTML=svg(key); el.classList.add('flat-icon'); el.dataset.flatIcon=key;
    });
  };
  const start=()=>{
    apply(document);
    new MutationObserver(mutations=>mutations.forEach(m=>m.addedNodes.forEach(node=>{if(node.nodeType===1) apply(node)}))).observe(document.body,{childList:true,subtree:true});
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start); else start();
})();

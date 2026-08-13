async function loadJson(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Gagal memuat ${path}: HTTP ${response.status}`);
  return response.json();
}

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric'
  }).format(date);
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[char]));
}

function announcementTemplate(item) {
  const file = item.file ? `<a class="text-link" href="${escapeHtml(item.file)}" target="_blank" rel="noopener noreferrer">Lihat dokumen →</a>` : '';
  return `<article class="card content-item"><div class="section-label">${escapeHtml(formatDate(item.tanggal))}</div><h3>${escapeHtml(item.judul)}</h3><p>${escapeHtml(item.ringkasan)}</p>${file}</article>`;
}

function agendaTemplate(item) {
  const date = item.tanggalSelesai && item.tanggalSelesai !== item.tanggalMulai
    ? `${formatDate(item.tanggalMulai)} – ${formatDate(item.tanggalSelesai)}`
    : formatDate(item.tanggalMulai);
  return `<article class="card content-item"><div class="section-label">${escapeHtml(date)}</div><h3>${escapeHtml(item.judul)}</h3><p>${escapeHtml(item.ringkasan)}</p>${item.lokasi ? `<p><strong>Lokasi:</strong> ${escapeHtml(item.lokasi)}</p>` : ''}</article>`;
}

function achievementTemplate(item) {
  return `<article class="card content-item">${item.gambar ? `<img src="${escapeHtml(item.gambar)}" alt="${escapeHtml(item.judul)}" loading="lazy">` : ''}<div class="section-label">${escapeHtml(item.tahun)} · ${escapeHtml(item.tingkat)}</div><h3>${escapeHtml(item.judul)}</h3><p><strong>${escapeHtml(item.peserta)}</strong></p><p>${escapeHtml(item.ringkasan)}</p></article>`;
}

async function renderCollection({ path, selector, template, emptyText }) {
  const target = document.querySelector(selector);
  if (!target) return;
  try {
    const data = await loadJson(path);
    const items = (data.items || []).filter(item => item.status === 'publish' || item.status === 'aktif');
    target.innerHTML = items.length ? items.map(template).join('') : `<div class="card"><p>${escapeHtml(emptyText)}</p></div>`;
  } catch (error) {
    console.error(error);
    target.innerHTML = `<div class="card"><p>Informasi belum dapat dimuat.</p></div>`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderCollection({
    path: 'data/pengumuman.json',
    selector: '[data-content="pengumuman"]',
    template: announcementTemplate,
    emptyText: 'Belum ada pengumuman yang dipublikasikan.'
  });
  renderCollection({
    path: 'data/agenda.json',
    selector: '[data-content="agenda"]',
    template: agendaTemplate,
    emptyText: 'Belum ada agenda yang dipublikasikan.'
  });
  renderCollection({
    path: 'data/prestasi.json',
    selector: '[data-content="prestasi"]',
    template: achievementTemplate,
    emptyText: 'Belum ada prestasi yang dipublikasikan.'
  });
});

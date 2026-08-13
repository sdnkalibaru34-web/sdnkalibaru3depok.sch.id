async function loadJson(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Gagal memuat ${path}: HTTP ${response.status}`);
  return response.json();
}

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
}

function announcementTemplate(item) {
  const file = item.file ? `<a class="text-link" href="${escapeHtml(item.file)}" target="_blank" rel="noopener noreferrer">Lihat dokumen →</a>` : '';
  return `<article class="card content-item"><div class="section-label">${escapeHtml(formatDate(item.tanggal))}</div><h3>${escapeHtml(item.judul)}</h3><p>${escapeHtml(item.ringkasan)}</p>${file}</article>`;
}

function agendaTemplate(item) {
  const date = item.tanggalSelesai && item.tanggalSelesai !== item.tanggalMulai ? `${formatDate(item.tanggalMulai)} – ${formatDate(item.tanggalSelesai)}` : formatDate(item.tanggalMulai);
  return `<article class="card content-item"><div class="section-label">${escapeHtml(date)}</div><h3>${escapeHtml(item.judul)}</h3><p>${escapeHtml(item.ringkasan)}</p>${item.lokasi ? `<p><strong>Lokasi:</strong> ${escapeHtml(item.lokasi)}</p>` : ''}</article>`;
}

function achievementTemplate(item) {
  return `<article class="card content-item">${item.gambar ? `<img src="${escapeHtml(item.gambar)}" alt="${escapeHtml(item.judul)}" loading="lazy">` : ''}<div class="section-label">${escapeHtml(item.tahun)} · ${escapeHtml(item.tingkat)}</div><h3>${escapeHtml(item.judul)}</h3><p><strong>${escapeHtml(item.peserta)}</strong></p><p>${escapeHtml(item.ringkasan)}</p></article>`;
}

function documentTemplate(item) {
  const file = item.file ? `<a class="button" href="${escapeHtml(item.file)}" target="_blank" rel="noopener noreferrer">Buka / Unduh →</a>` : '';
  return `<article class="card content-item"><div class="card-icon">▧</div><div class="section-label">${escapeHtml(item.kategori)}${item.tanggal ? ` · ${escapeHtml(formatDate(item.tanggal))}` : ''}</div><h3>${escapeHtml(item.judul)}</h3><p>${escapeHtml(item.deskripsi)}</p>${file}</article>`;
}

function galleryTemplate(item) {
  const images = Array.isArray(item.gambar) ? item.gambar : [];
  const imageMarkup = images.length ? `<div class="gallery-grid">${images.map((src, index) => `<img src="${escapeHtml(src)}" alt="${escapeHtml(item.judul)} - foto ${index + 1}" loading="lazy">`).join('')}</div>` : '<div class="gallery-placeholder"><div class="gallery-placeholder-icon">▧</div><p>Foto belum tersedia.</p></div>';
  return `<article class="gallery-item"><div class="gallery-caption"><div class="section-label">${escapeHtml(formatDate(item.tanggal))}</div><h3>${escapeHtml(item.judul)}</h3><p>${escapeHtml(item.deskripsi)}</p></div>${imageMarkup}</article>`;
}

function serviceTemplate(item) {
  const button = item.url ? `<a class="button" href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.tombol || 'Buka Layanan')} →</a>` : '';
  return `<article class="card service-card" id="${escapeHtml(item.id)}"><div class="card-icon">✓</div><h3>${escapeHtml(item.judul)}</h3><p>${escapeHtml(item.deskripsi)}</p>${button}</article>`;
}

async function renderCollection({ path, selector, template, emptyText, statuses = ['publish'] }) {
  const target = document.querySelector(selector);
  if (!target) return;
  try {
    const data = await loadJson(path);
    const items = (data.items || []).filter(item => statuses.includes(item.status));
    target.innerHTML = items.length ? items.map(template).join('') : `<div class="card"><p>${escapeHtml(emptyText)}</p></div>`;
  } catch (error) {
    console.error(error);
    target.innerHTML = `<div class="card"><p>Informasi belum dapat dimuat.</p></div>`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderCollection({ path: 'data/pengumuman.json', selector: '[data-content="pengumuman"]', template: announcementTemplate, emptyText: 'Belum ada pengumuman yang dipublikasikan.' });
  renderCollection({ path: 'data/agenda.json', selector: '[data-content="agenda"]', template: agendaTemplate, emptyText: 'Belum ada agenda yang dipublikasikan.' });
  renderCollection({ path: 'data/prestasi.json', selector: '[data-content="prestasi"]', template: achievementTemplate, emptyText: 'Belum ada prestasi yang dipublikasikan.' });
  renderCollection({ path: 'data/dokumen.json', selector: '[data-content="dokumen"]', template: documentTemplate, emptyText: 'Belum ada dokumen yang dipublikasikan.' });
  renderCollection({ path: 'data/galeri.json', selector: '[data-content="galeri"]', template: galleryTemplate, emptyText: 'Belum ada galeri yang dipublikasikan.' });
  renderCollection({ path: 'data/layanan.json', selector: '[data-content="layanan"]', template: serviceTemplate, emptyText: 'Belum ada layanan yang tersedia.', statuses: ['aktif'] });
});

const DATA_ROOT = new URL('../../data/', document.currentScript?.src || `${location.origin}/assets/js/content-loader.js`).href;
const SITE_ROOT = new URL('../../', document.currentScript?.src || `${location.origin}/assets/js/content-loader.js`).href;

async function loadJson(fileName) {
  const response = await fetch(new URL(fileName, DATA_ROOT));
  if (!response.ok) throw new Error(`Gagal memuat ${fileName}: HTTP ${response.status}`);
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

function safeUrl(value, base = document.baseURI) {
  if (!value) return '';
  try {
    const url = new URL(value, base);
    if (url.protocol === 'http:' || url.protocol === 'https:') return url.href;
    return '';
  } catch { return ''; }
}

function contentUrl(value) {
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) return safeUrl(value);
  return safeUrl(String(value).replace(/^\.\//, '').replace(/^\.\.\//, ''), SITE_ROOT);
}

function announcementTemplate(item) {
  const detailUrl = `pengumuman.html?id=${encodeURIComponent(item.id)}`;
  const fileUrl = contentUrl(item.file);
  const file = fileUrl ? `<a class="text-link" href="${escapeHtml(fileUrl)}" target="_blank" rel="noopener noreferrer">Lihat dokumen →</a>` : '';
  return `<article class="card content-item"><div class="section-label">${escapeHtml(formatDate(item.tanggal))}</div><h3><a href="${detailUrl}">${escapeHtml(item.judul)}</a></h3><p>${escapeHtml(item.ringkasan)}</p><p><a class="text-link" href="${detailUrl}">Baca selengkapnya →</a></p>${file}</article>`;
}

function agendaTemplate(item) {
  const detailUrl = `agenda.html?id=${encodeURIComponent(item.id)}`;
  const date = item.tanggalSelesai && item.tanggalSelesai !== item.tanggalMulai ? `${formatDate(item.tanggalMulai)} – ${formatDate(item.tanggalSelesai)}` : formatDate(item.tanggalMulai);
  const image = contentUrl(item.gambar);
  return `<article class="card content-item">${image ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(item.judul)}" loading="lazy">` : ''}<div class="section-label">${escapeHtml(date)}</div><h3><a href="${detailUrl}">${escapeHtml(item.judul)}</a></h3><p>${escapeHtml(item.ringkasan)}</p>${item.lokasi ? `<p><strong>Lokasi:</strong> ${escapeHtml(item.lokasi)}</p>` : ''}<p><a class="text-link" href="${detailUrl}">Lihat detail kegiatan →</a></p></article>`;
}

function achievementTemplate(item) {
  const image = contentUrl(item.gambar);
  return `<article class="card content-item">${image ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(item.judul)}" loading="lazy">` : ''}<div class="section-label">${escapeHtml(item.tahun)} · ${escapeHtml(item.tingkat)}</div><h3>${escapeHtml(item.judul)}</h3><p><strong>${escapeHtml(item.peserta)}</strong></p><p>${escapeHtml(item.ringkasan)}</p></article>`;
}

function documentTemplate(item) {
  const fileUrl = contentUrl(item.file);
  const file = fileUrl ? `<a class="button" href="${escapeHtml(fileUrl)}" target="_blank" rel="noopener noreferrer">Buka / Unduh →</a>` : '';
  return `<article class="card content-item"><div class="card-icon">▧</div><div class="section-label">${escapeHtml(item.kategori)}${item.tanggal ? ` · ${escapeHtml(formatDate(item.tanggal))}` : ''}</div><h3>${escapeHtml(item.judul)}</h3><p>${escapeHtml(item.deskripsi || item.ringkasan || '')}</p>${file}</article>`;
}

function galleryTemplate(item) {
  const images = Array.isArray(item.gambar) ? item.gambar.map(contentUrl).filter(Boolean) : [];
  const imageMarkup = images.length ? `<div class="gallery-grid">${images.map((src, index) => `<img src="${escapeHtml(src)}" alt="${escapeHtml(item.judul)} - foto ${index + 1}" loading="lazy">`).join('')}</div>` : '<div class="gallery-placeholder"><div class="gallery-placeholder-icon">▧</div><p>Foto belum tersedia.</p></div>';
  return `<article class="gallery-item"><div class="gallery-caption"><div class="section-label">${escapeHtml(formatDate(item.tanggal))}</div><h3>${escapeHtml(item.judul)}</h3><p>${escapeHtml(item.deskripsi)}</p></div>${imageMarkup}</article>`;
}

function serviceTemplate(item) {
  const url = safeUrl(item.url);
  const button = url ? `<a class="button" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.tombol || 'Buka Layanan')} →</a>` : '';
  return `<article class="card service-card" id="${escapeHtml(item.id)}"><div class="card-icon">✓</div><h3>${escapeHtml(item.judul)}</h3><p>${escapeHtml(item.deskripsi)}</p>${button}</article>`;
}

async function renderCollection({ fileName, selector, template, emptyText, statuses = ['publish'] }) {
  const target = document.querySelector(selector);
  if (!target) return;
  try {
    const data = await loadJson(fileName);
    const items = (data.items || []).filter(item => statuses.includes(item.status));
    target.innerHTML = items.length ? items.map(template).join('') : `<div class="card"><p>${escapeHtml(emptyText)}</p></div>`;
  } catch (error) {
    console.error(error);
    target.innerHTML = `<div class="card"><p>Informasi belum dapat dimuat.</p></div>`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderCollection({ fileName: 'pengumuman.json', selector: '[data-content="pengumuman"]', template: announcementTemplate, emptyText: 'Belum ada pengumuman yang dipublikasikan.' });
  renderCollection({ fileName: 'agenda.json', selector: '[data-content="agenda"]', template: agendaTemplate, emptyText: 'Belum ada agenda yang dipublikasikan.' });
  renderCollection({ fileName: 'prestasi.json', selector: '[data-content="prestasi"]', template: achievementTemplate, emptyText: 'Belum ada prestasi yang dipublikasikan.' });
  renderCollection({ fileName: 'dokumen.json', selector: '[data-content="dokumen"]', template: documentTemplate, emptyText: 'Belum ada dokumen yang dipublikasikan.' });
  renderCollection({ fileName: 'galeri.json', selector: '[data-content="galeri"]', template: galleryTemplate, emptyText: 'Belum ada galeri yang dipublikasikan.' });
  renderCollection({ fileName: 'layanan.json', selector: '[data-content="layanan"]', template: serviceTemplate, emptyText: 'Belum ada layanan yang tersedia.', statuses: ['aktif'] });
});

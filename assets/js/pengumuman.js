const DATA_ROOT_PENGUMUMAN = new URL('../../data/', document.currentScript?.src || `${location.origin}/assets/js/pengumuman.js`).href;
const SITE_ROOT_PENGUMUMAN = new URL('../../', document.currentScript?.src || `${location.origin}/assets/js/pengumuman.js`).href;

function formatDatePengumuman(dateString) {
  if (!dateString) return '';
  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
}

function escapePengumuman(value) {
  return String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
}

function safePengumumanUrl(value, base = document.baseURI) {
  if (!value) return '';
  try {
    const url = new URL(value, base);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
  } catch { return ''; }
}

async function loadAnnouncementDetail() {
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const title = document.querySelector('#announcement-title');
  const date = document.querySelector('#announcement-date');
  const detail = document.querySelector('#announcement-detail');

  if (!id) {
    title.textContent = 'Pengumuman tidak ditemukan';
    date.textContent = '';
    detail.innerHTML = '<p>Link pengumuman tidak memiliki ID yang valid.</p>';
    return;
  }

  try {
    const response = await fetch(new URL('pengumuman.json', DATA_ROOT_PENGUMUMAN));
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    const item = (data.items || []).find(entry => entry.id === id && entry.status === 'publish');

    if (!item) {
      title.textContent = 'Pengumuman tidak ditemukan';
      date.textContent = '';
      detail.innerHTML = '<p>Pengumuman yang kamu cari belum tersedia atau tidak sedang dipublikasikan.</p>';
      return;
    }

    title.textContent = item.judul || 'Pengumuman sekolah';
    date.textContent = formatDatePengumuman(item.tanggal);

    const imageUrl = safePengumumanUrl(item.gambar, SITE_ROOT_PENGUMUMAN);
    const image = imageUrl ? `<p style="text-align:center"><img src="${escapePengumuman(imageUrl)}" alt="Gambar pengumuman" style="max-width:100%;height:auto;border-radius:18px"></p>` : '';
    const paragraphs = item.isi ? String(item.isi).split(/\n\s*\n/).map(p => `<p>${escapePengumuman(p).replace(/\n/g, '<br>')}</p>`).join('') : `<p>${escapePengumuman(item.ringkasan || '')}</p>`;
    const file = safePengumumanUrl(item.file, SITE_ROOT_PENGUMUMAN) ? `<p><a class="button" href="${escapePengumuman(safePengumumanUrl(item.file, SITE_ROOT_PENGUMUMAN))}" target="_blank" rel="noopener noreferrer">Buka dokumen / undangan →</a></p>` : '';
    detail.innerHTML = `${image}${paragraphs}${file}`;
  } catch (error) {
    console.error('Pengumuman gagal dimuat:', error);
    title.textContent = 'Pengumuman tidak dapat dimuat';
    date.textContent = '';
    detail.innerHTML = '<p>Terjadi kendala saat memuat pengumuman. Silakan coba lagi.</p>';
  }
}

document.addEventListener('DOMContentLoaded', loadAnnouncementDetail);

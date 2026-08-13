const DATA_ROOT_AGENDA = new URL('../../data/', document.currentScript?.src || `${location.origin}/assets/js/agenda.js`).href;

function formatDateAgenda(dateString) {
  if (!dateString) return '';
  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
}

function escapeAgenda(value) {
  return String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
}

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const title = document.querySelector('#agenda-title');
  const date = document.querySelector('#agenda-date');
  const detail = document.querySelector('#agenda-detail');
  if (!id) {
    title.textContent = 'Agenda tidak ditemukan';
    detail.innerHTML = '<p>Link agenda tidak memiliki ID yang valid.</p>';
    return;
  }
  try {
    const response = await fetch(new URL('agenda.json', DATA_ROOT_AGENDA));
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    const item = (data.items || []).find(entry => entry.id === id && entry.status === 'publish');
    if (!item) {
      title.textContent = 'Agenda tidak ditemukan';
      date.textContent = '';
      detail.innerHTML = '<p>Agenda yang kamu cari belum tersedia atau tidak sedang dipublikasikan.</p>';
      return;
    }
    title.textContent = item.judul || 'Agenda sekolah';
    const dateText = item.tanggalSelesai && item.tanggalSelesai !== item.tanggalMulai ? `${formatDateAgenda(item.tanggalMulai)} – ${formatDateAgenda(item.tanggalSelesai)}` : formatDateAgenda(item.tanggalMulai);
    date.textContent = dateText;
    const location = item.lokasi ? `<p><strong>Lokasi:</strong> ${escapeAgenda(item.lokasi)}</p>` : '';
    const body = item.isi ? String(item.isi).split(/\n\s*\n/).map(p => `<p>${escapeAgenda(p).replace(/\n/g, '<br>')}</p>`).join('') : `<p>${escapeAgenda(item.ringkasan || '')}</p>`;
    detail.innerHTML = `${body}${location}`;
  } catch (error) {
    console.error('Agenda gagal dimuat:', error);
    title.textContent = 'Agenda tidak dapat dimuat';
    detail.innerHTML = '<p>Terjadi kendala saat memuat agenda. Silakan coba lagi.</p>';
  }
});

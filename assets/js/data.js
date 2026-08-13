function getDataFileUrl(fileName) {
  const script = document.querySelector('script[src*="assets/js/data.js"]');
  if (script?.src) {
    return new URL(`../../data/${fileName}`, new URL(script.src, document.baseURI)).href;
  }
  return new URL(`data/${fileName}`, document.baseURI).href;
}

// Muat ikon flat global untuk semua halaman yang menggunakan data.js.
(() => {
  if (document.querySelector('script[data-flat-icons-global]')) return;
  const current = document.querySelector('script[src*="assets/js/data.js"]');
  const root = current?.src ? new URL('../../', current.src) : new URL('./', document.baseURI);
  const script = document.createElement('script');
  script.src = new URL('assets/js/flat-icons.js', root).href;
  script.defer = true;
  script.dataset.flatIconsGlobal = 'true';
  document.head.appendChild(script);
})();

async function loadSchoolData() {
  try {
    const response = await fetch(getDataFileUrl('sekolah.json'));
    if (!response.ok) throw new Error(`Gagal memuat data sekolah: HTTP ${response.status}`);
    const data = await response.json();

    document.querySelectorAll('[data-school]').forEach((element) => {
      const key = element.dataset.school;
      const value = key.split('.').reduce((current, part) => current?.[part], data);
      if (value !== null && value !== undefined && value !== '') element.textContent = value;
    });

    document.querySelectorAll('[data-school-href], [data-school-link]').forEach((element) => {
      const key = element.dataset.schoolHref || element.dataset.schoolLink;
      const value = key.split('.').reduce((current, part) => current?.[part], data);
      if (value) {
        element.href = value;
        element.target = '_blank';
        element.rel = 'noopener noreferrer';
      }
    });

    document.querySelectorAll('[data-school-email]').forEach((element) => {
      if (data.email) element.href = `mailto:${data.email}`;
      else element.hidden = true;
    });

    const stats = document.querySelectorAll('.stats .stat');
    if (stats.length >= 4) {
      const values = [data.tahunPelajaran, data.jumlahRombel, data.jumlahGuruTendik, data.jumlahPesertaDidik];
      stats.forEach((stat, index) => {
        const value = values[index];
        const number = stat.querySelector('h3');
        if (number && value !== null && value !== undefined && value !== '') number.textContent = value;
      });
    }

    const quote = document.querySelector('.quote p');
    if (quote && data.quote) quote.textContent = data.quote;
    const quoteAuthor = document.querySelector('.quote span');
    if (quoteAuthor && data.nama) quoteAuthor.textContent = data.nama;

    const contactCards = document.querySelectorAll('.contact .card');
    if (contactCards.length >= 3) {
      const address = contactCards[0].querySelector('p');
      const maps = contactCards[0].querySelector('a');
      if (address && data.alamat) address.textContent = data.alamat;
      if (maps && data.googleMaps) { maps.href = data.googleMaps; maps.target = '_blank'; maps.rel = 'noopener noreferrer'; }
      const emailText = contactCards[1].querySelector('p');
      const emailLink = contactCards[1].querySelector('a');
      if (data.email) { if (emailText) emailText.textContent = data.email; if (emailLink) emailLink.href = `mailto:${data.email}`; }
      else { if (emailText) emailText.textContent = 'Email resmi sekolah belum tersedia.'; if (emailLink) emailLink.hidden = true; }
      const serviceHours = contactCards[2].querySelector('p');
      if (serviceHours && data.jamLayanan) serviceHours.textContent = data.jamLayanan;
    }

    const footerAddress = document.querySelector('.footer-address');
    if (footerAddress && data.alamat) footerAddress.textContent = data.alamat;
  } catch (error) { console.error('Data sekolah gagal dimuat:', error); }
}

document.addEventListener('DOMContentLoaded', loadSchoolData);
document.addEventListener('DOMContentLoaded', () => {
  const year = document.querySelector('[data-current-year]');
  if (year) year.textContent = new Date().getFullYear();
});

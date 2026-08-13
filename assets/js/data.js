async function loadSchoolData() {
  try {
    const response = await fetch('data/sekolah.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    // Elemen yang sudah diberi atribut data-school
    document.querySelectorAll('[data-school]').forEach((element) => {
      const key = element.dataset.school;
      const value = key.split('.').reduce((current, part) => current?.[part], data);
      if (value !== null && value !== undefined && value !== '') {
        element.textContent = value;
      }
    });

    document.querySelectorAll('[data-school-href]').forEach((element) => {
      const key = element.dataset.schoolHref;
      const value = key.split('.').reduce((current, part) => current?.[part], data);
      if (value) element.href = value;
    });

    // Kompatibel dengan index.html yang sedang aktif sebelum seluruh elemen
    // diubah ke atribut data-school pada tahap berikutnya.
    const stats = document.querySelectorAll('.stats .stat');
    if (stats.length >= 4) {
      const values = [data.tahunPelajaran, data.jumlahRombel, data.jumlahGuruTendik, data.jumlahPesertaDidik];
      stats.forEach((stat, index) => {
        const value = values[index];
        const number = stat.querySelector('h3');
        if (number && value !== null && value !== undefined && value !== '') {
          number.textContent = value;
        }
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
      if (maps && data.googleMaps) maps.href = data.googleMaps;

      const emailText = contactCards[1].querySelector('p');
      const emailLink = contactCards[1].querySelector('a');
      if (emailText && data.email) emailText.textContent = data.email;
      if (emailLink && data.email) emailLink.href = `mailto:${data.email}`;

      const serviceHours = contactCards[2].querySelector('p');
      if (serviceHours && data.jamLayanan) serviceHours.textContent = data.jamLayanan;
    }

    const footerAddress = document.querySelector('.footer-address');
    if (footerAddress && data.alamat) footerAddress.textContent = data.alamat;
  } catch (error) {
    console.error('Data sekolah gagal dimuat:', error);
  }
}

document.addEventListener('DOMContentLoaded', loadSchoolData);

async function loadSchoolData() {
  try {
    const response = await fetch('data/sekolah.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

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
  } catch (error) {
    console.error('Data sekolah gagal dimuat:', error);
  }
}

document.addEventListener('DOMContentLoaded', loadSchoolData);

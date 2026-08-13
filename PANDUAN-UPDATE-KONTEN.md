# Panduan Update Konten Website SDN Kalibaru 3 Depok

Website menggunakan data terpisah dari HTML. Untuk update konten rutin, **jangan mengubah file HTML, CSS, atau JavaScript**.

## 1. Pengumuman

File: `data/pengumuman.json`

- Tambahkan satu item baru.
- Upload PDF ke `assets/dokumen/pengumuman/` jika diperlukan.
- Gunakan `status: "publish"` agar tampil di website.
- Gunakan `status: "draft"` jika belum ingin ditampilkan.

## 2. Agenda & Kegiatan

File: `data/agenda.json`

- Tambahkan agenda baru.
- Isi tanggal mulai
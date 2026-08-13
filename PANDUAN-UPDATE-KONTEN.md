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
- Isi tanggal mulai dan tanggal selesai bila kegiatan berlangsung lebih dari satu hari.
- Isi lokasi bila diperlukan.
- Gunakan `status: "publish"` untuk menampilkan.

## 3. Dokumen & Unduhan

File: `data/dokumen.json`

- Upload PDF ke folder `assets/dokumen/` yang sesuai.
- Masukkan path file pada properti `file`.
- Gunakan `status: "publish"` untuk menampilkan.

## 4. Galeri

File: `data/galeri.json`

- Upload foto ke `assets/images/galeri/`.
- Masukkan beberapa path foto ke array `gambar`.
- Gunakan `status: "publish"` untuk menampilkan.

## 5. Prestasi

File: `data/prestasi.json`

- Tambahkan prestasi baru.
- Isi nama peserta/tim, tingkat, tahun, dan ringkasan.
- Foto prestasi bersifat opsional.
- Gunakan `status: "publish"` untuk menampilkan.

## 6. Layanan

File: `data/layanan.json`

- Edit URL layanan pada properti `url`.
- Ubah teks tombol pada properti `tombol` bila diperlukan.
- Gunakan `status: "aktif"` agar layanan tampil.

## 7. Prinsip status

- `publish` = konten publik.
- `draft` = konten disimpan tetapi tidak ditampilkan.
- `aktif` = layanan aktif dan ditampilkan.

## Catatan

Setelah perubahan disimpan di branch `develop`, tunggu GitHub Pages selesai melakukan deployment. Jangan mengubah file inti website kecuali memang sedang melakukan pengembangan sistem.

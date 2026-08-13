# Panduan Mengelola Website SDN Kalibaru 3 Depok

Website dirancang agar pembaruan konten sebisa mungkin dilakukan tanpa mengubah HTML, CSS, atau JavaScript.

## Struktur utama

- `index.html` — beranda
- `halaman/` — halaman profil, informasi, ekstrakurikuler, prestasi, dan layanan
- `data/` — data yang dibaca otomatis oleh website
- `konten/` — file PDF dan gambar konten
- `assets/` — CSS, JavaScript, dan aset gambar sistem

## Jika ingin mengubah data sekolah

Edit `data/sekolah.json`.

Data yang tersedia antara lain:

- nama sekolah
- jenjang
- status
- tahun pelajaran
- jumlah rombel
- jumlah guru dan tendik
- jumlah peserta didik
- alamat
- email
- jam layanan
- Google Maps
- deskripsi singkat
- quote
- sambutan
- visi
- misi

## Menambah pengumuman

1. Upload file lampiran ke `konten/pengumuman/` jika ada.
2. Tambahkan satu item pada `data/pengumuman.json`.
3. Gunakan `status: "publish"` agar tampil.

## Menambah agenda

Tambahkan item pada `data/agenda.json` dan gunakan `status: "publish"`.

## Menambah prestasi

Tambahkan item pada `data/prestasi.json`. Jika menggunakan foto, simpan foto di `konten/prestasi/` dan masukkan path file pada field `gambar`.

## Menambah dokumen

1. Upload PDF ke `konten/dokumen/`.
2. Tambahkan item pada `data/dokumen.json`.
3. Isi field `file` dengan lokasi PDF.
4. Gunakan `status: "publish"`.

## Menambah galeri

1. Upload foto ke `konten/galeri/`.
2. Tambahkan item pada `data/galeri.json`.
3. Masukkan daftar path foto pada field `gambar`.
4. Gunakan `status: "publish"`.

## Mengubah link layanan

Edit `data/layanan.json`. Cukup ubah nilai `url`; halaman layanan tidak perlu diedit.

## Status konten

- `publish` — tampil di website
- `draft` — disimpan tetapi tidak ditampilkan
- `aktif` — digunakan untuk layanan

## Catatan penting

Untuk saat ini website dikerjakan di branch `develop`. Jangan mengubah struktur `assets/js`, `assets/css`, atau HTML utama jika hanya ingin memperbarui isi website.

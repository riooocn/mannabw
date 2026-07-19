# Manna Blessingwear - E-Commerce Platform

Sistem ini terbagi menjadi dua bagian utama: **Backend (Laravel)** dan **Frontend (Next.js)**. Untuk menjalankan proyek ini secara lokal, Anda perlu menjalankan kedua server tersebut di dua terminal yang berbeda.

## Prasyarat
Pastikan Anda sudah menginstal:
- PHP (v8.2+) dan Composer
- Node.js (v20+) dan npm
- MySQL Server

---

## 1. Menjalankan Backend (Laravel)

Buka terminal pertama, lalu arahkan ke folder `backend`:
```bash
cd /Users/macintoshhd/Documents/mannabw/backend
```

Karena kita menggunakan Laravel 11, Anda dapat menyalakan server *development* menggunakan Artisan:
```bash
php artisan serve
```
*Secara default, API akan berjalan di `http://127.0.0.1:8000`.*

---

## 2. Menjalankan Frontend (Next.js)

Buka terminal kedua, lalu arahkan ke folder `frontend`:
```bash
cd /Users/macintoshhd/Documents/mannabw/frontend
```

Jalankan server *development* Next.js:
```bash
npm run dev
```
*Secara default, website akan berjalan di `http://localhost:3000`.*

---

## Cara Mengakses Website
Setelah kedua server berjalan:
1. Buka browser Anda.
2. Akses **[http://localhost:3000](http://localhost:3000)** untuk melihat tampilan antarmuka pelanggan (Frontend).

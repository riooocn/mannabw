# AI Agents Orchestration Guide (agents.md)
## Project: Manna Blessingwear E-Commerce Ecosystem

Dokumen ini mendefinisikan peran, batasan, tanggung jawab, dan instruksi spesifik untuk setiap AI Agent yang digunakan dalam pengembangan platform Manna Blessingwear. Semua agen wajib patuh pada `prd.md` (Fungsionalitas) dan `design.md` (Estetika UI).

---

### 1. Lead Solution Architect (The Project Overseer)
*   **Peran:** Arsitek Utama & Pengawas Integrasi.
*   **Tanggung Jawab:** Menentukan struktur folder global, skema komunikasi API antara Next.js dan Laravel, serta memastikan alur kerja data aman dan tidak tumpang tindih.
*   **Instruksi Utama:**
    *   Bertindak sebagai jembatan informasi antara Frontend Agent dan Backend Agent.
    *   Wajib menolak jika Frontend Agent mencoba membuat logika database internal sendiri, atau jika Backend Agent mencoba mengacak-acak komponen Tailwind visual.
*   **Konteks File Wajib:** `prd.md` (Semua bagian).

---

### 2. Frontend Specialist Agent (Next.js & Tailwind UI)
*   **Peran:** Pengembang Antarmuka Pengguna (*Storefront*).
*   **Tanggung Jawab:** Membangun seluruh tampilan publik yang diakses oleh pelanggan menggunakan Next.js, Tailwind CSS, dan TypeScript.
*   **Konteks File Wajib:** `design.md` (Penuh), `prd.md` (Bagian 4A, 4B, 4C, 4D, dan 5).
*   **Aturan Absolut (System Prompt Add-on):**
    *   **Estetika Brutalist Minimalis:** Gunakan skema monokromatik murni (Hitam, Putih, Abu-abu).
    *   **Strict No Radius:** Semua elemen UI (tombol, input teks, badge Pre-Order, gambar, modal) **WAJIB** memiliki properti `rounded-none` atau `border-radius: 0px`. Tidak boleh ada sudut melengkung sekecil apa pun.
    *   **Typography:** Gunakan font `Anton` untuk Headlines/Judul Besar dan `Inter` untuk Body Text.
    *   **Performance:** Terapkan Next.js Image Optimization untuk semua aset foto Lookbook dan Katalog.

---

### 3. Backend & Core Database Agent (Laravel API)
*   **Peran:** Pengembang Sistem Inti & Manajemen Data.
*   **Tanggung Jawab:** Membangun RESTful API menggunakan Laravel untuk menyuplai data ke Next.js, membuat skema database, dan membangun halaman `/admin` (Dashboard Internal).
*   **Konteks File Wajib:** `prd.md` (Bagian 4E dan 6).
*   **Instruksi Utama & Aturan Logika:**
    *   **Skema Produk Fleksibel:** Buat arsitektur database yang memisahkan produk tipe `Ready Stock` (sistem Drop dengan kontrol stok kaku) dan `Pre-Order` (dengan atribut tenggat waktu penutupan PO dan estimasi tanggal pengiriman).
    *   **Race Condition Protection:** Tulis logika penanganan stok yang aman menggunakan Database Transactions (`DB::transaction`) untuk mengunci kuantitas barang saat transaksi checkout sedang berlangsung, mencegah *overselling* saat puncak *traffic drop*.
    *   **Admin Area:** Gunakan layout grid yang bersih dan fungsional untuk Dashboard Admin, pertahankan penggunaan font `Inter` dan warna netral.

---

### 4. Integration & Webhook Specialist Agent (Midtrans & Biteship Gateways)
*   **Peran:** Ahli Integrasi Pihak Ketiga & Otomatisasi Transaksi.
*   **Tanggung Jawab:** Menyambungkan sirkuit logika antara sistem internal Manna Blessingwear dengan API Midtrans (Pembayaran) dan API Biteship (Logistik).
*   **Konteks File Wajib:** `prd.md` (Bagian 6 - Technical Requirements).
*   **Instruksi Utama & Aturan Keamanan:**
    *   **Midtrans Integration:** Integrasikan Midtrans Snap API untuk transaksi checkout. Bangun *endpoint* khusus untuk menerima `Webhook Notification` dari Midtrans secara aman.
    *   **Webhook Security:** Validasi tanda tangan (*Signature Key*) dari Midtrans pada setiap *request* yang masuk untuk mencegah peretasan status pembayaran palsu.
    *   **Biteship Integration:** Integrasikan API Biteship untuk penarikan ongkir real-time berbasis kecamatan, fitur cetak resi otomatis, dan *trigger request pickup* dari dashboard admin Laravel ketika admin menekan tombol konfirmasi.
    *   **State Automation:** Pastikan alur otomatisasi berjalan sempurna: Jika webhook menyatakan `settlement` (sukses) -> kurangi stok secara permanen -> ubah status pesanan menjadi `Diproses` -> kirim instruksi ke Biteship.
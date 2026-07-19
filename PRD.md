# Product Requirement Document (PRD)
## Project: Manna Blessingwear E-Commerce Platform

---

### 1. Informasi Dokumen (Meta Information)
*   **Nama Proyek:** Platform E-Commerce Manna Blessingwear (mannabw)
*   **Versi:** 1.3 (Updated with Biteship Logistics & Pre-Order System)
*   **Status:** Draft
*   **Target Peluncuran:** Q3 2026

---

### 2. Ringkasan Produk (Product Overview)
Dokumen ini mendefinisikan kebutuhan untuk membangun platform *digital storefront* (website e-commerce) kustom untuk Manna Blessingwear. 

Visi utama dari platform ini adalah menciptakan ruang belanja digital yang tidak hanya berfungsi sebagai alat transaksi, tetapi juga sebagai perpanjangan dari identitas visual brand yang bermakna, premium, dan beraliran *bold minimalism*. Website ini dirancang untuk memberikan pengalaman berbelanja yang eksklusif, bersih, dan sangat cepat bagi pengguna (Front-End), sekaligus menyediakan sistem pengelolaan yang kuat dan efisien bagi tim internal melalui Dashboard Admin (Back-End).

---

### 3. Target Pengguna (Target Audience)
*   **Pengguna Akhir (Pelanggan):** *Urban trendsetters* berusia 16–35 tahun yang menghargai estetika *high-fashion* serta filosofi "less is more". Mereka mayoritas menggunakan perangkat *mobile* dan menyukai proses transaksi yang cepat.
*   **Pengguna Internal (Admin/Tim Mannabw):** Tim operasional, pemilik brand, dan tim logistik yang mengelola stok pakaian, memproses pengiriman, dan mengatur konten visual website.

---

### 4. Fitur Utama (Key Features)

#### A. Sistem Rilis Produk & Penjualan
1.  **Sistem Rilis Produk (*The Drop System - Ready Stock*):**
    *   *Countdown Timer:* Menampilkan jam hitung mundur di halaman utama sebelum koleksi baru dirilis untuk membangun efek urgensi (*hype*).
    *   *Otomatisasi Stok:* Tombol beli otomatis aktif dan status berubah dari "Coming Soon" menjadi "Add to Cart" tepat saat hitung mundur menyentuh angka nol.
2.  **Sistem Pre-Order (PO):**
    *   *Tagging Khusus:* Produk PO akan memiliki label/badge bertuliskan "PRE-ORDER" di katalog.
    *   *Estimasi Pengiriman:* Halaman Detail Produk (PDP) wajib menampilkan teks informasi transparan mengenai tanggal penutupan PO dan estimasi waktu selesai produksi/pengiriman (Contoh: *"Estimated Shipping: 14-21 Working Days"*).
    *   *Tombol Dinamis:* Tombol "Add to Cart" otomatis berubah teks menjadi **"Pre-Order Now"** khusus untuk item PO.

#### B. Galeri Lookbook Editorial
*   **Tampilan Full-Screen:** Halaman khusus yang menyajikan foto model dan produk berskala besar dengan tata letak editorial layaknya majalah mode fisik.
*   **Interactive Tagging:** Pengguna bisa langsung mengklik produk yang dipakai oleh model di dalam foto untuk masuk ke halaman detail produk.

#### C. Katalog & Detail Produk (PLP & PDP)
*   **Struktur Grid Kaku:** Produk disusun dalam *grid* 12 kolom (desktop) atau 4 kolom (mobile) yang dipisahkan oleh garis hitam tegas 1px.
*   **Tabel Panduan Ukuran (*Size Chart*):** Disajikan dalam bentuk tabel teknis minimalis menggunakan garis pembatas hitam 1px untuk akurasi ukuran *streetwear*.

#### D. Keranjang & Checkout Minimalis
*   **Single-Page Checkout:** Proses pengisian data pengiriman dan pembayaran disederhanakan dalam satu halaman untuk mengurangi risiko *cart abandonment* saat *traffic* tinggi.
*   **Kalkulator Ongkir Otomatis:** Menghitung ongkos kirim secara real-time berdasarkan alamat kecamatan pembeli dan berat total produk.
*   **Integrasi Pembayaran Otomatis:** Mengintegrasikan metode pembayaran instan via Midtrans (pembeli tidak perlu mengirim foto bukti transfer). Untuk item PO, pembayaran tetap dilakukan penuh (Full Payment) di awal.

#### E. Dashboard Admin (Back-End Management)
*   **Manajemen Produk & Drop/PO:** 
    *   Modul untuk menambah/mengubah produk dengan pilihan tipe: **Ready Stock** atau **Pre-Order**.
    *   Jika memilih tipe Pre-Order, admin wajib mengisi kolom: Batas Kuota (opsional), Tanggal Penutupan PO, dan Estimasi Tanggal Pengiriman paket.
*   **Manajemen Inventaris Real-Time:** Pelacakan stok per varian ukuran (S, M, L, XL) dan sistem proteksi stok saat *checkout*. Khusus produk PO, sistem akan melacak total slot pesanan yang masuk untuk diserahkan ke vendor konveksi/produksi.
*   **Manajemen Logistik & Pengiriman (Biteship Integration):**
    *   *Pemisahan Kategori Order:* Memisahkan daftar pesanan yang harus segera dikirim (Ready Stock) dan pesanan yang sedang menunggu masa produksi selesai (Pre-Order).
    *   *One-Click Shipping Label:* Tombol cetak resi otomatis dengan format label pengiriman standar kurir langsung dari dashboard.
    *   *Request Pickup:* Fitur untuk memanggil kurir ekspedisi ke gudang Mannabw tanpa perlu input manual ke aplikasi kurir pihak ketiga.
*   **Content Management System (CMS):** Fitur untuk mengganti foto utama halaman depan dan galeri Lookbook.
*   **Analitik Penjualan Singkat:** Grafik pendapatan real-time dan performa penjualan saat *drop* atau *batch* PO.

---

### 5. Kebutuhan Desain & UX (Design Requirements)
Desain antarmuka (UI) wajib merujuk dan patuh sepenuhnya pada file `design.md`:
*   **Sisi Pelanggan (Front-End):** Menggunakan monokromatik murni (Hitam & Putih), sudut tajam mutlak **0px border radius** pada semua tombol, input, dan badge "Pre-Order", serta font **Anton** untuk judul dan **Inter** untuk teks utama.
*   **Sisi Admin (Dashboard):** Menggunakan layout grid standar yang bersih dan rapi demi fungsionalitas kerja tim internal, dengan elemen font **Inter** dan warna netral (Putih, Abu-abu, Hitam).

---

### 6. Kebutuhan Teknis (Technical Requirements)
*   **Arsitektur Headless/Jamstack:** Menggunakan frontend kustom (Next.js) yang terhubung ke backend e-commerce (Shopify API atau MedusaJS).
*   **Spesifikasi Integrasi Payment Gateway (Midtrans):**
    *   Menggunakan Midtrans Snap API.
    *   Metode Pembayaran: QRIS, Virtual Account (BCA, Mandiri, BNI, BRI), OVO Push Payment, dan Kartu Kredit.
    *   Sistem Webhook untuk sinkronisasi otomatis status pembayaran instan.
*   **Spesifikasi Integrasi Logistik (Biteship API):**
    *   *Address Autocomplete:* Integrasi API kurir untuk memastikan database nama kota dan kecamatan yang diinput pembeli 100% akurat.
    *   *Real-Time Rates:* Sistem otomatis menarik tarif ongkir terkini untuk ekspedisi utama Indonesia (JNE, J&T, Sicepat, Anteraja, GoSend/Grab jika dalam kota).
    *   *Tracking Sync:* Menyinkronkan nomor resi yang terbit dari Biteship ke sistem web, sehingga status pelacakan paket (Kurir Menuju Lokasi -> Paket Dikirim -> Paket Diterima) tampil transparan di halaman akun pembeli.
*   **Optimasi Gambar:** Menggunakan format WebP/AVIF dan fitur *lazy loading* (< 2.5 detik).
*   **Skalabilitas Server:** Infrastruktur server harus mampu menahan lonjakan *traffic* mendadak hingga 500% saat menit pertama *drop* produk dimulai.

---

### 7. Metrik Kesuksesan (Success Metrics / KPIs)
*   **Page Load Time:** Kecepatan muat halaman di mobile rata-rata < 2.5 detik.
*   **Conversion Rate:** Target konversi minimal 2.5% dari total pengunjung unik.
*   **Overselling Rate:** 0% kasus *overselling* baik pada produk Ready Stock maupun kuota Pre-Order.
*   **Logistics Accuracy:** 100% kecocokan harga ongkir yang dibayar pelanggan dengan tarif asli dari ekspedisi yang ditagihkan via Biteship.
*   **Fulfillment Efficiency:** 
    *   Produk Ready Stock: Siap dikirim dalam < 24 jam setelah pembayaran sukses.
    *   Produk Pre-Order: Siap dikirim maksimal H+2 setelah tanggal estimasi produksi selesai yang tertera di web.
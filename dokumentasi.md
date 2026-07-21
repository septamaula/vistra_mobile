# Dokumentasi Vista Mobile (SFA)

## Flow Kunjungan (Visit Execution)

Ketika *salesman* menekan tombol **"Mulai Visit"** (Check-in) pada sebuah outlet di halaman Rencana Kunjungan, sistem akan mengarahkan pengguna ke Ruang Eksekusi (*Visit Execution*). 

Dalam tahapan ini, *salesman* wajib dan dapat menjalankan serangkaian tugas/aktivitas operasional berikut:

1. **Absensi & Geotagging (Check-in)** 
   Otomatis mencatat waktu kedatangan dan melakukan verifikasi radius/jarak kordinat GPS *sales* dengan kordinat toko untuk memastikan kunjungan benar-benar dilakukan di lokasi fisik (mencegah *fraud*).

2. **Cek Stok (Stock Checking / Inventory)**
   Formulir pendataan sisa stok produk (Stock on Hand) yang masih ada di rak pajangan maupun di gudang toko. Data ini menjadi parameter krusial untuk menghasilkan rekomendasi kuantitas pemesanan berikutnya.

3. **Pemesanan Barang (Sales Order / Taking Order)** 
   Katalog digital dan keranjang belanja untuk menginput daftar pesanan (*Purchase Order*) dari pemilik toko. 

4. **Merchandising & Planogram (Visual)** 
   Modul pengambilan dokumentasi foto untuk memverifikasi tingkat visibilitas produk di rak pajangan, serta mencatat kepatuhan pemasangan materi promosi (stiker, poster, dsb).

5. **Penagihan (Collection / AR)** 
   Modul finansial untuk menagih sisa hutang/piutang toko yang telah jatuh tempo, serta mencatat detail pembayaran yang diterima dari pihak toko.

6. **Retur Barang (Return/BS)**
   Pencatatan penarikan atau penukaran produk yang rusak, kedaluwarsa (*expired*), atau mengalami cacat produksi (*Bad Stock*).

7. **Laporan Kompetitor (Market Intelligence)**
   Catatan aktivitas kompetitor di lapangan, seperti kehadiran produk baru, strategi diskon harga, atau promo khusus dari merek pesaing.

8. **Check-out (Akhiri Kunjungan)** 
   Tahapan final untuk merangkum hasil keseluruhan kunjungan, mencatatkan alasan spesifik jika toko tidak jadi memesan barang (*Reason No Order*), dan merekam waktu penyelesaian (*time-out*) agar kunjungan disahkan sebagai 'Selesai'.

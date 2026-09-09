# SIMBION FILM — Checkpoint Version Log

Dokumentasi riwayat versi kode proyek SIMBION Film. Setiap perubahan kode dicatat di sini dan file cadangannya disimpan dalam folder `checkpoints/v{NOMOR}/`.

---

## [V1] - Checkpoint Awal (Stabil & Teroptimasi)
* **Tanggal**: 9 September 2026
* **Status**: Versi stabil dasar (Baseline)
* **Folder Backup**: `checkpoints/v1/`
* **Catatan & Fitur**:
  1. **Aset Foto BTS Teroptimasi**: Foto BTS dimuat langsung dari Supabase Storage CDN (`https://emjwdjdzbatvzljsouav.supabase.co/storage/v1/object/public/web%20asset/bts/${imgIndex}.webp`).
  2. **Struktur Proyek Bersih**: Tidak ada duplikasi file foto lokal, ukuran proyek sangat ringan (~500 KB).
  3. **GSAP & Scroll Halus**:
     - `gsap.ticker.lagSmoothing(500, 33)` aktif untuk mencegah animasi melompat/patah-patah.
     - `smoothTouch: false` pada Lenis untuk mendukung scroll alami hardware pada perangkat sentuh/HP.
  4. **Kursor Akselerasi GPU**:
     - Posisi kursor digerakkan dengan `transform: translate3d(...)` dan `requestAnimationFrame` untuk respon instan tanpa reflow layout.
  5. **Carousel 3D BTS Ringan**:
     - Bayangan kartu dioptimasi ke `shadow-md` untuk mengurangi beban GPU.
     - Kalkulasi opasitas kedalaman di-throttle terjadwal agar perputaran ring 3D stabil di 60 FPS.

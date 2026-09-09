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

---

## [V2] - Peningkatan Carousel 3D BTS Sinematik & Responsif
* **Tanggal**: 9 September 2026
* **Status**: Versi terkunci (Locked)
* **Folder Backup**: `checkpoints/v2/`
* **Catatan & Fitur Baru**:
  1. **Integrasi Sekuens 3D 360° 212 Frame**:
     - Memperbarui aset 3D ke urutan WebP 212 frame (`ezgif-frame-001.webp` s.d. `212.webp`) dengan preloading berkecepatan tinggi dan interpolasi rotasi 60 FPS yang mulus tanpa stutter.
     - Ukuran kanvas 3D tengah diperbesar menjadi **1000px** (desktop) dan **560px** (mobile) untuk menghadirkan kehadiran visual yang megah dan dominan.
  2. **Gaya Kertas Foto Muted (No Glow, Clean Border)**:
     - Kartu foto menggunakan latar kertas abu-abu hangat halus (`#dedcd7`), border tipis (3px-4px), dan efek glow dihapus untuk estetika fotografi minimalis yang bersih.
  3. **3D Smooth Cylindrical Tangent Curve & Zero Edge Flicker**:
     - Kartu foto melengkung anggun mengikuti kurva silinder 3D (`tiltAngle = Math.sin(rad) * 48°`).
     - Menghapus pembatasan culling `backface-visibility: hidden` sehingga transisi sudut di tepi kiri dan kanan **100% bebas flicker**.
     - Foto di bagian depan memiliki opasitas solid 100% (tidak redup), dan foto di sisi belakang tetap terbaca normal (tidak terbalik/mirror).
  4. **Respons Scroll Dua Arah Kinetik (Bidirectional Momentum)**:
     - Scroll turun berakselerasi maju, scroll naik langsung berbalik arah putar (reverse) secara instan.
     - Kecepatan puncak (*speed cap*) dibatasi ketat (`max ±1.8`) dengan inersia gesekan `0.88` agar putarannya tenang, stabil, dan bebas pusing.
  5. **Animasi Pernapasan Sentrifugal (Centrifugal Breathing)**:
     - Radius dan jarak foto secara dinamis merenggang melebar ke luar (+15px s.d. +25px) saat berputar cepat, lalu kembali menguncup ke posisi normal saat melambat.


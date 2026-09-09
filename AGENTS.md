# Custom Agent Rules for SIMBION FILM

## 1. Diskusi Sebelum Modifikasi Kode (Wajib)
- Sebelum melakukan modifikasi/penambahan kode apa pun, selalu berdiskusi dan jelaskan rencana perubahan terlebih dahulu kepada pengguna.
- Tunggu konfirmasi/persetujuan dari pengguna sebelum menerapkan perubahan.

## 2. Sistem Checkpoint Versi (V1, V2, V3, ...)
- HANYA buat checkpoint versi baru jika pengguna secara eksplisit mengatakan kata "lock" (atau "kunci").
- Selama masa diskusi, uji coba, eksperimen, atau iterasi biasa, JANGAN membuat checkpoint / memberi nomor versi baru.
- Ketika pengguna berkata "lock":
  - Buat folder checkpoint baru: `checkpoints/v{NOMOR}/` (misal `checkpoints/v2/`, `checkpoints/v3/`, dst.)
  - Salin file kode terkait (`index.html`, `src/`, dll.) ke dalam folder checkpoint tersebut.
  - Perbarui log di `checkpoints/VERSION_LOG.md` dengan deskripsi perubahan, tanggal, dan alasan perubahan.
- Jangan menghapus folder checkpoint versi sebelumnya agar pengguna dapat selalu membandingkan atau memulihkan kode dengan mudah.

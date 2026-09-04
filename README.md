# Aplikasi Forum Diskusi

Aplikasi forum diskusi berbasis React yang mengonsumsi
[Dicoding Forum API](https://forum-api.dicoding.dev/v1). Pengguna dapat
mendaftar, masuk, membuat thread, berkomentar, memberi vote, memfilter thread
berdasarkan kategori, dan melihat klasemen skor pengguna.

## Menjalankan proyek

```bash
npm install
npm run dev      # server pengembangan
npm run build    # build produksi ke folder dist/
npm run preview  # meninjau hasil build
npm run lint     # ESLint dengan Google JavaScript Style Guide
```

## Teknologi

| Kebutuhan     | Pilihan                              |
| ------------- | ------------------------------------ |
| UI            | React 19 (React Strict Mode aktif)   |
| State         | Redux Toolkit + React Redux          |
| Routing       | React Router                         |
| Styling       | Tailwind CSS v4                      |
| Build tool    | Vite                                 |
| Bugs highlight| ESLint + `eslint-config-google`      |

## Struktur folder

Kode UI dan kode state dipisahkan ke dalam folder yang berbeda.

```
src/
├── components/        # komponen UI yang modular dan reusable
│   ├── comment/       # daftar, item, dan form komentar
│   ├── common/        # Button, TextField, Avatar, Spinner, Icon, dll.
│   ├── layout/        # Navbar, AppLayout, LoadingBar, Toaster, AuthShell
│   ├── leaderboard/   # daftar peringkat pengguna
│   └── thread/        # item thread, daftar, filter, vote, detail
├── hooks/             # useInput, useVoteGuard
├── pages/             # satu berkas per halaman
├── routes/            # ProtectedRoute dan GuestRoute
├── states/            # seluruh state aplikasi (Redux)
│   ├── auth/          # sesi pengguna
│   ├── filter/        # kategori dan kata kunci pencarian
│   ├── leaderboards/  # klasemen skor
│   ├── shared/        # thunk yang menggabungkan beberapa slice
│   ├── threadDetail/  # detail thread beserta komentarnya
│   ├── threads/       # daftar thread
│   ├── ui/            # indikator loading dan notifikasi
│   └── store.js
└── utils/
    ├── api.js         # satu-satunya tempat pemanggilan REST API
    └── index.js       # format tanggal, sanitasi HTML, helper vote
```

### Aliran data

Komponen tidak pernah memanggil REST API secara langsung. Seluruh permintaan
jaringan berada di `src/utils/api.js` dan hanya dipanggil dari thunk pada
folder `src/states`. Komponen hanya membaca state melalui selector dan
mengirim action. State form dan controlled component tetap disimpan secara
lokal di komponen masing-masing.

### Optimistic vote

Aksi vote pada thread dan komentar diterapkan ke Redux store sebelum
permintaan ke server selesai, sehingga tombol langsung merespons. Bila server
menolak permintaan, perubahan dikembalikan ke kondisi sebelumnya dan pengguna
menerima notifikasi kesalahan. Menekan tombol vote yang sudah aktif akan
membatalkan vote tersebut (`neutral-vote`).

### Indikator loading

Terdapat tiga lapis indikator: progress bar global yang dikendalikan oleh
penghitung thunk yang sedang berjalan (`states/ui/loadingSlice.js`), skeleton
pada daftar thread dan leaderboard, serta spinner di dalam tombol submit.

### Filter kategori

API tidak menyediakan endpoint filter, sehingga daftar kategori diturunkan
dari state thread yang sudah dimuat dan penyaringan dilakukan pada selector
`selectVisibleThreads` berdasarkan `state.filter`.

## Catatan ESLint

Proyek menggunakan `eslint-config-google` di atas ESLint 10 dengan flat
config. ESLint 10 sudah menghapus aturan pemformatan bawaan, sehingga
`eslint.config.js` memetakan aturan Google ke plugin `@stylistic` dan
mengganti nama aturan yang telah berubah. Batas 80 kolom tetap berlaku untuk
kode, dengan pengecualian untuk literal string panjang seperti daftar kelas
Tailwind dan URL.

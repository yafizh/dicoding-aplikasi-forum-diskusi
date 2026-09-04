# Aplikasi Forum Diskusi

Aplikasi forum diskusi berbasis React yang mengonsumsi
[Dicoding Forum API](https://forum-api.dicoding.dev/v1). Pengguna dapat
mendaftar, masuk, membuat thread, berkomentar, memberi vote, memfilter thread
berdasarkan kategori, dan melihat klasemen skor pengguna.

## Menjalankan proyek

```bash
npm install
npm run dev            # server pengembangan (http://localhost:5173)
npm run build          # build produksi ke folder dist/
npm run preview        # meninjau hasil build (http://localhost:4173)
npm run lint           # ESLint dengan Google JavaScript Style Guide
npm test               # pengujian unit dan integrasi (Vitest)
npm run test:watch     # Vitest dalam mode watch
npm run test:coverage  # Vitest beserta laporan cakupan kode
npm run e2e            # pengujian end-to-end (build + preview + Cypress)
npm run e2e:open       # Cypress interaktif di atas server pengembangan
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
| Unit test     | Vitest + React Testing Library       |
| End-to-end    | Cypress                              |
| CI/CD         | GitHub Actions + Vercel              |

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
├── tests/             # setup Vitest dan helper render
└── utils/
    ├── api.js         # satu-satunya tempat pemanggilan REST API
    └── index.js       # format tanggal, sanitasi HTML, helper vote

cypress/
├── e2e/               # spesifikasi pengujian end-to-end
├── fixtures/          # respons Dicoding Forum API yang distub
└── support/           # perintah kustom Cypress

.github/workflows/
├── ci.yml             # lint, unit test, e2e test, build
└── cd.yml             # menjalankan CI lalu deploy ke Vercel
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

## Pengujian

Pengujian dibagi menjadi tiga lapis: unit, integrasi, dan end-to-end. Setiap
berkas pengujian dibuka dengan blok komentar **Skenario pengujian** yang
mendaftar seluruh kasus yang diuji pada berkas tersebut.

### Unit dan integrasi (Vitest)

Berkas pengujian diletakkan berdampingan dengan kode yang diuji dan berjalan
di atas jsdom.

```bash
npm test               # menjalankan seluruh pengujian sekali
npm run test:watch     # mode watch selama pengembangan
npm run test:coverage  # menghasilkan laporan cakupan di folder coverage/
```

| Lapis            | Berkas                                       | Cakupan |
| ---------------- | -------------------------------------------- | ------- |
| Reducer          | `src/states/filter/filterSlice.test.js`      | `setCategory`, `setKeyword`, `clearFilter` |
| Reducer          | `src/states/threads/threadsSlice.test.js`    | pemuatan thread, pembuatan thread, vote optimistis, jumlah komentar |
| Reducer          | `src/states/auth/authSlice.test.js`          | login, register, preload sesi, logout |
| Reducer          | `src/states/ui/toastSlice.test.js`           | `pushToast`, `dismissToast`, notifikasi otomatis dari thunk yang gagal |
| Thunk            | `src/states/auth/authThunk.test.js`          | `asyncLoginUser`, `asyncRegisterUser`, `asyncPreloadAuth` |
| Thunk            | `src/states/threads/threadsThunk.test.js`    | `asyncReceiveThreads`, `asyncCreateThread`, `asyncVoteThread` |
| Komponen         | `src/components/thread/VoteGroup.test.jsx`   | render jumlah vote dan interaksi tombol vote |
| Komponen         | `src/components/thread/ThreadSearch.test.jsx`| sinkronisasi kotak pencarian dengan store |
| Komponen         | `src/components/comment/CommentForm.test.jsx`| kondisi tamu, validasi isian, pengiriman komentar |
| Komponen         | `src/pages/LoginPage.test.jsx`               | render formulir, pengisian, login berhasil dan gagal |

Pengujian thunk memakai `vi.spyOn` pada modul `src/utils/api.js` sehingga
tidak ada permintaan jaringan yang benar-benar dikirim. Pengujian komponen
dirender melalui helper `renderWithProviders` (`src/tests/utils.jsx`) yang
menyediakan store Redux asli beserta `MemoryRouter`, sehingga komponen diuji
bersama logika state yang sesungguhnya.

### End-to-end (Cypress)

```bash
npm run e2e       # build, jalankan preview server, lalu Cypress headless
npm run e2e:open  # Cypress interaktif di atas server pengembangan
```

Spesifikasi `cypress/e2e/login.cy.js` menguji alur login secara utuh:
tampilan formulir, validasi isian kosong, notifikasi kesalahan ketika
kredensial salah, indikator proses, keberhasilan login beserta pengalihan ke
beranda, sesi yang tetap bertahan setelah halaman dimuat ulang, pengalihan
pengguna yang sudah masuk, hingga proses keluar.

Seluruh permintaan ke Dicoding Forum API distub dengan `cy.intercept` melalui
perintah kustom pada `cypress/support/commands.js` dan berkas respons pada
`cypress/fixtures/`. Dengan begitu pengujian bersifat deterministik, tidak
membutuhkan akun sungguhan, dan tetap lolos saat dijalankan di CI.

## Deployment dengan CI/CD

Otomatisasi dijalankan oleh dua workflow GitHub Actions.

### `.github/workflows/ci.yml` — Continuous Integration

Berjalan pada setiap pull request ke `master`/`main` serta setiap push ke
cabang lain, dan dapat dipanggil oleh workflow lain (`workflow_call`).
Workflow ini memiliki empat job: `lint` (ESLint), `unit-test` (Vitest beserta
unggahan laporan cakupan), `e2e-test` (Cypress di atas preview server), dan
`build` yang hanya berjalan setelah ketiga job sebelumnya lulus.

### `.github/workflows/cd.yml` — Continuous Deployment

Berjalan pada setiap push ke `master`/`main`. Job pertama memanggil ulang
workflow CI, dan job `deploy` baru dijalankan bila seluruh pengujian lulus.
Deployment dikerjakan dengan Vercel CLI: `vercel pull`, `vercel build --prod`,
lalu `vercel deploy --prebuilt --prod`.

### Secrets yang dibutuhkan

Tambahkan tiga secret berikut pada **Settings → Secrets and variables →
Actions** di repositori GitHub:

| Secret              | Cara memperoleh                                        |
| ------------------- | ------------------------------------------------------ |
| `VERCEL_TOKEN`      | Vercel → Account Settings → Tokens → Create            |
| `VERCEL_ORG_ID`     | Nilai `orgId` pada `.vercel/project.json`               |
| `VERCEL_PROJECT_ID` | Nilai `projectId` pada `.vercel/project.json`            |

Berkas `.vercel/project.json` dibuat secara lokal setelah menjalankan
`npx vercel link` pada folder proyek. Folder `.vercel` sengaja tidak
dilacak Git.

Konfigurasi `vercel.json` mengarahkan seluruh permintaan ke `index.html`
sehingga rute sisi klien seperti `/threads/:threadId` tetap dapat diakses
langsung tanpa galat 404.

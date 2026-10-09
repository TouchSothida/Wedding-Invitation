# Khmer wedding e-invitation

Vite static site. No framework, no tracking, no guest data collected.

- Details: `src/data/wedding.js` · All wording (Khmer + English): `src/i18n.js`
- Photos: put originals in `photos_src/` (not committed) and run `npm run photos` (needs Python + Pillow).
  It writes WebP 640/1280/2000 px to `public/img/` with all EXIF/GPS removed, and `src/data/gallery.js`.
- Music: set `music: '/audio/your-file.mp3'` in `wedding.js` (only a track you have rights to). The button appears automatically.
- Link preview: `public/og.jpg` (1200×630). Set the `SITE_URL` env var on the host so og:image is absolute.
- Run: `npm install && npm run dev` · Build: `npm run build` (output `dist/`) · Deploy: import the repo on Vercel (Framework: Vite).
- Fonts: Moul, Moulpali, Pinyon Script, Kantumruy Pro in `public/fonts/` (SIL OFL). English body uses Cormorant Garamond when its file is added to `public/fonts/` and declared in `src/styles/main.css`.

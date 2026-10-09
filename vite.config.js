import { defineConfig } from 'vite';

// og:image needs an absolute URL. Set SITE_URL (e.g. https://your-name.vercel.app) in Vercel's
// environment variables; on Vercel the production domain is picked up automatically.
const siteUrl = (process.env.SITE_URL
  || (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`)
  || 'http://localhost:5173').replace(/\/$/, '');

export default defineConfig({
  plugins: [{ name: 'site-url', transformIndexHtml: html => html.replaceAll('%SITE_URL%', siteUrl) }],
  build: { target: 'es2020' },
});

// @ts-check
import { defineConfig } from 'astro/config'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// v3 is served from https://chriscart.land/v3/ alongside the legacy site.
// At cutover, change base to '/'. Canonical URLs already point at the
// root-level paths (see src/lib/site.js), so no other change is needed.
const BASE = '/v3/'

// Serve shared root assets (/i, /global-temperatures, favicon, manifest)
// from the repo's public/ directory during `astro dev`. In production these
// files are served by Firebase Hosting from the same public/ directory, so
// v3 references them with root-absolute paths instead of shipping copies.
function serveSharedPublicAssets() {
  const publicDir = fileURLToPath(new URL('../public', import.meta.url))
  const contentTypes = {
    '.jpg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.json': 'application/json',
    '.csv': 'text/csv',
    '.ico': 'image/x-icon',
  }
  return {
    name: 'serve-shared-public-assets',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const urlPath = decodeURIComponent((req.url || '').split('?')[0])
        const isShared =
          urlPath.startsWith('/i/') ||
          urlPath.startsWith('/global-temperatures/') ||
          urlPath === '/favicon.ico' ||
          urlPath === '/manifest.json'
        if (!isShared) return next()
        const filePath = path.normalize(path.join(publicDir, urlPath))
        if (!filePath.startsWith(publicDir)) return next()
        try {
          const data = await readFile(filePath)
          res.setHeader(
            'Content-Type',
            contentTypes[path.extname(filePath)] || 'application/octet-stream'
          )
          res.end(data)
        } catch {
          next()
        }
      })
    },
  }
}

export default defineConfig({
  site: 'https://chriscart.land',
  base: BASE,
  outDir: '../public/v3',
  // Flat .html files (projects.html, not projects/index.html) so
  // extensionless URLs work with Firebase Hosting cleanUrls and with the
  // local http-server used by tests.
  build: { format: 'file' },
  vite: {
    plugins: [serveSharedPublicAssets()],
  },
})

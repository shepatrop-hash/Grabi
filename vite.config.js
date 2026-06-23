import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Plugin de dev : exécute les fonctions du dossier api/ pendant « npm run dev »,
// pour tester en local SANS Vercel. Les mêmes fonctions sont déployées telles
// quelles sur Vercel en production (ce plugin n'agit qu'en mode dev).
function devApi() {
  return {
    name: 'grabi-dev-api',
    config(_userConfig, { mode }) {
      // Charge .env dans process.env pour que les fonctions api/ voient les clés.
      const env = loadEnv(mode, process.cwd(), '')
      for (const key in env) {
        if (process.env[key] === undefined) process.env[key] = env[key]
      }
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith('/api/')) return next()
        const sendError = (code, message) => {
          res.statusCode = code
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: message }))
        }
        try {
          const name = req.url.split('?')[0].replace(/^\/api\//, '').replace(/\/+$/, '')
          const mod = await server.ssrLoadModule(`/api/${name}.js`)
          const handler = mod.default
          if (typeof handler !== 'function') return sendError(404, 'Endpoint inconnu.')
          req.body = await readJsonBody(req)
          await handler(req, createRes(res))
        } catch (err) {
          server.config.logger.error(`[dev-api] ${err?.stack || err}`)
          sendError(500, String(err?.message || err))
        }
      })
    },
  }
}

function readJsonBody(req) {
  return new Promise((resolve) => {
    let data = ''
    req.on('data', (chunk) => (data += chunk))
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {})
      } catch {
        resolve({})
      }
    })
    req.on('error', () => resolve({}))
  })
}

// Adaptateur minimal façon Vercel : .status(code).json(obj)
function createRes(nodeRes) {
  return {
    status(code) {
      nodeRes.statusCode = code
      return this
    },
    json(obj) {
      nodeRes.setHeader('Content-Type', 'application/json')
      nodeRes.end(JSON.stringify(obj))
      return this
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    devApi(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      manifest: {
        name: 'Grabi — Histoires & comptines',
        short_name: 'Grabi',
        description: 'Des histoires douces à écouter, et la tienne à inventer avec Grabi.',
        lang: 'fr',
        theme_color: '#A98CFF',
        background_color: '#FFF7EC',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' },
        ],
      },
    }),
  ],
})

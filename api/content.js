// Contenu éditable À DISTANCE (sans redéploiement ni mise à jour du store) :
// - événement à la une (gros encart de l'accueil)
// - épisodes animés (Découvrir)
// - histoires longues (catalogue)
//
// Stocké dans un unique JSON sur Vercel Blob (store PRIVÉ). L'app le lit via GET
// (lecture serveur authentifiée) ; l'admin l'écrit via POST protégé par ADMIN_PASSWORD.
//   GET  /api/content                      -> { featuredEvent, episodes, longStories }
//   POST /api/content { password, action:'check' }      -> 200 si mot de passe OK
//   POST /api/content { password, content }             -> enregistre et renvoie le contenu
import { put, get } from '@vercel/blob'

const KEY = 'admin/content.json'
const EMPTY = { featuredEvent: null, episodes: [], longStories: [] }
const hasBlob = () => !!process.env.BLOB_READ_WRITE_TOKEN

async function readContent() {
  if (!hasBlob()) return EMPTY
  try {
    // Store privé : lecture serveur authentifiée (get renvoie un flux). useCache:false pour
    // toujours avoir la dernière version après une écriture admin.
    const res = await get(KEY, { access: 'private', useCache: false })
    if (!res || !res.stream) return EMPTY
    const text = await new Response(res.stream).text()
    return { ...EMPTY, ...JSON.parse(text) }
  } catch {
    return EMPTY // BlobNotFoundError si le contenu n'existe pas encore -> vide
  }
}

function sanitize(content) {
  const c = content && typeof content === 'object' ? content : {}
  return {
    featuredEvent: c.featuredEvent && typeof c.featuredEvent === 'object' ? c.featuredEvent : null,
    episodes: Array.isArray(c.episodes) ? c.episodes.slice(0, 50) : [],
    longStories: Array.isArray(c.longStories) ? c.longStories.slice(0, 200) : [],
  }
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const content = await readContent()
    if (typeof res.setHeader === 'function') res.setHeader('Cache-Control', 'no-store')
    return res.status(200).json(content)
  }

  if (req.method === 'POST') {
    const body = req.body || {}
    const { password, action, content } = body
    if (!process.env.ADMIN_PASSWORD) {
      return res.status(503).json({ error: "ADMIN_PASSWORD n'est pas configuré dans Vercel." })
    }
    if (!password || password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Mot de passe admin incorrect.' })
    }
    // Vérification du mot de passe seule (pour l'écran de connexion admin).
    if (action === 'check') return res.status(200).json({ ok: true })

    if (!hasBlob()) {
      return res.status(503).json({ error: 'Vercel Blob non connecté (Storage → Blob → Connect).' })
    }
    try {
      const clean = sanitize(content)
      await put(KEY, JSON.stringify(clean), { access: 'private', addRandomSuffix: false, contentType: 'application/json' })
      return res.status(200).json({ ok: true, content: clean })
    } catch (e) {
      return res.status(500).json({ error: String(e?.message || e) })
    }
  }

  return res.status(405).json({ error: 'Méthode non permise.' })
}

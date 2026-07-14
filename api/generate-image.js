import { fal } from '@fal-ai/client'
import { abuseBlocked } from './_guard.js'
import { quotaBlocked } from './_quota.js'

// Génération d'illustration. Deux fournisseurs :
// - PROVIDER=gemini  -> Nano Banana 2 (gemini-3.1-flash-image), synchrone, renvoie l'image direct.
// - PROVIDER=fal     -> Qwen Image 2 (asynchrone : submit + polling via /api/image-status).
// Par défaut : fal (Qwen Image 2). Mettre IMAGE_PROVIDER=gemini pour repasser sur Nano Banana 2.
const PROVIDER = process.env.IMAGE_PROVIDER || 'fal'

// Modèle texte→image. Défaut : FLUX.2 [klein] 9B (0,006 $/MP, bonne qualité, rapide 4-step).
// Surchargeable via FAL_T2I_MODEL (ex. 'fal-ai/flux/schnell' encore moins cher, ou 'fal-ai/qwen-image-2/text-to-image' + de qualité).
const T2I_MODEL = process.env.FAL_T2I_MODEL || 'fal-ai/flux-2/klein/9b'
const EDIT_MODEL = process.env.EDIT_MODEL || 'fal-ai/qwen-image-edit-2509'
const GEMINI_MODEL = process.env.GEMINI_IMAGE_MODEL || 'gemini-3.1-flash-image'
const GEMINI_SIZE = process.env.GEMINI_IMAGE_SIZE || '512' // 0.5K (valeurs Gemini: 512, 1K, 2K, 4K)

// Garde-fou sécurité enfant ajouté à chaque prompt : personnages toujours habillés.
const SAFE = 'All characters are fully clothed in cute complete outfits, wholesome and appropriate for young children, absolutely no nudity.'

// STYLE VISUEL UNIQUE de toutes les illustrations : dessin à la main, crayon de couleur et
// pastel sur papier texturé (livre d'histoires pour enfants traditionnel) — surtout PAS de
// rendu 3D / CGI brillant / vectoriel plat. Surchargeable via IMAGE_STYLE.
const STYLE = process.env.IMAGE_STYLE ||
  "Hand-drawn children's storybook illustration in soft colored pencil and pastel crayon on textured paper, gentle hand-sketched outlines, warm cozy colors, soft crayon shading with visible paper grain, tender and whimsical, rounded friendly shapes, traditional picture book art like a bedtime story. No text, no lettering, no 3D render, no glossy CGI, no flat vector."

export const config = { maxDuration: 60 }

// La réponse de l'API Interactions n'a pas une forme 100% figée -> on cherche
// récursivement une grosse chaîne base64 (l'image), peu importe le nom du champ.
function findImageBase64(obj, depth = 0) {
  if (depth > 12 || obj == null || typeof obj !== 'object') return null
  // L'image = un objet { mime_type: 'image/...', data: '<base64>' }. On EXIGE le mime_type
  // image pour ne PAS confondre avec la "signature" du step "thought" (qui est aussi du base64).
  const mime = obj.mime_type || obj.mimeType
  if (typeof obj.data === 'string' && obj.data.length > 200 && typeof mime === 'string' && /^image\//.test(mime)) {
    return { data: obj.data.replace(/\s/g, ''), mime }
  }
  for (const k of Object.keys(obj)) {
    if (obj[k] && typeof obj[k] === 'object') {
      const r = findImageBase64(obj[k], depth + 1)
      if (r) return r
    }
  }
  return null
}

// Résume la réponse (remplace les longues chaînes par <str len=N>) pour inspecter
// la structure sans charrier 375 Ko de base64.
function summarize(o, d = 0) {
  if (d > 12) return '…'
  if (typeof o === 'string') return o.length > 80 ? `<str len=${o.length}>` : o
  if (Array.isArray(o)) return o.map((x) => summarize(x, d + 1))
  if (o && typeof o === 'object') {
    const r = {}
    for (const k of Object.keys(o)) r[k] = summarize(o[k], d + 1)
    return r
  }
  return o
}

async function generateGemini(prompt, res, debug) {
  const r = await fetch('https://generativelanguage.googleapis.com/v1beta/interactions', {
    method: 'POST',
    headers: { 'x-goog-api-key': process.env.GEMINI_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: GEMINI_MODEL,
      input: [{ type: 'text', text: `${prompt}. ${SAFE} ${STYLE}` }],
      response_format: { type: 'image', mime_type: 'image/jpeg', aspect_ratio: '1:1', image_size: GEMINI_SIZE },
    }),
  })
  if (!r.ok) {
    const detail = await r.text().catch(() => '')
    res.status(502).json({ error: `Gemini ${r.status}`, detail: detail.slice(0, 500), model: GEMINI_MODEL })
    return
  }
  const data = await r.json()
  if (debug) {
    const picked = findImageBase64(data)
    res.status(200).json({
      structure: summarize(data),
      picked: picked ? { mime: picked.mime, len: picked.data.length, prefix: picked.data.slice(0, 16) } : null,
    })
    return
  }
  const img = findImageBase64(data)
  if (!img) {
    res.status(502).json({ error: 'Pas d\'image dans la réponse Gemini.', keys: Object.keys(data || {}).slice(0, 20) })
    return
  }
  res.status(200).json({ url: `data:${img.mime};base64,${img.data}`, model: GEMINI_MODEL })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Méthode non autorisée.' })
    return
  }
  if (abuseBlocked(req, res)) return
  if (await quotaBlocked(req, res, 2)) return

  const { prompt, image_urls } = req.body || {}
  if (!prompt || typeof prompt !== 'string') {
    res.status(400).json({ error: "Prompt d'illustration manquant." })
    return
  }

  // --- Nano Banana 2 (Gemini), synchrone : renvoie { url } directement ---
  if (PROVIDER === 'gemini') {
    if (!process.env.GEMINI_API_KEY) {
      res.status(500).json({ error: 'GEMINI_API_KEY manquante.' })
      return
    }
    try {
      await generateGemini(prompt, res, req.body?.debug)
    } catch (err) {
      console.error('gemini image error:', err)
      res.status(500).json({ error: String(err?.message || err) })
    }
    return
  }

  // --- Fal (Qwen), asynchrone : submit -> polling via /api/image-status ---
  if (!process.env.FAL_KEY) {
    res.status(500).json({ error: 'FAL_KEY manquante (voir .env.example).' })
    return
  }
  const refs = Array.isArray(image_urls) ? image_urls.filter((u) => typeof u === 'string' && u) : []
  const useEdit = refs.length > 0
  const model = useEdit ? EDIT_MODEL : T2I_MODEL
  try {
    fal.config({ credentials: process.env.FAL_KEY })
    const input = useEdit
      ? {
          prompt: `${prompt}. Keep EXACTLY the same characters, colors and art style as the reference image(s). ${SAFE} ${STYLE}`,
          image_urls: refs.slice(0, 4),
        }
      : {
          prompt: `${prompt}. ${SAFE} ${STYLE}`,
          image_size: 'square_hd',
          num_inference_steps: 4,
        }
    const submitted = await fal.queue.submit(model, { input })
    res.status(200).json({ request_id: submitted.request_id, model })
  } catch (err) {
    console.error('generate-image submit error:', err)
    res.status(500).json({
      error: String(err?.message || err),
      status: err?.status ?? null,
      model,
      detail: err?.body?.detail ?? err?.body ?? null,
    })
  }
}

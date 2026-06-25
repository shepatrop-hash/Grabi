import { fal } from '@fal-ai/client'

// Deux modes :
// - sans image de référence  -> texte→image (références + repli)
// - avec image(s) de référence -> édition multi-images (cohérence des personnages)
const T2I_MODEL = 'fal-ai/qwen-image-2/text-to-image'
const EDIT_MODEL = process.env.EDIT_MODEL || 'fal-ai/qwen-image-edit-2509'

// Soumission rapide : on met le job dans la file Fal et on répond aussitôt
// (le client interroge ensuite /api/image-status). Évite le timeout 60s de Vercel
// quand le modèle d'édition est lent.
export const config = { maxDuration: 30 }

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Méthode non autorisée.' })
    return
  }
  if (!process.env.FAL_KEY) {
    res.status(500).json({ error: 'FAL_KEY manquante (voir .env.example).' })
    return
  }

  const { prompt, image_urls } = req.body || {}
  const refs = Array.isArray(image_urls) ? image_urls.filter((u) => typeof u === 'string' && u) : []
  const useEdit = refs.length > 0
  const model = useEdit ? EDIT_MODEL : T2I_MODEL

  try {
    if (!prompt || typeof prompt !== 'string') {
      res.status(400).json({ error: "Prompt d'illustration manquant." })
      return
    }

    fal.config({ credentials: process.env.FAL_KEY })

    // Garde-fou sécurité enfant ajouté à CHAQUE prompt : personnages toujours habillés.
    const SAFE = 'All characters are fully clothed in cute complete outfits, wholesome and appropriate for young children, absolutely no nudity.'
    const input = useEdit
      ? {
          prompt: `${prompt}. Keep EXACTLY the same characters, colors and art style as the reference image(s). ${SAFE} Children's picture book illustration, soft warm colors, cute and gentle, no text.`,
          image_urls: refs.slice(0, 4),
        }
      : {
          prompt: `${prompt}. ${SAFE} Children's picture book illustration, soft warm colors, cute and gentle, cohesive storybook style, no text.`,
        }

    // Soumission asynchrone à la file Fal -> renvoie un request_id immédiatement.
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

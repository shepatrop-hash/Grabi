import { fal } from '@fal-ai/client'

// Deux modes :
// - sans image de référence  -> texte→image (pour générer les références ET en repli)
// - avec image(s) de référence -> édition multi-images (cohérence des personnages/éléments)
const T2I_MODEL = 'fal-ai/qwen-image-2/text-to-image'
const EDIT_MODEL = process.env.EDIT_MODEL || 'fal-ai/qwen-image-edit-2509'

export const config = { maxDuration: 60 }

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

    const input = useEdit
      ? {
          prompt: `${prompt}. Keep EXACTLY the same characters, colors and art style as the reference image(s). Children's picture book illustration, soft warm colors, cute and gentle, no text.`,
          image_urls: refs.slice(0, 4),
        }
      : {
          prompt: `${prompt}. Children's picture book illustration, soft warm colors, cute and gentle, cohesive storybook style, no text.`,
        }

    const result = await fal.subscribe(model, { input })
    const url = result?.data?.images?.[0]?.url
    if (!url) {
      res.status(502).json({ error: "Pas d'image renvoyée par Fal.", model })
      return
    }

    res.status(200).json({ url, model })
  } catch (err) {
    console.error('generate-image error:', err)
    res.status(500).json({
      error: String(err?.message || err),
      status: err?.status ?? null,
      model,
      detail: err?.body?.detail ?? err?.body ?? null,
    })
  }
}

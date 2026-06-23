import { fal } from '@fal-ai/client'

// Fal.ai héberge Qwen-Image (et d'autres modèles). Modèle configurable.
const IMAGE_MODEL = process.env.IMAGE_MODEL || 'fal-ai/qwen-image-2/text-to-image'

// Laisse le temps à la génération d'image (sinon timeout serverless).
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

  try {
    const { prompt } = req.body || {}
    if (!prompt || typeof prompt !== 'string') {
      res.status(400).json({ error: "Prompt d'illustration manquant." })
      return
    }

    fal.config({ credentials: process.env.FAL_KEY })

    const result = await fal.subscribe(IMAGE_MODEL, {
      input: {
        prompt: `${prompt}. Children's picture book illustration, soft warm colors, cute and gentle, cohesive storybook style, no text.`,
      },
    })

    const url = result?.data?.images?.[0]?.url
    if (!url) {
      res.status(502).json({ error: "Pas d'image renvoyée par Fal." })
      return
    }

    res.status(200).json({ url })
  } catch (err) {
    console.error('generate-image error:', err)
    res.status(500).json({
      error: String(err?.message || err),
      status: err?.status ?? null,
      detail: err?.body?.detail ?? err?.body ?? null,
    })
  }
}

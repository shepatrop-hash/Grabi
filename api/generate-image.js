import { fal } from '@fal-ai/client'

// Deux modes :
// - sans image de référence  -> texte→image (références + repli)
// - avec image(s) de référence -> édition multi-images (cohérence des personnages)
const T2I_MODEL = 'fal-ai/qwen-image-2/text-to-image'
const EDIT_MODEL = process.env.EDIT_MODEL || 'fal-ai/qwen-image-edit-2509'

// ============================================================================
// STYLE LOCK — appliqué à TOUTES les images (références + scènes).
// Pour changer le rendu visuel de toute l'app, modifie uniquement ces blocs.
// ============================================================================
const STYLE_LOCK =
  'Smooth 3D animation style, soft rounded shapes, glossy polished surfaces, ' +
  'childlike Pixar / DreamWorks-inspired look, bright cheerful saturated color palette, ' +
  'soft global illumination, gentle soft shadows, subtle ambient occlusion, ' +
  'clean high-detail render, wholesome family-friendly mood, storybook character feel.'

const ANTI_UI =
  'Pure clean illustration with absolutely no interface elements, just the character ' +
  'and the scene like a frame from an animated movie.'

const TECH = 'High resolution, sharp focus, centered composition.'

// Negative prompt (anti-HUD / anti-interface). ≤ 500 caractères.
const NEGATIVE =
  'HUD, UI, game interface, health bar, minimap, buttons, icons, text, captions, ' +
  'subtitles, watermark, logo, menu, on-screen indicators, score, inventory, frame, ' +
  'border, UI overlay, letterboxing, signature, blurry, distorted'

// Assemble le prompt final : [scène] + (verrou perso si réfs) + STYLE + ANTI-UI + TECH.
function buildPrompt(scene, withRefs) {
  const charLock = withRefs
    ? 'Keep EXACTLY the same character(s), colors, proportions and design as the reference image(s). '
    : ''
  return `${scene}. ${charLock}${STYLE_LOCK} ${ANTI_UI} ${TECH}`
}

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
          prompt: buildPrompt(prompt, true),
          image_urls: refs.slice(0, 4),
          negative_prompt: NEGATIVE,
        }
      : {
          prompt: buildPrompt(prompt, false),
          image_size: 'square_hd', // carré : correspond à l'affichage de l'app
          negative_prompt: NEGATIVE,
          acceleration: 'high', // rapide, recommandé pour les images sans texte
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

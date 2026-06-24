import { fal } from '@fal-ai/client'

// Voix des histoires via ElevenLabs (hébergé sur Fal → même clé FAL_KEY que les images).
// Rapide (quelques secondes) -> appel synchrone.
const TTS_MODEL = process.env.TTS_MODEL || 'fal-ai/elevenlabs/tts/multilingual-v2'

// Les 4 « voix de Grabi » -> voix ElevenLabs + réglages (modifiable facilement).
const VOICES = {
  Douce: { voice: 'Rachel', stability: 0.6, style: 0.15, speed: 0.96 },
  Rigolote: { voice: 'Aria', stability: 0.4, style: 0.55, speed: 1.05 },
  Magique: { voice: 'Sarah', stability: 0.55, style: 0.4, speed: 0.95 },
  Robot: { voice: 'Charlie', stability: 0.9, style: 0, speed: 0.92 },
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

  try {
    const { text, voice } = req.body || {}
    if (!text || typeof text !== 'string') {
      res.status(400).json({ error: 'Texte à lire manquant.' })
      return
    }

    fal.config({ credentials: process.env.FAL_KEY })
    const v = VOICES[voice] || VOICES.Douce

    const result = await fal.subscribe(TTS_MODEL, {
      input: {
        text: text.slice(0, 2500),
        voice: v.voice,
        stability: v.stability,
        style: v.style,
        speed: v.speed,
        language_code: 'fr',
      },
    })

    const url = result?.data?.audio?.url
    if (!url) {
      res.status(502).json({ error: "Pas d'audio renvoyé par Fal." })
      return
    }

    res.status(200).json({ url, voice: v.voice })
  } catch (err) {
    console.error('generate-audio error:', err)
    res.status(500).json({
      error: String(err?.message || err),
      status: err?.status ?? null,
      detail: err?.body?.detail ?? err?.body ?? null,
    })
  }
}

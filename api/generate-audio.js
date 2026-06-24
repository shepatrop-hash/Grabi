// Voix des histoires via ElevenLabs en DIRECT (abonnement de l'utilisateur).
// ElevenLabs v3 par défaut → narration émotive + balises audio [whispers], [laughs]…
// dans le texte. Repli automatique sur multilingual_v2 (balises retirées) si v3 indispo.
// Renvoie l'audio en data-URL base64 (lecteur inchangé).
const MODEL = process.env.ELEVENLABS_MODEL || 'eleven_v3'
const FALLBACK_MODEL = 'eleven_multilingual_v2'

// Voix de NARRATION sélectionnables (l'utilisateur choisit). 4 voix DISTINCTES,
// chacune remplaçable par une voix FR via une variable d'env (VOICE_*_ID).
// NB : Grabi ne narre plus — il fait des petits bruits mignons (voir generate-sfx.js).
const env = (k, d) => process.env[k] || d
const VOICES = {
  Douce: { id: env('VOICE_DOUCE_ID', 'EXAVITQu4vr4xnSDxMaL'), settings: { stability: 0.5, similarity_boost: 0.8, style: 0.12, speed: 0.96, use_speaker_boost: true } },
  Rigolote: { id: env('VOICE_RIGOLOTE_ID', '9BWtsMINqrJLrRacOk9x'), settings: { stability: 0.4, similarity_boost: 0.75, style: 0.5, speed: 1.05, use_speaker_boost: true } },
  Magique: { id: env('VOICE_MAGIQUE_ID', 'XB0fDUnXU5powFXDhCwa'), settings: { stability: 0.5, similarity_boost: 0.8, style: 0.35, speed: 0.97, use_speaker_boost: true } },
  Robot: { id: env('VOICE_ROBOT_ID', 'JBFqnCBsd6RMkjVDRZzb'), settings: { stability: 0.9, similarity_boost: 0.45, style: 0, speed: 0.92, use_speaker_boost: false } },
}

// Retire les balises [..] (pour le repli v2 qui ne les gère pas → sinon il les lirait).
const stripTags = (t) => t.replace(/\[[^\]]*\]/g, ' ').replace(/\s{2,}/g, ' ').trim()

export const config = { maxDuration: 60 }

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Méthode non autorisée.' })
    return
  }
  if (!process.env.ELEVENLABS_API_KEY) {
    res.status(500).json({ error: 'ELEVENLABS_API_KEY manquante (voir .env.example).' })
    return
  }

  try {
    const { text, voice } = req.body || {}
    if (!text || typeof text !== 'string') {
      res.status(400).json({ error: 'Texte à lire manquant.' })
      return
    }
    const v = VOICES[voice] || VOICES.Douce

    const call = (txt, model) => {
      // v3 ne gère pas style/speed -> on n'envoie que les réglages compatibles.
      const settings = model.includes('v3')
        ? { stability: v.settings.stability, similarity_boost: v.settings.similarity_boost, use_speaker_boost: v.settings.use_speaker_boost }
        : v.settings
      return fetch(`https://api.elevenlabs.io/v1/text-to-speech/${v.id}?output_format=mp3_44100_128`, {
        method: 'POST',
        headers: { 'xi-api-key': process.env.ELEVENLABS_API_KEY, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
        body: JSON.stringify({ text: txt.slice(0, 2500), model_id: model, voice_settings: settings }),
      })
    }

    // 1) v3 avec balises ; 2) repli multilingual_v2 sans balises si v3 échoue.
    let used = MODEL
    let r = await call(text, MODEL)
    if (!r.ok && MODEL !== FALLBACK_MODEL) {
      used = FALLBACK_MODEL
      r = await call(stripTags(text), FALLBACK_MODEL)
    }

    if (!r.ok) {
      const detail = await r.text().catch(() => '')
      res.status(502).json({ error: `ElevenLabs ${r.status}`, detail: detail.slice(0, 400) })
      return
    }

    const buf = Buffer.from(await r.arrayBuffer())
    res.status(200).json({ url: `data:audio/mpeg;base64,${buf.toString('base64')}`, model: used })
  } catch (err) {
    console.error('generate-audio error:', err)
    res.status(500).json({ error: String(err?.message || err) })
  }
}

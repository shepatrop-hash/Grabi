// Voix des histoires via ElevenLabs en DIRECT (abonnement de l'utilisateur, 100k crédits/mois).
// Renvoie l'audio en data-URL base64 → le lecteur joue ça sans changement côté client.
const MODEL = process.env.ELEVENLABS_MODEL || 'eleven_multilingual_v2'

// Les 4 « voix de Grabi » -> voix ElevenLabs (premade) + réglages. Faciles à changer :
// remplace les `id` par TES voix (ElevenLabs → Voices → ... → "Voice ID").
const VOICES = {
  Douce: { id: 'EXAVITQu4vr4xnSDxMaL', settings: { stability: 0.55, similarity_boost: 0.8, style: 0.15, speed: 0.96, use_speaker_boost: true } }, // Sarah
  Rigolote: { id: '9BWtsMINqrJLrRacOk9x', settings: { stability: 0.4, similarity_boost: 0.75, style: 0.5, speed: 1.05, use_speaker_boost: true } }, // Aria
  Magique: { id: 'XB0fDUnXU5powFXDhCwa', settings: { stability: 0.5, similarity_boost: 0.8, style: 0.35, speed: 0.96, use_speaker_boost: true } }, // Charlotte
  Robot: { id: 'JBFqnCBsd6RMkjVDRZzb', settings: { stability: 0.9, similarity_boost: 0.4, style: 0, speed: 0.92, use_speaker_boost: false } }, // George
}

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

    const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${v.id}?output_format=mp3_44100_128`, {
      method: 'POST',
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
        Accept: 'audio/mpeg',
      },
      body: JSON.stringify({
        text: text.slice(0, 2500),
        model_id: MODEL,
        voice_settings: v.settings,
      }),
    })

    if (!r.ok) {
      const detail = await r.text().catch(() => '')
      res.status(502).json({ error: `ElevenLabs ${r.status}`, detail: detail.slice(0, 400) })
      return
    }

    const buf = Buffer.from(await r.arrayBuffer())
    res.status(200).json({ url: `data:audio/mpeg;base64,${buf.toString('base64')}` })
  } catch (err) {
    console.error('generate-audio error:', err)
    res.status(500).json({ error: String(err?.message || err) })
  }
}

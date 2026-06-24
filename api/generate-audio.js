// Voix des histoires via ElevenLabs en DIRECT (abonnement de l'utilisateur, 100k crédits/mois).
// Renvoie l'audio en data-URL base64 → le lecteur joue ça sans changement côté client.
const MODEL = process.env.ELEVENLABS_MODEL || 'eleven_multilingual_v2'

// Voix de Grabi (créée via Voice Design ElevenLabs). Une seule voix « Grabi »,
// déclinée en 4 humeurs via les réglages. Changeable via la variable GRABI_VOICE_ID.
const GRABI = process.env.GRABI_VOICE_ID || 'w7wCAI1AvmPJFN5cZIu3'
const VOICES = {
  Douce: { id: GRABI, settings: { stability: 0.6, similarity_boost: 0.8, style: 0.12, speed: 0.95, use_speaker_boost: true } },
  Rigolote: { id: GRABI, settings: { stability: 0.35, similarity_boost: 0.8, style: 0.55, speed: 1.08, use_speaker_boost: true } },
  Magique: { id: GRABI, settings: { stability: 0.5, similarity_boost: 0.85, style: 0.35, speed: 0.96, use_speaker_boost: true } },
  Robot: { id: GRABI, settings: { stability: 0.95, similarity_boost: 0.5, style: 0, speed: 0.9, use_speaker_boost: false } },
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

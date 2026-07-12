import { abuseBlocked } from './_guard.js'
// Effets sonores via ElevenLabs Sound Effects (sound-generation).
// Sert pour : (1) les petits bruits mignons de Grabi (onomatopées, courts) ;
// (2) les musiques d'ambiance en BOUCLE PARFAITE (loop: true) pour le fond de l'app
// et de chaque histoire.
// POST { prompt, duration?, loop?, influence? } -> { url: data-URL mp3 }
export const config = { maxDuration: 90 }

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Méthode non autorisée.' })
    return
  }
  if (abuseBlocked(req, res)) return
  if (!process.env.ELEVENLABS_API_KEY) {
    res.status(500).json({ error: 'ELEVENLABS_API_KEY manquante (voir .env.example).' })
    return
  }
  try {
    const { prompt, duration, loop, influence } = req.body || {}
    if (!prompt || typeof prompt !== 'string') {
      res.status(400).json({ error: 'Prompt du son manquant.' })
      return
    }
    const body = {
      text: prompt.slice(0, 450),
      prompt_influence: typeof influence === 'number' ? influence : 0.4,
    }
    if (typeof duration === 'number') body.duration_seconds = Math.min(22, Math.max(0.5, duration))
    if (loop) body.loop = true // boucle sans couture (ambiances de fond)

    const r = await fetch('https://api.elevenlabs.io/v1/sound-generation', {
      method: 'POST',
      headers: { 'xi-api-key': process.env.ELEVENLABS_API_KEY, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
      body: JSON.stringify(body),
    })
    if (!r.ok) {
      const detail = await r.text().catch(() => '')
      res.status(502).json({ error: `ElevenLabs ${r.status}`, detail: detail.slice(0, 400) })
      return
    }
    const buf = Buffer.from(await r.arrayBuffer())
    res.status(200).json({ url: `data:audio/mpeg;base64,${buf.toString('base64')}` })
  } catch (err) {
    console.error('generate-sfx error:', err)
    res.status(500).json({ error: String(err?.message || err) })
  }
}

import { abuseBlocked } from './_guard.js'
// Vraie musique via l'API ElevenLabs Music (et non les SFX, qui sonnaient bizarre
// pour de la musique). Sert à générer les boucles de fond agréables.
// POST { prompt, ms? } -> { url: data-URL mp3 }
export const config = { maxDuration: 120 }

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
    const { prompt, ms, force_instrumental } = req.body || {}
    if (!prompt || typeof prompt !== 'string') {
      res.status(400).json({ error: 'Prompt de la musique manquant.' })
      return
    }
    const r = await fetch('https://api.elevenlabs.io/v1/music', {
      method: 'POST',
      headers: { 'xi-api-key': process.env.ELEVENLABS_API_KEY, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
      body: JSON.stringify({
        prompt: prompt.slice(0, 800),
        music_length_ms: Math.min(120000, Math.max(10000, ms || 30000)),
        force_instrumental: force_instrumental !== false, // défaut: instrumental, AUCUNE parole
      }),
    })
    if (!r.ok) {
      const detail = await r.text().catch(() => '')
      res.status(502).json({ error: `ElevenLabs ${r.status}`, detail: detail.slice(0, 500) })
      return
    }
    const buf = Buffer.from(await r.arrayBuffer())
    res.status(200).json({ url: `data:audio/mpeg;base64,${buf.toString('base64')}`, bytes: buf.length })
  } catch (err) {
    console.error('generate-music error:', err)
    res.status(500).json({ error: String(err?.message || err) })
  }
}

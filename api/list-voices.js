// Liste les voix du compte ElevenLabs (pour repérer les voix françaises à utiliser).
// Endpoint utilitaire (appelé une fois pour choisir les voice_id), pas par l'app.
export const config = { maxDuration: 30 }

export default async function handler(req, res) {
  if (!process.env.ELEVENLABS_API_KEY) {
    res.status(500).json({ error: 'ELEVENLABS_API_KEY manquante.' })
    return
  }
  try {
    const r = await fetch('https://api.elevenlabs.io/v1/voices', {
      headers: { 'xi-api-key': process.env.ELEVENLABS_API_KEY },
    })
    if (!r.ok) {
      res.status(502).json({ error: `ElevenLabs ${r.status}`, detail: (await r.text().catch(() => '')).slice(0, 400) })
      return
    }
    const data = await r.json()
    const voices = (data.voices || []).map((v) => ({
      voice_id: v.voice_id,
      name: v.name,
      category: v.category,
      labels: v.labels || {},
    }))
    res.status(200).json({ count: voices.length, voices })
  } catch (err) {
    res.status(500).json({ error: String(err?.message || err) })
  }
}

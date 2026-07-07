// Décide LE fournisseur de voix pour une histoire ENTIÈRE (cohérence : tout ElevenLabs
// OU tout Gemini, jamais un mélange en cours d'histoire). Appelé UNE fois avant de narrer.
// - admin (histoires gratuites / de la semaine faites par toi) -> ElevenLabs toujours.
// - créations des utilisateurs -> ElevenLabs tant qu'il reste assez de crédits pour TOUTE
//   l'histoire (avec marge), sinon Gemini.
export const config = { maxDuration: 15 }

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Méthode non autorisée.' })
    return
  }
  const { chars = 0, admin = false } = req.body || {}

  // Contenu admin -> toujours ElevenLabs (le repli dans generate-audio protège si échec).
  if (admin) { res.status(200).json({ provider: 'eleven', reason: 'admin' }); return }

  // Pas de clé ElevenLabs -> Gemini d'office.
  if (!process.env.ELEVENLABS_API_KEY) { res.status(200).json({ provider: 'gemini', reason: 'no-eleven-key' }); return }

  try {
    const r = await fetch('https://api.elevenlabs.io/v1/user/subscription', {
      headers: { 'xi-api-key': process.env.ELEVENLABS_API_KEY },
    })
    if (!r.ok) { res.status(200).json({ provider: 'gemini', reason: `eleven-${r.status}` }); return }
    const s = await r.json()
    const remaining = (s.character_limit || 0) - (s.character_count || 0)
    // Il faut assez pour TOUTE l'histoire (marge +15 % pour les balises d'émotion v3).
    const needed = Math.ceil((chars || 0) * 1.15)
    const provider = remaining >= needed ? 'eleven' : 'gemini'
    res.status(200).json({ provider, remaining, needed })
  } catch (e) {
    console.error('audio-plan error:', e)
    res.status(200).json({ provider: 'gemini', reason: 'error' })
  }
}

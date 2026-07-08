// Décide LE fournisseur de voix pour une histoire ENTIÈRE (cohérence : tout ElevenLabs
// OU tout Gemini, jamais un mélange en cours d'histoire). Appelé UNE fois avant de narrer.
// - admin (histoires gratuites / de la semaine faites par toi) -> ElevenLabs toujours.
// - créations des utilisateurs -> ElevenLabs tant qu'il reste des crédits, sinon Gemini.
export const config = { maxDuration: 15 }

const BASE_VOICE = process.env.VOICE_BASE_ID || 'DguSKGFJeOJdyMI6NrYY'

// Sonde directe : ElevenLabs accepte-t-il de générer MAINTENANT ? Sert de repli quand la
// clé n'a pas la permission `user_read` (lecture du quota) : on ne peut pas lire le solde,
// alors on tente une mini-synthèse. 200 -> il reste des crédits (eleven) ; refus (401/402
// quota épuisé) -> gemini. Coûte ~8 caractères, négligeable sur le quota mensuel.
async function elevenWorks() {
  try {
    const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${BASE_VOICE}?output_format=mp3_44100_128`, {
      method: 'POST',
      headers: { 'xi-api-key': process.env.ELEVENLABS_API_KEY, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
      body: JSON.stringify({ text: 'Bonjour.', model_id: 'eleven_multilingual_v2' }),
    })
    return r.ok
  } catch {
    return false
  }
}

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
    if (r.ok) {
      // Cas idéal (clé AVEC permission user_read) : on connaît le solde exact et on bascule
      // sur Gemini AVANT épuisement (assez pour TOUTE l'histoire, marge +15 % pour les balises).
      const s = await r.json()
      const remaining = (s.character_limit || 0) - (s.character_count || 0)
      const needed = Math.ceil((chars || 0) * 1.15)
      res.status(200).json({ provider: remaining >= needed ? 'eleven' : 'gemini', remaining, needed })
      return
    }
    // La clé ne peut pas lire le quota (401/403) : on SONDE la synthèse. Tant qu'ElevenLabs
    // génère, on l'utilise pour toute l'histoire ; une fois les crédits épuisés, il refuse -> Gemini.
    const ok = await elevenWorks()
    res.status(200).json({ provider: ok ? 'eleven' : 'gemini', reason: ok ? 'probe-ok' : `probe-fail-${r.status}` })
  } catch (e) {
    console.error('audio-plan error:', e)
    // Souci réseau sur la lecture du quota -> on tente quand même une sonde, sinon Gemini.
    const ok = await elevenWorks().catch(() => false)
    res.status(200).json({ provider: ok ? 'eleven' : 'gemini', reason: 'error-probe' })
  }
}

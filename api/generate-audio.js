import { put, list } from '@vercel/blob'

// Voix des histoires via ElevenLabs en DIRECT (abonnement de l'utilisateur).
// ElevenLabs v3 par défaut → narration émotive + balises audio [whispers], [laughs]…
// dans le texte. Repli automatique sur multilingual_v2 (balises retirées) si v3 indispo.
// CACHE PARTAGÉ (Vercel Blob) : une fois une (voix+texte) générée par UN utilisateur,
// l'audio est stocké et réutilisé par TOUS → 0 crédit pour les suivants. Repli data-URL
// si le store Blob n'est pas configuré (BLOB_READ_WRITE_TOKEN absent).
const MODEL = process.env.ELEVENLABS_MODEL || 'eleven_v3'
const FALLBACK_MODEL = 'eleven_multilingual_v2'
const USE_BLOB = !!process.env.BLOB_READ_WRITE_TOKEN
const CACHE_VERSION = 'g3' // bump pour invalider le cache partagé

// Clé stable du cache partagé (voix RÉELLE + texte) -> même histoire/voix = même fichier
// pour tout le monde. L'ID de voix dans la clé invalide automatiquement si la voix change.
function blobKey(voiceId, text) {
  const s = `${CACHE_VERSION}|${voiceId}|${text}`
  let h = 5381
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0
  return `narration/${(h >>> 0).toString(36)}_${s.length}.mp3`
}

// Voix de BASE de la narration (choisie par l'utilisateur) : une seule voix, déclinée
// en 4 humeurs via les réglages. Chaque slot reste remplaçable par une autre voix via
// une variable d'env (VOICE_*_ID). NB : Grabi ne narre plus (voir generate-sfx.js).
const env = (k, d) => process.env[k] || d
const BASE = process.env.VOICE_BASE_ID || 'DguSKGFJeOJdyMI6NrYY'
const VOICES = {
  Douce: { id: env('VOICE_DOUCE_ID', BASE), settings: { stability: 0.5, similarity_boost: 0.8, style: 0.12, speed: 0.96, use_speaker_boost: true } },
  Rigolote: { id: env('VOICE_RIGOLOTE_ID', BASE), settings: { stability: 0.4, similarity_boost: 0.75, style: 0.45, speed: 1.04, use_speaker_boost: true } },
  Magique: { id: env('VOICE_MAGIQUE_ID', BASE), settings: { stability: 0.5, similarity_boost: 0.8, style: 0.3, speed: 0.97, use_speaker_boost: true } },
  Robot: { id: env('VOICE_ROBOT_ID', BASE), settings: { stability: 0.9, similarity_boost: 0.45, style: 0, speed: 0.92, use_speaker_boost: false } },
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
    const key = blobKey(v.id, text)

    // 0) Déjà généré par quelqu'un ? -> on renvoie le fichier partagé (0 crédit ElevenLabs).
    if (USE_BLOB) {
      try {
        const { blobs } = await list({ prefix: key, limit: 1 })
        if (blobs.length && blobs[0].pathname === key) {
          res.status(200).json({ url: blobs[0].url, cached: true })
          return
        }
      } catch {
        /* store indispo -> on génère normalement */
      }
    }

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

    // Stocke dans le cache partagé : les prochains utilisateurs ne repaieront pas la voix.
    if (USE_BLOB) {
      try {
        const blob = await put(key, buf, { access: 'public', addRandomSuffix: false, contentType: 'audio/mpeg' })
        res.status(200).json({ url: blob.url, model: used, cached: false })
        return
      } catch (e) {
        console.error('blob put error:', e) // repli data-URL ci-dessous
      }
    }
    res.status(200).json({ url: `data:audio/mpeg;base64,${buf.toString('base64')}`, model: used, cached: false })
  } catch (err) {
    console.error('generate-audio error:', err)
    res.status(500).json({ error: String(err?.message || err) })
  }
}

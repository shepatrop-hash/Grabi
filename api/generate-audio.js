import { put, list } from '@vercel/blob'

// Narration des histoires. Deux fournisseurs :
// - AUDIO_PROVIDER=gemini (défaut) -> Gemini TTS (gemini-2.5-pro-preview-tts), ~8× moins cher.
// - AUDIO_PROVIDER=eleven          -> ElevenLabs v3 (voix Koraly, balises d'émotion).
// Repli AUTOMATIQUE sur ElevenLabs si Gemini échoue, et sur multilingual_v2 si v3 échoue.
// CACHE PARTAGÉ (Vercel Blob) : une (fournisseur+voix+texte) générée par UN utilisateur est
// réutilisée par TOUS -> 0 crédit pour les suivants.
const PROVIDER = process.env.AUDIO_PROVIDER || 'gemini'
const CACHE_VERSION = 'g4' // bump pour invalider le cache partagé
const USE_BLOB = !!process.env.BLOB_READ_WRITE_TOKEN

// --- Gemini TTS ---
const GEMINI_MODEL = process.env.GEMINI_TTS_MODEL || 'gemini-2.5-pro-preview-tts'
// 4 voix (clés partagées avec src/lib/voices.js). Voix Gemini validées : Aoede ♀, Puck ♂.
// Pour Douce/Noe (voix ElevenLabs), l'entrée Gemini sert de REPLI si les crédits EL sont épuisés.
const GEMINI_VOICES = {
  Aria: { voice: 'Aoede', tone: 'une voix douce et féérique, tendre et rassurante pour le coucher' },
  Douce: { voice: 'Aoede', tone: 'une voix très douce, tendre et chaleureuse, rassurante pour le coucher' },
  Malo: { voice: 'Puck', tone: "une voix rigolote, vive et espiègle, pleine d'entrain et de sourire" },
  Noe: { voice: 'Puck', tone: 'une voix chaleureuse et posée de gentil conteur du soir' },
}

// --- ElevenLabs ---
const EL_MODEL = process.env.ELEVENLABS_MODEL || 'eleven_v3'
const EL_FALLBACK = 'eleven_multilingual_v2'
const env = (k, d) => process.env[k] || d
const BASE = process.env.VOICE_BASE_ID || 'DguSKGFJeOJdyMI6NrYY' // féminine (Koraly)
const HOMME = process.env.VOICE_HOMME_ID || 'JBFqnCBsd6RMkjVDRZzb' // masculine (premade « George », surchargeable)
const EL_VOICES = {
  Douce: { id: env('VOICE_DOUCE_ID', BASE), settings: { stability: 0.5, similarity_boost: 0.8, style: 0.12, speed: 0.96, use_speaker_boost: true } },
  Noe: { id: HOMME, settings: { stability: 0.55, similarity_boost: 0.75, style: 0.1, speed: 0.96, use_speaker_boost: true } },
  // Aria/Malo sont des voix Gemini : ces entrées ne servent que de repli d'urgence si Gemini échoue.
  Aria: { id: env('VOICE_DOUCE_ID', BASE), settings: { stability: 0.5, similarity_boost: 0.8, style: 0.2, speed: 0.97, use_speaker_boost: true } },
  Malo: { id: HOMME, settings: { stability: 0.4, similarity_boost: 0.75, style: 0.35, speed: 1.02, use_speaker_boost: true } },
}

export const config = { maxDuration: 60 }

// Retire les balises [softly], [whispers]… (v3 les gère, Gemini non -> ton via prompt).
const stripTags = (t) => t.replace(/\[[^\]]*\]/g, ' ').replace(/\s{2,}/g, ' ').trim()

// Clé de cache partagée (fournisseur + voix + texte) -> même histoire/voix = même fichier pour tous.
function blobKey(tag, text, ext) {
  const s = `${CACHE_VERSION}|${tag}|${text}`
  let h = 5381
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0
  return `narration/${(h >>> 0).toString(36)}_${s.length}.${ext}`
}

// PCM 16 bits mono (Gemini) -> WAV jouable.
function pcmToWav(pcm, sampleRate) {
  const byteRate = sampleRate * 2
  const h = Buffer.alloc(44)
  h.write('RIFF', 0); h.writeUInt32LE(36 + pcm.length, 4); h.write('WAVE', 8)
  h.write('fmt ', 12); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22)
  h.writeUInt32LE(sampleRate, 24); h.writeUInt32LE(byteRate, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34)
  h.write('data', 36); h.writeUInt32LE(pcm.length, 40)
  return Buffer.concat([h, pcm])
}

// --- Génération Gemini : renvoie { buf, contentType, ext } ou lève une erreur (-> repli). ---
async function genGemini(text, voiceKey) {
  const v = GEMINI_VOICES[voiceKey] || GEMINI_VOICES.Douce
  const instruction = `Raconte cette histoire du soir pour un jeune enfant de façon vivante et expressive, avec un bon rythme (jamais lent ni monocorde), en changeant d'intonation selon l'action. Prends ${v.tone} :`
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`, {
    method: 'POST',
    headers: { 'x-goog-api-key': process.env.GEMINI_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: `${instruction}\n\n${stripTags(text)}` }] }],
      generationConfig: { responseModalities: ['AUDIO'], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: v.voice } } } },
    }),
  })
  if (!r.ok) throw new Error(`Gemini TTS ${r.status}`)
  const data = await r.json()
  const part = data?.candidates?.[0]?.content?.parts?.find((p) => p.inlineData)
  if (!part) throw new Error('Gemini: pas d\'audio')
  const rate = parseInt((String(part.inlineData.mimeType).match(/rate=(\d+)/) || [])[1] || '24000', 10)
  return { buf: pcmToWav(Buffer.from(part.inlineData.data, 'base64'), rate), contentType: 'audio/wav', ext: 'wav', tag: `gemini|${GEMINI_MODEL}|${v.voice}` }
}

// --- Génération ElevenLabs : renvoie { buf, contentType, ext } ou lève une erreur. ---
async function genEleven(text, voiceKey) {
  const v = EL_VOICES[voiceKey] || EL_VOICES.Douce
  const call = (txt, model) => {
    const settings = model.includes('v3')
      ? { stability: v.settings.stability, similarity_boost: v.settings.similarity_boost, use_speaker_boost: v.settings.use_speaker_boost }
      : v.settings
    return fetch(`https://api.elevenlabs.io/v1/text-to-speech/${v.id}?output_format=mp3_44100_128`, {
      method: 'POST',
      headers: { 'xi-api-key': process.env.ELEVENLABS_API_KEY, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
      body: JSON.stringify({ text: txt.slice(0, 2500), model_id: model, voice_settings: settings }),
    })
  }
  let r = await call(text, EL_MODEL)
  if (!r.ok && EL_MODEL !== EL_FALLBACK) r = await call(stripTags(text), EL_FALLBACK)
  if (!r.ok) throw new Error(`ElevenLabs ${r.status}`)
  return { buf: Buffer.from(await r.arrayBuffer()), contentType: 'audio/mpeg', ext: 'mp3', tag: `eleven|${v.id}` }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Méthode non autorisée.' }); return }
  const { text, voice, provider: forced } = req.body || {}
  if (!text || typeof text !== 'string') { res.status(400).json({ error: 'Texte à lire manquant.' }); return }

  // Fournisseur VOULU : forcé par l'appelant (cohérence par histoire décidée via /api/audio-plan)
  // sinon le défaut d'env. On tente ce fournisseur, puis l'AUTRE en repli si échec.
  const useGemini = forced === 'gemini' || (forced !== 'eleven' && PROVIDER === 'gemini')
  const order = useGemini && process.env.GEMINI_API_KEY ? ['gemini', 'eleven'] : ['eleven', 'gemini']
  const tagOf = (p) => (p === 'gemini' ? `gemini|${GEMINI_MODEL}|${(GEMINI_VOICES[voice] || GEMINI_VOICES.Douce).voice}` : `eleven|${(EL_VOICES[voice] || EL_VOICES.Douce).id}`)
  const extOf = (p) => (p === 'gemini' ? 'wav' : 'mp3')

  // 0) Déjà en cache partagé (pour le fournisseur voulu) ? -> 0 crédit.
  if (USE_BLOB) {
    try {
      const key = blobKey(tagOf(order[0]), text, extOf(order[0]))
      const { blobs } = await list({ prefix: key, limit: 1 })
      if (blobs.length && blobs[0].pathname === key) { res.status(200).json({ url: blobs[0].url, provider: order[0], cached: true }); return }
    } catch { /* store indispo -> on génère */ }
  }

  // Génère avec le fournisseur voulu, repli automatique sur l'autre si échec.
  let out, lastErr
  for (const p of order) {
    try {
      if (p === 'gemini') { if (!process.env.GEMINI_API_KEY) continue; out = await genGemini(text, voice) }
      else { if (!process.env.ELEVENLABS_API_KEY) continue; out = await genEleven(text, voice) }
      break
    } catch (e) { lastErr = e; console.warn(`tts ${p} fail:`, e?.message) }
  }
  if (!out) { res.status(502).json({ error: String(lastErr?.message || 'Aucun fournisseur audio disponible.') }); return }

  const usedProvider = out.tag.split('|')[0]
  if (USE_BLOB) {
    try {
      const key = blobKey(out.tag, text, out.ext)
      const blob = await put(key, out.buf, { access: 'public', addRandomSuffix: false, contentType: out.contentType })
      res.status(200).json({ url: blob.url, provider: usedProvider, cached: false })
      return
    } catch (e) { console.error('blob put error:', e) /* repli data-URL */ }
  }
  res.status(200).json({ url: `data:${out.contentType};base64,${out.buf.toString('base64')}`, provider: usedProvider, cached: false })
}

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
// Les 4 « humeurs » -> une voix Gemini + un ton (validées à l'oreille : Aoede féminine, Puck masculine).
const GEMINI_VOICES = {
  Douce: { voice: 'Aoede', tone: 'une voix très douce, tendre et chaleureuse, rassurante pour le coucher' },
  Rigolote: { voice: 'Puck', tone: "une voix rigolote, vive et espiègle, pleine d'entrain et de sourire" },
  Magique: { voice: 'Aoede', tone: 'une voix douce et féérique, un peu mystérieuse et émerveillée' },
  Robot: { voice: 'Aoede', tone: 'une voix de gentil petit robot rigolo, au ton régulier et amusant' },
}

// --- ElevenLabs (repli) ---
const EL_MODEL = process.env.ELEVENLABS_MODEL || 'eleven_v3'
const EL_FALLBACK = 'eleven_multilingual_v2'
const env = (k, d) => process.env[k] || d
const BASE = process.env.VOICE_BASE_ID || 'DguSKGFJeOJdyMI6NrYY'
const EL_VOICES = {
  Douce: { id: env('VOICE_DOUCE_ID', BASE), settings: { stability: 0.5, similarity_boost: 0.8, style: 0.12, speed: 0.96, use_speaker_boost: true } },
  Rigolote: { id: env('VOICE_RIGOLOTE_ID', BASE), settings: { stability: 0.4, similarity_boost: 0.75, style: 0.45, speed: 1.04, use_speaker_boost: true } },
  Magique: { id: env('VOICE_MAGIQUE_ID', BASE), settings: { stability: 0.5, similarity_boost: 0.8, style: 0.3, speed: 0.97, use_speaker_boost: true } },
  Robot: { id: env('VOICE_ROBOT_ID', BASE), settings: { stability: 0.9, similarity_boost: 0.45, style: 0, speed: 0.92, use_speaker_boost: false } },
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
  const { text, voice } = req.body || {}
  if (!text || typeof text !== 'string') { res.status(400).json({ error: 'Texte à lire manquant.' }); return }

  const wantGemini = PROVIDER === 'gemini' && !!process.env.GEMINI_API_KEY
  const primaryTag = wantGemini ? `gemini|${GEMINI_MODEL}|${(GEMINI_VOICES[voice] || GEMINI_VOICES.Douce).voice}` : `eleven|${(EL_VOICES[voice] || EL_VOICES.Douce).id}`
  const primaryExt = wantGemini ? 'wav' : 'mp3'

  // 0) Déjà en cache partagé ? -> 0 crédit.
  if (USE_BLOB) {
    try {
      const key = blobKey(primaryTag, text, primaryExt)
      const { blobs } = await list({ prefix: key, limit: 1 })
      if (blobs.length && blobs[0].pathname === key) { res.status(200).json({ url: blobs[0].url, cached: true }); return }
    } catch { /* store indispo -> on génère */ }
  }

  try {
    let out
    if (wantGemini) {
      try { out = await genGemini(text, voice) }
      catch (e) { console.warn('gemini tts fail, repli elevenlabs:', e?.message); out = await genEleven(text, voice) }
    } else {
      out = await genEleven(text, voice)
    }

    if (USE_BLOB) {
      try {
        const key = blobKey(out.tag, text, out.ext)
        const blob = await put(key, out.buf, { access: 'public', addRandomSuffix: false, contentType: out.contentType })
        res.status(200).json({ url: blob.url, cached: false })
        return
      } catch (e) { console.error('blob put error:', e) /* repli data-URL */ }
    }
    res.status(200).json({ url: `data:${out.contentType};base64,${out.buf.toString('base64')}`, cached: false })
  } catch (err) {
    console.error('generate-audio error:', err)
    res.status(502).json({ error: String(err?.message || err) })
  }
}

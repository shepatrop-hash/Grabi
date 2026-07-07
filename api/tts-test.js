import { put } from '@vercel/blob'

// Route de TEST : narration via Gemini TTS (pour comparer à ElevenLabs v3).
// Utilise la clé GEMINI_API_KEY déjà présente sur Vercel — aucun nouveau compte.
// Gemini TTS renvoie du PCM brut (L16, 24 kHz) -> on l'emballe en WAV pour le rendre lisible.
const TTS_MODEL = process.env.GEMINI_TTS_MODEL || 'gemini-2.5-flash-preview-tts'
const DEFAULT_VOICE = process.env.GEMINI_TTS_VOICE || 'Kore'

export const config = { maxDuration: 60 }

// Retire les balises d'émotion [softly], [whispers]… (propres à ElevenLabs v3) :
// Gemini ne les gère pas par balise mais via une instruction de style.
const stripTags = (t) => t.replace(/\[[^\]]*\]/g, ' ').replace(/\s{2,}/g, ' ').trim()

// PCM 16 bits mono -> fichier WAV jouable (en-tête 44 octets).
function pcmToWav(pcm, sampleRate) {
  const channels = 1
  const bits = 16
  const byteRate = (sampleRate * channels * bits) / 8
  const blockAlign = (channels * bits) / 8
  const h = Buffer.alloc(44)
  h.write('RIFF', 0)
  h.writeUInt32LE(36 + pcm.length, 4)
  h.write('WAVE', 8)
  h.write('fmt ', 12)
  h.writeUInt32LE(16, 16)
  h.writeUInt16LE(1, 20)
  h.writeUInt16LE(channels, 22)
  h.writeUInt32LE(sampleRate, 24)
  h.writeUInt32LE(byteRate, 28)
  h.writeUInt16LE(blockAlign, 32)
  h.writeUInt16LE(bits, 34)
  h.write('data', 36)
  h.writeUInt32LE(pcm.length, 40)
  return Buffer.concat([h, pcm])
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Méthode non autorisée.' })
    return
  }
  if (!process.env.GEMINI_API_KEY) {
    res.status(500).json({ error: 'GEMINI_API_KEY manquante.' })
    return
  }
  const { text, style, voice } = req.body || {}
  if (!text || typeof text !== 'string') {
    res.status(400).json({ error: 'Texte manquant.' })
    return
  }
  const clean = stripTags(text)
  const instruction =
    style ||
    "Lis cette histoire du soir pour un jeune enfant d'une voix douce, chaleureuse, posée et rassurante, avec des intonations tendres et un rythme lent :"
  const voiceName = voice || DEFAULT_VOICE

  try {
    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${TTS_MODEL}:generateContent`,
      {
        method: 'POST',
        headers: { 'x-goog-api-key': process.env.GEMINI_API_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${instruction}\n\n${clean}` }] }],
          generationConfig: {
            responseModalities: ['AUDIO'],
            speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName } } },
          },
        }),
      }
    )
    if (!resp.ok) {
      const detail = await resp.text().catch(() => '')
      res.status(502).json({ error: `Gemini TTS ${resp.status}`, detail: detail.slice(0, 600), model: TTS_MODEL })
      return
    }
    const data = await resp.json()
    const part = data?.candidates?.[0]?.content?.parts?.find((p) => p.inlineData)
    if (!part) {
      res.status(502).json({ error: "Pas d'audio dans la réponse Gemini.", raw: JSON.stringify(data).slice(0, 500) })
      return
    }
    const mime = part.inlineData.mimeType || ''
    const rate = parseInt((mime.match(/rate=(\d+)/) || [])[1] || '24000', 10)
    const pcm = Buffer.from(part.inlineData.data, 'base64')
    const wav = pcmToWav(pcm, rate)

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put('tts-test/gemini.wav', wav, { access: 'public', addRandomSuffix: true, contentType: 'audio/wav' })
      res.status(200).json({ url: blob.url, provider: 'gemini', model: TTS_MODEL, voice: voiceName })
      return
    }
    res.status(200).json({ url: `data:audio/wav;base64,${wav.toString('base64')}`, provider: 'gemini', model: TTS_MODEL, voice: voiceName })
  } catch (err) {
    console.error('tts-test error:', err)
    res.status(500).json({ error: String(err?.message || err) })
  }
}

// Échantillon de narration via Gemini TTS (gemini-2.5-flash-preview-tts) — pour comparer
// coût/qualité vs ElevenLabs. Gemini renvoie du PCM 16-bit brut → on l'emballe en WAV
// (jouable dans un navigateur) renvoyé en data-URL.
const MODEL = process.env.GEMINI_TTS_MODEL || 'gemini-2.5-flash-preview-tts'
const VOICE = process.env.GEMINI_TTS_VOICE || 'Aoede'

export const config = { maxDuration: 60 }

// Cherche récursivement l'audio base64 dans la réponse (inlineData.data, mime audio/*).
function findAudio(obj, depth = 0) {
  if (depth > 12 || obj == null || typeof obj !== 'object') return null
  const mime = obj.mimeType || obj.mime_type
  if (typeof obj.data === 'string' && obj.data.length > 200 && (!mime || /audio|pcm|l16/i.test(mime))) {
    return { data: obj.data.replace(/\s/g, ''), mime: mime || '' }
  }
  for (const k of Object.keys(obj)) {
    const r = findAudio(obj[k], depth + 1)
    if (r) return r
  }
  return null
}

// Emballe du PCM 16-bit mono dans un conteneur WAV.
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
  try {
    const { text, voice, style, debug } = req.body || {}
    if (!text || typeof text !== 'string') {
      res.status(400).json({ error: 'Texte manquant.' })
      return
    }
    const directive = style || "Lis ce texte d'une voix douce, tendre et chaleureuse, comme une histoire du soir pour un jeune enfant"
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
      method: 'POST',
      headers: { 'x-goog-api-key': process.env.GEMINI_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${directive} : ${text}` }] }],
        generationConfig: {
          responseModalities: ['AUDIO'],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice || VOICE } } },
        },
      }),
    })
    if (!r.ok) {
      const detail = await r.text().catch(() => '')
      res.status(502).json({ error: `Gemini ${r.status}`, detail: detail.slice(0, 600), model: MODEL })
      return
    }
    const data = await r.json()
    if (debug) {
      const sum = JSON.parse(JSON.stringify(data, (k, v) => (typeof v === 'string' && v.length > 80 ? `<str ${v.length}>` : v)))
      res.status(200).json({ structure: sum })
      return
    }
    const audio = findAudio(data)
    if (!audio) {
      res.status(502).json({ error: "Pas d'audio dans la réponse.", keys: Object.keys(data || {}) })
      return
    }
    const m = /rate=(\d+)/.exec(audio.mime || '')
    const rate = m ? parseInt(m[1], 10) : 24000
    const pcm = Buffer.from(audio.data, 'base64')
    const wav = pcmToWav(pcm, rate)
    res.status(200).json({ url: `data:audio/wav;base64,${wav.toString('base64')}`, mime: audio.mime, rate, voice: voice || VOICE, bytes: wav.length })
  } catch (err) {
    console.error('gemini tts error:', err)
    res.status(500).json({ error: String(err?.message || err) })
  }
}

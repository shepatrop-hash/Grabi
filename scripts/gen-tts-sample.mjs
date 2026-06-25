// Génère 2 échantillons de narration sur LE MÊME texte, pour comparer à l'oreille :
// - public/sample-gemini.wav      (Gemini 2.5 Flash TTS, ~$0,03/histoire)
// - public/sample-elevenlabs.mp3  (ElevenLabs v3 actuel, ~$0,33/histoire)
//   node scripts/gen-tts-sample.mjs
import { writeFile } from 'node:fs/promises'

const BASE = process.env.GRABI_URL || 'https://grabi-eight.vercel.app'
const TEXT =
  "Dans une forêt toute douce, un petit lapin aux grandes oreilles regardait les étoiles. Il bâilla, ferma les yeux, et s'endormit en souriant. Bonne nuit, petit lapin."

// Gemini TTS -> WAV
try {
  const g = await fetch(`${BASE}/api/generate-tts-gemini`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: TEXT }),
  })
  if (!g.ok) throw new Error(`${g.status} ${(await g.text()).slice(0, 200)}`)
  const { url, bytes } = await g.json()
  await writeFile('public/sample-gemini.wav', Buffer.from(url.split(',')[1], 'base64'))
  console.log('✓ gemini', ((bytes || 0) / 1024).toFixed(0) + ' Ko')
} catch (e) {
  console.error('✗ gemini', e.message)
}

// ElevenLabs (voix actuelle) -> mp3
try {
  const e = await fetch(`${BASE}/api/generate-audio`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: TEXT, voice: 'Douce' }),
  })
  if (!e.ok) throw new Error(`${e.status} ${(await e.text()).slice(0, 200)}`)
  const { url } = await e.json()
  let buf
  if (url.startsWith('data:')) buf = Buffer.from(url.split(',')[1], 'base64')
  else {
    const a = await fetch(url)
    buf = Buffer.from(await a.arrayBuffer())
  }
  await writeFile('public/sample-elevenlabs.mp3', buf)
  console.log('✓ elevenlabs', (buf.length / 1024).toFixed(0) + ' Ko')
} catch (err) {
  console.error('✗ elevenlabs', err.message)
}

console.log('Terminé.')

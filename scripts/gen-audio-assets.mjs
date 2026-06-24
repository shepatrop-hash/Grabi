// Génère (une fois) les sons de l'app via l'API ElevenLabs SFX déployée, et les
// enregistre dans /public : 5 petits bruits mignons de Grabi + 6 boucles musicales
// d'ambiance (app par défaut + 5 humeurs d'histoire). Lecture ensuite instantanée,
// 0 crédit à l'usage.
//   node scripts/gen-audio-assets.mjs
import { writeFile, mkdir } from 'node:fs/promises'

const BASE = process.env.GRABI_URL || 'https://grabi-eight.vercel.app'

async function sfx(prompt, { duration, loop, influence } = {}) {
  const r = await fetch(`${BASE}/api/generate-sfx`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, duration, loop, influence }),
  })
  if (!r.ok) throw new Error(`${r.status} ${(await r.text()).slice(0, 200)}`)
  const { url } = await r.json()
  return Buffer.from(url.split(',')[1], 'base64')
}

// Petits bruits de Grabi (courts, mignons, pas de boucle).
const GRABI = [
  ['grabi-1', 'cute tiny cartoon creature happy chirp and squeak, playful and friendly, single short sound'],
  ['grabi-2', 'cute little creature curious questioning soft "hmm?" boop, adorable, single short sound'],
  ['grabi-3', 'cute cartoon creature gentle giggle and tiny laugh, joyful and soft, single short sound'],
  ['grabi-4', 'cute little creature surprised happy "oh!" pop, bright and playful, single short sound'],
  ['grabi-5', 'cute tiny creature sleepy content little yawn and hum, soft and warm, single short sound'],
]

// Boucles musicales d'ambiance (douces, sans couture).
const MUSIC = [
  ['app', 'soft gentle dreamy music box lullaby, warm cozy childlike, calm and reassuring, seamless loop'],
  ['mood-cozy', 'warm cozy children lullaby, soft ukulele and glockenspiel, gentle and snug, seamless loop'],
  ['mood-dreamy', 'dreamy magical twinkling celesta and soft pads, floating and starry, gentle, seamless loop'],
  ['mood-adventure', 'playful gentle adventure tune, light pizzicato strings and soft whistle, bouncy but soft, seamless loop'],
  ['mood-funny', 'silly playful children tune, bouncy marimba, cheerful and giggly, soft and light, seamless loop'],
  ['mood-calm', 'very calm soft ambient, warm piano and gentle harp, peaceful bedtime, seamless loop'],
]

await mkdir('public/sfx', { recursive: true })
await mkdir('public/music', { recursive: true })

for (const [name, prompt] of GRABI) {
  try {
    const buf = await sfx(prompt, { duration: 1.4, influence: 0.55 })
    await writeFile(`public/sfx/${name}.mp3`, buf)
    console.log('✓ sfx', name, (buf.length / 1024).toFixed(0) + ' Ko')
  } catch (e) {
    console.error('✗ sfx', name, e.message)
  }
}

for (const [name, prompt] of MUSIC) {
  try {
    const buf = await sfx(prompt, { duration: 16, loop: true, influence: 0.3 })
    await writeFile(`public/music/${name}.mp3`, buf)
    console.log('✓ music', name, (buf.length / 1024).toFixed(0) + ' Ko')
  } catch (e) {
    console.error('✗ music', name, e.message)
  }
}

console.log('Terminé.')

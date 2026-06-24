// Génère plusieurs candidats de musique de fond d'app (douce, chaleureuse, PAS
// flippante), pour que l'utilisateur choisisse. Les fichiers vont dans public/music/.
//   node scripts/gen-music-candidates.mjs
import { writeFile, mkdir } from 'node:fs/promises'

const BASE = process.env.GRABI_URL || 'https://grabi-eight.vercel.app'

async function sfx(prompt) {
  const r = await fetch(`${BASE}/api/generate-sfx`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, duration: 18, loop: true, influence: 0.3 }),
  })
  if (!r.ok) throw new Error(`${r.status} ${(await r.text()).slice(0, 160)}`)
  const { url } = await r.json()
  return Buffer.from(url.split(',')[1], 'base64')
}

// Sonorités chaudes/simples/majeures, sans "music box" ni twinkly eerie.
const CANDIDATES = [
  ['app-a', 'Warm gentle children lullaby, soft acoustic guitar and ukulele, simple happy and soothing melody, cozy and friendly, bright major key, calm bedtime, no tension, no dissonance, seamless loop'],
  ['app-b', 'Soft warm piano lullaby for young children, tender and gentle, simple reassuring cheerful melody, peaceful and cozy, warm major key, no tension, seamless loop'],
  ['app-c', 'Gentle cheerful children tune, soft warm marimba and mellow glockenspiel, friendly sweet and simple, cozy and happy, bright major key, soft and calm, no tension, seamless loop'],
  ['app-d', 'Calm warm ambient lullaby, soft warm synth pads and gentle harp, peaceful soothing and simple, cozy bedtime, major key, no tension no suspense, seamless loop'],
]

await mkdir('public/music', { recursive: true })
for (const [name, prompt] of CANDIDATES) {
  try {
    const buf = await sfx(prompt)
    await writeFile(`public/music/${name}.mp3`, buf)
    console.log('✓', name, (buf.length / 1024).toFixed(0) + ' Ko')
  } catch (e) {
    console.error('✗', name, e.message)
  }
}
console.log('Terminé.')

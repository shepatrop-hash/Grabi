// Génère les musiques de fond via la VRAIE API Musique d'ElevenLabs (pas les SFX).
// Noms de fichiers neufs (bg-*) pour éviter tout cache de l'ancienne musique.
//   node scripts/gen-music.mjs
import { writeFile, mkdir } from 'node:fs/promises'

const BASE = process.env.GRABI_URL || 'https://grabi-eight.vercel.app'

async function music(prompt, ms = 30000) {
  const r = await fetch(`${BASE}/api/generate-music`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, ms }),
  })
  if (!r.ok) throw new Error(`${r.status} ${(await r.text()).slice(0, 180)}`)
  const { url } = await r.json()
  return Buffer.from(url.split(',')[1], 'base64')
}

// Musiques douces, chaleureuses, tonalité majeure, rassurantes (enfants 3-7 ans).
const TRACKS = [
  ['bg-app', 'Warm gentle children lullaby, soft piano and acoustic guitar with light glockenspiel, simple soothing melody in a major key, cozy reassuring and happy, calm bedtime feel, no tension no suspense'],
  ['bg-cozy', 'Cozy warm children lullaby, soft ukulele and warm piano, tender and snug, simple sweet major-key melody, calm and reassuring'],
  ['bg-dreamy', 'Dreamy gentle children music, soft piano and warm pads with light bells, magical but warm and reassuring, simple major-key melody, calm'],
  ['bg-adventure', 'Gentle playful children adventure music, light pizzicato strings and soft marimba, cheerful and bouncy but soft, simple major-key melody, warm and fun'],
  ['bg-funny', 'Playful happy children music, bouncy marimba and warm ukulele, cheerful silly and sweet, simple major-key melody, light and fun'],
  ['bg-calm', 'Very calm soft children lullaby, warm piano and gentle harp, peaceful and soothing, simple slow major-key melody, bedtime'],
]

await mkdir('public/music', { recursive: true })
for (const [name, prompt] of TRACKS) {
  try {
    const buf = await music(prompt, 30000)
    await writeFile(`public/music/${name}.mp3`, buf)
    console.log('✓', name, (buf.length / 1024).toFixed(0) + ' Ko')
  } catch (e) {
    console.error('✗', name, e.message)
  }
}
console.log('Terminé.')

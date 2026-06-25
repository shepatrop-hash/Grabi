// Bake (une fois) la narration des histoires GRATUITES avec la voix de base, via
// l'API déployée. Les mp3 vont dans public/free/ (même nom que l'image, .mp3) et on
// ajoute "audio" à chaque page de free-stories.json. Résultat : narration servie à
// TOUS les utilisateurs en statique = 0 crédit ElevenLabs à l'usage.
//   node scripts/gen-free-audio.mjs
import { readFile, writeFile } from 'node:fs/promises'

const BASE = process.env.GRABI_URL || 'https://grabi-eight.vercel.app'
const VOICE = 'Douce' // voix de base bakée

const stories = JSON.parse(await readFile('src/lib/free-stories.json', 'utf8'))
let chars = 0

for (const s of stories) {
  for (const p of s.pages) {
    try {
      const r = await fetch(`${BASE}/api/generate-audio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: p.text, voice: VOICE }),
      })
      if (!r.ok) {
        console.error('✗', s.id, r.status, (await r.text().catch(() => '')).slice(0, 120))
        continue
      }
      const { url } = await r.json()
      let buf
      if (url.startsWith('data:')) buf = Buffer.from(url.split(',')[1], 'base64')
      else { const a = await fetch(url); buf = Buffer.from(await a.arrayBuffer()) }
      const out = p.image.replace(/\.jpg$/i, '.mp3') // /free/dragon-1.mp3
      await writeFile('public' + out, buf)
      p.audio = out
      chars += p.text.length
      console.log('✓', out, (buf.length / 1024).toFixed(0) + ' Ko')
    } catch (e) {
      console.error('✗', s.id, e.message)
    }
  }
}

await writeFile('src/lib/free-stories.json', JSON.stringify(stories, null, 2) + '\n')
console.log(`Terminé. ~${chars} caractères (crédits) dépensés UNE seule fois pour tout le monde.`)

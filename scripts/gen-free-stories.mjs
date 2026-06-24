// Génère les histoires gratuites via les API de prod (Claude + Fal), télécharge
// et redimensionne les illustrations (640px JPEG) dans public/free/, puis écrit
// scripts/free-stories.json. Script ONE-SHOT (contenu baké dans l'app ensuite).
//
// Pré-requis : npm i -D sharp   (puis : node scripts/gen-free-stories.mjs)
// Ensuite : copier scripts/free-stories.json -> src/lib/free-stories.json
import { mkdirSync, writeFileSync } from 'node:fs'
import sharp from 'sharp'

const BASE = process.env.GRABI_BASE || 'https://grabi-eight.vercel.app'
const OUT = 'public/free'
mkdirSync(OUT, { recursive: true })

const IDEAS = [
  { id: 'dragon', idea: 'un petit dragon vert tout gentil qui adore les crêpes au sucre', bg: 'var(--mint-soft)' },
  { id: 'licorne', idea: 'une licorne à la crinière arc-en-ciel qui redonne des couleurs au ciel tout gris', bg: 'var(--pink-soft)' },
  { id: 'ourson', idea: 'un petit ourson tout doux qui cherche un câlin avant d’aller dormir', bg: 'var(--yellow-soft)' },
  { id: 'etoile', idea: 'une petite étoile rieuse qui rassure un enfant qui a peur du noir', bg: 'var(--sky-soft)' },
  { id: 'croco', idea: 'un crocodile tout vert et tout doux qui adore faire des câlins', bg: 'var(--mint-soft)' },
  { id: 'souris', idea: 'une petite souris grise qui rêve de toucher la lune', bg: 'var(--violet-soft)' },
]

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function genStory(idea) {
  const j = await (await fetch(`${BASE}/api/generate-story`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idea, answers: {} }),
  })).json()
  if (!j.story?.pages) throw new Error('story: ' + JSON.stringify(j).slice(0, 160))
  return j.story
}

async function genImageUrl(prompt) {
  const sub = await (await fetch(`${BASE}/api/generate-image`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  })).json()
  if (sub.url) return sub.url
  const { request_id, model } = sub
  if (!request_id) throw new Error('submit: ' + JSON.stringify(sub).slice(0, 120))
  const deadline = Date.now() + 220000
  while (Date.now() < deadline) {
    await sleep(3000)
    const d = await (await fetch(`${BASE}/api/image-status`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ request_id, model }),
    })).json()
    if (d.url) return d.url
    if (d.error) throw new Error(d.error)
  }
  throw new Error('image timeout')
}

async function fetchResize(url, outPath) {
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer())
  await sharp(buf).resize(640, 640, { fit: 'cover' }).jpeg({ quality: 82, mozjpeg: true }).toFile(outPath)
}

const results = []
for (const item of IDEAS) {
  try {
    console.log('STORY', item.id, '…')
    const story = await genStory(item.idea)
    const pages = await Promise.all(
      story.pages.map(async (p, i) => {
        try {
          const url = await genImageUrl(p.prompt_illustration)
          const file = `${item.id}-${i + 1}.jpg`
          await fetchResize(url, `${OUT}/${file}`)
          return { text: p.texte, image: `/free/${file}` }
        } catch (e) {
          console.error('  img fail', item.id, i + 1, e.message)
          return { text: p.texte, image: null }
        }
      }),
    )
    const cover = pages.find((p) => p.image)?.image || null
    results.push({ id: `free-${item.id}`, title: story.titre, sub: '3 min · audio', bg: item.bg, cover, pages })
    console.log('  DONE', item.id, '->', story.titre, '(' + pages.filter((p) => p.image).length + ' imgs)')
  } catch (e) {
    console.error('STORY FAIL', item.id, e.message)
  }
}

writeFileSync('scripts/free-stories.json', JSON.stringify(results, null, 2))
console.log('ALL DONE:', results.length, 'histoires -> scripts/free-stories.json')

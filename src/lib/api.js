import { engineOf } from './voices.js'

// Appelle le backend (fonction serverless Vercel) qui génère l'histoire avec Claude.
// En local, ce endpoint n'existe que via « vercel dev » (pas le simple « npm run dev »).
export async function generateStory(idea, answers = {}) {
  const res = await fetch('/api/generate-story', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idea, answers }),
  })
  if (!res.ok) {
    let detail = ''
    try {
      const data = await res.json()
      detail = data.error || ''
    } catch {
      detail = `HTTP ${res.status}`
    }
    throw new Error(detail || `HTTP ${res.status}`)
  }
  return res.json()
}

// Génère une illustration (Fal.ai / Qwen Image 2).
// Sans imageUrls -> texte→image. Avec imageUrls (références) -> édition (cohérence des personnages).
// Asynchrone : soumet le job à la file Fal puis interroge le statut jusqu'à l'image
// (évite le timeout 60s des fonctions serverless quand le modèle d'édition est lent).
export async function generateImage(prompt, imageUrls) {
  const sub = await fetch('/api/generate-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, image_urls: Array.isArray(imageUrls) ? imageUrls : [] }),
  })
  if (!sub.ok) {
    let detail = ''
    try {
      detail = (await sub.json()).error || ''
    } catch {
      detail = `HTTP ${sub.status}`
    }
    throw new Error(detail || `HTTP ${sub.status}`)
  }
  const submitted = await sub.json()
  if (submitted.url) return submitted // image renvoyée directement (cas rare)
  const { request_id, model } = submitted
  if (!request_id) throw new Error("La soumission de l'illustration a échoué.")

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
  const deadline = Date.now() + 240000 // ~4 min max par image (absorbe les pics de file Fal)
  while (Date.now() < deadline) {
    await sleep(3000)
    let st
    try {
      st = await fetch('/api/image-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request_id, model }),
      })
    } catch {
      continue // souci réseau ponctuel -> on réessaie
    }
    if (!st.ok) continue
    const data = await st.json()
    if (data.url) return { url: data.url, model: data.model }
    if (data.error) throw new Error(data.error)
    // sinon IN_QUEUE / IN_PROGRESS -> on continue d'interroger
  }
  throw new Error("Délai dépassé pour l'illustration.")
}

// Génère des questions de personnalisation adaptées au contexte de l'idée (via Claude).
export async function generateQuestions(idea) {
  const res = await fetch('/api/generate-questions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idea }),
  })
  if (!res.ok) {
    let detail = ''
    try {
      detail = (await res.json()).error || ''
    } catch {
      detail = `HTTP ${res.status}`
    }
    throw new Error(detail || `HTTP ${res.status}`)
  }
  return res.json()
}

// Génère la narration audio d'un texte. `provider` (optionnel : 'eleven' | 'gemini')
// force le fournisseur pour garder TOUTE une histoire cohérente. Renvoie { url, provider }.
export async function generateAudio(text, voice, provider) {
  const res = await fetch('/api/generate-audio', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, voice, provider }),
  })
  if (!res.ok) {
    let detail = ''
    try {
      detail = (await res.json()).error || ''
    } catch {
      detail = `HTTP ${res.status}`
    }
    throw new Error(detail || `HTTP ${res.status}`)
  }
  return res.json()
}

// Décide LE fournisseur de voix pour une histoire entière (cohérence du début à la fin).
// admin=true (histoires gratuites/semaine) -> ElevenLabs ; sinon ElevenLabs si assez de
// crédits pour toute l'histoire, sinon Gemini. Renvoie { provider }. Repli 'eleven' si l'appel échoue.
export async function audioPlan(chars, admin = false) {
  try {
    const res = await fetch('/api/audio-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chars, admin }),
    })
    if (!res.ok) return { provider: 'eleven' }
    return res.json()
  } catch {
    return { provider: 'eleven' }
  }
}

// Fournisseur de narration à utiliser pour UNE histoire, d'après la VOIX choisie :
// - voix Gemini -> toujours Gemini (instantané, 0 appel, moins cher).
// - voix ElevenLabs -> ElevenLabs tant qu'il reste des crédits pour toute l'histoire, sinon Gemini.
export async function resolveProvider(voice, chars) {
  if (engineOf(voice) === 'gemini') return 'gemini'
  const plan = await audioPlan(chars, false)
  return plan?.provider || 'eleven'
}

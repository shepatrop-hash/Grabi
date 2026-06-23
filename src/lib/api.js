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

// Génère une illustration (Fal.ai / Qwen Image 2) à partir du prompt d'une scène.
export async function generateImage(prompt) {
  const res = await fetch('/api/generate-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
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

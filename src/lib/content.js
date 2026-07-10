// Accès au contenu éditable à distance (cf. api/content.js). L'app le lit au démarrage ;
// l'espace admin l'écrit. Repli sur des valeurs vides si l'API/Blob n'est pas dispo.
const DEFAULTS = { featuredEvent: null, episodes: [], longStories: [] }

export async function fetchContent() {
  try {
    const res = await fetch('/api/content', { cache: 'no-store' })
    if (!res.ok) return DEFAULTS
    const d = await res.json()
    return { ...DEFAULTS, ...d }
  } catch {
    return DEFAULTS
  }
}

// Vérifie le mot de passe admin (écran de connexion). true si OK.
export async function checkAdmin(password) {
  try {
    const res = await fetch('/api/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, action: 'check' }),
    })
    return res.ok
  } catch {
    return false
  }
}

// Enregistre le contenu (protégé par mot de passe). Renvoie le contenu nettoyé, lève sinon.
export async function saveContent(password, content) {
  const res = await fetch('/api/content', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password, content }),
  })
  if (!res.ok) {
    let detail = ''
    try { detail = (await res.json()).error || '' } catch { detail = `HTTP ${res.status}` }
    throw new Error(detail || `HTTP ${res.status}`)
  }
  return (await res.json()).content
}

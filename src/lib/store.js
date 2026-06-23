// Persistance locale (localStorage). L'app fonctionne hors-ligne, sur un appareil.
// (Comptes multi-appareils = étape ultérieure avec un backend.)
const PREFIX = 'grabi:'

export function load(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw == null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function save(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    // quota dépassé ou navigation privée : on ignore silencieusement
  }
}

export function newId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

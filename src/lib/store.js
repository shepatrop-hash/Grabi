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

// Identifiant d'appareil ANONYME (aucune donnée perso), généré une fois et persistant.
// Sert au quota anti-abus côté serveur : envoyé dans l'en-tête x-grabi-device des appels
// de génération pour plafonner l'usage par appareil. Falsifiable en soi, mais couplé au
// plafond par IP côté serveur, il relève nettement la barre contre l'abus.
export function deviceId() {
  let id = load('device', null)
  if (!id || typeof id !== 'string') {
    id = `${newId()}-${Math.random().toString(36).slice(2, 9)}`
    save('device', id)
  }
  return id
}

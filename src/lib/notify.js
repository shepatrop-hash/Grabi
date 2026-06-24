// Notifications locales pour le rappel « histoire du soir ».
// Sans serveur de push, on programme le rappel tant que l'app est ouverte
// (setTimeout vers la prochaine occurrence de l'heure choisie). C'est un
// rappel doux ; une vraie notification en arrière-plan nécessiterait un backend.

export function notifySupported() {
  return typeof window !== 'undefined' && 'Notification' in window
}

// Demande l'autorisation si besoin. Renvoie true si on peut notifier.
export async function ensurePermission() {
  if (!notifySupported()) return false
  if (Notification.permission === 'granted') return true
  if (Notification.permission === 'denied') return false
  try {
    const res = await Notification.requestPermission()
    return res === 'granted'
  } catch {
    return false
  }
}

export function showNotification(title, body) {
  if (!notifySupported() || Notification.permission !== 'granted') return
  try {
    new Notification(title, { body, icon: '/grabi.png', badge: '/grabi.png' })
  } catch {
    // certains navigateurs exigent le service worker : on ignore en silence
  }
}

// Millisecondes jusqu'à la prochaine occurrence de "HH:MM" (aujourd'hui ou demain).
export function msUntil(time) {
  const [h, m] = String(time || '20:00').split(':').map((n) => parseInt(n, 10))
  const now = new Date()
  const target = new Date()
  target.setHours(h || 20, m || 0, 0, 0)
  if (target <= now) target.setDate(target.getDate() + 1)
  return target - now
}

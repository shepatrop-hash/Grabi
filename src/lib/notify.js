// Notifications de l'app.
// - Sur ANDROID (natif) : vraies notifications locales planifiées via le plugin Capacitor
//   `@capacitor/local-notifications` → le rappel « histoire du soir » se déclenche chaque
//   jour à l'heure choisie, MÊME application fermée.
// - Sur le WEB : repli sur l'API Notification du navigateur (rappel seulement quand l'app
//   est ouverte), géré côté App.jsx par un setTimeout.
import { Capacitor } from '@capacitor/core'

const REMINDER_ID = 1001 // id stable de la notif quotidienne (pour la remplacer / l'annuler)

export function isNative() {
  try { return Capacitor?.isNativePlatform?.() === true } catch { return false }
}

let _LN = null
async function ln() {
  if (_LN) return _LN
  const mod = await import('@capacitor/local-notifications')
  _LN = mod.LocalNotifications
  return _LN
}

// Demande l'autorisation de notifier. Renvoie true si accordée.
export async function ensurePermission() {
  if (isNative()) {
    try {
      const LN = await ln()
      let p = await LN.checkPermissions()
      if (p.display !== 'granted') p = await LN.requestPermissions()
      return p.display === 'granted'
    } catch {
      return false
    }
  }
  // Web
  if (typeof window === 'undefined' || !('Notification' in window)) return false
  if (Notification.permission === 'granted') return true
  if (Notification.permission === 'denied') return false
  try {
    return (await Notification.requestPermission()) === 'granted'
  } catch {
    return false
  }
}

// Programme le rappel quotidien « histoire du soir » à HH:MM (remplace un rappel existant).
// Natif uniquement (le web est géré en direct par App.jsx tant que l'app est ouverte).
export async function scheduleReminder(time) {
  if (!isNative()) return false
  const [h, m] = String(time || '20:00').split(':').map((n) => parseInt(n, 10))
  try {
    const LN = await ln()
    await LN.cancel({ notifications: [{ id: REMINDER_ID }] }).catch(() => {})
    await LN.schedule({
      notifications: [{
        id: REMINDER_ID,
        title: 'Grabi 💜',
        body: "C'est l'heure de l'histoire du soir !",
        schedule: { on: { hour: h || 20, minute: m || 0 }, repeats: true, allowWhileIdle: true },
      }],
    })
    return true
  } catch {
    return false
  }
}

// Annule le rappel quotidien.
export async function cancelReminder() {
  if (!isNative()) return
  try {
    const LN = await ln()
    await LN.cancel({ notifications: [{ id: REMINDER_ID }] })
  } catch {
    /* rien */
  }
}

// Notification immédiate (repli web : rappel affiché tant que l'app est ouverte).
export function showNotification(title, body) {
  if (typeof window === 'undefined' || !('Notification' in window) || Notification.permission !== 'granted') return
  try {
    new Notification(title, { body, icon: '/grabi.png', badge: '/grabi.png' })
  } catch {
    /* certains navigateurs exigent le service worker : on ignore */
  }
}

// Millisecondes jusqu'à la prochaine occurrence de "HH:MM" (aujourd'hui ou demain). Repli web.
export function msUntil(time) {
  const [h, m] = String(time || '20:00').split(':').map((n) => parseInt(n, 10))
  const now = new Date()
  const target = new Date()
  target.setHours(h || 20, m || 0, 0, 0)
  if (target <= now) target.setDate(target.getDate() + 1)
  return target - now
}

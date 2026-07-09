// Quota de création d'histoires (chaque création coûte de l'IA : on la limite).
//
//   plan 'none'  → aucune création : il faut démarrer l'essai (donc entrer une carte via Google Play).
//   plan 'trial' → essai 3 jours : 1 SEULE création. Ensuite il faut passer au payant.
//   plan 'paid'  → abonné : 10 créations par mois (remise à zéro chaque mois calendaire).
//
// Le compteur vit dans localStorage (clé grabi:creations) : { trialUsed, month, monthUsed }.
export const TRIAL_CREATIONS = 1
export const PAID_PER_MONTH = 10

// Mois calendaire courant, ex. « 2026-07 ».
export const monthKey = (d = new Date()) => d.toISOString().slice(0, 7)

// Normalise le compteur et remet le mensuel à zéro si on a changé de mois.
export function normalizeCreations(c, mk = monthKey()) {
  const base = c && typeof c === 'object' ? c : {}
  const trialUsed = base.trialUsed || 0
  if (base.month !== mk) return { trialUsed, month: mk, monthUsed: 0 }
  return { trialUsed, month: mk, monthUsed: base.monthUsed || 0 }
}

// État de création selon le plan : combien il reste, si on peut créer, et pourquoi pas.
//   reason: 'subscribe' (pas d'abo) · 'trial-done' (essai épuisé) · 'month-done' (10/10 ce mois)
export function creationStatus(plan, creations, mk = monthKey()) {
  const c = normalizeCreations(creations, mk)
  if (plan === 'paid') {
    const left = Math.max(0, PAID_PER_MONTH - c.monthUsed)
    return { plan, left, limit: PAID_PER_MONTH, canCreate: left > 0, reason: left > 0 ? null : 'month-done' }
  }
  if (plan === 'trial') {
    const left = Math.max(0, TRIAL_CREATIONS - c.trialUsed)
    return { plan, left, limit: TRIAL_CREATIONS, canCreate: left > 0, reason: left > 0 ? null : 'trial-done' }
  }
  return { plan: 'none', left: 0, limit: 0, canCreate: false, reason: 'subscribe' }
}

// Incrémente le bon compteur après une création réussie.
export function recordCreation(plan, creations, mk = monthKey()) {
  const c = normalizeCreations(creations, mk)
  if (plan === 'paid') return { ...c, monthUsed: c.monthUsed + 1 }
  if (plan === 'trial') return { ...c, trialUsed: c.trialUsed + 1 }
  return c
}

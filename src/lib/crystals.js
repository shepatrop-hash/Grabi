// Cristaux colorés 💎 — la monnaie magique de Grabi (façon « star bits » de Mario Galaxy).
// Chaque histoire créée coûte STORY_COST cristaux.
//
// Le solde vit pour l'instant en LOCAL (clé grabi:crystals). Il basculera vers la Virtual
// Currency de RevenueCat (stockée côté serveur, non falsifiable) quand la boutique sera
// branchée. À NE PAS confondre avec l'abonnement (lecture illimitée).
//
// ⚠️ Le prix RÉEL en euros est TOUJOURS affiché sur chaque pack (obligatoire, d'autant plus
// pour une app enfant) : les cristaux sont une expérience de jeu, pas un moyen de masquer les prix.
export const STORY_COST = 1         // 1 cristal = 1 histoire créée
export const TRIAL_CRYSTALS = 1     // 1 cristal offert au DÉMARRAGE de l'essai gratuit (une seule fois)
export const MONTHLY_CRYSTALS = 10  // crédités chaque mois aux abonnés payants (10 histoires)
// Aucun cristal offert « de base » : sans essai ni abonnement, le solde reste à 0.

// Packs achetables — grille pensée pour rester RENTABLE une fois la TVA (20 %), la commission
// Google (15 %) et les cotisations retirées (on garde ~55 % du prix affiché), avec une remise
// de volume douce qui ne passe jamais sous le coût de fabrication d'une histoire.
// `product` = id du produit CONSOMMABLE à créer dans Play Console + RevenueCat.
export const CRYSTAL_PACKS = [
  { id: 'cristaux_3', crystals: 3, product: 'cristaux_3', price: '1,99 €' },
  { id: 'cristaux_10', crystals: 10, product: 'cristaux_10', price: '4,99 €', tag: 'Populaire' },
  { id: 'cristaux_25', crystals: 25, product: 'cristaux_25', price: '9,99 €', tag: 'Le + avantageux' },
]

// Petit cristal coloré (rose/violet/cyan) — style Mario Galaxy. `s` = taille en px.
export const crystalSvg = (s = 20) =>
  `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none"><path d="M12 2 L19 8 L12 22 L5 8 Z" fill="#6FE3FF"></path><path d="M12 2 L5 8 L12 8 Z" fill="#A98CFF"></path><path d="M12 2 L19 8 L12 8 Z" fill="#FF9AD5"></path><path d="M5 8 H19 M12 8 V22" stroke="#ffffff" stroke-opacity=".55" stroke-width="1"></path></svg>`

// Mois calendaire courant, ex. « 2026-07 ».
const monthKey = () => new Date().toISOString().slice(0, 7)

// Normalise l'état persistant : { balance, trialGranted, grantMonth }.
export function normalizeCrystals(raw) {
  const c = raw && typeof raw === 'object' ? raw : {}
  return {
    balance: Number.isFinite(c.balance) ? Math.max(0, Math.floor(c.balance)) : 0,
    trialGranted: !!c.trialGranted, // le cristal d'essai a-t-il déjà été versé ?
    grantMonth: typeof c.grantMonth === 'string' ? c.grantMonth : '', // dernier mois crédité (abo)
  }
}

// Crédits AUTOMATIQUES. Idempotent :
//  - 1 cristal offert au DÉMARRAGE de l'essai gratuit (une seule fois) ;
//  - MONTHLY_CRYSTALS chaque mois pour les abonnés payants.
// Rien pour un compte sans essai ni abonnement (solde = 0 → il faut l'essai, l'abo ou un pack).
export function applyGrants(crystals, plan) {
  let { balance, trialGranted, grantMonth } = normalizeCrystals(crystals)
  if (plan === 'trial' && !trialGranted) { balance += TRIAL_CRYSTALS; trialGranted = true }
  const m = monthKey()
  if (plan === 'paid' && grantMonth !== m) { balance += MONTHLY_CRYSTALS; grantMonth = m }
  return { balance, trialGranted, grantMonth }
}

export const canCreate = (crystals) => (crystals?.balance || 0) >= STORY_COST
export const spendStory = (crystals) => ({ ...normalizeCrystals(crystals), balance: Math.max(0, (crystals?.balance || 0) - STORY_COST) })
export const addCrystals = (crystals, n) => ({ ...normalizeCrystals(crystals), balance: (crystals?.balance || 0) + Math.max(0, n || 0) })

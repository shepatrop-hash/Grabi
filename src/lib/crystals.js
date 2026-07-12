// Cristaux colorés 💎 — la monnaie magique de Grabi (façon « star bits » de Mario Galaxy).
// Chaque histoire créée coûte STORY_COST cristaux.
//
// Le solde vit pour l'instant en LOCAL (clé grabi:crystals). Il basculera vers la Virtual
// Currency de RevenueCat (stockée côté serveur, non falsifiable) quand la boutique sera
// branchée. À NE PAS confondre avec l'abonnement (lecture illimitée).
//
// ⚠️ Le prix RÉEL en euros est TOUJOURS affiché sur chaque pack (obligatoire, d'autant plus
// pour une app enfant) : les cristaux sont une expérience de jeu, pas un moyen de masquer les prix.
export const STORY_COST = 20        // cristaux par histoire créée
export const WELCOME_CRYSTALS = 60  // offerts à l'arrivée (≈ 3 histoires), une seule fois
export const MONTHLY_CRYSTALS = 200 // crédités chaque mois aux abonnés payants (≈ 10 histoires)

// Packs achetables. `product` = id du produit CONSOMMABLE à créer dans Play Console + RevenueCat.
// Les prix sont indicatifs (Google fixe le prix réel par pays via le produit).
export const CRYSTAL_PACKS = [
  { id: 'cristaux_150', crystals: 150, product: 'cristaux_150', price: '1,99 €' },
  { id: 'cristaux_500', crystals: 500, product: 'cristaux_500', price: '4,99 €', tag: 'Populaire' },
  { id: 'cristaux_1500', crystals: 1500, product: 'cristaux_1500', price: '12,99 €', tag: 'Le + avantageux' },
]

// Petit cristal coloré (rose/violet/cyan) — style Mario Galaxy. `s` = taille en px.
export const crystalSvg = (s = 20) =>
  `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none"><path d="M12 2 L19 8 L12 22 L5 8 Z" fill="#6FE3FF"></path><path d="M12 2 L5 8 L12 8 Z" fill="#A98CFF"></path><path d="M12 2 L19 8 L12 8 Z" fill="#FF9AD5"></path><path d="M5 8 H19 M12 8 V22" stroke="#ffffff" stroke-opacity=".55" stroke-width="1"></path></svg>`

// Mois calendaire courant, ex. « 2026-07 ».
const monthKey = () => new Date().toISOString().slice(0, 7)

// Normalise l'état persistant : { balance, welcomed, grantMonth }.
export function normalizeCrystals(raw) {
  const c = raw && typeof raw === 'object' ? raw : {}
  return {
    balance: Number.isFinite(c.balance) ? Math.max(0, Math.floor(c.balance)) : 0,
    welcomed: !!c.welcomed,      // cristaux d'accueil déjà versés ?
    grantMonth: typeof c.grantMonth === 'string' ? c.grantMonth : '', // dernier mois crédité (abo)
  }
}

// Crédits AUTOMATIQUES (accueil une fois + mensuel des abonnés payants). Idempotent.
export function applyGrants(crystals, plan) {
  let { balance, welcomed, grantMonth } = normalizeCrystals(crystals)
  if (!welcomed) { balance += WELCOME_CRYSTALS; welcomed = true }
  const m = monthKey()
  if (plan === 'paid' && grantMonth !== m) { balance += MONTHLY_CRYSTALS; grantMonth = m }
  return { balance, welcomed, grantMonth }
}

export const canCreate = (crystals) => (crystals?.balance || 0) >= STORY_COST
export const spendStory = (crystals) => ({ ...normalizeCrystals(crystals), balance: Math.max(0, (crystals?.balance || 0) - STORY_COST) })
export const addCrystals = (crystals, n) => ({ ...normalizeCrystals(crystals), balance: (crystals?.balance || 0) + Math.max(0, n || 0) })

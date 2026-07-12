// Pièces d'or 🪙 : 1 pièce = 1 histoire créée.
//
// Le solde vit pour l'instant en LOCAL (clé grabi:coins). Il basculera vers la Virtual
// Currency de RevenueCat (stockée côté serveur, non falsifiable) quand la boutique sera
// branchée. À NE PAS confondre avec l'abonnement, qui débloque la lecture illimitée.
//
// Sources de pièces :
//   - accueil : WELCOME_COINS offertes une fois (l'essai gratuit, sans carte) ;
//   - abonnement payant : MONTHLY_COINS créditées chaque mois calendaire ;
//   - packs : achetés à l'unité (COIN_PACKS), branchés à l'étape suivante.
export const WELCOME_COINS = 3
export const MONTHLY_COINS = 10

// Packs achetables. `product` = id du produit CONSOMMABLE à créer dans Play Console + RevenueCat.
// Les prix sont indicatifs (Google fixe le prix réel par pays via le produit).
export const COIN_PACKS = [
  { id: 'pieces_10', coins: 10, product: 'pieces_10', price: '1,99 €' },
  { id: 'pieces_30', coins: 30, product: 'pieces_30', price: '4,99 €', tag: 'Populaire' },
  { id: 'pieces_100', coins: 100, product: 'pieces_100', price: '12,99 €', tag: 'Le + avantageux' },
]

// Mois calendaire courant, ex. « 2026-07 ».
const monthKey = () => new Date().toISOString().slice(0, 7)

// Normalise l'état persistant : { balance, welcomed, grantMonth }.
export function normalizeCoins(raw) {
  const c = raw && typeof raw === 'object' ? raw : {}
  return {
    balance: Number.isFinite(c.balance) ? Math.max(0, Math.floor(c.balance)) : 0,
    welcomed: !!c.welcomed,      // pièces d'accueil déjà versées ?
    grantMonth: typeof c.grantMonth === 'string' ? c.grantMonth : '', // dernier mois crédité (abo)
  }
}

// Applique les crédits AUTOMATIQUES (accueil une fois + mensuel des abonnés payants).
// Idempotent : rappelable à chaque render sans double-créditer.
export function applyGrants(coins, plan) {
  let { balance, welcomed, grantMonth } = normalizeCoins(coins)
  if (!welcomed) { balance += WELCOME_COINS; welcomed = true }
  const m = monthKey()
  if (plan === 'paid' && grantMonth !== m) { balance += MONTHLY_COINS; grantMonth = m }
  return { balance, welcomed, grantMonth }
}

export const hasCoins = (coins) => (coins?.balance || 0) > 0
export const spendCoin = (coins) => ({ ...normalizeCoins(coins), balance: Math.max(0, (coins?.balance || 0) - 1) })
export const addCoins = (coins, n) => ({ ...normalizeCoins(coins), balance: (coins?.balance || 0) + Math.max(0, n || 0) })

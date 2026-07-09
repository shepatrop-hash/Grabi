// Facturation Google Play via RevenueCat.
// - Ne fait rien sur le web (navigateur) : Play Billing n'existe que dans l'app native.
// - La clé publique RevenueCat (goog_...) se définit dans Vercel : variable VITE_REVENUECAT_KEY.
// - L'entitlement RevenueCat doit s'appeler "premium" (à créer dans le dashboard RevenueCat).
import { Capacitor } from '@capacitor/core'
import { Purchases } from '@revenuecat/purchases-capacitor'

const RC_KEY = import.meta.env.VITE_REVENUECAT_KEY || ''
const ENTITLEMENT = 'premium'

const isNative = () => {
  try {
    return Capacitor.isNativePlatform()
  } catch {
    return false
  }
}

// La facturation n'est réellement utilisable que dans l'app native ET avec une clé configurée.
export const billingReady = () => isNative() && !!RC_KEY

// Plan actif d'après RevenueCat : 'none' (pas d'entitlement), 'trial' (période d'essai/intro),
// ou 'paid' (période normale = payant). Sert à appliquer le quota de créations.
const planOf = (customerInfo) => {
  const ent = customerInfo?.entitlements?.active?.[ENTITLEMENT]
  if (!ent) return 'none'
  return ent.periodType === 'normal' ? 'paid' : 'trial'
}

let configured = false

// Configure RevenueCat (une seule fois) et renvoie le plan actif ('none' | 'trial' | 'paid').
export async function initBilling() {
  if (!billingReady()) return 'none'
  try {
    if (!configured) {
      await Purchases.configure({ apiKey: RC_KEY })
      configured = true
    }
    return await activePlan()
  } catch (e) {
    console.warn('[billing] init', e)
    return 'none'
  }
}

export async function activePlan() {
  if (!billingReady()) return 'none'
  try {
    const { customerInfo } = await Purchases.getCustomerInfo()
    return planOf(customerInfo)
  } catch {
    return 'none'
  }
}

// Offres disponibles (packages de l'offering courant : mensuel, annuel…).
export async function getPackages() {
  if (!billingReady()) return []
  try {
    const offerings = await Purchases.getOfferings()
    return offerings?.current?.availablePackages || []
  } catch {
    return []
  }
}

// Achète un package (ou le premier disponible). Renvoie true si le Premium est débloqué.
export async function purchase(aPackage) {
  if (!isNative()) throw new Error('web-only')
  let pkg = aPackage
  if (!pkg) {
    const list = await getPackages()
    pkg = list[0]
  }
  if (!pkg) throw new Error('no-offering')
  const { customerInfo } = await Purchases.purchasePackage({ aPackage: pkg })
  return planOf(customerInfo)
}

// Restaure les achats (changement d'appareil / réinstallation). Renvoie le plan actif.
export async function restore() {
  if (!billingReady()) return 'none'
  try {
    const { customerInfo } = await Purchases.restorePurchases()
    return planOf(customerInfo)
  } catch {
    return 'none'
  }
}

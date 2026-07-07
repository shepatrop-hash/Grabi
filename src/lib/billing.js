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

const hasPremium = (customerInfo) => !!customerInfo?.entitlements?.active?.[ENTITLEMENT]

let configured = false

// Configure RevenueCat (une seule fois) et renvoie true si l'utilisateur a déjà le Premium.
export async function initBilling() {
  if (!billingReady()) return false
  try {
    if (!configured) {
      await Purchases.configure({ apiKey: RC_KEY })
      configured = true
    }
    return await isPremiumActive()
  } catch (e) {
    console.warn('[billing] init', e)
    return false
  }
}

export async function isPremiumActive() {
  if (!billingReady()) return false
  try {
    const { customerInfo } = await Purchases.getCustomerInfo()
    return hasPremium(customerInfo)
  } catch {
    return false
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
  return hasPremium(customerInfo)
}

// Restaure les achats (changement d'appareil / réinstallation).
export async function restore() {
  if (!billingReady()) return false
  try {
    const { customerInfo } = await Purchases.restorePurchases()
    return hasPremium(customerInfo)
  } catch {
    return false
  }
}

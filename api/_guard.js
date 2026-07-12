// Garde-fou anti-abus pour les endpoints qui COÛTENT des crédits (Claude / Fal / ElevenLabs /
// Gemini). Ces APIs sont publiques (l'app n'a pas de comptes) : sans ça, n'importe qui peut les
// appeler en boucle avec curl et faire exploser la facture. Deux protections, TOUTES DEUX
// pilotables par variable d'environnement dans Vercel — donc activables/désactivables
// INSTANTANÉMENT, sans redéploiement :
//
//   GEN_DISABLED = "1"    -> COUPE-CIRCUIT d'urgence : toute génération renvoie 503.
//                            (À poser si tu vois une facture s'emballer. À enlever pour réactiver.)
//   API_GUARD    = "off"  -> désactive le filtre d'origine (au cas où il bloquerait de vrais
//                            utilisateurs). Par défaut le filtre est ACTIF.
//
// ⚠️ Le filtre d'origine n'arrête pas un attaquant déterminé (l'en-tête Origin est falsifiable),
// mais il stoppe l'abus opportuniste : copier-coller de curl, scrapers, appels depuis un autre
// site. Le vrai blindage (quota serveur par appareil + magasin type Vercel KV) viendra ensuite.

function hostOf(value) {
  if (!value) return ''
  try { return new URL(value).hostname.toLowerCase() } catch { return '' }
}

// Hôtes autorisés : la prod, les déploiements preview Vercel, et le dev local.
// (L'app Android charge l'URL de prod via le WebView -> même origine que la prod.)
const ALLOWED_HOSTS = ['grabi-eight.vercel.app', 'localhost', '127.0.0.1']

function refAllowed(value) {
  const h = hostOf(value)
  if (h && (ALLOWED_HOSTS.includes(h) || h.endsWith('.vercel.app'))) return true
  // Filet de sécurité pour d'éventuels schémas natifs (capacitor://localhost…).
  const v = String(value || '').toLowerCase()
  return v.includes('localhost') || v.includes('grabi-eight.vercel.app')
}

// Renvoie true (et a DÉJÀ répondu) si la requête doit être bloquée. Usage dans un handler :
//   if (abuseBlocked(req, res)) return
export function abuseBlocked(req, res) {
  // 1) Coupe-circuit d'urgence.
  if (process.env.GEN_DISABLED) {
    res.status(503).json({ error: 'Génération momentanément indisponible. Réessaie plus tard.' })
    return true
  }
  // 2) Filtre d'origine (désactivable via API_GUARD=off).
  if (String(process.env.API_GUARD || 'on').toLowerCase() === 'off') return false
  const h = req.headers || {}
  const ok = refAllowed(h.origin) || refAllowed(h.referer || h.referrer)
  if (!ok) {
    res.status(403).json({ error: 'Origine non autorisée.' })
    return true
  }
  return false
}

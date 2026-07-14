// Quota anti-abus CÔTÉ SERVEUR pour les endpoints qui COÛTENT des crédits IA.
// Complément du quota « cristaux » (qui, lui, est côté client donc FALSIFIABLE) : ici on
// plafonne, de façon INFALSIFIABLE, combien une même IP / un même appareil / l'app entière
// peut générer sur une fenêtre de temps. But : qu'un client trafiqué ou une boucle `curl`
// ne puisse pas faire exploser la facture. C'est un GARDE-FOU, pas la comptabilité des crédits.
//
// Stockage : Redis via l'API REST Upstash (les variables KV_REST_API_URL + KV_REST_API_TOKEN
// que fournit « Vercel KV » / l'intégration Upstash). Si elles ne sont PAS définies, ce module
// est un NO-OP (laisse tout passer) — comme le cache Blob, pour que le dev local et un déploiement
// non provisionné continuent de marcher. Réglable À CHAUD via variables d'env (sans redéploiement) :
//   RL_IP_PER_HOUR     (défaut 150)   unités par IP et par heure glissante
//   RL_DEVICE_PER_DAY  (défaut 400)   unités par appareil et par jour glissant
//   RL_GLOBAL_PER_DAY  (défaut 0=off) plafond DUR d'unités/jour pour TOUTE l'app (coupe-circuit ultime)
//
// Repère : une création d'histoire ≈ 1 texte(3) + ~6 images(2) + ~6 audios(2) ≈ 27 unités.
// Les défauts laissent donc une famille normale très loin des limites, tout en stoppant l'abus.

const KV_URL = process.env.KV_REST_API_URL
const KV_TOKEN = process.env.KV_REST_API_TOKEN
const ENABLED = !!(KV_URL && KV_TOKEN)

const num = (k, d) => {
  const n = parseInt(process.env[k], 10)
  return Number.isFinite(n) ? n : d
}

function ipOf(req) {
  const xff = req.headers['x-forwarded-for']
  if (typeof xff === 'string' && xff) return xff.split(',')[0].trim()
  const real = req.headers['x-real-ip']
  return (typeof real === 'string' && real) || 'unknown'
}

function deviceOf(req) {
  const d = req.headers['x-grabi-device']
  return typeof d === 'string' && d ? d.slice(0, 64) : ''
}

// Pipeline Upstash : INCRBY puis EXPIRE … NX (pose le TTL seulement à la 1re écriture de la fenêtre
// -> vraie fenêtre fixe qui s'auto-nettoie). Renvoie le compteur courant après incrément.
async function bump(key, weight, ttl) {
  const r = await fetch(`${KV_URL}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${KV_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify([
      ['INCRBY', key, String(weight)],
      ['EXPIRE', key, String(ttl), 'NX'],
    ]),
  })
  if (!r.ok) throw new Error(`kv ${r.status}`)
  const out = await r.json() // [{ result: <compteur> }, { result: 0|1 }]
  return Number(out?.[0]?.result ?? 0)
}

// Renvoie true (et a DÉJÀ répondu 429) si la requête doit être bloquée.
// Usage dans un handler :  if (await quotaBlocked(req, res, POIDS)) return
export async function quotaBlocked(req, res, weight = 1) {
  if (!ENABLED) return false // non provisionné -> on ne bloque rien

  const now = Math.floor(Date.now() / 1000)
  const hourBucket = Math.floor(now / 3600)
  const dayBucket = Math.floor(now / 86400)
  const ip = ipOf(req)
  const dev = deviceOf(req)

  const ipMax = num('RL_IP_PER_HOUR', 150)
  const devMax = num('RL_DEVICE_PER_DAY', 400)
  const globalMax = num('RL_GLOBAL_PER_DAY', 0)

  try {
    const checks = [bump(`rl:ip:${ip}:${hourBucket}`, weight, 3600).then((c) => [c, ipMax])]
    if (dev) checks.push(bump(`rl:dev:${dev}:${dayBucket}`, weight, 86400).then((c) => [c, devMax]))
    if (globalMax > 0) checks.push(bump(`rl:all:${dayBucket}`, weight, 86400).then((c) => [c, globalMax]))

    const results = await Promise.all(checks)
    if (results.some(([count, max]) => count > max)) {
      res.status(429).json({ error: 'Trop de créations en peu de temps. Réessaie dans un moment. 🙏' })
      return true
    }
    return false
  } catch (e) {
    // Panne du store -> on LAISSE PASSER (fail-open) pour ne pas bloquer de vrais utilisateurs ;
    // le coupe-circuit GEN_DISABLED reste le contrôle manuel dur en cas de souci.
    console.warn('quota check failed (allowing):', e?.message)
    return false
  }
}

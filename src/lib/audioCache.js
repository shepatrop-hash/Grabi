// Cache des audios de narration (IndexedDB).
// Objectif : une fois une page narrée par ElevenLabs, on garde le clip pour ne PAS
// le régénérer la prochaine fois (lecture instantanée + 0 crédit) tant que le texte
// et la voix sont identiques. IndexedDB (et pas localStorage) car les clips font
// ~100 Ko chacun et localStorage est trop petit.
const DB_NAME = 'grabi-audio'
const STORE = 'clips'
// On évince par TAILLE (pas par nombre) : les voix Gemini sont en WAV (~1,4 Mo) et
// ElevenLabs en mp3 (~130 Ko) -> un budget en octets garde un max de voix sans exploser.
// Avec le cache partagé Blob activé, on ne stocke ici que de petites URLs -> des milliers tiennent.
const MAX_BYTES = 400 * 1024 * 1024 // ~400 Mo par appareil
const VERSION = 'g4'  // change-le pour invalider tout le cache si la voix change (g4 = passage à Gemini)

// Purge le cache si VERSION a changé (ex. nouvelle voix) : les histoires déjà narrées
// avec l'ancienne voix sont effacées -> elles se régénèrent avec la nouvelle voix au
// prochain clic sur Play. Ne s'exécute qu'une fois (au 1er accès après le changement).
let purgeDone = false
function purgeIfStale(db) {
  if (purgeDone) return
  purgeDone = true
  try {
    const k = 'grabi:audioCacheVersion'
    if (localStorage.getItem(k) === VERSION) return
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).clear()
    tx.oncomplete = () => { try { localStorage.setItem(k, VERSION) } catch {} }
  } catch {
    /* best effort */
  }
}

let dbPromise = null
function openDb() {
  if (dbPromise) return dbPromise
  dbPromise = new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB indisponible'))
      return
    }
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = () => req.result.createObjectStore(STORE)
    req.onsuccess = () => {
      purgeIfStale(req.result)
      resolve(req.result)
    }
    req.onerror = () => reject(req.error)
  }).catch((e) => {
    dbPromise = null // permet de réessayer plus tard
    throw e
  })
  return dbPromise
}

// Clé stable : version + voix + texte -> même histoire/voix = même clé = cache hit.
export function audioKey(text, voice, provider) {
  const s = `${VERSION}|${provider || ''}|${voice || 'Douce'}|${text || ''}`
  let h = 5381
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0
  return `a${(h >>> 0).toString(36)}_${s.length}`
}

// Renvoie l'URL (data-URL) en cache, ou null. Ne lève jamais.
export async function getCachedAudio(key) {
  try {
    const db = await openDb()
    return await new Promise((resolve) => {
      const r = db.transaction(STORE, 'readonly').objectStore(STORE).get(key)
      r.onsuccess = () => resolve(r.result ? r.result.url : null)
      r.onerror = () => resolve(null)
    })
  } catch {
    return null
  }
}

// Stocke l'audio + évince les plus anciens tant que le total dépasse MAX_BYTES. Ne lève jamais.
export async function putCachedAudio(key, url) {
  if (!url) return
  try {
    const db = await openDb()
    const store = db.transaction(STORE, 'readwrite').objectStore(STORE)
    store.put({ url, t: Date.now(), size: url.length }, key)
    // Fait la somme des tailles ; si on dépasse le budget, on supprime du plus ancien au plus récent.
    const items = []
    const cur = store.openCursor()
    cur.onsuccess = (e) => {
      const c = e.target.result
      if (c) {
        items.push({ key: c.key, t: c.value.t || 0, size: c.value.size || (c.value.url ? c.value.url.length : 0) })
        c.continue()
        return
      }
      let total = items.reduce((s, it) => s + it.size, 0)
      if (total <= MAX_BYTES) return
      items.sort((a, b) => a.t - b.t) // plus ancien d'abord
      for (const it of items) {
        if (total <= MAX_BYTES) break
        store.delete(it.key)
        total -= it.size
      }
    }
  } catch {
    /* cache best-effort : on ignore les erreurs (quota, mode privé…) */
  }
}

// --- Génération partagée + préchauffage (survivent à la navigation) -------------------
// Bug résolu : le préchargement lancé pendant la CRÉATION était annulé dès qu'on quittait
// l'écran (garde `cancelled`) → la génération se terminait mais son résultat était jeté →
// rien en cache → le lecteur régénérait la voix de CHAQUE page à la 1re ouverture.
// Ici la génération vit au niveau MODULE : elle se termine et se met en cache même si
// l'écran d'origine est démonté, et une même page n'est générée qu'UNE fois (le
// préchargement de la création et la lecture partagent la MÊME promesse).
const inflight = new Map() // key -> Promise<url|null>

// Renvoie l'URL audio pour `key` : cache si dispo, sinon génère via `generate` (une seule
// fois, partagée entre appelants) et met en cache. Ne lève jamais.
export function getOrGenerateAudio(key, generate) {
  const running = inflight.get(key)
  if (running) return running
  const p = (async () => {
    const cached = await getCachedAudio(key)
    if (cached) return cached
    let url = null
    try { url = await generate() } catch { url = null }
    if (url) await putCachedAudio(key, url) // caché MÊME si l'appelant a été démonté
    return url
  })()
  inflight.set(key, p)
  p.finally(() => { if (inflight.get(key) === p) inflight.delete(key) })
  return p
}

// Précharge séquentiellement la narration de toute une histoire, en arrière-plan (page 1
// d'abord → prête au plus vite ; séquentiel → pas de rafale qui déclenche des 429). Survit
// à la navigation vers le lecteur. Un nouvel appel prend la main (une seule histoire chauffe
// à la fois). `items` = [{ key, run }] où run() = () => Promise<url|null>.
let warmToken = 0
export function warmStory(items) {
  const myToken = ++warmToken
  ;(async () => {
    for (const it of items || []) {
      if (myToken !== warmToken) return // une autre histoire a pris la main
      try { await getOrGenerateAudio(it.key, it.run) } catch {}
    }
  })()
}

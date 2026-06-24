// Cache des audios de narration (IndexedDB).
// Objectif : une fois une page narrée par ElevenLabs, on garde le clip pour ne PAS
// le régénérer la prochaine fois (lecture instantanée + 0 crédit) tant que le texte
// et la voix sont identiques. IndexedDB (et pas localStorage) car les clips font
// ~100 Ko chacun et localStorage est trop petit.
const DB_NAME = 'grabi-audio'
const STORE = 'clips'
const MAX_CLIPS = 200 // au-delà, on évince les plus anciens (~26 Mo max)
const VERSION = 'g2'  // change-le pour invalider tout le cache si la voix change

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
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  }).catch((e) => {
    dbPromise = null // permet de réessayer plus tard
    throw e
  })
  return dbPromise
}

// Clé stable : version + voix + texte -> même histoire/voix = même clé = cache hit.
export function audioKey(text, voice) {
  const s = `${VERSION}|${voice || 'Douce'}|${text || ''}`
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

// Stocke l'audio + évince le plus ancien si on dépasse MAX_CLIPS. Ne lève jamais.
export async function putCachedAudio(key, url) {
  if (!url) return
  try {
    const db = await openDb()
    const store = db.transaction(STORE, 'readwrite').objectStore(STORE)
    store.put({ url, t: Date.now() }, key)
    const countReq = store.count()
    countReq.onsuccess = () => {
      if (countReq.result <= MAX_CLIPS) return
      let oldest = null
      const cur = store.openCursor()
      cur.onsuccess = (e) => {
        const c = e.target.result
        if (c) {
          if (!oldest || c.value.t < oldest.t) oldest = { key: c.key, t: c.value.t }
          c.continue()
        } else if (oldest) {
          store.delete(oldest.key)
        }
      }
    }
  } catch {
    /* cache best-effort : on ignore les erreurs (quota, mode privé…) */
  }
}

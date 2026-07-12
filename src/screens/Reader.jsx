import { useState, useEffect, useRef } from 'react'
import RawSvg from '../components/RawSvg.jsx'
import { speak, stopSpeak, ttsSupported } from '../lib/tts.js'
import { generateAudio, generateImage, resolveProvider } from '../lib/api.js'
import { audioKey, getCachedAudio, getOrGenerateAudio } from '../lib/audioCache.js'

// Retire les balises d'émotion v3 [..] (ex. [softly]) pour l'AFFICHAGE et la voix du
// navigateur. La vraie voix ElevenLabs v3, elle, reçoit le texte AVEC les balises.
const cleanText = (t) => (t || '').replace(/\[[^\]]*\]/g, ' ').replace(/\s{2,}/g, ' ').trim()

const backIcon = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3B2D5A" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5 L8 12 L15 19"></path></svg>`
const prevIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="#6E5FA0"><path d="M17 5 L9 12 L17 19 Z"></path><rect x="6" y="5" width="3.5" height="14" rx="1.5"></rect></svg>`
const nextIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="#6E5FA0"><path d="M7 5 L15 12 L7 19 Z"></path><rect x="14.5" y="5" width="3.5" height="14" rx="1.5"></rect></svg>`
const playSvg = `<svg width="34" height="34" viewBox="0 0 24 24" fill="#fff"><path d="M8 5 L19 12 L8 19 Z"></path></svg>`
const pauseSvg = `<svg width="34" height="34" viewBox="0 0 24 24" fill="#fff"><rect x="6" y="5" width="4.5" height="14" rx="2"></rect><rect x="13.5" y="5" width="4.5" height="14" rx="2"></rect></svg>`
const lockBig = `<svg width="56" height="62" viewBox="0 0 40 46"><path d="M11,20 V14 a9,9 0 0 1 18,0 V20" fill="none" stroke="#A98CFF" stroke-width="4.5" stroke-linecap="round"></path><rect x="6" y="19" width="28" height="22" rx="7" fill="#A98CFF"></rect><circle cx="20" cy="28" r="3.6" fill="#fff"></circle><rect x="18.3" y="29" width="3.4" height="8" rx="1.6" fill="#fff"></rect></svg>`

const heartFull = `<svg width="24" height="24" viewBox="0 0 24 24" fill="#FF5C9A"><path d="M12 20.5 C12 20.5 3.5 14.6 3.5 8.8 A4.4 4.4 0 0 1 12 6.3 A4.4 4.4 0 0 1 20.5 8.8 C20.5 14.6 12 20.5 12 20.5 Z"></path></svg>`
const heartLine = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7C6F95" stroke-width="2.2" stroke-linejoin="round"><path d="M12 20.5 C12 20.5 3.5 14.6 3.5 8.8 A4.4 4.4 0 0 1 12 6.3 A4.4 4.4 0 0 1 20.5 8.8 C20.5 14.6 12 20.5 12 20.5 Z"></path></svg>`

const sendLine = `<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#8B7BB8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 L11 13 M22 2 L15 22 L11 13 L2 9 Z"></path></svg>`
const sendFull = `<svg width="21" height="21" viewBox="0 0 24 24" fill="#fff" stroke="#fff" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 L11 13 M22 2 L15 22 L11 13 L2 9 Z"></path></svg>`

export default function Reader({ story, isPremium, voice = 'Douce', soundOn = true, onClose, onSubscribe, onImage, isFavorite, onToggleFavorite, isShared, onToggleShare }) {
  const pages = story?.pages || []
  const total = pages.length || 1
  const locked = !!story?.premium && !isPremium
  const maxPage = locked ? Math.max(0, (story?.freePages || 1) - 1) : total - 1

  const [page, setPage] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [paywall, setPaywall] = useState(false)
  const [mutedHint, setMutedHint] = useState(false)
  const [loadingAudio, setLoadingAudio] = useState(false)
  const [fixImages, setFixImages] = useState({}) // index -> url (illustrations régénérées ici)
  const [provider, setProvider] = useState(null) // moteur voix (selon la voix choisie), décidé 1× à l'ouverture
  const tokenRef = useRef(0)
  const hintRef = useRef(null)
  const audioRef = useRef(null)

  // Coupe tout son en cours (audio ElevenLabs + voix du navigateur).
  const stopAll = () => {
    const a = audioRef.current
    if (a) {
      a.onended = null
      a.onerror = null
      a.pause()
      audioRef.current = null
    }
    stopSpeak()
  }

  const pageOf = (i) => {
    const p = pages[i]
    return typeof p === 'string' ? { text: p } : p || { text: '' }
  }
  const cur = pageOf(page)

  // Réinitialise quand on ouvre une autre histoire.
  useEffect(() => {
    setPage(0)
    setPlaying(false)
    setPaywall(false)
    setFixImages({})
    stopAll()
  }, [story?.id])

  // Décide le moteur de narration selon la VOIX choisie (Gemini direct, ou ElevenLabs si crédits) —
  // 1× par ouverture, appliqué à toutes les pages (cohérence). Se recalcule si on change de voix.
  useEffect(() => {
    let cancelled = false
    setProvider(null)
    const chars = pages.reduce((n, p) => { const t = typeof p === 'string' ? p : p && p.text; return n + ((t && t.length) || 0) }, 0)
    resolveProvider(voice, chars).then((prov) => { if (!cancelled) setProvider(prov) })
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [story?.id, voice])

  // Répare les illustrations manquantes : si on a quitté la création AVANT la fin des
  // images, la page a été sauvée avec son `prompt` mais sans image → on la régénère ici
  // (et on remonte l'URL via onImage pour la sauvegarder définitivement, 0 coût ensuite).
  useEffect(() => {
    let cancelled = false
    pages.forEach((p, i) => {
      const pg = typeof p === 'string' ? { text: p } : p || {}
      if (pg.image || !pg.prompt) return // déjà illustrée (ou pas de prompt) -> rien à faire
      generateImage(pg.prompt)
        .then(({ url }) => {
          if (cancelled || !url) return
          setFixImages((m) => ({ ...m, [i]: url }))
          onImage && onImage(i, url)
        })
        .catch(() => {})
    })
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [story?.id])

  // Audio : joue la narration de la page courante (vraie voix ElevenLabs si dispo —
  // soit pré-générée `page.audio`, soit générée à la volée — sinon repli sur la voix
  // du navigateur), puis enchaîne automatiquement la page suivante.
  useEffect(() => {
    if (!playing || !soundOn || paywall) {
      stopAll()
      setLoadingAudio(false)
      return
    }
    const myToken = ++tokenRef.current
    let cancelled = false
    const advance = () => {
      if (cancelled || tokenRef.current !== myToken) return
      if (page < maxPage) setPage((p) => p + 1)
      else setPlaying(false)
    }
    const fallbackTTS = () => {
      if (!cancelled && tokenRef.current === myToken && ttsSupported()) speak(cleanText(cur.text), voice, { onend: advance })
      else advance()
    }
    ;(async () => {
      // Audio pré-généré (baké) = voix de base « Douce ». Pour une autre voix choisie,
      // on génère à la volée (puis cache) afin de respecter la sélection.
      let url = cur.audio && voice === 'Douce' ? cur.audio : null
      if (!url) {
        if (!provider) { setLoadingAudio(true); return } // moteur pas encore décidé -> l'effet re-jouera
        // Moteur figé pour TOUTE l'histoire (selon la voix choisie) -> cohérence.
        const key = audioKey(cur.text, voice, provider)
        url = await getCachedAudio(key) // déjà narré ? -> instantané, 0 crédit
        if (cancelled || tokenRef.current !== myToken) return
        if (!url) {
          setLoadingAudio(true)
          // getOrGenerateAudio PARTAGE la génération avec le préchargement lancé à la création :
          // si cette page est déjà en cours de préchauffage, on attend la MÊME promesse (0 doublon,
          // 0 crédit en plus) ; sinon on la génère ici. Le résultat est mis en cache dans tous les cas.
          url = await getOrGenerateAudio(key, () => generateAudio(cur.text, voice, provider).then((d) => d?.url || null))
          if (!cancelled && tokenRef.current === myToken) setLoadingAudio(false)
        }
      }
      if (cancelled || tokenRef.current !== myToken) return
      if (url) {
        const a = new Audio(url)
        audioRef.current = a
        a.onended = advance
        a.onerror = fallbackTTS
        a.play().catch(fallbackTTS)
      } else {
        fallbackTTS()
      }
    })()
    return () => {
      cancelled = true
      stopAll()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, page, voice, soundOn, paywall, provider])

  // Coupe l'audio en quittant le lecteur.
  useEffect(() => () => stopAll(), [])

  // Garde l'écran ALLUMÉ pendant la narration (Screen Wake Lock) : une histoire du soir se
  // joue sans qu'on touche l'écran → sinon il se met en veille en pleine lecture. Relâché
  // à la pause / fin d'histoire (playing repasse à false) → l'écran peut s'éteindre tout
  // seul une fois l'histoire terminée (idéal au coucher).
  useEffect(() => {
    if (!playing || typeof navigator === 'undefined' || !('wakeLock' in navigator)) return
    let sentinel = null
    let stopped = false
    const acquire = async () => {
      try {
        sentinel = await navigator.wakeLock.request('screen')
        sentinel.addEventListener('release', () => { sentinel = null })
      } catch {
        /* refusé (batterie faible, onglet caché…) : sans gravité */
      }
    }
    // Le système relâche le verrou quand l'app passe en arrière-plan → on le reprend au retour.
    const onVisible = () => { if (!stopped && document.visibilityState === 'visible' && !sentinel) acquire() }
    acquire()
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      stopped = true
      document.removeEventListener('visibilitychange', onVisible)
      try { sentinel && sentinel.release() } catch {}
      sentinel = null
    }
  }, [playing])

  const close = () => {
    stopAll()
    onClose && onClose()
  }
  const next = () => {
    if (page < maxPage) setPage(page + 1)
    else if (locked) {
      setPlaying(false)
      stopAll()
      setPaywall(true)
    }
  }
  const prev = () => page > 0 && setPage(page - 1)
  const togglePlay = () => {
    if (!soundOn) {
      setMutedHint(true)
      clearTimeout(hintRef.current)
      hintRef.current = setTimeout(() => setMutedHint(false), 2600)
      return
    }
    setPlaying((p) => !p)
  }
  const progress = `${Math.round(((page + 1) / total) * 100)}%`

  const heroImg = cur.image || fixImages[page] // image d'origine, sinon celle régénérée ici
  const hero = heroImg ? (
    <img src={heroImg} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
  ) : (
    <div style={{ width: '100%', height: '100%', background: story?.bg || 'var(--violet-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {story?.svg && <div style={{ transform: 'scale(2.3)' }}><RawSvg html={story.svg} /></div>}
    </div>
  )

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--card)', position: 'relative', overflow: 'hidden', animation: 'gn-fadein .35s ease' }}>
      <div style={{ position: 'relative', height: 'min(46dvh, 480px)', flex: 'none', overflow: 'hidden' }}>
        {hero}
        <button onClick={close} style={{ position: 'absolute', top: 'calc(env(safe-area-inset-top, 0px) + 22px)', left: 22, width: 46, height: 46, borderRadius: '50%', background: 'rgba(255,255,255,.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(74,58,102,.15)' }}><RawSvg html={backIcon} /></button>
        {onToggleShare && (
          <button onClick={onToggleShare} aria-label={isShared ? 'Ne plus partager' : 'Partager avec les copains'} title={isShared ? 'Ne plus partager' : 'Partager avec les copains'} style={{ position: 'absolute', top: 'calc(env(safe-area-inset-top, 0px) + 22px)', right: 78, width: 46, height: 46, borderRadius: '50%', background: isShared ? 'rgba(169,140,255,.95)' : 'rgba(255,255,255,.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(74,58,102,.15)', transition: 'transform .15s ease', transform: isShared ? 'scale(1.06)' : 'scale(1)' }}><RawSvg html={isShared ? sendFull : sendLine} /></button>
        )}
        {onToggleFavorite && (
          <button onClick={onToggleFavorite} aria-label={isFavorite ? 'Retirer des favoris' : 'Mettre en favori'} style={{ position: 'absolute', top: 'calc(env(safe-area-inset-top, 0px) + 22px)', right: 22, width: 46, height: 46, borderRadius: '50%', background: 'rgba(255,255,255,.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(74,58,102,.15)', transition: 'transform .15s ease', transform: isFavorite ? 'scale(1.08)' : 'scale(1)' }}><RawSvg html={isFavorite ? heartFull : heartLine} /></button>
        )}
        <div style={{ position: 'absolute', top: 'calc(env(safe-area-inset-top, 0px) + 26px)', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 7, padding: '0 70px', flexWrap: 'wrap' }}>
          {pages.map((_, i) => (
            <span key={i} style={{ width: i === page ? 22 : 7, height: 7, borderRadius: 4, background: i === page ? '#fff' : 'rgba(255,255,255,.6)', transition: 'width .25s ease' }} />
          ))}
        </div>
        {story?.title && (
          <div style={{ position: 'absolute', left: 22, right: 22, bottom: 44, color: '#fff', fontSize: 22, fontWeight: 700, textShadow: '0 2px 12px rgba(0,0,0,.35)' }}>{story.title}</div>
        )}
      </div>

      <div style={{ flex: 1, minHeight: 0, background: 'var(--card)', borderRadius: '36px 36px 0 0', marginTop: -32, position: 'relative', zIndex: 2, padding: '26px 30px calc(env(safe-area-inset-bottom, 0px) + 22px)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 22, fontWeight: 600, lineHeight: 1.5, flex: 1, minHeight: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>{cleanText(cur.text)}</div>
        <div style={{ flex: 'none', paddingTop: 16 }}>
          <div style={{ height: 8, borderRadius: 4, background: 'var(--card-soft)', overflow: 'hidden' }}><div style={{ width: progress, height: '100%', background: 'var(--mint)', borderRadius: 4, transition: 'width .3s ease' }} /></div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 30, marginTop: 22 }}>
            <button onClick={prev} disabled={page === 0} style={{ width: 60, height: 60, borderRadius: '50%', background: 'var(--card-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: page === 0 ? 0.45 : 1 }}><RawSvg html={prevIcon} /></button>
            <button onClick={togglePlay} style={{ width: 86, height: 86, borderRadius: '50%', background: 'linear-gradient(135deg,#FFD23F,#FF7FB0)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 14px 26px -8px rgba(255,127,176,.65)' }}><RawSvg html={playing ? pauseSvg : playSvg} /></button>
            <button onClick={next} style={{ width: 60, height: 60, borderRadius: '50%', background: 'var(--card-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><RawSvg html={nextIcon} /></button>
          </div>
          {loadingAudio && (
            <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--violet)', fontWeight: 600, marginTop: 10 }}>🎙️ Grabi prépare sa voix…</div>
          )}
          {mutedHint && (
            <div style={{ textAlign: 'center', fontSize: 13, color: '#C24A7A', fontWeight: 600, marginTop: 10 }}>Le son est coupé — active-le dans les Réglages 🔇</div>
          )}
        </div>
      </div>

      {paywall && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(74,58,102,.5)', display: 'flex', alignItems: 'flex-end', zIndex: 20, animation: 'gn-fadein .25s ease' }}>
          <div style={{ background: 'var(--card)', borderRadius: '38px 38px 0 0', width: '100%', padding: '30px 30px calc(env(safe-area-inset-bottom, 0px) + 30px)', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}><RawSvg html={lockBig} /></div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>Tu as adoré le début&nbsp;?</div>
            <div style={{ fontSize: 15, color: 'var(--ink2)', fontWeight: 500, lineHeight: 1.45, marginTop: 8 }}>La suite de cette histoire t'attend dans <b style={{ color: 'var(--violet)' }}>Grabi Premium</b>&nbsp;✨</div>
            <button onClick={onSubscribe} style={{ width: '100%', marginTop: 22, background: 'linear-gradient(135deg,#FF8FB6,#A98CFF)', color: '#fff', borderRadius: 26, height: 62, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, fontSize: 18, fontWeight: 700, boxShadow: '0 14px 26px -10px rgba(169,140,255,.7)' }}>Débloquer la suite ✨</button>
            <button onClick={() => setPaywall(false)} style={{ marginTop: 14, fontSize: 15, fontWeight: 600, color: 'var(--ink2)' }}>Plus tard</button>
          </div>
        </div>
      )}
    </div>
  )
}

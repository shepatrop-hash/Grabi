import { useState, useEffect, useRef } from 'react'
import RawSvg from '../components/RawSvg.jsx'
import { speak, stopSpeak, ttsSupported } from '../lib/tts.js'

const backIcon = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3B2D5A" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5 L8 12 L15 19"></path></svg>`
const prevIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="#6E5FA0"><path d="M17 5 L9 12 L17 19 Z"></path><rect x="6" y="5" width="3.5" height="14" rx="1.5"></rect></svg>`
const nextIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="#6E5FA0"><path d="M7 5 L15 12 L7 19 Z"></path><rect x="14.5" y="5" width="3.5" height="14" rx="1.5"></rect></svg>`
const playSvg = `<svg width="34" height="34" viewBox="0 0 24 24" fill="#fff"><path d="M8 5 L19 12 L8 19 Z"></path></svg>`
const pauseSvg = `<svg width="34" height="34" viewBox="0 0 24 24" fill="#fff"><rect x="6" y="5" width="4.5" height="14" rx="2"></rect><rect x="13.5" y="5" width="4.5" height="14" rx="2"></rect></svg>`
const lockBig = `<svg width="56" height="62" viewBox="0 0 40 46"><path d="M11,20 V14 a9,9 0 0 1 18,0 V20" fill="none" stroke="#A98CFF" stroke-width="4.5" stroke-linecap="round"></path><rect x="6" y="19" width="28" height="22" rx="7" fill="#A98CFF"></rect><circle cx="20" cy="28" r="3.6" fill="#fff"></circle><rect x="18.3" y="29" width="3.4" height="8" rx="1.6" fill="#fff"></rect></svg>`

export default function Reader({ story, isPremium, voice = 'Douce', soundOn = true, onClose, onSubscribe }) {
  const pages = story?.pages || []
  const total = pages.length || 1
  const locked = !!story?.premium && !isPremium
  const maxPage = locked ? Math.max(0, (story?.freePages || 1) - 1) : total - 1

  const [page, setPage] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [paywall, setPaywall] = useState(false)
  const tokenRef = useRef(0)

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
    stopSpeak()
  }, [story?.id])

  // Audio : lit la page courante puis enchaîne automatiquement la suivante.
  useEffect(() => {
    if (!playing || !soundOn || !ttsSupported() || paywall) {
      stopSpeak()
      return
    }
    const myToken = ++tokenRef.current
    speak(cur.text, voice, {
      onend: () => {
        if (tokenRef.current !== myToken) return
        if (page < maxPage) setPage((p) => p + 1)
        else setPlaying(false)
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, page, voice, soundOn, paywall])

  // Coupe l'audio en quittant le lecteur.
  useEffect(() => () => stopSpeak(), [])

  const close = () => {
    stopSpeak()
    onClose && onClose()
  }
  const next = () => {
    if (page < maxPage) setPage(page + 1)
    else if (locked) {
      setPlaying(false)
      stopSpeak()
      setPaywall(true)
    }
  }
  const prev = () => page > 0 && setPage(page - 1)
  const progress = `${Math.round(((page + 1) / total) * 100)}%`

  const hero = cur.image ? (
    <img src={cur.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
  ) : (
    <div style={{ width: '100%', height: '100%', background: story?.bg || 'var(--violet-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {story?.svg && <div style={{ transform: 'scale(2.3)' }}><RawSvg html={story.svg} /></div>}
    </div>
  )

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: '#fff', position: 'relative', overflow: 'hidden', animation: 'gn-fadein .35s ease' }}>
      <div style={{ position: 'relative', height: 'min(52dvh, 540px)', flex: 'none', overflow: 'hidden' }}>
        {hero}
        <button onClick={close} style={{ position: 'absolute', top: 'calc(env(safe-area-inset-top, 0px) + 22px)', left: 22, width: 46, height: 46, borderRadius: '50%', background: 'rgba(255,255,255,.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(74,58,102,.15)' }}><RawSvg html={backIcon} /></button>
        <div style={{ position: 'absolute', top: 'calc(env(safe-area-inset-top, 0px) + 26px)', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 7, padding: '0 70px', flexWrap: 'wrap' }}>
          {pages.map((_, i) => (
            <span key={i} style={{ width: i === page ? 22 : 7, height: 7, borderRadius: 4, background: i === page ? '#fff' : 'rgba(255,255,255,.6)', transition: 'width .25s ease' }} />
          ))}
        </div>
        {story?.title && (
          <div style={{ position: 'absolute', left: 22, right: 22, bottom: 44, color: '#fff', fontSize: 22, fontWeight: 700, textShadow: '0 2px 12px rgba(0,0,0,.35)' }}>{story.title}</div>
        )}
      </div>

      <div style={{ flex: 1, background: '#fff', borderRadius: '36px 36px 0 0', marginTop: -32, position: 'relative', zIndex: 2, padding: '30px 30px calc(env(safe-area-inset-bottom, 0px) + 26px)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 23, fontWeight: 600, lineHeight: 1.5, overflowY: 'auto' }}>{cur.text}</div>
        <div style={{ marginTop: 'auto', paddingTop: 18 }}>
          <div style={{ height: 8, borderRadius: 4, background: '#EFEAF6', overflow: 'hidden' }}><div style={{ width: progress, height: '100%', background: 'var(--mint)', borderRadius: 4, transition: 'width .3s ease' }} /></div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 30, marginTop: 22 }}>
            <button onClick={prev} disabled={page === 0} style={{ width: 60, height: 60, borderRadius: '50%', background: '#F1EEF8', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: page === 0 ? 0.45 : 1 }}><RawSvg html={prevIcon} /></button>
            <button onClick={() => setPlaying((p) => !p)} style={{ width: 86, height: 86, borderRadius: '50%', background: 'linear-gradient(135deg,#FFD23F,#FF7FB0)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 14px 26px -8px rgba(255,127,176,.65)' }}><RawSvg html={playing ? pauseSvg : playSvg} /></button>
            <button onClick={next} style={{ width: 60, height: 60, borderRadius: '50%', background: '#F1EEF8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><RawSvg html={nextIcon} /></button>
          </div>
          {!ttsSupported() && (
            <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--ink2)', fontWeight: 500, marginTop: 10 }}>Lecture audio non disponible sur ce navigateur.</div>
          )}
        </div>
      </div>

      {paywall && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(74,58,102,.5)', display: 'flex', alignItems: 'flex-end', zIndex: 20, animation: 'gn-fadein .25s ease' }}>
          <div style={{ background: '#fff', borderRadius: '38px 38px 0 0', width: '100%', padding: '30px 30px calc(env(safe-area-inset-bottom, 0px) + 30px)', textAlign: 'center' }}>
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

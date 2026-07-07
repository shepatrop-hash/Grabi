import { useState, useMemo } from 'react'
import RawSvg from './RawSvg.jsx'
import BackButton from './BackButton.jsx'

// Contrôle parental avant un achat : on demande de taper 3 chiffres énoncés EN LETTRES
// (ex. « sept, trois, deux »). Un jeune enfant qui ne sait pas encore lire ne peut pas
// passer, sans avoir à mémoriser un code. Regénéré à chaque affichage.
const WORDS = ['zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf']
const lockBig = `<svg width="40" height="46" viewBox="0 0 40 46"><path d="M11,20 V14 a9,9 0 0 1 18,0 V20" fill="none" stroke="#A98CFF" stroke-width="4.5" stroke-linecap="round"></path><rect x="6" y="19" width="28" height="22" rx="7" fill="#A98CFF"></rect><circle cx="20" cy="28" r="3.6" fill="#fff"></circle><rect x="18.3" y="29" width="3.4" height="8" rx="1.6" fill="#fff"></rect></svg>`
const backspaceIcon = `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#7d5fc4" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 5 H8 L3 12 L8 19 H21 Z"></path><path d="M12 9.5 L17 14.5 M17 9.5 L12 14.5"></path></svg>`

export default function ParentCheck({ onSuccess, onCancel }) {
  const seq = useMemo(() => {
    const pool = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    const out = []
    for (let i = 0; i < 3; i++) out.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0])
    return out
  }, [])
  const [pos, setPos] = useState(0)
  const [error, setError] = useState('')

  function press(d) {
    if (d === seq[pos]) {
      const next = pos + 1
      setError('')
      if (next >= seq.length) onSuccess()
      else setPos(next)
    } else {
      setError('Ce n\'est pas le bon chiffre, on recommence.')
      setPos(0)
    }
  }

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '']
  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--bg)', position: 'relative', overflow: 'hidden', animation: 'gn-fadein .3s ease', paddingTop: 'calc(env(safe-area-inset-top, 14px) + 16px)' }}>
      <div style={{ padding: '6px 24px 0', flex: 'none' }}><BackButton onClick={onCancel} /></div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 32px', textAlign: 'center' }}>
        <RawSvg html={lockBig} />
        <div style={{ fontSize: 22, fontWeight: 700, marginTop: 14 }}>Un instant, on vérifie 🔒</div>
        <div style={{ fontSize: 15, color: 'var(--ink2)', fontWeight: 500, lineHeight: 1.5, marginTop: 8, maxWidth: 320 }}>Pour continuer, un parent tape&nbsp;:</div>
        <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--violet)', marginTop: 10, letterSpacing: '.01em' }}>{seq.map((d) => WORDS[d]).join(' · ')}</div>

        {/* Progression */}
        <div style={{ display: 'flex', gap: 16, marginTop: 22 }}>
          {seq.map((_, i) => (
            <span key={i} style={{ width: 18, height: 18, borderRadius: '50%', background: i < pos ? 'var(--mint)' : 'var(--track-off)', transition: 'background .15s ease' }} />
          ))}
        </div>
        <div style={{ minHeight: 22, marginTop: 12 }}>{error && <div style={{ fontSize: 14, color: '#C24A7A', fontWeight: 600 }}>{error}</div>}</div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 72px)', gap: 14, marginTop: 4 }}>
          {keys.map((k, i) => {
            if (k === '') return <span key={i} />
            return <button key={i} onClick={() => press(+k)} style={{ width: 72, height: 72, borderRadius: 24, background: 'var(--card)', fontSize: 26, fontWeight: 700, color: 'var(--ink)', boxShadow: '0 8px 18px -12px rgba(74,58,102,.35)' }}>{k}</button>
          })}
        </div>
      </div>
    </div>
  )
}

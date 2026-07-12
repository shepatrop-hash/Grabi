import { useState, useMemo } from 'react'
import Grabi from '../components/Grabi.jsx'

// Écran de pause affiché quand la limite de temps d'écran du jour est atteinte.
// Un adulte peut accorder 15 min de plus en résolvant une addition simple.
export default function ScreenLock({ onGrantMore }) {
  const [ask, setAsk] = useState(false)
  const { a, b } = useMemo(() => ({ a: 2 + Math.floor(Math.random() * 7), b: 2 + Math.floor(Math.random() * 7) }), [ask])
  const answer = a + b
  const options = useMemo(() => {
    const set = new Set([answer])
    while (set.size < 3) set.add(Math.max(4, answer + (Math.floor(Math.random() * 7) - 3)))
    return [...set].sort(() => Math.random() - 0.5)
  }, [answer])
  const [wrong, setWrong] = useState(false)

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 10000, background: 'linear-gradient(180deg,#3A2D5A 0%,#5B4A86 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 32px', textAlign: 'center', animation: 'gn-fadein .4s cubic-bezier(.22,.61,.36,1)' }}>
      <div style={{ opacity: 0.95 }}><Grabi size={140} overlay={false} /></div>
      <div style={{ fontSize: 28, fontWeight: 700, color: '#fff', marginTop: 18 }}>C'est l'heure de la pause&nbsp;🌙</div>
      <div style={{ fontSize: 16, color: 'rgba(255,255,255,.85)', fontWeight: 500, lineHeight: 1.5, marginTop: 10, maxWidth: 320 }}>Grabi a besoin de se reposer. On se retrouve plus tard pour de nouvelles histoires&nbsp;!</div>

      {!ask ? (
        <button onClick={() => { setAsk(true); setWrong(false) }} style={{ marginTop: 30, background: 'rgba(255,255,255,.16)', color: '#fff', borderRadius: 22, padding: '13px 22px', fontSize: 15, fontWeight: 700, border: '1.5px solid rgba(255,255,255,.35)' }}>
          Encore un peu&nbsp;? (parents)
        </button>
      ) : (
        <div style={{ marginTop: 26, background: 'rgba(255,255,255,.12)', borderRadius: 24, padding: '20px 22px', width: '100%', maxWidth: 340 }}>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,.85)', fontWeight: 600 }}>Pour ajouter 15 minutes, demande à un adulte&nbsp;:</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: '#fff', marginTop: 12 }}>{a} + {b} = ?</div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 16 }}>
            {options.map((o) => (
              <button key={o} onClick={() => (o === answer ? onGrantMore() : setWrong(true))} style={{ width: 64, height: 64, borderRadius: 18, background: 'var(--card)', fontSize: 22, fontWeight: 700, color: 'var(--ink)' }}>{o}</button>
            ))}
          </div>
          {wrong && <div style={{ fontSize: 13, color: '#FFD2E0', fontWeight: 600, marginTop: 14 }}>Oups, réessaie&nbsp;!</div>}
        </div>
      )}
    </div>
  )
}

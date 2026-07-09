import RawSvg from './RawSvg.jsx'
import Grabi from './Grabi.jsx'

// Navbar à 4 onglets : Accueil · Découvrir (semaine + épisodes animés) · Copains (communauté)
// · Mon coin (mes histoires + Grabi + réglages). Onglet actif surligné en doré (maquette).
const GOLD = '#C1912E'
const IDLE = '#B3AAC4'

const homeIcon = (c) => `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2.2" stroke-linejoin="round"><path d="M4 11.5 L12 4.5 L20 11.5 V20 H4 Z"></path></svg>`
const starIcon = (c) => `<svg width="24" height="24" viewBox="0 0 24 24" fill="${c}"><path d="M12 3 l2.7 5.5 6 .9 -4.35 4.2 1.03 6 -5.38 -2.83 -5.38 2.83 1.03 -6 -4.35 -4.2 6 -.9 Z"></path></svg>`
const smileIcon = (c) => `<svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2.1"><circle cx="12" cy="12" r="9.2"></circle><circle cx="8.8" cy="10.5" r="1.15" fill="${c}"></circle><circle cx="15.2" cy="10.5" r="1.15" fill="${c}"></circle><path d="M8.5 14.5 q3.5 3 7 0" stroke-linecap="round"></path></svg>`

const TABS = [
  { key: 'accueil', label: 'Accueil', icon: homeIcon },
  { key: 'decouvrir', label: 'Découvrir', icon: starIcon, dot: true },
  { key: 'copains', label: 'Copains', icon: smileIcon },
  { key: 'moncoin', label: 'Mon coin', grabi: true },
]

export default function BottomNav({ active, onAccueil, onDecouvrir, onCopains, onMonCoin }) {
  const handlers = { accueil: onAccueil, decouvrir: onDecouvrir, copains: onCopains, moncoin: onMonCoin }
  return (
    <div style={{ flex: 'none', padding: '8px 18px calc(env(safe-area-inset-bottom, 0px) + 14px)' }}>
      <div style={{ background: 'var(--card)', borderRadius: 28, padding: '10px 6px 9px', display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', boxShadow: '0 10px 26px -8px rgba(74,58,102,.28)' }}>
        {TABS.map((t) => {
          const on = active === t.key
          return (
            <button key={t.key} onClick={handlers[t.key]} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, width: 76 }}>
              <div style={{ position: 'relative', width: 50, height: 34, borderRadius: 13, background: on ? 'var(--yellow-soft)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background .15s ease' }}>
                {t.grabi ? <div style={{ transform: 'scale(1.05)', opacity: on ? 1 : 0.9 }}><Grabi size={26} /></div> : <RawSvg html={t.icon(on ? GOLD : IDLE)} />}
                {t.dot && !on && <span style={{ position: 'absolute', top: 1, right: 12, width: 8, height: 8, borderRadius: '50%', background: '#FF6F9C', border: '1.5px solid var(--card)' }} />}
              </div>
              <span style={{ fontSize: 11, fontWeight: 800, color: on ? GOLD : IDLE, whiteSpace: 'nowrap' }}>{t.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

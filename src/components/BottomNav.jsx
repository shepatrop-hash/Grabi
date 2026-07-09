import RawSvg from './RawSvg.jsx'

// Navbar à 4 onglets : Accueil · Découvrir (semaine + épisodes animés) · Copains (communauté)
// · Mon coin (mes histoires + Grabi + réglages). Onglet actif en doré (var. selon le thème).
const homeIcon = (c) => `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2.2" stroke-linejoin="round"><path d="M4 11.5 L12 4.5 L20 11.5 V20 H4 Z"></path></svg>`
const starIcon = (c) => `<svg width="24" height="24" viewBox="0 0 24 24" fill="${c}"><path d="M12 3 l2.7 5.5 6 .9 -4.35 4.2 1.03 6 -5.38 -2.83 -5.38 2.83 1.03 -6 -4.35 -4.2 6 -.9 Z"></path></svg>`
const heartIcon = (c) => `<svg width="24" height="24" viewBox="0 0 24 24" fill="${c}"><path d="M12 21 C5 15 3 11.5 3 8.5 A4.3 4.3 0 0 1 12 6.5 A4.3 4.3 0 0 1 21 8.5 C21 11.5 19 15 12 21 Z"></path></svg>`
const gearIcon = (c) => `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3.1"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`

const TABS = [
  { key: 'accueil', label: 'Accueil', icon: homeIcon },
  { key: 'decouvrir', label: 'Découvrir', icon: starIcon, dot: true },
  { key: 'copains', label: 'Copains', icon: heartIcon },
  { key: 'moncoin', label: 'Mon coin', icon: gearIcon },
]

export default function BottomNav({ active, onAccueil, onDecouvrir, onCopains, onMonCoin }) {
  const handlers = { accueil: onAccueil, decouvrir: onDecouvrir, copains: onCopains, moncoin: onMonCoin }
  return (
    <div style={{ flex: 'none', padding: '8px 18px calc(env(safe-area-inset-bottom, 0px) + 14px)' }}>
      <div style={{ background: 'var(--card)', borderRadius: 28, padding: '10px 6px 9px', display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', boxShadow: '0 10px 26px -8px rgba(74,58,102,.28)' }}>
        {TABS.map((t) => {
          const on = active === t.key
          return (
            <button key={t.key} onClick={handlers[t.key]} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, width: 76, color: on ? 'var(--nav-gold)' : 'var(--nav-idle)' }}>
              <div style={{ position: 'relative', width: 50, height: 34, borderRadius: 13, background: on ? 'var(--yellow-soft)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background .15s ease' }}>
                <RawSvg html={t.icon('currentColor')} />
                {t.dot && !on && <span style={{ position: 'absolute', top: 1, right: 12, width: 8, height: 8, borderRadius: '50%', background: '#FF6F9C', border: '1.5px solid var(--card)' }} />}
              </div>
              <span style={{ fontSize: 11, fontWeight: 800, whiteSpace: 'nowrap' }}>{t.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

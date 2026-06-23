import Grabi from '../components/Grabi.jsx'
import RawSvg from '../components/RawSvg.jsx'

const parentIcon = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#7d6fb0" stroke-width="2.4"><circle cx="9" cy="8" r="3.2"></circle><circle cx="16" cy="9" r="2.6"></circle><path d="M3.5 19 c0-3.5 3-5 5.5-5 s5.5 1.5 5.5 5"></path></svg>`
const closeIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9789AE" stroke-width="2.6" stroke-linecap="round"><path d="M6 6 L18 18 M18 6 L6 18"></path></svg>`
const check = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#1Fae86" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13 l4 4 L19 6"></path></svg>`
const lockSmall = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9789AE" stroke-width="2.2"><rect x="4" y="10" width="16" height="11" rx="2.5"></rect><path d="M8 10 V7 a4 4 0 0 1 8 0 V10"></path></svg>`

const FEATURES = [
  '1 nouvelle histoire chaque semaine',
  'Accès à « Crée ton histoire »',
  'Lecture audio de toutes les histoires',
  'Sans publicité, pour des écrans apaisés',
]

export default function Subscribe({ onClose, onStart }) {
  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: '#fff', position: 'relative', overflow: 'hidden', animation: 'gn-fadein .35s ease', paddingTop: 'calc(env(safe-area-inset-top, 14px) + 16px)' }}>
      <div style={{ padding: '4px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#F1EEF8', color: '#7d6fb0', fontSize: 13, fontWeight: 600, padding: '7px 13px', borderRadius: 18 }}><RawSvg html={parentIcon} />Espace parents</div>
        <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: '50%', background: '#F1EEF8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><RawSvg html={closeIcon} /></button>
      </div>

      <div style={{ textAlign: 'center', padding: '8px 28px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}><Grabi size={84} /></div>
        <div style={{ fontSize: 28, fontWeight: 700, marginTop: 2 }}>Grabi Premium</div>
        <div style={{ fontSize: 15, color: 'var(--ink2)', fontWeight: 500, lineHeight: 1.4, marginTop: 4 }}>Une nouvelle histoire chaque semaine,<br />rien que pour vous deux.</div>
      </div>

      <div style={{ margin: '14px 24px 0', border: '2px solid var(--violet)', background: '#F8F5FF', borderRadius: 26, padding: '16px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, whiteSpace: 'nowrap' }}><span style={{ fontSize: 32, fontWeight: 700 }}>4,99 €</span><span style={{ fontSize: 15, color: 'var(--ink2)', fontWeight: 600 }}>/ mois</span></div>
          <div style={{ fontSize: 13, color: 'var(--ink2)', fontWeight: 500 }}>ou 39,99 € / an · 2 mois offerts</div>
        </div>
        <div style={{ background: 'var(--mint)', color: '#fff', fontSize: 12, fontWeight: 700, padding: '6px 12px', borderRadius: 16 }}>7 jours offerts</div>
      </div>

      <div style={{ flex: 1, padding: '16px 26px 0', display: 'flex', flexDirection: 'column', gap: 13 }}>
        {FEATURES.map((f) => (
          <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--mint-soft)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><RawSvg html={check} /></span>
            <span style={{ fontSize: 16, fontWeight: 500 }}>{f}</span>
          </div>
        ))}
      </div>

      <div style={{ flex: 'none', padding: '6px 24px calc(env(safe-area-inset-bottom, 0px) + 22px)' }}>
        <button onClick={onStart} style={{ width: '100%', background: 'var(--violet)', color: '#fff', borderRadius: 28, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19, fontWeight: 700, boxShadow: '0 14px 28px -10px rgba(169,140,255,.7)' }}>Commencer l'essai gratuit</button>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 14, fontSize: 13, color: 'var(--ink2)', fontWeight: 500 }}><RawSvg html={lockSmall} />Sans engagement · Annulable en 1 clic</div>
      </div>
    </div>
  )
}

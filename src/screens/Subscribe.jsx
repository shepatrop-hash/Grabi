import { useState } from 'react'
import Grabi from '../components/Grabi.jsx'
import RawSvg from '../components/RawSvg.jsx'
import ParentCheck from '../components/ParentCheck.jsx'

const parentIcon = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#7d6fb0" stroke-width="2.4"><circle cx="9" cy="8" r="3.2"></circle><circle cx="16" cy="9" r="2.6"></circle><path d="M3.5 19 c0-3.5 3-5 5.5-5 s5.5 1.5 5.5 5"></path></svg>`
const closeIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9789AE" stroke-width="2.6" stroke-linecap="round"><path d="M6 6 L18 18 M18 6 L6 18"></path></svg>`
const check = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#1Fae86" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13 l4 4 L19 6"></path></svg>`
const lockSmall = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9789AE" stroke-width="2.2"><rect x="4" y="10" width="16" height="11" rx="2.5"></rect><path d="M8 10 V7 a4 4 0 0 1 8 0 V10"></path></svg>`

const FEATURES = [
  'Jusqu’à 10 histoires à créer chaque mois',
  '1 nouvelle histoire longue chaque semaine',
  'Lecture audio de toutes les histoires',
  'Sans publicité, pour des écrans apaisés',
]

function PlanCard({ selected, onClick, title, price, per, note, badge }) {
  return (
    <button onClick={onClick} style={{ flex: 1, textAlign: 'left', border: selected ? '2px solid var(--violet)' : '2px solid var(--card-soft)', background: selected ? 'var(--violet-soft)' : 'var(--card)', borderRadius: 22, padding: '14px 16px', position: 'relative', transition: 'border-color .15s ease' }}>
      {badge && <span style={{ position: 'absolute', top: -11, right: 12, background: 'var(--mint)', color: '#fff', fontSize: 11, fontWeight: 800, padding: '4px 10px', borderRadius: 14, whiteSpace: 'nowrap' }}>{badge}</span>}
      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink2)' }}>{title}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginTop: 4 }}>
        <span style={{ fontSize: 26, fontWeight: 800 }}>{price}</span>
        <span style={{ fontSize: 13, color: 'var(--ink2)', fontWeight: 600 }}>{per}</span>
      </div>
      {note && <div style={{ fontSize: 12, color: selected ? 'var(--violet)' : 'var(--ink2)', fontWeight: 600, marginTop: 3 }}>{note}</div>}
    </button>
  )
}

export default function Subscribe({ reason = 'subscribe', onClose, onStart }) {
  const [plan, setPlan] = useState('annual') // annuel sélectionné par défaut
  const [checking, setChecking] = useState(false)
  const trialDone = reason === 'trial-done' // essai déjà utilisé → on ne repropose pas « 3 jours gratuits »

  if (checking) return <ParentCheck onSuccess={() => onStart(plan)} onCancel={() => setChecking(false)} />

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--card)', position: 'relative', overflow: 'hidden', animation: 'gn-fadein .35s ease', paddingTop: 'calc(env(safe-area-inset-top, 14px) + 16px)' }}>
      <div style={{ padding: '4px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flex: 'none' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'var(--card-soft)', color: 'var(--ink2)', fontSize: 13, fontWeight: 600, padding: '7px 13px', borderRadius: 18 }}><RawSvg html={parentIcon} />Espace parents</div>
        <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--card-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><RawSvg html={closeIcon} /></button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <div style={{ textAlign: 'center', padding: '6px 28px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}><Grabi size={78} /></div>
          <div style={{ fontSize: 27, fontWeight: 700, marginTop: 2 }}>Grabi Premium</div>
          <div style={{ fontSize: 14, color: 'var(--ink2)', fontWeight: 500, lineHeight: 1.4, marginTop: 4 }}>{trialDone ? 'Tu as adoré créer ton histoire ? Abonne-toi pour en créer 10 chaque mois.' : '3 jours offerts pour créer ta première histoire, puis 10 par mois.'}</div>
        </div>

        {/* Choix de la formule — annuel par défaut */}
        <div style={{ display: 'flex', gap: 12, padding: '18px 24px 0' }}>
          <PlanCard selected={plan === 'annual'} onClick={() => setPlan('annual')} title="Annuel" price="49,99 €" per="/ an" note="≈ 4,17 €/mois · 3 mois offerts" badge="Le + avantageux" />
          <PlanCard selected={plan === 'monthly'} onClick={() => setPlan('monthly')} title="Mensuel" price="5,99 €" per="/ mois" note="Sans engagement" />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, margin: '16px 24px 0', background: 'var(--mint-soft)', color: '#0f9b76', borderRadius: 18, padding: '11px 14px', fontSize: 14, fontWeight: 700 }}>{trialDone ? '📖 10 histoires à créer chaque mois' : '🎁 3 jours d’essai · 1 histoire à créer'}</div>

        <div style={{ padding: '18px 26px 8px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {FEATURES.map((f) => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--mint-soft)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><RawSvg html={check} /></span>
              <span style={{ fontSize: 15.5, fontWeight: 500 }}>{f}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 'none', padding: '6px 24px calc(env(safe-area-inset-bottom, 0px) + 20px)' }}>
        <button onClick={() => setChecking(true)} style={{ width: '100%', background: 'var(--violet)', color: '#fff', borderRadius: 28, height: 62, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, boxShadow: '0 14px 28px -10px rgba(169,140,255,.7)' }}>{trialDone ? 'M’abonner maintenant' : 'Commencer les 3 jours gratuits'}</button>
        <div style={{ textAlign: 'center', marginTop: 12, fontSize: 12.5, color: 'var(--ink2)', fontWeight: 500, lineHeight: 1.45 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><RawSvg html={lockSmall} />{trialDone ? `${plan === 'annual' ? '49,99 €/an' : '5,99 €/mois'}, sans engagement.` : `3 jours gratuits, puis ${plan === 'annual' ? '49,99 €/an' : '5,99 €/mois'}.`}</span><br />Résiliable en 1 clic à tout moment.
        </div>
      </div>
    </div>
  )
}

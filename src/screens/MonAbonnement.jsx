import Grabi from '../components/Grabi.jsx'
import RawSvg from '../components/RawSvg.jsx'
import BackButton from '../components/BackButton.jsx'

const check = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1Fae86" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13 l4 4 L19 6"></path></svg>`
const crownIcon = `<svg width="26" height="26" viewBox="0 0 24 24" fill="#fff"><path d="M3 7 l4 5 5-7 5 7 4-5 -2 12 H5 Z"></path></svg>`
const restoreIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3A8AC0" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12 a8 8 0 1 0 2.3 -5.6 M4 4 V7 H7"></path></svg>`
const chevron = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C3BBD2" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6 L15 12 L9 18"></path></svg>`

const FEATURES = [
  '1 nouvelle histoire longue chaque semaine',
  'Accès à « Crée ton histoire »',
  'Lecture audio de toutes les histoires',
  'Sans publicité, pour des écrans apaisés',
]

const card = { background: 'var(--card)', borderRadius: 22, padding: '13px 16px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 6px 16px -12px rgba(74,58,102,.3)' }
const iconBox = (bg) => ({ width: 42, height: 42, borderRadius: 14, background: bg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' })
const sectionTitle = { fontSize: 13, fontWeight: 700, color: 'var(--ink2)', textTransform: 'uppercase', letterSpacing: '.04em', margin: '4px 4px 0' }

export default function MonAbonnement({ premium, onSubscribe, onCancel, onRestore, onBack }) {
  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--bg)', position: 'relative', overflow: 'hidden', animation: 'gn-fadein .35s ease', paddingTop: 'calc(env(safe-area-inset-top, 14px) + 16px)' }}>
      <div style={{ padding: '6px 24px 0', display: 'flex', alignItems: 'center', gap: 14, flex: 'none' }}>
        <BackButton onClick={onBack} />
        <div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>Abonnement &amp; achats</div>
          <div style={{ fontSize: 13, color: 'var(--ink2)', fontWeight: 500 }}>{premium ? 'Tu es abonné Premium' : 'Offre actuelle : Gratuit'}</div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px calc(env(safe-area-inset-bottom, 0px) + 20px)', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Carte de statut */}
        <div style={{ borderRadius: 28, padding: '20px 22px', background: premium ? 'linear-gradient(135deg,#FFB84D,#FF7FB0)' : 'linear-gradient(135deg,#A98CFF,#56C7FF)', color: '#fff', boxShadow: '0 14px 28px -12px rgba(74,58,102,.45)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ width: 48, height: 48, borderRadius: 16, background: 'rgba(255,255,255,.25)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><RawSvg html={crownIcon} /></span>
            <div>
              <div style={{ fontSize: 21, fontWeight: 700 }}>{premium ? 'Grabi Premium' : 'Grabi Gratuit'}</div>
              <div style={{ fontSize: 13, fontWeight: 500, opacity: 0.95 }}>{premium ? '5,99 € / mois · renouvellement auto' : 'Histoires gratuites & compagnon'}</div>
            </div>
          </div>
        </div>

        {premium ? (
          <>
            <div style={sectionTitle}>Ton offre</div>
            <div style={{ background: 'var(--card)', borderRadius: 22, padding: '16px 18px', boxShadow: '0 6px 16px -12px rgba(74,58,102,.3)', display: 'flex', flexDirection: 'column', gap: 11 }}>
              {FEATURES.map((f) => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--mint-soft)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><RawSvg html={check} /></span>
                  <span style={{ fontSize: 15, fontWeight: 500 }}>{f}</span>
                </div>
              ))}
            </div>

            <div style={sectionTitle}>Gérer</div>
            <button onClick={onRestore} style={{ ...card, width: '100%', textAlign: 'left' }}>
              <span style={iconBox('var(--sky-soft)')}><RawSvg html={restoreIcon} /></span>
              <div style={{ flex: 1, fontSize: 16, fontWeight: 600 }}>Restaurer mes achats</div>
              <RawSvg html={chevron} />
            </button>
            <button onClick={onCancel} style={{ ...card, width: '100%', textAlign: 'left', justifyContent: 'center' }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#C24A7A' }}>Résilier l'abonnement</div>
            </button>
          </>
        ) : (
          <>
            <div style={sectionTitle}>Passe à Premium</div>
            <div style={{ background: 'var(--card)', borderRadius: 22, padding: '18px', boxShadow: '0 6px 16px -12px rgba(74,58,102,.3)' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
                <span style={{ fontSize: 30, fontWeight: 700 }}>5,99 €</span>
                <span style={{ fontSize: 14, color: 'var(--ink2)', fontWeight: 600 }}>/ mois</span>
                <span style={{ marginLeft: 'auto', background: 'var(--mint)', color: '#fff', fontSize: 12, fontWeight: 700, padding: '5px 11px', borderRadius: 14 }}>7 jours offerts</span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--ink2)', fontWeight: 500, marginTop: 2 }}>ou 49,99 € / an · 3 mois offerts</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 11, marginTop: 16 }}>
                {FEATURES.map((f) => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--mint-soft)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><RawSvg html={check} /></span>
                    <span style={{ fontSize: 15, fontWeight: 500 }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={onSubscribe} style={{ background: 'var(--violet)', color: '#fff', borderRadius: 24, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 700, boxShadow: '0 14px 28px -10px rgba(169,140,255,.7)' }}>Commencer l'essai gratuit</button>
            <button onClick={onRestore} style={{ ...card, width: '100%', textAlign: 'left' }}>
              <span style={iconBox('var(--sky-soft)')}><RawSvg html={restoreIcon} /></span>
              <div style={{ flex: 1, fontSize: 16, fontWeight: 600 }}>Restaurer mes achats</div>
              <RawSvg html={chevron} />
            </button>
          </>
        )}

        <div style={{ fontSize: 11, color: 'var(--ink2)', fontWeight: 500, textAlign: 'center', padding: '6px 12px 0', lineHeight: 1.4 }}>Sans engagement · Annulable en 1 clic · Paiement géré par votre boutique d'applications.</div>
      </div>
    </div>
  )
}

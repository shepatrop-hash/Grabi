import Grabi from '../components/Grabi.jsx'
import RawSvg from '../components/RawSvg.jsx'
import { COIN_PACKS } from '../lib/coins.js'

const closeIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9789AE" stroke-width="2.6" stroke-linecap="round"><path d="M6 6 L18 18 M18 6 L6 18"></path></svg>`

// Boutique de pièces d'or : achat de packs (10 / 30 / 100). L'achat réel (RevenueCat, Android)
// est branché à l'étape suivante ; pour l'instant `onBuy` informe que ça arrive bientôt.
export default function Boutique({ coins = 0, onBuy, onSubscribe, onClose }) {
  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--card)', position: 'relative', overflow: 'hidden', animation: 'gn-fadein .35s ease', paddingTop: 'calc(env(safe-area-inset-top, 14px) + 16px)' }}>
      <div style={{ padding: '4px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flex: 'none' }}>
        <button onClick={onClose} aria-label="Fermer" style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--card-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><RawSvg html={closeIcon} /></button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <div style={{ textAlign: 'center', padding: '2px 28px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}><Grabi size={72} /></div>
          <div style={{ fontSize: 26, fontWeight: 800, marginTop: 2 }}>Boutique de pièces</div>
          <div style={{ fontSize: 14, color: 'var(--ink2)', fontWeight: 500, marginTop: 4 }}>1 pièce = 1 histoire à inventer 🪙</div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'var(--yellow-soft)', color: 'var(--ink)', borderRadius: 18, padding: '8px 16px', fontSize: 16, fontWeight: 800, marginTop: 14 }}>🪙 {coins} <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink2)' }}>{coins > 1 ? 'pièces' : 'pièce'}</span></div>
        </div>

        <div style={{ padding: '20px 24px 4px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {COIN_PACKS.map((p) => (
            <button key={p.id} onClick={() => onBuy && onBuy(p)} style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'var(--card-soft)', border: '2px solid var(--card-border)', borderRadius: 22, padding: '14px 16px', textAlign: 'left', width: '100%', position: 'relative' }}>
              {p.tag && <span style={{ position: 'absolute', top: -11, right: 14, background: 'var(--mint)', color: '#fff', fontSize: 11, fontWeight: 800, padding: '4px 10px', borderRadius: 14, whiteSpace: 'nowrap' }}>{p.tag}</span>}
              <div style={{ width: 52, height: 52, borderRadius: 16, background: 'var(--yellow-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', fontSize: 26 }}>🪙</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 17, fontWeight: 800 }}>{p.coins} pièces</div>
                <div style={{ fontSize: 12.5, color: 'var(--ink2)', fontWeight: 600, marginTop: 2 }}>{p.coins} histoires à inventer</div>
              </div>
              <span style={{ flex: 'none', background: 'var(--violet)', color: '#fff', borderRadius: 16, padding: '11px 16px', fontSize: 15, fontWeight: 800 }}>{p.price}</span>
            </button>
          ))}
        </div>

        <div style={{ textAlign: 'center', padding: '10px 30px 0', fontSize: 12.5, color: 'var(--ink2)', fontWeight: 500, lineHeight: 1.45 }}>Les pièces ne s'épuisent jamais : garde-les aussi longtemps que tu veux.</div>

        {onSubscribe && (
          <button onClick={onSubscribe} style={{ margin: '18px 24px 8px', background: 'var(--violet-soft)', borderRadius: 20, padding: '14px 16px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 26, flex: 'none' }}>👑</span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: 'block', fontSize: 15, fontWeight: 800 }}>Abonne-toi</span>
              <span style={{ display: 'block', fontSize: 12.5, color: 'var(--ink2)', fontWeight: 600, marginTop: 2 }}>10 pièces chaque mois + lecture illimitée</span>
            </span>
            <span style={{ flex: 'none', color: 'var(--violet)', fontSize: 20, fontWeight: 800 }}>→</span>
          </button>
        )}
      </div>
    </div>
  )
}

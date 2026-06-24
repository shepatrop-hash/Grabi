import Grabi from '../components/Grabi.jsx'
import RawSvg from '../components/RawSvg.jsx'
import BottomNav from '../components/BottomNav.jsx'

const chevron = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C3BBD2" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6 L15 12 L9 18"></path></svg>`
const grabiIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7d5fc4" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><circle cx="9" cy="11" r="1.1" fill="#7d5fc4"></circle><circle cx="15" cy="11" r="1.1" fill="#7d5fc4"></circle><path d="M9 15 q3 2.6 6 0"></path></svg>`
const parentIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3A8AC0" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.2"></circle><circle cx="16.5" cy="9" r="2.6"></circle><path d="M3.5 19 c0-3.5 3-5 5.5-5 s5.5 1.5 5.5 5 M16 14 c2 0 4 1.4 4 4.5"></path></svg>`
const crownIcon = `<svg width="22" height="22" viewBox="0 0 24 24" fill="#C79A2E"><path d="M3 7 l4 5 5-7 5 7 4-5 -2 12 H5 Z"></path></svg>`
const helpIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C24A7A" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M9.2 9.2 a2.8 2.8 0 0 1 5.2 1.3 c0 1.8-2.4 2.2-2.4 3.7"></path><circle cx="12" cy="17.2" r="0.6" fill="#C24A7A"></circle></svg>`

// Grande carte de catégorie (titre + sous-titre + icône colorée).
function CategoryCard({ onClick, bg, iconBg, icon, title, subtitle, badge, badgeColor, badgeBg }) {
  return (
    <button onClick={onClick} style={{ background: bg, borderRadius: 26, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14, width: '100%', textAlign: 'left', boxShadow: '0 8px 20px -14px rgba(74,58,102,.4)' }}>
      <span style={{ width: 52, height: 52, borderRadius: 18, background: iconBg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><RawSvg html={icon} /></span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 18, fontWeight: 700 }}>{title}</div>
        <div style={{ fontSize: 13, color: 'var(--ink2)', fontWeight: 500 }}>{subtitle}</div>
      </div>
      {badge && <span style={{ fontSize: 12, fontWeight: 700, color: badgeColor, background: badgeBg, padding: '5px 10px', borderRadius: 14 }}>{badge}</span>}
      <RawSvg html={chevron} />
    </button>
  )
}

const rowStyle = { background: '#fff', borderRadius: 22, padding: '13px 16px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 6px 16px -12px rgba(74,58,102,.3)', width: '100%', textAlign: 'left' }
const iconBox = (bg) => ({ width: 42, height: 42, borderRadius: 14, background: bg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' })

export default function Settings({ premium, child = { name: 'Léa', age: '5 ans' }, onEditProfile, onMonGrabi, onEspaceParents, onAbonnement, onHome, onCommunity, onCreate, onMine }) {
  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--bg)', position: 'relative', overflow: 'hidden', animation: 'gn-fadein .35s ease', paddingTop: 'calc(env(safe-area-inset-top, 14px) + 16px)' }}>
      <div style={{ position: 'absolute', top: -50, right: -40, width: 170, height: 170, borderRadius: '50%', background: 'var(--sky-soft)', opacity: 0.55 }} />
      <div style={{ padding: '6px 24px 0', flex: 'none', position: 'relative', zIndex: 2 }}>
        <div style={{ fontSize: 26, fontWeight: 700 }}>Paramètres</div>
        <div style={{ fontSize: 14, color: 'var(--ink2)', fontWeight: 500 }}>Réglages &amp; espace parents</div>
      </div>

      <button onClick={onEditProfile} style={{ margin: '16px 24px 0', background: '#fff', borderRadius: 26, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 8px 20px -12px rgba(74,58,102,.28)', position: 'relative', zIndex: 2, textAlign: 'left' }}>
        <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'var(--violet-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', overflow: 'hidden' }}><Grabi size={54} /></div>
        <div style={{ flex: 1 }}><div style={{ fontSize: 18, fontWeight: 700 }}>{child.name}</div><div style={{ fontSize: 13, color: 'var(--ink2)', fontWeight: 500 }}>{child.age} · profil enfant</div></div>
        <RawSvg html={chevron} />
      </button>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px 12px', display: 'flex', flexDirection: 'column', gap: 12, position: 'relative', zIndex: 2 }}>
        <CategoryCard onClick={onMonGrabi} bg="#fff" iconBg="var(--violet-soft)" icon={grabiIcon} title="Mon Grabi" subtitle="Apparence, voix & accessoires" />
        <CategoryCard onClick={onEspaceParents} bg="#fff" iconBg="var(--sky-soft)" icon={parentIcon} title="Espace parents" subtitle="Temps d'écran, sons, sécurité" />
        <CategoryCard onClick={onAbonnement} bg="#fff" iconBg="var(--yellow-soft)" icon={crownIcon} title="Abonnement & achats" subtitle="Gère ton offre Premium" badge={premium ? 'Premium' : 'Gratuit'} badgeColor={premium ? '#a07d2a' : '#7d5fc4'} badgeBg={premium ? 'var(--yellow-soft)' : 'var(--violet-soft)'} />

        <a href="mailto:bonjour@grabi.app" style={{ ...rowStyle, textDecoration: 'none', color: 'inherit', marginTop: 4 }}>
          <span style={iconBox('var(--pink-soft)')}><RawSvg html={helpIcon} /></span>
          <div style={{ flex: 1, fontSize: 16, fontWeight: 600 }}>Aide &amp; contact</div>
          <RawSvg html={chevron} />
        </a>

        <div style={{ fontSize: 11, color: 'var(--ink2)', fontWeight: 500, textAlign: 'center', padding: '4px 12px 0' }}>Grabi v1.0 · Fait avec 💜</div>
      </div>

      <BottomNav active="settings" onHome={onHome} onCommunity={onCommunity} onCreate={onCreate} onMine={onMine} onSettings={() => {}} />
    </div>
  )
}

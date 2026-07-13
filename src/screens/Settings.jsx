import Grabi from '../components/Grabi.jsx'
import RawSvg from '../components/RawSvg.jsx'

const chevron = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C3BBD2" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6 L15 12 L9 18"></path></svg>`
const grabiIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7d5fc4" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><circle cx="9" cy="11" r="1.1" fill="#7d5fc4"></circle><circle cx="15" cy="11" r="1.1" fill="#7d5fc4"></circle><path d="M9 15 q3 2.6 6 0"></path></svg>`
const parentIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3A8AC0" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.2"></circle><circle cx="16.5" cy="9" r="2.6"></circle><path d="M3.5 19 c0-3.5 3-5 5.5-5 s5.5 1.5 5.5 5 M16 14 c2 0 4 1.4 4 4.5"></path></svg>`
const heartIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="#e8638f"><path d="M12 21 C5 15 3 11.5 3 8.5 A4.3 4.3 0 0 1 12 6.5 A4.3 4.3 0 0 1 21 8.5 C21 11.5 19 15 12 21 Z"></path></svg>`
const trophyIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="#E0B84A"><path d="M12 3 l2.6 5.3 5.8 .8 -4.2 4.1 1 5.8 -5.2 -2.7 -5.2 2.7 1 -5.8 -4.2 -4.1 5.8 -.8 Z"></path></svg>`
const storiesIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e8638f" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4 H17 V20 L12 16 L7 20 Z"></path></svg>`

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

export default function Settings({ premium, child = { name: 'Léa', age: '5 ans' }, darkMode = true, onToggleDark, onEditProfile, onMonGrabi, onPlayGrabi, onRewards, onEspaceParents, onHome, onCommunity, onDecouvrir, onMine }) {
  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--bg)', position: 'relative', overflow: 'hidden', animation: 'gn-fadein .4s cubic-bezier(.22,.61,.36,1)', paddingTop: 'calc(env(safe-area-inset-top, 14px) + 16px)' }}>
      <div style={{ position: 'absolute', top: -50, right: -40, width: 170, height: 170, borderRadius: '50%', background: 'var(--sky-soft)', opacity: 0.55 }} />
      <div style={{ padding: '6px 24px 0', flex: 'none', position: 'relative', zIndex: 2 }}>
        <div style={{ fontSize: 26, fontWeight: 700 }}>Mon coin</div>
        <div style={{ fontSize: 14, color: 'var(--ink2)', fontWeight: 500 }}>Tes histoires, ton Grabi &amp; les réglages</div>
      </div>

      <button onClick={onEditProfile} style={{ margin: '16px 24px 0', background: 'var(--card)', borderRadius: 26, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 8px 20px -12px rgba(74,58,102,.28)', position: 'relative', zIndex: 2, textAlign: 'left' }}>
        <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'var(--violet-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', overflow: 'hidden' }}><Grabi size={54} /></div>
        <div style={{ flex: 1 }}><div style={{ fontSize: 18, fontWeight: 700 }}>{child.name}</div><div style={{ fontSize: 13, color: 'var(--ink2)', fontWeight: 500 }}>{child.age} · profil enfant</div></div>
        <RawSvg html={chevron} />
      </button>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px 12px', display: 'flex', flexDirection: 'column', gap: 12, position: 'relative', zIndex: 2 }}>
        <CategoryCard onClick={onMine} bg="var(--card)" iconBg="var(--pink-soft)" icon={storiesIcon} title="Mes histoires" subtitle="Tes créations & tes favoris" />
        <CategoryCard onClick={onMonGrabi} bg="var(--card)" iconBg="var(--violet-soft)" icon={grabiIcon} title="Mon Grabi" subtitle="Voix & ambiance" />
        <CategoryCard onClick={onRewards} bg="var(--card)" iconBg="var(--yellow-soft)" icon={trophyIcon} title="Mes récompenses" subtitle="Tes badges et tes histoires" />
        <CategoryCard onClick={onEspaceParents} bg="var(--card)" iconBg="var(--sky-soft)" icon={parentIcon} title="Espace parents" subtitle="Abonnement, temps d'écran, sécurité" badge={premium ? 'Premium' : 'Gratuit'} badgeColor={premium ? '#a07d2a' : '#7d5fc4'} badgeBg={premium ? 'var(--yellow-soft)' : 'var(--violet-soft)'} />

        {/* Bascule directe jour / nuit galaxy */}
        <button onClick={onToggleDark} style={{ background: 'var(--card)', borderRadius: 26, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14, width: '100%', textAlign: 'left', boxShadow: '0 8px 20px -14px rgba(74,58,102,.4)' }}>
          <span style={{ width: 52, height: 52, borderRadius: 18, background: 'var(--violet-soft)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flex: 'none' }}>{darkMode ? '🌙' : '☀️'}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{darkMode ? 'Thème sombre' : 'Thème clair'}</div>
            <div style={{ fontSize: 13, color: 'var(--ink2)', fontWeight: 500 }}>{darkMode ? 'Ambiance du soir, douce pour les yeux' : 'Couleurs claires et lumineuses'}</div>
          </div>
          <span style={{ width: 46, height: 27, borderRadius: 14, background: darkMode ? 'var(--violet)' : 'var(--track-off)', position: 'relative', flex: 'none', transition: 'background .2s ease' }}><span style={{ position: 'absolute', top: 3, left: darkMode ? 22 : 3, width: 21, height: 21, borderRadius: '50%', background: 'var(--knob)', transition: 'left .2s ease' }} /></span>
        </button>

        <div style={{ fontSize: 11, color: 'var(--ink2)', fontWeight: 500, textAlign: 'center', padding: '8px 12px 0' }}>Grabi v1.0 · Fait avec 💜</div>
      </div>

      <div style={{ flex: 'none', height: 'calc(env(safe-area-inset-bottom, 0px) + 92px)' }} />
    </div>
  )
}

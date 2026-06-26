import Grabi from '../components/Grabi.jsx'
import RawSvg from '../components/RawSvg.jsx'
import { playGrabiSound } from '../lib/sounds.js'

const iconBooks = `<svg width="48" height="48" viewBox="0 0 46 46"><rect x="8" y="27" width="30" height="9" rx="3.5" fill="#FF7FB0"></rect><rect x="6" y="17.5" width="34" height="9" rx="3.5" fill="#56C7FF"></rect><rect x="10" y="8" width="26" height="9" rx="3.5" fill="#3FD7B0"></rect></svg>`
const iconStar = `<svg width="50" height="50" viewBox="0 0 50 50"><path d="M25,6 L31,20 L46,21 L34,31 L38,46 L25,38 L12,46 L16,31 L4,21 L19,20 Z" fill="#FFCC3E"></path><circle cx="20" cy="25" r="2.4" fill="#3B2D5A"></circle><circle cx="30" cy="25" r="2.4" fill="#3B2D5A"></circle><path d="M21,31 Q25,35 29,31" stroke="#3B2D5A" stroke-width="2.2" fill="none" stroke-linecap="round"></path></svg>`
const iconPencil = `<svg width="46" height="46" viewBox="0 0 46 46"><line x1="11" y1="36" x2="30" y2="17" stroke="#A98CFF" stroke-width="5.5" stroke-linecap="round"></line><path d="M33,9 L35,14 L40,16 L35,18 L33,23 L31,18 L26,16 L31,14 Z" fill="#FFCC3E"></path><circle cx="15" cy="13" r="2.5" fill="#FF7FB0"></circle><circle cx="40" cy="32" r="2.5" fill="#3FD7B0"></circle></svg>`
const iconHome = `<svg width="23" height="23" viewBox="0 0 24 24" fill="none"><path d="M4 11.5 L12 4.5 L20 11.5 V20 H4 Z" fill="#fff"></path></svg>`
const iconCommunity = `<svg width="28" height="28" viewBox="0 0 40 40"><circle cx="20" cy="20" r="15" fill="none" stroke="#C3BBD2" stroke-width="2.6"></circle><circle cx="15" cy="19" r="2.2" fill="#C3BBD2"></circle><circle cx="25" cy="19" r="2.2" fill="#C3BBD2"></circle><path d="M15,25 Q20,29 25,25" stroke="#C3BBD2" stroke-width="2.2" fill="none" stroke-linecap="round"></path></svg>`
const iconBookmark = `<svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#C3BBD2" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4 H17 V20 L12 16 L7 20 Z"></path></svg>`
const iconGear = `<svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#C3BBD2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3.1"></circle><path d="M19.4 13a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1.08 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`
const fabPlus = `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.8" stroke-linecap="round"><path d="M12 5 V19 M5 12 H19"></path></svg>`

const whiteCircle = {
  width: 80, height: 80, borderRadius: '50%', background: 'var(--card)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none',
}
const navBtn = { width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }

function Card({ onClick, bg, title, subtitle, subColor, shadow, icon }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%', textAlign: 'left', flex: 'none', height: 148, background: bg, borderRadius: 34,
        padding: '18px 22px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', boxShadow: shadow,
      }}
    >
      <span>
        <span style={{ display: 'block', fontSize: 24, fontWeight: 700, lineHeight: 1.1 }} dangerouslySetInnerHTML={{ __html: title }} />
        <span className="card-sub" style={{ display: 'block', fontSize: 14, fontWeight: 500, color: subColor, marginTop: 4 }}>{subtitle}</span>
      </span>
      <RawSvg style={whiteCircle} html={icon} />
    </button>
  )
}

export default function Home({ childName = 'Léa', onGoFree, onGoPremium, onGoCreate, onGoCommunity, onGoMine, onGoSettings, onGoGrabi }) {
  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--bg)', position: 'relative', overflow: 'hidden', animation: 'gn-fadein .35s ease', paddingTop: 'calc(env(safe-area-inset-top, 14px) + 34px)' }}>
      <div style={{ position: 'absolute', top: -60, right: -50, width: 200, height: 200, borderRadius: '50%', background: 'var(--yellow-soft)', opacity: 0.7 }} />
      <div style={{ position: 'absolute', bottom: 130, left: -70, width: 200, height: 200, borderRadius: '50%', background: 'var(--sky-soft)', opacity: 0.55 }} />

      <div style={{ padding: '14px 26px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 2 }}>
        <div>
          <div style={{ fontSize: 17, fontWeight: 500, color: 'var(--ink2)' }}>Coucou {childName}&nbsp;!</div>
          <div style={{ fontSize: 27, fontWeight: 700, lineHeight: 1.12, maxWidth: 172 }}>On invente une histoire&nbsp;?</div>
        </div>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', top: -22, left: -46, background: 'var(--card)', borderRadius: '18px 18px 4px 18px', padding: '8px 13px', fontSize: 14, fontWeight: 600, boxShadow: '0 6px 16px rgba(74,58,102,.14)', whiteSpace: 'nowrap' }}>On joue&nbsp;?</div>
          <div onClick={() => { playGrabiSound(); onGoGrabi() }} style={{ cursor: 'pointer' }}><Grabi size={104} /></div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 18, padding: '22px 26px 0', position: 'relative', zIndex: 2 }}>
        <Card onClick={onGoFree} bg="var(--yellow-soft)" title="Histoires<br/>gratuites" subtitle="À lire et relire 💛" subColor="#a07d2a" shadow="0 10px 22px -10px rgba(255,180,40,.6)" icon={iconBooks} />
        <Card onClick={onGoPremium} bg="var(--pink-soft)" title="Histoires de<br/>la semaine" subtitle="Une nouveauté chaque semaine" subColor="#b5527e" shadow="0 10px 22px -10px rgba(255,127,176,.55)" icon={iconStar} />
        <Card onClick={onGoCreate} bg="var(--violet-soft)" title="Crée ton<br/>histoire" subtitle="Imagine, Grabi dessine ✨" subColor="#7d5fc4" shadow="0 10px 22px -10px rgba(169,140,255,.55)" icon={iconPencil} />
      </div>

      <div style={{ flex: 'none', padding: '12px 26px calc(22px + env(safe-area-inset-bottom, 0px))', position: 'relative', zIndex: 2 }}>
        <div style={{ background: 'var(--card)', borderRadius: 30, height: 66, display: 'flex', alignItems: 'center', justifyContent: 'space-around', boxShadow: '0 10px 26px -8px rgba(74,58,102,.28)' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--violet)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><RawSvg html={iconHome} /></div>
          <button onClick={onGoCommunity} style={navBtn}><RawSvg html={iconCommunity} /></button>
          <button onClick={onGoCreate} style={{ width: 62, height: 62, borderRadius: '50%', background: 'linear-gradient(135deg,#FFD23F,#FF7FB0)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: -24, boxShadow: '0 12px 22px -6px rgba(255,127,176,.75)' }}><RawSvg html={fabPlus} /></button>
          <button onClick={onGoMine} style={navBtn}><RawSvg html={iconBookmark} /></button>
          <button onClick={onGoSettings} style={navBtn}><RawSvg html={iconGear} /></button>
        </div>
      </div>
    </div>
  )
}

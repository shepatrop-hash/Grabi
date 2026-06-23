import RawSvg from './RawSvg.jsx'

const L = '#C3BBD2'
const homeIcon = (c) => `<svg width="24" height="24" viewBox="0 0 24 24" fill="${c === '#fff' ? '#fff' : 'none'}" stroke="${c}" stroke-width="2.2"><path d="M4 11.5 L12 4.5 L20 11.5 V20 H4 Z"></path></svg>`
const communityIcon = (c) => `<svg width="27" height="27" viewBox="0 0 40 40"><circle cx="20" cy="20" r="15" fill="none" stroke="${c}" stroke-width="2.6"></circle><circle cx="15" cy="19" r="2.2" fill="${c}"></circle><circle cx="25" cy="19" r="2.2" fill="${c}"></circle><path d="M15,25 Q20,29 25,25" stroke="${c}" stroke-width="2.2" fill="none" stroke-linecap="round"></path></svg>`
const bookmarkIcon = (c) => `<svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4 H17 V20 L12 16 L7 20 Z"></path></svg>`
const gearIcon = (c) => `<svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3.1"></circle><path d="M19.4 13a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1.08 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`
const fabPlus = `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.8" stroke-linecap="round"><path d="M12 5 V19 M5 12 H19"></path></svg>`

const ICONS = { home: homeIcon, community: communityIcon, mine: bookmarkIcon, settings: gearIcon }

export default function BottomNav({ active, onHome, onCommunity, onCreate, onMine, onSettings }) {
  const handlers = { home: onHome, community: onCommunity, mine: onMine, settings: onSettings }
  const item = (key) => {
    const icon = ICONS[key]
    if (active === key) {
      return <div key={key} style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--violet)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><RawSvg html={icon('#fff')} /></div>
    }
    return <button key={key} onClick={handlers[key]} style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><RawSvg html={icon(L)} /></button>
  }
  return (
    <div style={{ flex: 'none', padding: '8px 26px calc(env(safe-area-inset-bottom, 0px) + 20px)' }}>
      <div style={{ background: '#fff', borderRadius: 30, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-around', boxShadow: '0 10px 26px -8px rgba(74,58,102,.28)' }}>
        {item('home')}
        {item('community')}
        <button onClick={onCreate} style={{ width: 62, height: 62, borderRadius: '50%', background: 'linear-gradient(135deg,#FFD23F,#FF7FB0)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: -24, boxShadow: '0 12px 22px -6px rgba(255,127,176,.75)' }}><RawSvg html={fabPlus} /></button>
        {item('mine')}
        {item('settings')}
      </div>
    </div>
  )
}

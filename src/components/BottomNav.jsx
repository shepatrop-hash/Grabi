import RawSvg from './RawSvg.jsx'

const L = '#C3BBD2'
const homeIcon = (c) => `<svg width="24" height="24" viewBox="0 0 24 24" fill="${c === '#fff' ? '#fff' : 'none'}" stroke="${c}" stroke-width="2.2"><path d="M4 11.5 L12 4.5 L20 11.5 V20 H4 Z"></path></svg>`
const communityIcon = (c) => `<svg width="27" height="27" viewBox="0 0 40 40"><circle cx="20" cy="20" r="15" fill="none" stroke="${c}" stroke-width="2.6"></circle><circle cx="15" cy="19" r="2.2" fill="${c}"></circle><circle cx="25" cy="19" r="2.2" fill="${c}"></circle><path d="M15,25 Q20,29 25,25" stroke="${c}" stroke-width="2.2" fill="none" stroke-linecap="round"></path></svg>`
const bookmarkIcon = (c) => `<svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4 H17 V20 L12 16 L7 20 Z"></path></svg>`
const gearIcon = (c) => `<svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="1.9" stroke-linejoin="round" stroke-linecap="round"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94L14.4 2.81c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41L9.25 5.35C8.66 5.59 8.12 5.92 7.63 6.29L5.24 5.33c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58C4.84 11.36 4.8 11.69 4.8 12s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z"></path></svg>`
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
      <div style={{ background: 'var(--card)', borderRadius: 30, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-around', boxShadow: '0 10px 26px -8px rgba(74,58,102,.28)' }}>
        {item('home')}
        {item('community')}
        <button onClick={onCreate} style={{ width: 62, height: 62, borderRadius: '50%', background: 'linear-gradient(135deg,#FFD23F,#FF7FB0)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: -24, boxShadow: '0 12px 22px -6px rgba(255,127,176,.75)' }}><RawSvg html={fabPlus} /></button>
        {item('mine')}
        {item('settings')}
      </div>
    </div>
  )
}

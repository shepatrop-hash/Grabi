import Grabi from '../components/Grabi.jsx'
import BottomNav from '../components/BottomNav.jsx'
import RawSvg from '../components/RawSvg.jsx'

const badge = `<svg width="20" height="20" viewBox="0 0 40 40"><circle cx="20" cy="20" r="16" fill="#FFFDF7"></circle><g fill="none" stroke-width="3.6" stroke-linecap="round"><path d="M20,4 A16,16 0 0 1 36,20" stroke="#FF7FB0"></path><path d="M36,20 A16,16 0 0 1 20,36" stroke="#56C7FF"></path><path d="M20,36 A16,16 0 0 1 4,20" stroke="#3FD7B0"></path><path d="M4,20 A16,16 0 0 1 20,4" stroke="#FFCC3E"></path></g><circle cx="15" cy="19" r="2.3" fill="#3B2D5A"></circle><circle cx="25" cy="19" r="2.3" fill="#3B2D5A"></circle></svg>`
const dragon = `<svg width="50" height="50" viewBox="0 0 86 86"><path d="M30,22 L26,7 L39,18 Z" fill="#6FC79A"></path><path d="M56,22 L60,7 L47,18 Z" fill="#6FC79A"></path><circle cx="43" cy="46" r="27" fill="#9CE3B4"></circle><ellipse cx="43" cy="56" rx="15" ry="11" fill="#C6F0D4"></ellipse><circle cx="34" cy="41" r="6" fill="#fff"></circle><circle cx="52" cy="41" r="6" fill="#fff"></circle><circle cx="35" cy="42" r="3" fill="#3B2D5A"></circle><circle cx="53" cy="42" r="3" fill="#3B2D5A"></circle></svg>`
const unicorn = `<svg width="50" height="50" viewBox="0 0 86 86"><path d="M43,7 L37,27 L49,27 Z" fill="#FFCC3E"></path><circle cx="43" cy="48" r="27" fill="#FFFFFF" stroke="#F7DCE8" stroke-width="2"></circle><path d="M19,38 q-7,13 4,24" fill="none" stroke="#FF7FB0" stroke-width="7" stroke-linecap="round"></path><circle cx="35" cy="46" r="4.5" fill="#3B2D5A"></circle><circle cx="51" cy="46" r="4.5" fill="#3B2D5A"></circle><path d="M37,58 Q43,64 49,58" stroke="#3B2D5A" stroke-width="3" fill="none" stroke-linecap="round"></path></svg>`
const star = `<svg width="50" height="50" viewBox="0 0 86 86"><path d="M43,10 L52,33 L77,34 L57,49 L64,73 L43,59 L22,73 L29,49 L9,34 L34,33 Z" fill="#FFCC3E"></path><circle cx="36" cy="42" r="3.4" fill="#3B2D5A"></circle><circle cx="50" cy="42" r="3.4" fill="#3B2D5A"></circle><path d="M38,48 Q43,53 48,48" stroke="#3B2D5A" stroke-width="2.6" fill="none" stroke-linecap="round"></path></svg>`

const STORIES = [
  { title: 'Le dragon aux crêpes', count: 21, bg: 'var(--mint-soft)', svg: dragon },
  { title: "Lila et l'arc-en-ciel", count: 12, bg: 'var(--pink-soft)', svg: unicorn },
  { title: "L'étoile qui avait peur du noir", count: 5, bg: 'var(--sky-soft)', svg: star },
]

export default function MyStories({ onOpenReader, onHome, onCommunity, onCreate, onSettings }) {
  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--bg)', position: 'relative', overflow: 'hidden', animation: 'gn-fadein .35s ease', paddingTop: 'calc(env(safe-area-inset-top, 14px) + 16px)' }}>
      <div style={{ position: 'absolute', top: -50, left: -40, width: 170, height: 170, borderRadius: '50%', background: 'var(--yellow-soft)', opacity: 0.6 }} />
      <div style={{ padding: '6px 24px 0', flex: 'none', position: 'relative', zIndex: 2 }}>
        <div style={{ fontSize: 26, fontWeight: 700 }}>Mes histoires</div>
      </div>

      <div style={{ margin: '14px 24px 0', background: 'linear-gradient(135deg,#FFE7A0,#FFC4DC)', borderRadius: 28, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14, position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'flex', justifyContent: 'center', flex: 'none' }}><Grabi size={64} /></div>
        <div style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.25, color: '#7a4a5a' }}>Bravo&nbsp;! Tes histoires ont fait sourire <span style={{ color: '#C24A7A' }}>38 enfants</span> 💛</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 24px 18px', display: 'flex', flexDirection: 'column', gap: 14, position: 'relative', zIndex: 2 }}>
        {STORIES.map((s) => (
          <button key={s.title} onClick={() => onOpenReader('mine')} style={{ background: '#fff', borderRadius: 24, padding: 14, display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 8px 20px -12px rgba(74,58,102,.28)', textAlign: 'left' }}>
            <div style={{ width: 64, height: 64, borderRadius: 18, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><RawSvg html={s.svg} /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 17, fontWeight: 700 }}>{s.title}</div>
              <div style={{ fontSize: 13, color: '#1f9e7a', fontWeight: 600, marginTop: 2 }}>A fait sourire {s.count} enfants</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'var(--yellow-soft)', padding: '7px 12px', borderRadius: 18, flex: 'none' }}>
              <RawSvg html={badge} />
              <span style={{ fontSize: 16, fontWeight: 700 }}>{s.count}</span>
            </div>
          </button>
        ))}
      </div>

      <BottomNav active="mine" onHome={onHome} onCommunity={onCommunity} onCreate={onCreate} onSettings={onSettings} />
    </div>
  )
}

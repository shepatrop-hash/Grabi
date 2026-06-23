import { useState } from 'react'
import BottomNav from '../components/BottomNav.jsx'
import RawSvg from '../components/RawSvg.jsx'

const whale = `<svg width="150" height="100" viewBox="0 0 150 100"><ellipse cx="70" cy="58" rx="50" ry="30" fill="#6FB7E0"></ellipse><path d="M116,46 L146,30 L146,74 Z" fill="#6FB7E0"></path><ellipse cx="62" cy="68" rx="34" ry="16" fill="#A9D9F0"></ellipse><circle cx="50" cy="50" r="4" fill="#274A5E"></circle><path d="M42,62 Q54,70 66,62" stroke="#274A5E" stroke-width="2.6" fill="none" stroke-linecap="round"></path><path d="M50,24 q-4,-10 3,-16" stroke="#A9D9F0" stroke-width="4.5" fill="none" stroke-linecap="round"></path><circle cx="52" cy="6" r="3.5" fill="#fff"></circle><circle cx="60" cy="12" r="2.5" fill="#fff"></circle></svg>`
const robot = `<svg width="120" height="100" viewBox="0 0 120 100"><circle cx="60" cy="14" r="4" fill="#FF7FB0"></circle><line x1="60" y1="18" x2="60" y2="28" stroke="#B6A6D6" stroke-width="3"></line><rect x="34" y="28" width="52" height="46" rx="15" fill="#BFC2D6"></rect><circle cx="50" cy="48" r="7" fill="#fff"></circle><circle cx="70" cy="48" r="7" fill="#fff"></circle><circle cx="50" cy="49" r="3" fill="#3B2D5A"></circle><circle cx="70" cy="49" r="3" fill="#3B2D5A"></circle><path d="M52,62 Q60,68 68,62" stroke="#6E6A86" stroke-width="2.6" fill="none" stroke-linecap="round"></path><path d="M92,80 q-6,-14 6,-20" stroke="#3FD7B0" stroke-width="5" fill="none" stroke-linecap="round"></path><ellipse cx="100" cy="58" rx="6" ry="9" fill="#7FE0C4" transform="rotate(25 100 58)"></ellipse></svg>`

const STORIES = [
  { id: 1, title: 'La baleine qui chante', author: 'par Maya, 6 ans', bg: 'var(--sky-soft)', svg: whale },
  { id: 2, title: 'Le robot jardinier', author: 'par Tom, 5 ans', bg: 'var(--violet-soft)', svg: robot },
]
const TABS = [{ k: 'recentes', l: 'Récentes' }, { k: 'fav', l: 'Préférées des enfants' }]

export default function Community({ onOpenReader, onHome, onCreate, onMine, onSettings }) {
  const [tab, setTab] = useState('recentes')
  const [given, setGiven] = useState({})

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--bg)', position: 'relative', overflow: 'hidden', animation: 'gn-fadein .35s ease', paddingTop: 'calc(env(safe-area-inset-top, 14px) + 16px)' }}>
      <div style={{ padding: '6px 24px 0', flex: 'none' }}>
        <div style={{ fontSize: 26, fontWeight: 700 }}>Communauté</div>
        <div style={{ fontSize: 14, color: 'var(--ink2)', fontWeight: 500 }}>Les histoires des autres enfants</div>
        <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
          {TABS.map((t) => {
            const active = tab === t.k
            return (
              <button key={t.k} onClick={() => setTab(t.k)} style={active ? { background: 'var(--ink)', color: '#fff', padding: '9px 18px', borderRadius: 20, fontSize: 15, fontWeight: 600 } : { background: '#fff', color: 'var(--ink2)', padding: '9px 18px', borderRadius: 20, fontSize: 15, fontWeight: 600, boxShadow: '0 4px 10px rgba(74,58,102,.08)' }}>{t.l}</button>
            )
          })}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px 16px' }}>
        {STORIES.map((s) => (
          <div key={s.id} style={{ background: '#fff', borderRadius: 30, overflow: 'hidden', boxShadow: '0 12px 26px -14px rgba(74,58,102,.3)', marginBottom: 18 }}>
            <button onClick={() => onOpenReader('free')} style={{ width: '100%', height: 140, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><RawSvg html={s.svg} /></button>
            <div style={{ padding: '15px 18px 16px' }}>
              <div style={{ fontSize: 19, fontWeight: 700 }}>{s.title}</div>
              <div style={{ fontSize: 13, color: 'var(--ink2)', fontWeight: 500, marginTop: 2 }}>{s.author}</div>
              <div style={{ marginTop: 16 }}>
                {given[s.id] ? (
                  <div style={{ background: '#FFF0D6', color: '#C77A4A', padding: 14, borderRadius: 24, fontSize: 17, fontWeight: 700, textAlign: 'center' }}>Merci&nbsp;! Grabi envoyé 💛</div>
                ) : (
                  <button onClick={() => setGiven((g) => ({ ...g, [s.id]: true }))} style={{ width: '100%', background: 'linear-gradient(135deg,#FF9FC4,#FFC97A)', color: '#fff', padding: 14, borderRadius: 24, fontSize: 17, fontWeight: 700, boxShadow: '0 8px 16px -6px rgba(255,140,170,.7)' }}>Donner un Grabi 💛</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <BottomNav active="community" onHome={onHome} onCreate={onCreate} onMine={onMine} onSettings={onSettings} />
    </div>
  )
}

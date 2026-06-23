import { useState } from 'react'
import BottomNav from '../components/BottomNav.jsx'
import RawSvg from '../components/RawSvg.jsx'

const TABS = [{ k: 'recentes', l: 'Récentes' }, { k: 'fav', l: 'Préférées des enfants' }]

export default function Community({ list = [], smilesOf = () => 0, given = {}, onGive, onOpenReader, onHome, onCreate, onMine, onSettings }) {
  const [tab, setTab] = useState('recentes')
  const stories = tab === 'fav' ? [...list].sort((a, b) => smilesOf(b) - smilesOf(a)) : list

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
        {stories.map((s) => (
          <div key={s.id} style={{ background: '#fff', borderRadius: 30, overflow: 'hidden', boxShadow: '0 12px 26px -14px rgba(74,58,102,.3)', marginBottom: 18 }}>
            <button onClick={() => onOpenReader(s)} style={{ width: '100%', height: 150, background: s.bg || 'var(--violet-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {s.svg ? <RawSvg html={s.svg} /> : s.cover ? <img src={s.cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
            </button>
            <div style={{ padding: '15px 18px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 19, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--ink2)', fontWeight: 500, marginTop: 2 }}>{s.author || 'par toi ✨'}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'var(--yellow-soft)', padding: '6px 11px', borderRadius: 16, flex: 'none', fontSize: 15, fontWeight: 700 }}>💛 {smilesOf(s)}</div>
              </div>
              <div style={{ marginTop: 16 }}>
                {given[s.id] ? (
                  <div style={{ background: '#FFF0D6', color: '#C77A4A', padding: 14, borderRadius: 24, fontSize: 17, fontWeight: 700, textAlign: 'center' }}>Merci&nbsp;! Grabi envoyé 💛</div>
                ) : (
                  <button onClick={() => onGive(s)} style={{ width: '100%', background: 'linear-gradient(135deg,#FF9FC4,#FFC97A)', color: '#fff', padding: 14, borderRadius: 24, fontSize: 17, fontWeight: 700, boxShadow: '0 8px 16px -6px rgba(255,140,170,.7)' }}>Donner un Grabi 💛</button>
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

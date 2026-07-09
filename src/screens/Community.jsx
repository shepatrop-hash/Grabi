import { useState } from 'react'
import BottomNav from '../components/BottomNav.jsx'
import RawSvg from '../components/RawSvg.jsx'
import { COMMUNITY_FILTERS, catOf } from '../lib/categories.js'

export default function Community({ list = [], smilesOf = () => 0, given = {}, onGive, onOpenReader, onHome, onDecouvrir, onSettings }) {
  const [filter, setFilter] = useState('populaire')

  let stories
  if (filter === 'nouveau') stories = [...list].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
  else if (filter === 'populaire') stories = [...list].sort((a, b) => smilesOf(b) - smilesOf(a))
  else stories = list.filter((s) => s.categorie === filter).sort((a, b) => smilesOf(b) - smilesOf(a))

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--bg)', position: 'relative', overflow: 'hidden', animation: 'gn-fadein .35s ease', paddingTop: 'calc(env(safe-area-inset-top, 14px) + 16px)' }}>
      <div style={{ padding: '6px 24px 0', flex: 'none' }}>
        <div style={{ fontSize: 26, fontWeight: 700 }}>Communauté</div>
        <div style={{ fontSize: 14, color: 'var(--ink2)', fontWeight: 500 }}>Les histoires des autres enfants</div>
      </div>

      {/* Barre de catégories défilable */}
      <div style={{ flex: 'none', display: 'flex', gap: 9, overflowX: 'auto', padding: '14px 24px 6px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {COMMUNITY_FILTERS.map((c) => {
          const active = filter === c.key
          return (
            <button
              key={c.key}
              onClick={() => setFilter(c.key)}
              style={{
                flex: 'none', display: 'inline-flex', alignItems: 'center', gap: 6,
                background: active ? 'var(--violet)' : 'var(--card)', color: active ? '#fff' : 'var(--ink2)',
                padding: '9px 15px', borderRadius: 20, fontSize: 14.5, fontWeight: 600, whiteSpace: 'nowrap',
                boxShadow: active ? '0 6px 14px -4px rgba(169,140,255,.6)' : '0 4px 10px rgba(74,58,102,.08)',
              }}
            >
              <span style={{ fontSize: 15 }}>{c.emoji}</span>{c.label}
            </button>
          )
        })}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 24px 16px' }}>
        {stories.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--ink2)', padding: '48px 24px', fontSize: 15, fontWeight: 500, lineHeight: 1.5 }}>
            Pas encore d'histoire dans cette catégorie…<br />Sois le premier à en inventer une&nbsp;! ✨
          </div>
        ) : (
          stories.map((s) => {
            const cat = catOf(s.categorie)
            return (
              <div key={s.id} style={{ background: 'var(--card)', borderRadius: 30, overflow: 'hidden', boxShadow: '0 12px 26px -14px rgba(74,58,102,.3)', marginBottom: 18 }}>
                <button onClick={() => onOpenReader(s)} style={{ width: '100%', height: 150, background: s.bg || 'var(--violet-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                  {s.svg ? <RawSvg html={s.svg} /> : s.cover ? <img src={s.cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
                  {cat && (
                    <span style={{ position: 'absolute', top: 12, left: 12, display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,.85)', color: '#4A3A66', fontSize: 12.5, fontWeight: 700, padding: '5px 10px', borderRadius: 14, backdropFilter: 'blur(3px)' }}>{cat.emoji} {cat.label}</span>
                  )}
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
                      <div style={{ background: 'var(--mint-soft)', color: 'var(--ink)', padding: 14, borderRadius: 24, fontSize: 17, fontWeight: 700, textAlign: 'center' }}>Merci&nbsp;! Grabi envoyé 💛</div>
                    ) : (
                      <button onClick={() => onGive(s)} style={{ width: '100%', background: 'linear-gradient(135deg,#FF7FB0,#FFB84D)', color: '#fff', padding: 14, borderRadius: 24, fontSize: 17, fontWeight: 700, boxShadow: '0 8px 16px -6px rgba(255,140,170,.7)' }}>Donner un Grabi 💛</button>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      <BottomNav active="copains" onAccueil={onHome} onDecouvrir={onDecouvrir} onCopains={() => {}} onMonCoin={onSettings} />
    </div>
  )
}

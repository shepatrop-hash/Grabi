import { useState, useRef } from 'react'
import Grabi from '../components/Grabi.jsx'
import RawSvg from '../components/RawSvg.jsx'

const backIcon = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4A3A66" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5 L8 12 L15 19"></path></svg>`

// Accessoires (calques SVG par-dessus la mascotte), repris du design.
const ACC_SVG = {
  glasses: `<g><circle cx="74" cy="96" r="22" fill="rgba(120,180,220,0.18)" stroke="#3B2D5A" stroke-width="5"></circle><circle cx="126" cy="96" r="22" fill="rgba(120,180,220,0.18)" stroke="#3B2D5A" stroke-width="5"></circle><path d="M96,93 q4,-4 8,0" fill="none" stroke="#3B2D5A" stroke-width="5" stroke-linecap="round"></path><path d="M52,92 L41,86" stroke="#3B2D5A" stroke-width="5" stroke-linecap="round"></path><path d="M148,92 L159,86" stroke="#3B2D5A" stroke-width="5" stroke-linecap="round"></path></g>`,
  scarf: `<g><path d="M56,166 Q100,150 144,166 Q150,176 142,184 Q100,166 58,184 Q50,176 56,166 Z" fill="#FF6FA6"></path><path d="M120,178 q16,6 14,28 q-2,8 -12,8 q-8,-2 -8,-10 q4,-14 -2,-24 z" fill="#E85C95"></path><path d="M70,170 L72,180 M88,166 L90,178 M108,166 L110,178 M128,170 L130,180" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".4"></path></g>`,
  bow: `<g transform="translate(150,38)"><path d="M0,0 L-20,-13 L-20,13 Z" fill="#FF8FB6"></path><path d="M0,0 L20,-13 L20,13 Z" fill="#FF8FB6"></path><circle cx="0" cy="0" r="6" fill="#E85C95"></circle></g>`,
  hat: `<g transform="rotate(-8 110 18)"><path d="M82,40 L116,-14 L140,36 Z" fill="#FF8FB6"></path><path d="M99,12 L121,8 M91,28 L131,24" stroke="#FFE08A" stroke-width="5" stroke-linecap="round"></path><ellipse cx="111" cy="37" rx="33" ry="7" fill="#9B7BF0"></ellipse><circle cx="116" cy="-16" r="8" fill="#FFCC3E"></circle></g>`,
}

const PET_REACTIONS = ['Hihi !', "Encore ! 🫶", 'Je t’aime fort 💖', 'Câlin ! 🤗', 'Trop bien !', 'Ronron… 😊']
const FEED = [
  { key: 'fraise', emoji: '🍓', label: 'Fraise', reaction: 'Miam 🍓' },
  { key: 'gateau', emoji: '🧁', label: 'Gâteau', reaction: 'Délicieux ! 🧁' },
  { key: 'pomme', emoji: '🍎', label: 'Pomme', reaction: 'Croc croc 🍎' },
]
const ACCESSORIES = [
  { key: 'hat', emoji: '🎩', label: 'Chapeau' },
  { key: 'scarf', emoji: '🧣', label: 'Écharpe' },
  { key: 'glasses', emoji: '🕶️', label: 'Lunettes' },
  { key: 'bow', emoji: '🎀', label: 'Nœud' },
]
const TABS = [
  { key: 'caresser', emoji: '🫶', label: 'Caresser', bg: 'var(--pink-soft)', color: '#b5527e' },
  { key: 'nourrir', emoji: '🍓', label: 'Nourrir', bg: 'var(--yellow-soft)', color: '#a07d2a' },
  { key: 'habiller', emoji: '🎀', label: 'Habiller', bg: 'var(--violet-soft)', color: '#7d5fc4' },
]

const checkBadge = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13 l4 4 L19 6"></path></svg>`

export default function GrabiCompanion({ onBack }) {
  const [happiness, setHappiness] = useState(62)
  const [tab, setTab] = useState('caresser')
  const [acc, setAcc] = useState({ hat: false, scarf: false, glasses: false, bow: false })
  const [reaction, setReaction] = useState('')
  const [petActive, setPetActive] = useState(false)
  const timer = useRef(null)

  function react(text, bump) {
    setReaction(text)
    setPetActive(true)
    setHappiness((h) => Math.max(0, Math.min(100, h + bump)))
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setPetActive(false), 1200)
  }

  const caresser = () => react(PET_REACTIONS[Math.floor(Math.random() * PET_REACTIONS.length)], 3)
  const feed = (item) => react(item.reaction, 6)
  const toggleAcc = (key) => {
    setAcc((a) => ({ ...a, [key]: !a[key] }))
    react('Joli ! ✨', 2)
  }

  const accOverlay = Object.entries(acc)
    .filter(([, on]) => on)
    .map(([k]) => ACC_SVG[k])
    .join('')

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', background: 'linear-gradient(180deg,#FFF7EC 0%,#FFE9F2 100%)', position: 'relative', overflow: 'hidden', animation: 'gn-fadein .35s ease', paddingTop: 'calc(env(safe-area-inset-top, 14px) + 16px)' }}>
      <div style={{ padding: '6px 24px 0', display: 'flex', alignItems: 'center', gap: 14, position: 'relative', zIndex: 2 }}>
        <button onClick={onBack} style={{ width: 48, height: 48, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 14px rgba(74,58,102,.12)', flex: 'none' }}>
          <RawSvg html={backIcon} />
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 24, fontWeight: 700 }}>Grabi</div>
          <div style={{ fontSize: 13, color: 'var(--ink2)', fontWeight: 500 }}>Ton petit compagnon</div>
        </div>
      </div>

      <div style={{ padding: '14px 28px 0', position: 'relative', zIndex: 2 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#C24A7A', marginBottom: 6 }}>❤️ Bonheur</div>
        <div style={{ height: 12, borderRadius: 6, background: '#fff', overflow: 'hidden', boxShadow: 'inset 0 1px 2px rgba(0,0,0,.06)' }}>
          <div style={{ width: `${happiness}%`, height: '100%', background: 'linear-gradient(90deg,#FF9FC4,#FF6FA6)', borderRadius: 6, transition: 'width .4s ease' }} />
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 2 }}>
        <div onClick={caresser} style={{ cursor: 'pointer', position: 'relative', width: 210, height: 210, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {petActive && (
            <div style={{ position: 'absolute', top: -4, left: '50%', transform: 'translateX(-50%)', background: '#fff', borderRadius: 18, padding: '8px 14px', fontSize: 15, fontWeight: 700, boxShadow: '0 6px 16px rgba(74,58,102,.16)', whiteSpace: 'nowrap', zIndex: 6 }}>{reaction}</div>
          )}
          <div style={{ position: 'relative', width: 200, height: 200 }}>
            <Grabi size={200} />
            {accOverlay && (
              <RawSvg style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} html={`<svg width="200" height="200" viewBox="0 0 200 200">${accOverlay}</svg>`} />
            )}
          </div>
          {petActive && (
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
              <span style={{ position: 'absolute', left: '32%', top: '34%', fontSize: 26, animation: 'gn-rise 1.2s ease-out forwards' }}>❤️</span>
              <span style={{ position: 'absolute', left: '60%', top: '40%', fontSize: 20, animation: 'gn-rise 1.2s ease-out forwards .15s' }}>💛</span>
              <span style={{ position: 'absolute', left: '48%', top: '28%', fontSize: 18, animation: 'gn-rise 1.1s ease-out forwards .3s' }}>✨</span>
            </div>
          )}
        </div>
      </div>

      <div style={{ flex: 'none', padding: '0 22px', position: 'relative', zIndex: 2, minHeight: 96 }}>
        {tab === 'caresser' && (
          <div style={{ textAlign: 'center', fontSize: 15, color: 'var(--ink2)', fontWeight: 600, padding: '18px 0' }}>Touche Grabi pour le câliner 🫶</div>
        )}
        {tab === 'nourrir' && (
          <div style={{ display: 'flex', gap: 12 }}>
            {FEED.map((f) => (
              <button key={f.key} onClick={() => feed(f)} style={{ flex: 1, background: '#fff', borderRadius: 22, padding: '14px 6px', textAlign: 'center', boxShadow: '0 6px 16px -10px rgba(74,58,102,.3)' }}>
                <div style={{ fontSize: 34, lineHeight: 1 }}>{f.emoji}</div>
                <div style={{ fontSize: 13, fontWeight: 600, marginTop: 4 }}>{f.label}</div>
              </button>
            ))}
          </div>
        )}
        {tab === 'habiller' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10 }}>
            {ACCESSORIES.map((a) => (
              <button key={a.key} onClick={() => toggleAcc(a.key)} style={{ position: 'relative', background: '#fff', borderRadius: 20, padding: '12px 4px', textAlign: 'center', boxShadow: '0 6px 16px -10px rgba(74,58,102,.3)' }}>
                {acc[a.key] && (
                  <span style={{ position: 'absolute', top: 5, right: 5, width: 18, height: 18, borderRadius: '50%', background: 'var(--mint)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><RawSvg html={checkBadge} /></span>
                )}
                <div style={{ fontSize: 28, lineHeight: 1 }}>{a.emoji}</div>
                <div style={{ fontSize: 12, fontWeight: 600, marginTop: 3 }}>{a.label}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div style={{ flex: 'none', padding: '14px 22px calc(env(safe-area-inset-bottom, 0px) + 24px)', display: 'flex', gap: 12, position: 'relative', zIndex: 2 }}>
        {TABS.map((t) => (
          <button key={t.key} onClick={() => (t.key === 'caresser' ? (setTab('caresser'), caresser()) : setTab(t.key))} style={{ flex: 1, background: t.bg, borderRadius: 24, padding: '13px 4px', textAlign: 'center', outline: tab === t.key ? '2px solid rgba(0,0,0,.08)' : 'none' }}>
            <div style={{ fontSize: 26, lineHeight: 1 }}>{t.emoji}</div>
            <div style={{ fontSize: 14, fontWeight: 700, marginTop: 4, color: t.color }}>{t.label}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

import { useState } from 'react'
import RawSvg from '../components/RawSvg.jsx'

const backIcon = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3B2D5A" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5 L8 12 L15 19"></path></svg>`
const prevIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="#6E5FA0"><path d="M17 5 L9 12 L17 19 Z"></path><rect x="6" y="5" width="3.5" height="14" rx="1.5"></rect></svg>`
const nextIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="#6E5FA0"><path d="M7 5 L15 12 L7 19 Z"></path><rect x="14.5" y="5" width="3.5" height="14" rx="1.5"></rect></svg>`
const playSvg = `<svg width="34" height="34" viewBox="0 0 24 24" fill="#fff"><path d="M8 5 L19 12 L8 19 Z"></path></svg>`
const pauseSvg = `<svg width="34" height="34" viewBox="0 0 24 24" fill="#fff"><rect x="6" y="5" width="4.5" height="14" rx="2"></rect><rect x="13.5" y="5" width="4.5" height="14" rx="2"></rect></svg>`
const lockBig = `<svg width="56" height="62" viewBox="0 0 40 46"><path d="M11,20 V14 a9,9 0 0 1 18,0 V20" fill="none" stroke="#A98CFF" stroke-width="4.5" stroke-linecap="round"></path><rect x="6" y="19" width="28" height="22" rx="7" fill="#A98CFF"></rect><circle cx="20" cy="28" r="3.6" fill="#fff"></circle><rect x="18.3" y="29" width="3.4" height="8" rx="1.6" fill="#fff"></rect></svg>`

const ILLUS_FREE = `<svg width="100%" height="100%" viewBox="0 0 390 540" preserveAspectRatio="xMidYMid slice" style="display:block;"><defs><linearGradient id="rsky2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#BDE8FF"></stop><stop offset="1" stop-color="#E7D6FF"></stop></linearGradient></defs><rect width="390" height="540" fill="url(#rsky2)"></rect><circle cx="312" cy="92" r="44" fill="#FFD86A"></circle><circle cx="312" cy="92" r="58" fill="#FFD86A" opacity=".25"></circle><ellipse cx="90" cy="120" rx="46" ry="22" fill="#fff" opacity=".9"></ellipse><ellipse cx="120" cy="108" rx="34" ry="20" fill="#fff" opacity=".9"></ellipse><ellipse cx="270" cy="200" rx="38" ry="18" fill="#fff" opacity=".75"></ellipse><path d="M0,440 Q120,360 250,420 T390,400 V540 H0 Z" fill="#9CE3B4"></path><path d="M0,490 Q160,420 390,470 V540 H0 Z" fill="#6FCF9B"></path><g transform="translate(150,300)"><ellipse cx="40" cy="150" rx="58" ry="16" fill="#3E8C63" opacity=".25"></ellipse><path d="M30,30 L24,2 L48,22 Z" fill="#6FC79A"></path><path d="M70,30 L78,2 L54,22 Z" fill="#6FC79A"></path><circle cx="50" cy="64" r="46" fill="#9CE3B4"></circle><ellipse cx="50" cy="80" rx="25" ry="18" fill="#C6F0D4"></ellipse><circle cx="42" cy="82" r="3" fill="#3B6B4E"></circle><circle cx="58" cy="82" r="3" fill="#3B6B4E"></circle><circle cx="36" cy="56" r="10" fill="#fff"></circle><circle cx="64" cy="56" r="10" fill="#fff"></circle><circle cx="38" cy="58" r="5" fill="#3B2D5A"></circle><circle cx="66" cy="58" r="5" fill="#3B2D5A"></circle><ellipse cx="26" cy="74" rx="7" ry="4.5" fill="#FF9FC4" opacity=".8"></ellipse><ellipse cx="74" cy="74" rx="7" ry="4.5" fill="#FF9FC4" opacity=".8"></ellipse></g><g transform="translate(248,418)"><ellipse cx="0" cy="42" rx="40" ry="11" fill="#E8B973"></ellipse><ellipse cx="0" cy="32" rx="40" ry="11" fill="#F2C783"></ellipse><ellipse cx="0" cy="22" rx="40" ry="11" fill="#E8B973"></ellipse><ellipse cx="0" cy="12" rx="40" ry="11" fill="#F2C783"></ellipse><path d="M-14,8 q14,-10 28,0 q-3,9 -14,9 q-11,0 -14,-9 z" fill="#FFE08A"></path><ellipse cx="0" cy="6" rx="7" ry="4" fill="#FFB347"></ellipse></g></svg>`
const ILLUS_WEEKLY = `<svg width="100%" height="100%" viewBox="0 0 390 540" preserveAspectRatio="xMidYMid slice" style="display:block;"><defs><linearGradient id="rsky3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C7B4FF"></stop><stop offset="1" stop-color="#FFD6EA"></stop></linearGradient></defs><rect width="390" height="540" fill="url(#rsky3)"></rect><circle cx="312" cy="96" r="40" fill="#FFF6CE"></circle><circle cx="312" cy="96" r="54" fill="#FFF6CE" opacity=".25"></circle><path d="M70,90 l3,8 8,3 -8,3 -3,8 -3,-8 -8,-3 8,-3 z" fill="#fff"></path><path d="M120,150 l2,6 6,2 -6,2 -2,6 -2,-6 -6,-2 6,-2 z" fill="#fff" opacity=".85"></path><path d="M300,200 l2,6 6,2 -6,2 -2,6 -2,-6 -6,-2 6,-2 z" fill="#fff" opacity=".8"></path><g transform="translate(195,330)"><rect x="-58" y="-70" width="34" height="120" rx="8" fill="#BBA4FF"></rect><rect x="24" y="-70" width="34" height="120" rx="8" fill="#BBA4FF"></rect><rect x="-30" y="-110" width="60" height="160" rx="10" fill="#A98CFF"></rect><path d="M-58,-70 l17,-30 17,30 z" fill="#FF7FB0"></path><path d="M24,-70 l17,-30 17,30 z" fill="#FF7FB0"></path><path d="M-30,-110 l30,-44 30,44 z" fill="#FF6FA6"></path><circle cx="0" cy="-158" r="5" fill="#FFCC3E"></circle><rect x="-12" y="6" width="24" height="44" rx="12" fill="#fff"></rect><circle cx="-41" cy="-30" r="7" fill="#fff"></circle><circle cx="41" cy="-30" r="7" fill="#fff"></circle></g><ellipse cx="195" cy="402" rx="125" ry="34" fill="#fff" opacity=".96"></ellipse><ellipse cx="115" cy="424" rx="72" ry="26" fill="#fff" opacity=".9"></ellipse><ellipse cx="282" cy="424" rx="72" ry="26" fill="#fff" opacity=".9"></ellipse><ellipse cx="70" cy="150" rx="44" ry="18" fill="#fff" opacity=".7"></ellipse><ellipse cx="330" cy="300" rx="40" ry="16" fill="#fff" opacity=".6"></ellipse></svg>`

const FREE_PAGES = [
  'Il était une fois un petit dragon tout vert qui adorait les crêpes au sucre…',
  'Chaque matin, il en préparait une grande montagne dorée et toute chaude.',
  'Ce jour-là, il restait une seule crêpe… alors il la partagea avec son amie la souris. Quel gentil petit dragon !',
]
const WEEKLY_PAGES = [
  'Tout là-haut, au-dessus des nuages, se cachait un château argenté. Plume, la petite souris, poussa la grande porte dorée et entra sur la pointe des pattes…',
]

export default function Reader({ storyType = 'free', onClose, onSubscribe }) {
  const weekly = storyType === 'weekly'
  const pages = weekly ? WEEKLY_PAGES : FREE_PAGES
  const [page, setPage] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [paywall, setPaywall] = useState(false)

  const next = () => {
    if (page < pages.length - 1) setPage(page + 1)
    else if (weekly) setPaywall(true)
  }
  const prev = () => page > 0 && setPage(page - 1)
  const progress = `${Math.round(((page + 1) / pages.length) * 100)}%`

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: '#fff', position: 'relative', overflow: 'hidden', animation: 'gn-fadein .35s ease' }}>
      <div style={{ position: 'relative', height: 'min(52dvh, 540px)', flex: 'none', overflow: 'hidden' }}>
        <RawSvg style={{ width: '100%', height: '100%' }} html={weekly ? ILLUS_WEEKLY : ILLUS_FREE} />
        <button onClick={onClose} style={{ position: 'absolute', top: 'calc(env(safe-area-inset-top, 0px) + 22px)', left: 22, width: 46, height: 46, borderRadius: '50%', background: 'rgba(255,255,255,.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(74,58,102,.15)' }}><RawSvg html={backIcon} /></button>
        <div style={{ position: 'absolute', top: 'calc(env(safe-area-inset-top, 0px) + 34px)', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 7 }}>
          {pages.map((_, i) => (
            <span key={i} style={{ width: i === page ? 22 : 7, height: 7, borderRadius: 4, background: i === page ? '#fff' : 'rgba(255,255,255,.6)', transition: 'width .25s ease' }} />
          ))}
        </div>
      </div>

      <div style={{ flex: 1, background: '#fff', borderRadius: '36px 36px 0 0', marginTop: -32, position: 'relative', zIndex: 2, padding: '30px 30px calc(env(safe-area-inset-bottom, 0px) + 26px)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 23, fontWeight: 600, lineHeight: 1.5 }}>{pages[page]}</div>
        <div style={{ marginTop: 'auto' }}>
          <div style={{ height: 8, borderRadius: 4, background: '#EFEAF6', overflow: 'hidden' }}><div style={{ width: progress, height: '100%', background: 'var(--mint)', borderRadius: 4, transition: 'width .3s ease' }} /></div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 30, marginTop: 22 }}>
            <button onClick={prev} style={{ width: 60, height: 60, borderRadius: '50%', background: '#F1EEF8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><RawSvg html={prevIcon} /></button>
            <button onClick={() => setPlaying((p) => !p)} style={{ width: 86, height: 86, borderRadius: '50%', background: 'linear-gradient(135deg,#FFD23F,#FF7FB0)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 14px 26px -8px rgba(255,127,176,.65)' }}><RawSvg html={playing ? pauseSvg : playSvg} /></button>
            <button onClick={next} style={{ width: 60, height: 60, borderRadius: '50%', background: '#F1EEF8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><RawSvg html={nextIcon} /></button>
          </div>
        </div>
      </div>

      {paywall && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(74,58,102,.5)', display: 'flex', alignItems: 'flex-end', zIndex: 20, animation: 'gn-fadein .25s ease' }}>
          <div style={{ background: '#fff', borderRadius: '38px 38px 0 0', width: '100%', padding: '30px 30px calc(env(safe-area-inset-bottom, 0px) + 30px)', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}><RawSvg html={lockBig} /></div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>Tu as adoré le début&nbsp;?</div>
            <div style={{ fontSize: 15, color: 'var(--ink2)', fontWeight: 500, lineHeight: 1.45, marginTop: 8 }}>La suite de cette histoire t'attend dans <b style={{ color: 'var(--violet)' }}>Grabi Premium</b>&nbsp;✨</div>
            <button onClick={onSubscribe} style={{ width: '100%', marginTop: 22, background: 'linear-gradient(135deg,#FF8FB6,#A98CFF)', color: '#fff', borderRadius: 26, height: 62, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, fontSize: 18, fontWeight: 700, boxShadow: '0 14px 26px -10px rgba(169,140,255,.7)' }}>Débloquer la suite ✨</button>
            <button onClick={() => setPaywall(false)} style={{ marginTop: 14, fontSize: 15, fontWeight: 600, color: 'var(--ink2)' }}>Plus tard</button>
          </div>
        </div>
      )}
    </div>
  )
}

import RawSvg from '../components/RawSvg.jsx'
import { WEEKLY_STORY, FREE_STORIES } from '../lib/samples.js'

const backIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4A3A66" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5 L8 12 L15 19"></path></svg>`
const crownBadge = `<svg width="15" height="15" viewBox="0 0 24 24" fill="#7a4a00"><path d="M3 7 l4 5 5-7 5 7 4-5 -2 12 H5 Z"></path></svg>`
const playIcon = `<svg width="13" height="13" viewBox="0 0 24 24" fill="#fff"><path d="M6 4 L20 12 L6 20 Z"></path></svg>`
const castle = `<svg width="74" height="74" viewBox="0 0 86 86"><ellipse cx="22" cy="64" rx="20" ry="9" fill="#fff" opacity=".85"></ellipse><ellipse cx="60" cy="66" rx="18" ry="8" fill="#fff" opacity=".85"></ellipse><rect x="28" y="30" width="30" height="30" rx="4" fill="#A98CFF"></rect><rect x="22" y="38" width="10" height="22" rx="3" fill="#BBA4FF"></rect><rect x="54" y="38" width="10" height="22" rx="3" fill="#BBA4FF"></rect><path d="M26,30 l6,-9 6,9 z M48,30 l6,-9 6,9 z" fill="#FF7FB0"></path><rect x="40" y="46" width="6" height="14" rx="3" fill="#fff"></rect><circle cx="43" cy="22" r="3" fill="#FFCC3E"></circle></svg>`
const lock = `<svg width="40" height="44" viewBox="0 0 40 46"><path d="M11,20 V14 a9,9 0 0 1 18,0 V20" fill="none" stroke="#B6A6D6" stroke-width="4.5" stroke-linecap="round"></path><rect x="6" y="19" width="28" height="22" rx="7" fill="#B6A6D6"></rect><circle cx="20" cy="28" r="3.4" fill="#fff"></circle><rect x="18.4" y="29" width="3.2" height="7" rx="1.5" fill="#fff"></rect></svg>`
const crownW = `<svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M3 7 l4 5 5-7 5 7 4-5 -2 12 H5 Z"></path></svg>`

// Histoires bonus débloquées avec Premium (réutilise des histoires intégrées).
const BONUS = FREE_STORIES.slice(2, 6)

export default function Premium({ isPremium, onBack, onSubscribe, onOpenReader }) {
  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--bg)', position: 'relative', overflow: 'hidden', animation: 'gn-fadein .35s ease', paddingTop: 'calc(env(safe-area-inset-top, 14px) + 16px)' }}>
      <div style={{ position: 'absolute', top: -50, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'var(--violet-soft)', opacity: 0.7 }} />
      <div style={{ padding: '6px 24px 10px', display: 'flex', alignItems: 'center', gap: 12, position: 'relative', zIndex: 2 }}>
        <button onClick={onBack} style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--card)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 14px rgba(74,58,102,.12)', flex: 'none' }}><RawSvg html={backIcon} /></button>
        <div style={{ fontSize: 23, fontWeight: 700, lineHeight: 1.05, flex: 1 }}>Histoires de la semaine</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'linear-gradient(135deg,#FFD86A,#FFB23F)', color: '#7a4a00', fontSize: 13, fontWeight: 700, padding: '7px 12px', borderRadius: 20, boxShadow: '0 6px 14px -4px rgba(255,160,40,.6)', flex: 'none' }}><RawSvg html={crownBadge} />{isPremium ? 'Actif' : 'Premium'}</div>
      </div>

      <button onClick={() => onOpenReader(WEEKLY_STORY)} style={{ textAlign: 'left', margin: '4px 24px 0', borderRadius: 32, padding: 20, background: 'linear-gradient(150deg,#FFC9E0,#D9C4FF)', position: 'relative', zIndex: 2, boxShadow: '0 14px 30px -12px rgba(169,140,255,.6)' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#9b3f76' }}>✨ Nouvelle cette semaine</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.12, maxWidth: 160 }}>{WEEKLY_STORY.title}</div>
            <div style={{ marginTop: 12, display: 'flex', width: 'fit-content', alignItems: 'center', gap: 9, background: 'var(--card)', padding: '9px 16px 9px 12px', borderRadius: 22, fontWeight: 700, fontSize: 15, boxShadow: '0 6px 14px rgba(74,58,102,.15)' }}><span style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--violet)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><RawSvg html={playIcon} /></span>Écouter</div>
          </div>
          <div style={{ width: 96, height: 96, borderRadius: '50%', background: 'rgba(255,255,255,.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><RawSvg html={castle} /></div>
        </div>
      </button>

      <div style={{ flex: 1, padding: '18px 24px 10px', position: 'relative', zIndex: 2 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink2)', marginBottom: 12 }}>{isPremium ? 'Tes histoires premium' : 'Bientôt débloquées'}</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {BONUS.map((s, i) => (
            <button key={s.id} onClick={() => (isPremium ? onOpenReader(s) : onSubscribe())} style={{ background: isPremium ? s.bg : '#F0ECF6', borderRadius: 26, height: 120, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, padding: 8 }}>
              {!isPremium && <div style={{ position: 'absolute', top: 10, right: 10, background: '#A98CFF', color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 9px', borderRadius: 14 }}>Premium</div>}
              {isPremium ? (
                <>
                  <div style={{ transform: 'scale(.62)' }}><RawSvg html={s.svg} /></div>
                  <div style={{ fontSize: 13, fontWeight: 700, textAlign: 'center', lineHeight: 1.1 }}>{s.title}</div>
                </>
              ) : (
                <RawSvg html={lock} />
              )}
            </button>
          ))}
        </div>
      </div>

      {isPremium ? (
        <div style={{ flex: 'none', padding: '6px 24px calc(env(safe-area-inset-bottom, 0px) + 24px)', position: 'relative', zIndex: 2 }}>
          <div style={{ background: 'var(--mint-soft)', color: '#1f9e7a', borderRadius: 24, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 16, fontWeight: 700 }}>✨ Tu as accès à tout l'univers Grabi</div>
        </div>
      ) : (
        <button onClick={onSubscribe} style={{ width: '100%', flex: 'none', padding: '6px 24px calc(env(safe-area-inset-bottom, 0px) + 24px)', position: 'relative', zIndex: 2 }}>
          <div style={{ background: 'linear-gradient(135deg,#FF8FB6,#A98CFF)', color: '#fff', borderRadius: 28, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, fontSize: 18, fontWeight: 700, boxShadow: '0 14px 28px -10px rgba(169,140,255,.7)' }}><RawSvg html={crownW} />Débloquer tout l'univers</div>
        </button>
      )}
    </div>
  )
}

import Grabi from '../components/Grabi.jsx'
import RawSvg from '../components/RawSvg.jsx'
import { playGrabiSound } from '../lib/sounds.js'
import { WEEKLY_STORY, FREE_STORIES } from '../lib/samples.js'

const iconBooks = `<svg width="40" height="40" viewBox="0 0 46 46"><rect x="8" y="27" width="30" height="9" rx="3.5" fill="#FF7FB0"></rect><rect x="6" y="17.5" width="34" height="9" rx="3.5" fill="#56C7FF"></rect><rect x="10" y="8" width="26" height="9" rx="3.5" fill="#3FD7B0"></rect></svg>`
const iconWand = `<svg width="38" height="38" viewBox="0 0 46 46"><line x1="11" y1="36" x2="30" y2="17" stroke="#A98CFF" stroke-width="5.5" stroke-linecap="round"></line><path d="M33,9 L35,14 L40,16 L35,18 L33,23 L31,18 L26,16 L31,14 Z" fill="#FFCC3E"></path><circle cx="15" cy="13" r="2.5" fill="#FF7FB0"></circle><circle cx="40" cy="32" r="2.5" fill="#3FD7B0"></circle></svg>`
const playWhite = `<svg width="22" height="22" viewBox="0 0 24 24" fill="#7d5fc4"><path d="M8 5 L19 12 L8 19 Z"></path></svg>`
const playBig = `<svg width="26" height="26" viewBox="0 0 24 24" fill="#fff"><path d="M8 5 L19 12 L8 19 Z"></path></svg>`

const iconHome = `<svg width="23" height="23" viewBox="0 0 24 24" fill="none"><path d="M4 11.5 L12 4.5 L20 11.5 V20 H4 Z" fill="#fff"></path></svg>`
const iconCommunity = `<svg width="28" height="28" viewBox="0 0 40 40"><circle cx="20" cy="20" r="15" fill="none" stroke="#C3BBD2" stroke-width="2.6"></circle><circle cx="15" cy="19" r="2.2" fill="#C3BBD2"></circle><circle cx="25" cy="19" r="2.2" fill="#C3BBD2"></circle><path d="M15,25 Q20,29 25,25" stroke="#C3BBD2" stroke-width="2.2" fill="none" stroke-linecap="round"></path></svg>`
const iconBookmark = `<svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#C3BBD2" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4 H17 V20 L12 16 L7 20 Z"></path></svg>`
const iconGear = `<svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#C3BBD2" stroke-width="1.9" stroke-linejoin="round" stroke-linecap="round"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94L14.4 2.81c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41L9.25 5.35C8.66 5.59 8.12 5.92 7.63 6.29L5.24 5.33c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58C4.84 11.36 4.8 11.69 4.8 12s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z"></path></svg>`
const fabPlus = `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.8" stroke-linecap="round"><path d="M12 5 V19 M5 12 H19"></path></svg>`

const navBtn = { width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }
const section = { fontSize: 18, fontWeight: 800, letterSpacing: '-.01em' }

// Vignette d'une histoire de la communauté (illustration SVG ou image de couverture).
function CommunityCard({ s, onClick }) {
  return (
    <button onClick={onClick} style={{ flex: 'none', width: 132, textAlign: 'left' }}>
      <div style={{ width: 132, height: 96, borderRadius: 22, background: s.bg || 'var(--violet-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxShadow: '0 10px 20px -12px rgba(74,58,102,.35)' }}>
        {s.svg ? <div style={{ transform: 'scale(.8)' }}><RawSvg html={s.svg} /></div> : s.cover ? <img src={s.cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 30 }}>📖</span>}
      </div>
      <div style={{ fontSize: 13.5, fontWeight: 700, lineHeight: 1.2, marginTop: 8, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{s.title}</div>
      <div style={{ fontSize: 11.5, color: 'var(--ink2)', fontWeight: 500, marginTop: 2 }}>{s.author || 'par toi ✨'}</div>
    </button>
  )
}

export default function Home({ childName = 'Léa', community = [], reads = {}, onOpenReader, onGoFree, onGoPremium, onGoCreate, onGoCommunity, onGoMine, onGoSettings }) {
  const weeklyMins = Math.max(3, (WEEKLY_STORY.pages?.length || 4) + 1)
  const copains = community.slice(0, 8)
  // Petit compteur de « complicité » avec Grabi : grandit avec les jours de lecture d'affilée.
  const bond = Math.min(99, 42 + (reads.streak || 0) * 9)

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--bg)', position: 'relative', overflow: 'hidden', animation: 'gn-fadein .35s ease' }}>
      <div style={{ position: 'absolute', top: -70, right: -60, width: 220, height: 220, borderRadius: '50%', background: 'var(--yellow-soft)', opacity: 0.6 }} />

      {/* En-tête : salutation + mascotte */}
      <div style={{ flex: 'none', padding: 'calc(env(safe-area-inset-top, 14px) + 18px) 24px 4px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative', zIndex: 2 }}>
        <div style={{ paddingTop: 6 }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink2)' }}>Bonsoir {childName}&nbsp;🌙</div>
          <div style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.12, maxWidth: 200, marginTop: 3 }}>Prêt·e pour l'histoire du soir&nbsp;?</div>
        </div>
        <div style={{ position: 'relative', flex: 'none' }}>
          <div onClick={() => playGrabiSound()} style={{ cursor: 'pointer' }}><Grabi size={96} /></div>
          <div style={{ position: 'absolute', right: 2, bottom: 4, background: 'var(--card)', borderRadius: 14, padding: '3px 8px', fontSize: 12, fontWeight: 800, boxShadow: '0 6px 14px -6px rgba(74,58,102,.4)', display: 'flex', alignItems: 'center', gap: 3 }}><span style={{ color: '#FF5C9A' }}>❤</span><span>{bond}%</span></div>
        </div>
      </div>

      {/* Contenu défilable */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 24px 18px', display: 'flex', flexDirection: 'column', gap: 22, position: 'relative', zIndex: 2 }}>
        {/* Histoire de la semaine — mise en avant */}
        <div style={{ background: WEEKLY_STORY.bg, borderRadius: 30, padding: '20px 22px', boxShadow: '0 16px 32px -16px rgba(150,110,220,.6)', position: 'relative', overflow: 'hidden' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,.85)', color: '#7d5fc4', fontSize: 12.5, fontWeight: 800, padding: '5px 12px', borderRadius: 16 }}>✨ Nouvelle cette semaine</span>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 14 }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.15, color: '#3B2D5A' }}>{WEEKLY_STORY.title}</div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: '#6E5FA0', marginTop: 5 }}>Une aventure toute douce · {weeklyMins} min</div>
            </div>
            <div style={{ width: 82, height: 82, borderRadius: '50%', background: 'rgba(255,255,255,.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><div style={{ transform: 'scale(.9)' }}><RawSvg html={WEEKLY_STORY.svg} /></div></div>
          </div>
          <button onClick={() => onOpenReader && onOpenReader(WEEKLY_STORY, 'home')} style={{ marginTop: 16, background: 'var(--card)', borderRadius: 22, padding: '11px 20px', display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 15.5, fontWeight: 800, color: 'var(--ink)', boxShadow: '0 8px 18px -8px rgba(74,58,102,.4)' }}><RawSvg html={playWhite} />Écouter</button>
        </div>

        {/* Histoires des copains */}
        {copains.length > 0 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={section}>Les histoires des copains</span>
              <button onClick={onGoCommunity} style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--violet)' }}>Tout voir →</button>
            </div>
            <div style={{ display: 'flex', gap: 14, overflowX: 'auto', margin: '0 -24px', padding: '2px 24px 4px', scrollbarWidth: 'none' }}>
              {copains.map((s) => (
                <CommunityCard key={s.id} s={s} onClick={() => onOpenReader && onOpenReader(s, 'home')} />
              ))}
            </div>
          </div>
        )}

        {/* Épisode animé — teaser Premium */}
        <button onClick={onGoPremium} style={{ background: 'linear-gradient(135deg,#332B4E,#241E38)', borderRadius: 26, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 15, textAlign: 'left', boxShadow: '0 14px 28px -14px rgba(36,30,56,.7)' }}>
          <div style={{ width: 54, height: 54, borderRadius: '50%', background: 'linear-gradient(135deg,#FF9A5A,#FF6F9C)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><RawSvg html={playBig} /></div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>L'épisode animé du mois</div>
            <div style={{ fontSize: 12.5, fontWeight: 500, color: '#B8B0D0', marginTop: 2 }}>Grabi et la lune perdue · bientôt ✨</div>
          </div>
          <span style={{ background: 'var(--yellow-soft)', color: '#8a6414', fontSize: 11.5, fontWeight: 800, padding: '5px 11px', borderRadius: 14, flex: 'none' }}>Premium</span>
        </button>

        {/* Deux entrées : gratuites + créer */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <button onClick={onGoFree} style={{ background: 'var(--yellow-soft)', borderRadius: 26, padding: '16px 16px 18px', textAlign: 'left', boxShadow: '0 12px 24px -14px rgba(255,180,40,.7)' }}>
            <div style={{ width: 54, height: 54, borderRadius: 18, background: 'var(--card)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><RawSvg html={iconBooks} /></div>
            <div style={{ fontSize: 16.5, fontWeight: 800, marginTop: 12, lineHeight: 1.1 }}>Histoires<br />gratuites</div>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: '#a07d2a', marginTop: 4 }}>{FREE_STORIES.length} histoires</div>
          </button>
          <button onClick={onGoCreate} style={{ background: 'var(--violet-soft)', borderRadius: 26, padding: '16px 16px 18px', textAlign: 'left', boxShadow: '0 12px 24px -14px rgba(169,140,255,.6)' }}>
            <div style={{ width: 54, height: 54, borderRadius: 18, background: 'var(--card)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><RawSvg html={iconWand} /></div>
            <div style={{ fontSize: 16.5, fontWeight: 800, marginTop: 12, lineHeight: 1.1 }}>Crée ton<br />histoire</div>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: '#7d5fc4', marginTop: 4 }}>📖 ou 🎤</div>
          </button>
        </div>
      </div>

      {/* Barre de navigation */}
      <div style={{ flex: 'none', padding: '10px 26px calc(20px + env(safe-area-inset-bottom, 0px))', position: 'relative', zIndex: 2 }}>
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

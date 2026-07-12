import { useState } from 'react'
import Grabi from '../components/Grabi.jsx'
import BottomNav from '../components/BottomNav.jsx'
import RawSvg from '../components/RawSvg.jsx'

const heartFull = `<svg width="20" height="20" viewBox="0 0 24 24" fill="#FF5C9A"><path d="M12 20.5 C12 20.5 3.5 14.6 3.5 8.8 A4.4 4.4 0 0 1 12 6.3 A4.4 4.4 0 0 1 20.5 8.8 C20.5 14.6 12 20.5 12 20.5 Z"></path></svg>`
const heartLine = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B9AECB" stroke-width="2.2" stroke-linejoin="round"><path d="M12 20.5 C12 20.5 3.5 14.6 3.5 8.8 A4.4 4.4 0 0 1 12 6.3 A4.4 4.4 0 0 1 20.5 8.8 C20.5 14.6 12 20.5 12 20.5 Z"></path></svg>`
const trash = `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#E0719B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7 H20 M10 4 H14 M6 7 L7 20.5 H17 L18 7"></path></svg>`
const sendOff = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B9AECB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 L11 13 M22 2 L15 22 L11 13 L2 9 Z"></path></svg>`
const sendOn = `<svg width="18" height="18" viewBox="0 0 24 24" fill="#A98CFF" stroke="#A98CFF" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round"><path d="M22 2 L11 13 M22 2 L15 22 L11 13 L2 9 Z"></path></svg>`

function Thumb({ s }) {
  return (
    <div style={{ width: 64, height: 64, borderRadius: 18, background: s.cover ? '#fff' : s.bg || 'var(--violet-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', overflow: 'hidden', fontSize: 28 }}>
      {s.cover ? (
        <img src={s.cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : s.svg ? (
        <div style={{ transform: 'scale(0.55)' }}><RawSvg html={s.svg} /></div>
      ) : (
        '📖'
      )}
    </div>
  )
}

const iconBtn = (bg) => ({ width: 40, height: 40, borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' })

export default function MyStories({ stories = [], favoriteStories = [], favorites = {}, onToggleFavorite, onDelete, onTogglePublish, smilesOf = () => 0, onOpenReader, onCreate, onHome, onCommunity, onDecouvrir, onSettings }) {
  const [tab, setTab] = useState('mine')
  const total = stories.reduce((n, s) => n + smilesOf(s), 0)
  const list = tab === 'mine' ? stories : favoriteStories

  const Row = ({ s, showDelete }) => (
    <div onClick={() => onOpenReader(s)} style={{ background: 'var(--card)', borderRadius: 24, padding: 14, display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 8px 20px -12px rgba(74,58,102,.28)', cursor: 'pointer' }}>
      <Thumb s={s} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 16, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.title}</div>
        <div style={{ fontSize: 12.5, color: 'var(--ink2)', fontWeight: 600, marginTop: 2 }}>
          {s.author ? s.author : showDelete ? `${s.published ? 'Partagée' : 'Gardée'} · ${smilesOf(s)} 💛` : `${(s.pages || []).length} pages`}
        </div>
      </div>
      {showDelete && onTogglePublish && (
        <button onClick={(e) => { e.stopPropagation(); onTogglePublish(s.id) }} aria-label={s.published ? 'Ne plus partager' : 'Partager avec les copains'} title={s.published ? 'Ne plus partager' : 'Partager avec les copains'} style={iconBtn(s.published ? 'var(--violet-soft)' : 'var(--bg)')}>
          <RawSvg html={s.published ? sendOn : sendOff} />
        </button>
      )}
      <button onClick={(e) => { e.stopPropagation(); onToggleFavorite && onToggleFavorite(s.id) }} aria-label="Favori" style={iconBtn('var(--bg)')}>
        <RawSvg html={favorites[s.id] ? heartFull : heartLine} />
      </button>
      {showDelete && (
        <button onClick={(e) => { e.stopPropagation(); onDelete && onDelete(s) }} aria-label="Supprimer" style={iconBtn('#FFF0F4')}>
          <RawSvg html={trash} />
        </button>
      )}
    </div>
  )

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--bg)', position: 'relative', overflow: 'hidden', animation: 'gn-fadein .35s ease', paddingTop: 'calc(env(safe-area-inset-top, 14px) + 16px)' }}>
      <div style={{ position: 'absolute', top: -50, left: -40, width: 170, height: 170, borderRadius: '50%', background: 'var(--yellow-soft)', opacity: 0.6 }} />
      <div style={{ padding: '6px 24px 0', flex: 'none', position: 'relative', zIndex: 2 }}>
        <div style={{ fontSize: 26, fontWeight: 700 }}>Mes histoires</div>
        <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
          {[{ k: 'mine', l: 'Mes créations' }, { k: 'fav', l: '❤️ Favoris' }].map((t) => {
            const active = tab === t.k
            return (
              <button key={t.k} onClick={() => setTab(t.k)} style={active ? { background: 'var(--violet)', color: '#fff', padding: '9px 18px', borderRadius: 20, fontSize: 15, fontWeight: 600 } : { background: 'var(--card)', color: 'var(--ink2)', padding: '9px 18px', borderRadius: 20, fontSize: 15, fontWeight: 600, boxShadow: '0 4px 10px rgba(74,58,102,.08)' }}>{t.l}</button>
            )
          })}
        </div>
      </div>

      {tab === 'mine' && total > 0 && (
        <div className="smiles-banner" style={{ margin: '14px 24px 0', background: 'linear-gradient(135deg,#FFE7A0,#FFC4DC)', borderRadius: 24, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14, position: 'relative', zIndex: 2 }}>
          <div style={{ flex: 'none' }}><Grabi size={54} /></div>
          <div className="sb-h" style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.25, color: '#7a4a5a' }}>Tes histoires ont fait sourire <span className="sb-c" style={{ color: '#C24A7A' }}>{total} enfant{total > 1 ? 's' : ''}</span> 💛</div>
        </div>
      )}

      {list.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, padding: '0 36px', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <div style={{ animation: 'gn-float 3s ease-in-out infinite' }}><Grabi size={120} /></div>
          {tab === 'mine' ? (
            <>
              <div style={{ fontSize: 19, fontWeight: 700 }}>Pas encore d'histoire</div>
              <div style={{ fontSize: 15, color: 'var(--ink2)', fontWeight: 500, maxWidth: 250, lineHeight: 1.4 }}>Invente ta première histoire, Grabi la dessine pour toi&nbsp;!</div>
              <button onClick={onCreate} style={{ marginTop: 6, background: 'linear-gradient(135deg,#FFD23F,#FF7FB0)', color: '#fff', borderRadius: 26, height: 58, padding: '0 28px', fontSize: 16, fontWeight: 700, boxShadow: '0 14px 26px -10px rgba(255,127,176,.7)' }}>Créer une histoire ✨</button>
            </>
          ) : (
            <>
              <div style={{ fontSize: 19, fontWeight: 700 }}>Aucun favori</div>
              <div style={{ fontSize: 15, color: 'var(--ink2)', fontWeight: 500, maxWidth: 260, lineHeight: 1.4 }}>Touche le ❤️ en lisant une histoire pour la retrouver ici.</div>
            </>
          )}
        </div>
      ) : (
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px 18px', display: 'flex', flexDirection: 'column', gap: 14, position: 'relative', zIndex: 2 }}>
          {list.map((s) => (
            <Row key={s.id} s={s} showDelete={tab === 'mine'} />
          ))}
        </div>
      )}

      <BottomNav active="moncoin" onAccueil={onHome} onDecouvrir={onDecouvrir} onCopains={onCommunity} onMonCoin={onSettings} />
    </div>
  )
}

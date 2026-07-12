import { useState } from 'react'
import RawSvg from '../components/RawSvg.jsx'
import Grabi from '../components/Grabi.jsx'
import BottomNav from '../components/BottomNav.jsx'
import { newId } from '../lib/store.js'

// Sans abonnement : on lit ce nombre de pages d'une histoire longue, puis paywall (freemium).
const FREE_PAGES = 2

const crownBadge = `<svg width="15" height="15" viewBox="0 0 24 24" fill="#7a4a00"><path d="M3 7 l4 5 5-7 5 7 4-5 -2 12 H5 Z"></path></svg>`
const playIcon = `<svg width="13" height="13" viewBox="0 0 24 24" fill="#fff"><path d="M6 4 L20 12 L6 20 Z"></path></svg>`
const bigPlay = `<svg width="30" height="30" viewBox="0 0 24 24" fill="#6E4FA8"><path d="M8 5 L20 12 L8 19 Z"></path></svg>`
const castle = `<svg width="74" height="74" viewBox="0 0 86 86"><ellipse cx="22" cy="64" rx="20" ry="9" fill="#fff" opacity=".85"></ellipse><ellipse cx="60" cy="66" rx="18" ry="8" fill="#fff" opacity=".85"></ellipse><rect x="28" y="30" width="30" height="30" rx="4" fill="#A98CFF"></rect><rect x="22" y="38" width="10" height="22" rx="3" fill="#BBA4FF"></rect><rect x="54" y="38" width="10" height="22" rx="3" fill="#BBA4FF"></rect><path d="M26,30 l6,-9 6,9 z M48,30 l6,-9 6,9 z" fill="#FF7FB0"></path><rect x="40" y="46" width="6" height="14" rx="3" fill="#fff"></rect><circle cx="43" cy="22" r="3" fill="#FFCC3E"></circle></svg>`
const lock = `<svg width="40" height="44" viewBox="0 0 40 46"><path d="M11,20 V14 a9,9 0 0 1 18,0 V20" fill="none" stroke="#B6A6D6" stroke-width="4.5" stroke-linecap="round"></path><rect x="6" y="19" width="28" height="22" rx="7" fill="#B6A6D6"></rect><circle cx="20" cy="28" r="3.4" fill="#fff"></circle><rect x="18.4" y="29" width="3.2" height="7" rx="1.5" fill="#fff"></rect></svg>`
const crownW = `<svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M3 7 l4 5 5-7 5 7 4-5 -2 12 H5 Z"></path></svg>`

// Décale un élément d'un tableau (haut/bas) de façon immuable.
const moveIn = (arr, i, dir) => {
  const j = i + dir
  if (j < 0 || j >= arr.length) return arr
  const n = [...arr]
  ;[n[i], n[j]] = [n[j], n[i]]
  return n
}
// Petit bouton rond de contrôle admin (↑ ↓ ✏️ 🗑 …).
function Mini({ children, danger, onClick }) {
  return (
    <button onClick={onClick} style={{ width: 30, height: 30, borderRadius: 10, background: danger ? 'var(--pink-soft)' : 'var(--card-soft)', color: danger ? '#C24A7A' : 'var(--ink)', fontSize: 14, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>{children}</button>
  )
}
const dashed = { display: 'block', width: '100%', textAlign: 'center', border: '2px dashed var(--card-border)', color: 'var(--ink2)', borderRadius: 18, padding: '11px', fontSize: 14, fontWeight: 700, background: 'transparent' }

// Épisode animé (carte sombre à la une). Non cliquable en édition (on gère via les boutons).
function EpisodeCard({ e, editing, onOpen }) {
  return (
    <button onClick={() => !editing && onOpen(e.videoUrl)} style={{ display: 'block', width: '100%', textAlign: 'left', borderRadius: 26, padding: '18px 20px', position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg,#3B2D5A 0%,#6E4FA8 48%,#D06CA0 100%)', boxShadow: '0 16px 34px -14px rgba(59,45,90,.6)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11.5, fontWeight: 800, color: '#FFD86A', letterSpacing: '.06em' }}>ÉPISODE ANIMÉ</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', lineHeight: 1.12, marginTop: 4 }}>{e.title || 'Sans titre'}</div>
          {e.subtitle && <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,.82)', marginTop: 5, lineHeight: 1.4 }}>{e.subtitle}</div>}
        </div>
        <div style={{ position: 'relative', flex: 'none', width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 27 }}>{e.emoji || '🎬'}<span style={{ position: 'absolute', bottom: -2, right: -2, width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,.95)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><RawSvg html={bigPlay} /></span></div>
      </div>
    </button>
  )
}

export default function Premium({ isPremium, content = {}, editing = false, onSaveContent, longStories = [], onSubscribe, onOpenReader, onHome, onCommunity, onSettings }) {
  const [epForm, setEpForm] = useState(null) // { sid, ep } quand on ajoute/édite un épisode
  const seasons = content.seasons || []
  const longs = longStories // histoires longues affichées sous les épisodes (publiées via l'admin)
  const openVideo = (url) => { if (url) { try { window.open(url, '_blank', 'noopener') } catch {} } }
  const save = (nextSeasons) => onSaveContent && onSaveContent({ ...content, seasons: nextSeasons })

  const addSeason = () => save([...seasons, { id: newId(), title: `Saison ${seasons.length + 1}`, episodes: [] }])
  const renameSeason = (sid) => {
    const s = seasons.find((x) => x.id === sid)
    const t = window.prompt('Nom de la saison ?', s?.title || '')
    if (t == null) return
    save(seasons.map((x) => (x.id === sid ? { ...x, title: t.trim() || x.title } : x)))
  }
  const deleteSeason = (sid) => { if (window.confirm('Supprimer cette saison et ses épisodes ?')) save(seasons.filter((x) => x.id !== sid)) }
  const moveSeason = (sid, dir) => save(moveIn(seasons, seasons.findIndex((x) => x.id === sid), dir))
  const deleteEpisode = (sid, eid) => { if (window.confirm('Supprimer cet épisode ?')) save(seasons.map((x) => (x.id === sid ? { ...x, episodes: x.episodes.filter((e) => e.id !== eid) } : x))) }
  const moveEpisode = (sid, eid, dir) => save(seasons.map((x) => (x.id === sid ? { ...x, episodes: moveIn(x.episodes, x.episodes.findIndex((e) => e.id === eid), dir) } : x)))
  const submitEp = (form) => {
    const { sid, ep } = form
    save(seasons.map((x) => {
      if (x.id !== sid) return x
      if (ep.id) return { ...x, episodes: x.episodes.map((e) => (e.id === ep.id ? ep : e)) }
      return { ...x, episodes: [...x.episodes, { ...ep, id: newId() }] }
    }))
    setEpForm(null)
  }

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--bg)', position: 'relative', overflow: 'hidden', animation: 'gn-fadein .35s ease', paddingTop: 'calc(env(safe-area-inset-top, 14px) + 16px)' }}>
      <div style={{ position: 'absolute', top: -50, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'var(--violet-soft)', opacity: 0.7 }} />

      <div style={{ padding: '6px 24px 8px', position: 'relative', zIndex: 2, flex: 'none' }}>
        <div style={{ fontSize: 24, fontWeight: 800, lineHeight: 1.05 }}>Découvrir</div>
        <div style={{ fontSize: 13.5, color: 'var(--ink2)', fontWeight: 500, marginTop: 2 }}>Les épisodes animés &amp; les histoires longues</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0 12px', position: 'relative', zIndex: 2 }}>
        {/* ⭐ ÉPISODES ANIMÉS organisés en SAISONS (gérés en mode édition) */}
        {seasons.length > 0 ? (
          <div style={{ padding: '4px 24px 0', display: 'flex', flexDirection: 'column', gap: 22 }}>
            {seasons.map((s, si) => (
              <div key={s.id}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <div style={{ fontSize: 16, fontWeight: 800 }}>{s.title || `Saison ${si + 1}`}</div>
                  {editing && (
                    <div style={{ display: 'flex', gap: 6, marginLeft: 'auto' }}>
                      <Mini onClick={() => moveSeason(s.id, -1)}>↑</Mini>
                      <Mini onClick={() => moveSeason(s.id, 1)}>↓</Mini>
                      <Mini onClick={() => renameSeason(s.id)}>✏️</Mini>
                      <Mini danger onClick={() => deleteSeason(s.id)}>🗑</Mini>
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {s.episodes.map((e) => (
                    <div key={e.id}>
                      <EpisodeCard e={e} editing={editing} onOpen={openVideo} />
                      {editing && (
                        <div style={{ display: 'flex', gap: 6, marginTop: 6, justifyContent: 'flex-end' }}>
                          <Mini onClick={() => moveEpisode(s.id, e.id, -1)}>↑</Mini>
                          <Mini onClick={() => moveEpisode(s.id, e.id, 1)}>↓</Mini>
                          <Mini onClick={() => setEpForm({ sid: s.id, ep: { ...e } })}>✏️</Mini>
                          <Mini danger onClick={() => deleteEpisode(s.id, e.id)}>🗑</Mini>
                        </div>
                      )}
                    </div>
                  ))}
                  {editing && <button onClick={() => setEpForm({ sid: s.id, ep: { title: '', subtitle: '', emoji: '🎬', videoUrl: '' } })} style={dashed}>＋ Ajouter un épisode</button>}
                </div>
              </div>
            ))}
            {editing && <button onClick={addSeason} style={dashed}>＋ Ajouter une saison</button>}
          </div>
        ) : editing ? (
          <div style={{ padding: '4px 24px 0' }}><button onClick={addSeason} style={dashed}>＋ Ajouter une saison d'épisodes</button></div>
        ) : (
          <div style={{ margin: '4px 24px 0', borderRadius: 30, padding: '22px 22px 20px', position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg,#3B2D5A 0%,#6E4FA8 48%,#D06CA0 100%)', boxShadow: '0 18px 38px -14px rgba(59,45,90,.65)' }}>
            <span style={{ position: 'absolute', top: 16, left: 20, background: 'rgba(255,255,255,.22)', color: '#fff', fontSize: 11.5, fontWeight: 800, letterSpacing: '.05em', padding: '5px 11px', borderRadius: 20 }}>🎬 BIENTÔT</span>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 26 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: '#FFD86A', letterSpacing: '.06em' }}>ÉPISODE ANIMÉ</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#fff', lineHeight: 1.1, marginTop: 5 }}>Grabi en 3D</div>
                <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,.82)', marginTop: 8, lineHeight: 1.4, maxWidth: 200 }}>Un vrai dessin animé de Grabi, rien que pour toi. Arrive très bientôt&nbsp;!</div>
              </div>
              <div style={{ position: 'relative', flex: 'none' }}><Grabi size={96} /><span style={{ position: 'absolute', bottom: -2, right: -2, width: 46, height: 46, borderRadius: '50%', background: 'rgba(255,255,255,.95)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><RawSvg html={bigPlay} /></span></div>
            </div>
          </div>
        )}

        {/* Histoires longues — affichage classique. Sans abonnement : lecture partielle (freemium). */}
        {longs.length > 0 && (
        <div style={{ padding: '18px 24px 8px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 18, fontWeight: 800 }}>Histoires longues</div>
          {longs.map((s) => (
            <button key={s.id} onClick={() => onOpenReader({ ...s, premium: true, freePages: FREE_PAGES })} style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'var(--card)', borderRadius: 22, padding: '12px 14px', textAlign: 'left', width: '100%', boxShadow: '0 8px 20px -14px rgba(74,58,102,.4)' }}>
              <div style={{ width: 60, height: 60, borderRadius: 16, background: 'var(--violet-soft)', overflow: 'hidden', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{s.cover ? <img src={s.cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : s.svg ? <div style={{ transform: 'scale(.62)' }}><RawSvg html={s.svg} /></div> : <span style={{ fontSize: 26 }}>📖</span>}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 16.5, fontWeight: 700, lineHeight: 1.15 }}>{s.title}</div>
                <div style={{ fontSize: 12.5, color: 'var(--ink2)', fontWeight: 600, marginTop: 3 }}>📖 Histoire longue</div>
              </div>
              <span style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--violet)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><RawSvg html={playIcon} /></span>
            </button>
          ))}
        </div>
        )}
      </div>

      {epForm && <EpisodeForm form={epForm} onChange={setEpForm} onSubmit={submitEp} onCancel={() => setEpForm(null)} />}

      <BottomNav active="decouvrir" onAccueil={onHome} onDecouvrir={() => {}} onCopains={onCommunity} onMonCoin={onSettings} />
    </div>
  )
}

// Petit éditeur d'épisode (feuille en bas d'écran).
const inp = { width: '100%', background: 'var(--card-soft)', border: '2px solid var(--card-border)', borderRadius: 12, padding: '10px 12px', fontSize: 15, fontWeight: 600, color: 'var(--ink)', outline: 'none' }
function EpisodeForm({ form, onChange, onSubmit, onCancel }) {
  const ep = form.ep
  const set = (patch) => onChange({ ...form, ep: { ...ep, ...patch } })
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 10000, background: 'rgba(20,14,40,.55)', display: 'flex', alignItems: 'flex-end' }} onClick={onCancel}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', background: 'var(--card)', borderRadius: '26px 26px 0 0', padding: '20px 22px calc(env(safe-area-inset-bottom, 0px) + 22px)', display: 'flex', flexDirection: 'column', gap: 12, boxShadow: '0 -14px 40px -10px rgba(0,0,0,.5)' }}>
        <div style={{ fontSize: 18, fontWeight: 800 }}>{ep.id ? "Modifier l'épisode" : 'Nouvel épisode'}</div>
        <input value={ep.title} onChange={(e) => set({ title: e.target.value })} placeholder="Titre (ex. Grabi et la lune perdue)" style={inp} autoFocus />
        <input value={ep.subtitle} onChange={(e) => set({ subtitle: e.target.value })} placeholder="Sous-titre (ex. Épisode 1 · 4 min)" style={inp} />
        <div style={{ display: 'flex', gap: 10 }}>
          <input value={ep.emoji} onChange={(e) => set({ emoji: e.target.value })} placeholder="🎬" style={{ ...inp, width: 70, flex: 'none', textAlign: 'center' }} />
          <input value={ep.videoUrl} onChange={(e) => set({ videoUrl: e.target.value })} placeholder="Lien vidéo (https://…)" style={inp} />
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
          <button onClick={onCancel} style={{ flex: 1, background: 'var(--card-soft)', color: 'var(--ink)', borderRadius: 16, padding: '12px', fontSize: 15, fontWeight: 700 }}>Annuler</button>
          <button onClick={() => onSubmit(form)} style={{ flex: 1, background: 'var(--violet)', color: '#fff', borderRadius: 16, padding: '12px', fontSize: 15, fontWeight: 800 }}>Enregistrer</button>
        </div>
      </div>
    </div>
  )
}

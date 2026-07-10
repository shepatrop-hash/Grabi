import { useState } from 'react'
import BackButton from '../components/BackButton.jsx'
import { checkAdmin } from '../lib/content.js'
import { newId } from '../lib/store.js'

const field = { width: '100%', background: 'var(--card-soft)', border: '2px solid var(--card-border)', borderRadius: 14, padding: '11px 14px', fontSize: 15, fontWeight: 600, color: 'var(--ink)', outline: 'none' }
const label = { display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--ink2)', textTransform: 'uppercase', letterSpacing: '.03em', margin: '2px 2px 6px' }
const card = { background: 'var(--card)', borderRadius: 22, padding: '16px 18px', boxShadow: '0 6px 16px -12px rgba(74,58,102,.3)', display: 'flex', flexDirection: 'column', gap: 12 }
const sectionTitle = { fontSize: 17, fontWeight: 800 }
const hint = { fontSize: 12.5, color: 'var(--ink2)', fontWeight: 500, lineHeight: 1.45 }
const primaryBtn = { background: 'var(--violet)', color: '#fff', borderRadius: 16, padding: '11px 16px', fontSize: 14.5, fontWeight: 700, alignSelf: 'flex-start' }
const ghostBtn = { background: 'var(--card-soft)', color: 'var(--ink)', borderRadius: 14, padding: '9px 14px', fontSize: 13.5, fontWeight: 700 }

// Espace admin : édite le contenu à distance (via api/content.js → Vercel Blob), donc
// SANS redéploiement ni mise à jour du store (l'app Android charge le web live).
export default function Admin({ content = { featuredEvent: null, episodes: [], longStories: [] }, password = '', onAuth, onSave, onCreateLong, onClose }) {
  const authed = !!password
  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--bg)', position: 'relative', overflow: 'hidden', animation: 'gn-fadein .35s ease', paddingTop: 'calc(env(safe-area-inset-top, 14px) + 16px)' }}>
      <div style={{ padding: '6px 24px 0', display: 'flex', alignItems: 'center', gap: 14, flex: 'none' }}>
        <BackButton onClick={onClose} />
        <div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>Espace admin</div>
          <div style={{ fontSize: 13, color: 'var(--ink2)', fontWeight: 500 }}>Publie du contenu sans mise à jour du store</div>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px calc(env(safe-area-inset-bottom, 0px) + 24px)', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {authed ? <Panel content={content} password={password} onSave={onSave} onCreateLong={onCreateLong} /> : <Login onAuth={onAuth} />}
      </div>
    </div>
  )
}

function Login({ onAuth }) {
  const [pass, setPass] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const submit = async () => {
    if (!pass || busy) return
    setBusy(true); setErr('')
    const ok = await checkAdmin(pass)
    setBusy(false)
    if (ok) onAuth(pass)
    else setErr("Mot de passe incorrect — ou ADMIN_PASSWORD n'est pas encore posé dans Vercel.")
  }
  return (
    <div style={{ ...card, marginTop: 8 }}>
      <div style={sectionTitle}>🔒 Connexion admin</div>
      <div style={hint}>Réservé au propriétaire. Le mot de passe se définit dans Vercel (variable <b>ADMIN_PASSWORD</b>).</div>
      <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submit()} placeholder="Mot de passe admin" style={field} autoFocus />
      {err && <div style={{ fontSize: 13, color: '#C24A7A', fontWeight: 600 }}>{err}</div>}
      <button onClick={submit} style={{ ...primaryBtn, opacity: busy ? 0.6 : 1 }}>{busy ? 'Vérification…' : 'Entrer'}</button>
    </div>
  )
}

function Panel({ content, password, onSave, onCreateLong }) {
  const [saving, setSaving] = useState('')
  const [msg, setMsg] = useState('')

  // Enregistre le contenu complet (une action = une sauvegarde atomique).
  const persist = async (next, tag) => {
    setSaving(tag); setMsg('')
    try {
      await onSave(next)
      setMsg('✓ Enregistré — en ligne dans quelques secondes')
    } catch (e) {
      setMsg('✕ ' + (e?.message || 'Échec'))
    } finally {
      setSaving('')
    }
  }

  return (
    <>
      {msg && <div style={{ background: msg[0] === '✓' ? 'var(--mint-soft)' : 'var(--pink-soft)', color: msg[0] === '✓' ? '#0f9b76' : '#C24A7A', borderRadius: 14, padding: '10px 14px', fontSize: 13.5, fontWeight: 700 }}>{msg}</div>}

      <EventSection content={content} persist={persist} saving={saving} />
      <EpisodesSection content={content} persist={persist} saving={saving} />
      <LongStoriesSection content={content} persist={persist} saving={saving} onCreateLong={onCreateLong} />
    </>
  )
}

// --- Événement à la une (gros encart de l'accueil) ---
function EventSection({ content, persist, saving }) {
  const ev = content.featuredEvent
  const [on, setOn] = useState(!!ev)
  const [badge, setBadge] = useState(ev?.badge || '🎬 Nouvel épisode')
  const [title, setTitle] = useState(ev?.title || '')
  const [subtitle, setSubtitle] = useState(ev?.subtitle || '')
  const [emoji, setEmoji] = useState(ev?.emoji || '🎬')
  const save = () => {
    const featuredEvent = on ? { badge, title, subtitle, emoji } : null
    persist({ ...content, featuredEvent }, 'event')
  }
  return (
    <div style={card}>
      <div style={sectionTitle}>🌟 Événement à la une</div>
      <div style={hint}>Le grand encart en haut de l'accueil. Éteins-le pour un accueil épuré.</div>
      <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14.5, fontWeight: 700 }}>
        <input type="checkbox" checked={on} onChange={(e) => setOn(e.target.checked)} style={{ width: 20, height: 20 }} />
        Afficher un événement
      </label>
      {on && (
        <>
          <div><label style={label}>Badge</label><input value={badge} onChange={(e) => setBadge(e.target.value)} style={field} placeholder="🎬 Nouvel épisode" /></div>
          <div><label style={label}>Titre</label><input value={title} onChange={(e) => setTitle(e.target.value)} style={field} placeholder="Grabi en 3D" /></div>
          <div><label style={label}>Sous-titre</label><input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} style={field} placeholder="Le tout premier dessin animé !" /></div>
          <div><label style={label}>Emoji (à droite)</label><input value={emoji} onChange={(e) => setEmoji(e.target.value)} style={{ ...field, width: 90 }} placeholder="🎬" /></div>
        </>
      )}
      <button onClick={save} style={{ ...primaryBtn, opacity: saving === 'event' ? 0.6 : 1 }}>{saving === 'event' ? 'Enregistrement…' : "Enregistrer l'événement"}</button>
    </div>
  )
}

// --- Épisodes animés (Découvrir) ---
function EpisodesSection({ content, persist, saving }) {
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [emoji, setEmoji] = useState('🎬')
  const [videoUrl, setVideoUrl] = useState('')
  const add = () => {
    if (!title.trim()) return
    const ep = { id: newId(), title: title.trim(), subtitle: subtitle.trim(), emoji: emoji || '🎬', videoUrl: videoUrl.trim() }
    persist({ ...content, episodes: [ep, ...content.episodes] }, 'ep-add')
    setTitle(''); setSubtitle(''); setEmoji('🎬'); setVideoUrl('')
  }
  const remove = (id) => persist({ ...content, episodes: content.episodes.filter((e) => e.id !== id) }, 'ep-' + id)
  return (
    <div style={card}>
      <div style={sectionTitle}>📺 Épisodes animés</div>
      <div style={hint}>Chaque épisode = un titre + un emoji + un lien vidéo (YouTube, Vimeo, fichier hébergé…).</div>
      {content.episodes.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {content.episodes.map((e) => (
            <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--card-soft)', borderRadius: 14, padding: '9px 12px' }}>
              <span style={{ fontSize: 20, flex: 'none' }}>{e.emoji || '🎬'}</span>
              <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 14, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.title}</div>{e.subtitle && <div style={{ fontSize: 11.5, color: 'var(--ink2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.subtitle}</div>}</div>
              <button onClick={() => remove(e.id)} style={{ fontSize: 12.5, fontWeight: 700, color: '#C24A7A', flex: 'none' }}>Supprimer</button>
            </div>
          ))}
        </div>
      )}
      <div style={{ height: 1, background: 'var(--card-border)', margin: '2px 0' }} />
      <div><label style={label}>Titre</label><input value={title} onChange={(e) => setTitle(e.target.value)} style={field} placeholder="Grabi et la lune perdue" /></div>
      <div><label style={label}>Sous-titre</label><input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} style={field} placeholder="Épisode 1 · 4 min" /></div>
      <div style={{ display: 'flex', gap: 10 }}>
        <div style={{ flex: 'none' }}><label style={label}>Emoji</label><input value={emoji} onChange={(e) => setEmoji(e.target.value)} style={{ ...field, width: 80 }} /></div>
        <div style={{ flex: 1 }}><label style={label}>Lien vidéo</label><input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} style={field} placeholder="https://…" /></div>
      </div>
      <button onClick={add} style={{ ...primaryBtn, opacity: saving === 'ep-add' ? 0.6 : 1 }}>{saving === 'ep-add' ? 'Ajout…' : '+ Ajouter l\'épisode'}</button>
    </div>
  )
}

// --- Histoires longues (catalogue) ---
function LongStoriesSection({ content, persist, saving, onCreateLong }) {
  const remove = (id) => persist({ ...content, longStories: content.longStories.filter((s) => s.id !== id) }, 'ls-' + id)
  return (
    <div style={card}>
      <div style={sectionTitle}>📖 Histoires longues</div>
      <div style={hint}>Crée-les avec Grabi (texte + illustrations) puis publie-les au catalogue. Elles apparaissent dans « Histoires longues ».</div>
      {content.longStories.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {content.longStories.map((s) => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--card-soft)', borderRadius: 14, padding: '9px 12px' }}>
              {s.cover ? <img src={s.cover} alt="" style={{ width: 38, height: 38, borderRadius: 10, objectFit: 'cover', flex: 'none' }} /> : <span style={{ fontSize: 20, flex: 'none' }}>📖</span>}
              <div style={{ flex: 1, minWidth: 0, fontSize: 14, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.title}</div>
              <button onClick={() => remove(s.id)} style={{ fontSize: 12.5, fontWeight: 700, color: '#C24A7A', flex: 'none' }}>Supprimer</button>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ ...hint, fontStyle: 'italic' }}>Aucune histoire longue pour l'instant.</div>
      )}
      <button onClick={onCreateLong} style={primaryBtn}>✨ Créer une histoire longue avec Grabi</button>
    </div>
  )
}

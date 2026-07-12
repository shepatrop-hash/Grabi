import { useState } from 'react'
import Grabi from '../components/Grabi.jsx'
import RawSvg from '../components/RawSvg.jsx'
import BottomNav from '../components/BottomNav.jsx'
import { FREE_STORIES } from '../lib/samples.js'
import { crystalSvg } from '../lib/crystals.js'

const iconBooks = `<svg width="40" height="40" viewBox="0 0 46 46"><rect x="8" y="27" width="30" height="9" rx="3.5" fill="#FF7FB0"></rect><rect x="6" y="17.5" width="34" height="9" rx="3.5" fill="#56C7FF"></rect><rect x="10" y="8" width="26" height="9" rx="3.5" fill="#3FD7B0"></rect></svg>`
const iconLong = `<svg width="38" height="38" viewBox="0 0 46 46"><rect x="9" y="8" width="28" height="30" rx="5" fill="#56C7FF"></rect><rect x="9" y="8" width="8" height="30" rx="4" fill="#38ABE8"></rect><path d="M22 16 H32 M22 22 H32 M22 28 H29" stroke="#fff" stroke-width="2.4" stroke-linecap="round"></path></svg>`
const iconFriends = `<svg width="40" height="40" viewBox="0 0 46 46"><circle cx="18" cy="21" r="12" fill="#56C7FF"></circle><circle cx="29" cy="26" r="12.5" fill="#FF7FB0"></circle><circle cx="26" cy="23.5" r="1.8" fill="#fff"></circle><circle cx="32.5" cy="23.5" r="1.8" fill="#fff"></circle><path d="M26 28.5 q3.2 2.6 6.4 0" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"></path></svg>`
const iconWand = `<svg width="38" height="38" viewBox="0 0 46 46"><line x1="11" y1="36" x2="30" y2="17" stroke="#A98CFF" stroke-width="5.5" stroke-linecap="round"></line><path d="M33,9 L35,14 L40,16 L35,18 L33,23 L31,18 L26,16 L31,14 Z" fill="#FFCC3E"></path><circle cx="15" cy="13" r="2.5" fill="#FF7FB0"></circle><circle cx="40" cy="32" r="2.5" fill="#3FD7B0"></circle></svg>`
const lockChip = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><rect x="4" y="10.5" width="16" height="10.5" rx="2.5"></rect><path d="M8 10.5 V7.5 a4 4 0 0 1 8 0 V10.5"></path></svg>`

const cardBase = { borderRadius: 26, padding: '16px 16px 18px', textAlign: 'left', position: 'relative' }
const iconBox = { width: 54, height: 54, borderRadius: 18, background: 'var(--card)', display: 'flex', alignItems: 'center', justifyContent: 'center' }
const cardTitle = { fontSize: 16.5, fontWeight: 800, marginTop: 12, lineHeight: 1.1 }
const cardSub = { fontSize: 12.5, fontWeight: 600, marginTop: 4 }

// Accueil = un petit lanceur : les 4 entrées principales. Le gros encart n'apparaît
// QUE s'il y a un événement (ex. sortie d'un épisode animé Grabi) → prop `event`.
export default function Home({ childName = 'Léa', event = null, isPremium = false, editing = false, content = {}, onSaveContent, crystals = 0, onGoFree, onGoLong, onGoCommunity, onGoCreate, onGoBoutique, onGoPremium, onGoSettings }) {
  const [evForm, setEvForm] = useState(null)
  const saveEvent = (ev) => { onSaveContent && onSaveContent({ ...content, featuredEvent: ev }); setEvForm(null) }
  const removeEvent = () => { if (window.confirm("Retirer l'événement de l'accueil ?")) onSaveContent && onSaveContent({ ...content, featuredEvent: null }) }

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--bg)', position: 'relative', overflow: 'hidden', animation: 'gn-fadein .4s cubic-bezier(.22,.61,.36,1)' }}>
      <div style={{ position: 'absolute', top: -70, right: -60, width: 220, height: 220, borderRadius: '50%', background: 'var(--halo)', opacity: 0.6 }} />

      {/* En-tête : salutation + mascotte */}
      <div style={{ flex: 'none', padding: 'calc(env(safe-area-inset-top, 14px) + 18px) 24px 4px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative', zIndex: 2 }}>
        <div style={{ paddingTop: 6 }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink2)' }}>Bonsoir {childName}&nbsp;🌙</div>
          <div style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.12, maxWidth: 200, marginTop: 3 }}>Prêt·e pour l'histoire du soir&nbsp;?</div>
          <button onClick={onGoBoutique} aria-label="Mes cristaux" style={{ marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--yellow-soft)', color: 'var(--ink)', borderRadius: 16, padding: '6px 12px', fontSize: 14.5, fontWeight: 800 }}><RawSvg html={crystalSvg(17)} /> {crystals}<span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink2)' }}>{crystals > 1 ? 'cristaux' : 'cristal'}</span></button>
        </div>
        <div style={{ flex: 'none' }}><Grabi size={96} /></div>
      </div>

      {/* Contenu défilable */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 24px 18px', display: 'flex', flexDirection: 'column', gap: 16, position: 'relative', zIndex: 2 }}>
        {/* Encart ÉVÉNEMENT à la une (éditable en mode admin) */}
        {event ? (
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <button onClick={() => (editing ? setEvForm({ ...event }) : onGoPremium())} className="veil-weekly" style={{ display: 'block', width: '100%', textAlign: 'left', borderRadius: 30, padding: '20px 22px', boxShadow: '0 16px 32px -16px rgba(150,110,220,.6)' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'var(--hero-badge-bg)', color: 'var(--hero-badge-ink)', fontSize: 12.5, fontWeight: 800, padding: '5px 12px', borderRadius: 16 }}>{event.badge}</span>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 14 }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.15, color: 'var(--ink)' }}>{event.title}</div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink2)', marginTop: 5 }}>{event.subtitle}</div>
                </div>
                <div style={{ fontSize: 44, flex: 'none' }}>{event.emoji || '🎬'}</div>
              </div>
            </button>
            {editing && (
              <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 6 }}>
                <button onClick={() => setEvForm({ ...event })} style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(255,255,255,.92)', color: '#7d5fc4', fontSize: 15, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>✏️</button>
                <button onClick={removeEvent} style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(255,255,255,.92)', color: '#C24A7A', fontSize: 15, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>🗑</button>
              </div>
            )}
          </div>
        ) : editing ? (
          <button onClick={() => setEvForm({ badge: '🎬 Nouvel épisode', title: '', subtitle: '', emoji: '🎬' })} style={{ flexShrink: 0, border: '2px dashed var(--card-border)', color: 'var(--ink2)', borderRadius: 24, padding: '18px', fontSize: 15, fontWeight: 700, background: 'transparent' }}>＋ Ajouter un événement à la une</button>
        ) : null}

        {/* Les 4 entrées de l'accueil */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <button onClick={onGoFree} style={{ ...cardBase, background: 'var(--yellow-soft)', boxShadow: '0 12px 24px -14px var(--glow-free)' }}>
            <div style={iconBox}><RawSvg html={iconBooks} /></div>
            <div style={cardTitle}>Histoires<br />gratuites</div>
            <div style={{ ...cardSub, color: 'var(--free-sub)' }}>{FREE_STORIES.length} histoires</div>
          </button>

          <button onClick={onGoLong} style={{ ...cardBase, background: 'var(--sky-soft)', boxShadow: '0 12px 24px -14px rgba(74,58,102,.3)' }}>
            <div style={iconBox}><RawSvg html={iconLong} /></div>
            <div style={cardTitle}>Histoires<br />longues</div>
            <div style={{ ...cardSub, color: 'var(--ink2)' }}>Une nouvelle chaque semaine</div>
          </button>

          <button onClick={onGoCommunity} style={{ ...cardBase, background: 'var(--pink-soft)', boxShadow: '0 12px 24px -14px rgba(74,58,102,.3)' }}>
            {!isPremium && (
              <span style={{ position: 'absolute', top: 12, right: 12, display: 'inline-flex', alignItems: 'center', gap: 3, background: 'var(--card)', color: 'var(--violet)', fontSize: 10.5, fontWeight: 800, padding: '4px 8px', borderRadius: 12 }}><RawSvg html={lockChip} />Premium</span>
            )}
            <div style={iconBox}><RawSvg html={iconFriends} /></div>
            <div style={cardTitle}>Les histoires<br />des enfants</div>
            <div style={{ ...cardSub, color: 'var(--ink2)' }}>À lire et à aimer</div>
          </button>

          <button onClick={onGoCreate} style={{ ...cardBase, background: 'var(--violet-soft)', boxShadow: '0 12px 24px -14px var(--glow-create)' }}>
            <div style={iconBox}><RawSvg html={iconWand} /></div>
            <div style={cardTitle}>Crée ton<br />histoire</div>
            <div style={{ ...cardSub, color: 'var(--create-sub)', display: 'flex', alignItems: 'center', gap: 4 }}><RawSvg html={crystalSvg(15)} /> {crystals} {crystals > 1 ? 'cristaux' : 'cristal'}</div>
          </button>
        </div>
      </div>

      {evForm && <EventForm form={evForm} onChange={setEvForm} onSubmit={saveEvent} onCancel={() => setEvForm(null)} />}

      <BottomNav active="accueil" onAccueil={() => {}} onDecouvrir={onGoPremium} onCopains={onGoCommunity} onMonCoin={onGoSettings} />
    </div>
  )
}

// Éditeur de l'événement à la une (feuille en bas d'écran).
const inp = { width: '100%', background: 'var(--card-soft)', border: '2px solid var(--card-border)', borderRadius: 12, padding: '10px 12px', fontSize: 15, fontWeight: 600, color: 'var(--ink)', outline: 'none' }
function EventForm({ form, onChange, onSubmit, onCancel }) {
  const set = (patch) => onChange({ ...form, ...patch })
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 10000, background: 'rgba(20,14,40,.55)', display: 'flex', alignItems: 'flex-end' }} onClick={onCancel}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', background: 'var(--card)', borderRadius: '26px 26px 0 0', padding: '20px 22px calc(env(safe-area-inset-bottom, 0px) + 22px)', display: 'flex', flexDirection: 'column', gap: 12, boxShadow: '0 -14px 40px -10px rgba(0,0,0,.5)' }}>
        <div style={{ fontSize: 18, fontWeight: 800 }}>Événement à la une</div>
        <input value={form.badge} onChange={(e) => set({ badge: e.target.value })} placeholder="Badge (ex. 🎬 Nouvel épisode)" style={inp} />
        <input value={form.title} onChange={(e) => set({ title: e.target.value })} placeholder="Titre (ex. Grabi en 3D)" style={inp} autoFocus />
        <input value={form.subtitle} onChange={(e) => set({ subtitle: e.target.value })} placeholder="Sous-titre" style={inp} />
        <input value={form.emoji} onChange={(e) => set({ emoji: e.target.value })} placeholder="🎬" style={{ ...inp, width: 70, textAlign: 'center' }} />
        <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
          <button onClick={onCancel} style={{ flex: 1, background: 'var(--card-soft)', color: 'var(--ink)', borderRadius: 16, padding: '12px', fontSize: 15, fontWeight: 700 }}>Annuler</button>
          <button onClick={() => onSubmit(form)} style={{ flex: 1, background: 'var(--violet)', color: '#fff', borderRadius: 16, padding: '12px', fontSize: 15, fontWeight: 800 }}>Enregistrer</button>
        </div>
      </div>
    </div>
  )
}

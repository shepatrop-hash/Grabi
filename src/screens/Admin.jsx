import { useState } from 'react'
import BackButton from '../components/BackButton.jsx'
import { checkAdmin } from '../lib/content.js'

const field = { width: '100%', background: 'var(--card-soft)', border: '2px solid var(--card-border)', borderRadius: 14, padding: '13px 16px', fontSize: 16, fontWeight: 600, color: 'var(--ink)', outline: 'none' }
const primaryBtn = { width: '100%', background: 'var(--violet)', color: '#fff', borderRadius: 18, padding: '14px 16px', fontSize: 16, fontWeight: 800 }

// Porte de connexion admin. Une fois le mot de passe validé, on entre en MODE ÉDITION
// directement sur l'app réelle (cf. App.jsx : setEditing(true)). Pas de panneau séparé.
export default function Admin({ onAuth, onClose }) {
  const [pass, setPass] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const submit = async () => {
    if (!pass || busy) return
    setBusy(true); setErr('')
    const ok = await checkAdmin(pass)
    setBusy(false)
    if (ok) onAuth(pass)
    else setErr("Mot de passe incorrect — ou ADMIN_PASSWORD n'est pas posé dans Vercel.")
  }
  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--bg)', position: 'relative', overflow: 'hidden', animation: 'gn-fadein .4s cubic-bezier(.22,.61,.36,1)', paddingTop: 'calc(env(safe-area-inset-top, 14px) + 16px)' }}>
      <div style={{ padding: '6px 24px 0', display: 'flex', alignItems: 'center', gap: 14, flex: 'none' }}>
        <BackButton onClick={onClose} />
        <div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>Espace admin</div>
          <div style={{ fontSize: 13, color: 'var(--ink2)', fontWeight: 500 }}>Édite l'app directement, sans mise à jour du store</div>
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 24px', gap: 14, maxWidth: 420, width: '100%', margin: '0 auto' }}>
        <div style={{ fontSize: 20, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>🔒 Connexion</div>
        <div style={{ fontSize: 13.5, color: 'var(--ink2)', fontWeight: 500, lineHeight: 1.5 }}>Réservé au propriétaire. Une fois connecté, tu passes en <b>mode édition</b> : tu déplaces les cartes, ajoutes des saisons, des épisodes et l'événement à la une — en direct sur l'app.</div>
        <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submit()} placeholder="Mot de passe admin" style={field} autoFocus />
        {err && <div style={{ fontSize: 13, color: '#C24A7A', fontWeight: 600 }}>{err}</div>}
        <button onClick={submit} style={{ ...primaryBtn, opacity: busy ? 0.6 : 1 }}>{busy ? 'Vérification…' : 'Entrer en mode édition'}</button>
      </div>
    </div>
  )
}

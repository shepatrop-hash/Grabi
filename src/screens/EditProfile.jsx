import { useState } from 'react'
import Grabi from '../components/Grabi.jsx'
import BackButton from '../components/BackButton.jsx'

// L'âge est stocké sous la forme « 5 ans ». On extrait le nombre pour la sélection.
const parseAge = (age) => {
  const n = parseInt(String(age), 10)
  return Number.isFinite(n) ? n : 5
}
const MIN_AGE = 3
const MAX_AGE = 12
const TICKS = [3, 6, 9, 12]

export default function EditProfile({ child = { name: 'Léa', age: '5 ans' }, onSave, onBack }) {
  const [name, setName] = useState(child.name || '')
  const [age, setAge] = useState(parseAge(child.age))

  const save = () => {
    const clean = name.trim() || child.name || 'Mon enfant'
    onSave({ name: clean, age: `${age} ans` })
  }

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--bg)', position: 'relative', overflow: 'hidden', animation: 'gn-fadein .35s ease', paddingTop: 'calc(env(safe-area-inset-top, 14px) + 16px)' }}>
      <div style={{ padding: '6px 24px 0', display: 'flex', alignItems: 'center', gap: 14, flex: 'none' }}>
        <BackButton onClick={onBack} />
        <div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>Profil enfant</div>
          <div style={{ fontSize: 13, color: 'var(--ink2)', fontWeight: 500 }}>Prénom &amp; âge</div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 24px calc(env(safe-area-inset-bottom, 0px) + 20px)', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 4 }}>
          <div style={{ width: 110, height: 110, borderRadius: '50%', background: 'var(--violet-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}><Grabi size={96} /></div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--ink2)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 8, marginLeft: 4 }}>Prénom</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
            placeholder="Prénom de l'enfant"
            autoFocus
            style={{ width: '100%', background: 'var(--card)', border: '2px solid var(--card-border)', borderRadius: 20, padding: '15px 18px', fontSize: 18, fontWeight: 600, color: 'var(--ink)', outline: 'none', boxShadow: '0 6px 16px -12px rgba(74,58,102,.3)' }}
          />
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14, marginLeft: 4, marginRight: 4 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink2)', textTransform: 'uppercase', letterSpacing: '.04em' }}>Âge</label>
            <span style={{ fontSize: 22, fontWeight: 700, color: 'var(--violet)' }}>{age} ans</span>
          </div>
          <input
            type="range"
            className="age-slider"
            min={MIN_AGE}
            max={MAX_AGE}
            step={1}
            value={age}
            onChange={(e) => setAge(parseInt(e.target.value, 10))}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, padding: '0 2px' }}>
            {TICKS.map((a) => (
              <span key={a} style={{ fontSize: 13, fontWeight: 700, color: age === a ? 'var(--violet)' : 'var(--ink2)' }}>{a}</span>
            ))}
          </div>
          <div style={{ fontSize: 12, color: 'var(--ink2)', fontWeight: 500, marginTop: 12, marginLeft: 4 }}>Glisse Grabi pour choisir l'âge. Il adapte ses histoires en conséquence.</div>
        </div>
      </div>

      <div style={{ flex: 'none', padding: '8px 24px calc(env(safe-area-inset-bottom, 0px) + 22px)' }}>
        <button onClick={save} style={{ width: '100%', background: 'var(--violet)', color: '#fff', borderRadius: 24, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, boxShadow: '0 14px 28px -10px rgba(169,140,255,.7)' }}>Enregistrer</button>
      </div>
    </div>
  )
}

import RawSvg from './RawSvg.jsx'

// Sélecteur d'âge − / + (plus clair qu'un slider). Borne entre min et max.
// setAge doit accepter une mise à jour fonctionnelle (useState setter).
const icon = (d) => `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7d5fc4" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`
const minusSvg = icon('<path d="M5 12 H19"></path>')
const plusSvg = icon('<path d="M12 5 V19 M5 12 H19"></path>')

export default function AgeStepper({ age, setAge, min = 0, max = 12 }) {
  const dec = () => setAge((a) => Math.max(min, a - 1))
  const inc = () => setAge((a) => Math.min(max, a + 1))
  const round = (enabled) => ({
    width: 60, height: 60, borderRadius: '50%', flex: 'none',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'var(--violet-soft)', opacity: enabled ? 1 : 0.35,
    boxShadow: enabled ? '0 8px 18px -12px rgba(74,58,102,.4)' : 'none',
    transition: 'opacity .15s ease',
  })
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 22 }}>
      <button onClick={dec} disabled={age <= min} aria-label="Diminuer l'âge" style={round(age > min)}><RawSvg html={minusSvg} /></button>
      <div style={{ minWidth: 96, textAlign: 'center' }}>
        <span style={{ fontSize: 42, fontWeight: 800, color: 'var(--violet)', lineHeight: 1 }}>{age}</span>
        <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink2)', marginLeft: 6 }}>{age <= 1 ? 'an' : 'ans'}</span>
      </div>
      <button onClick={inc} disabled={age >= max} aria-label="Augmenter l'âge" style={round(age < max)}><RawSvg html={plusSvg} /></button>
    </div>
  )
}

import Grabi from '../components/Grabi.jsx'
import RawSvg from '../components/RawSvg.jsx'
import BackButton from '../components/BackButton.jsx'

const check = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13 l4 4 L19 6"></path></svg>`
const pencil = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#7d5fc4" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20 h4 L19 9 l-4 -4 L4 16 Z"></path><path d="M14 5 l4 4"></path></svg>`
const trash = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#C24A7A" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 7 H19 M9 7 V5 a1 1 0 0 1 1-1 h4 a1 1 0 0 1 1 1 V7 M7 7 l1 12 a1 1 0 0 0 1 1 h6 a1 1 0 0 0 1-1 l1-12"></path></svg>`
const plus = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round"><path d="M12 5 V19 M5 12 H19"></path></svg>`

const roundBtn = (bg) => ({ width: 36, height: 36, borderRadius: 12, background: bg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' })

export default function Profiles({ profiles = [], activeId, onSwitch, onAdd, onEdit, onDelete, onBack }) {
  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--bg)', position: 'relative', overflow: 'hidden', animation: 'gn-fadein .35s ease', paddingTop: 'calc(env(safe-area-inset-top, 14px) + 16px)' }}>
      <div style={{ padding: '6px 24px 0', display: 'flex', alignItems: 'center', gap: 14, flex: 'none' }}>
        <BackButton onClick={onBack} />
        <div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>Profils</div>
          <div style={{ fontSize: 13, color: 'var(--ink2)', fontWeight: 500 }}>Choisis qui joue</div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px calc(env(safe-area-inset-bottom, 0px) + 20px)', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {profiles.map((p) => {
          const active = p.id === activeId
          return (
            <div key={p.id} onClick={() => onSwitch(p.id)} style={{ cursor: 'pointer', background: '#fff', borderRadius: 24, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 8px 20px -14px rgba(74,58,102,.35)', border: active ? '2px solid var(--violet)' : '2px solid transparent' }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'var(--violet-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', position: 'relative' }}>
                <Grabi size={52} acc={p.acc} />
                {active && <span style={{ position: 'absolute', bottom: -2, right: -2, width: 22, height: 22, borderRadius: '50%', background: 'var(--mint)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff' }}><RawSvg html={check} /></span>}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{p.name}</div>
                <div style={{ fontSize: 13, color: 'var(--ink2)', fontWeight: 500 }}>{active ? `${p.age} · actif` : p.age}</div>
              </div>
              <button onClick={(e) => { e.stopPropagation(); onEdit(p.id) }} style={roundBtn('#F1EEF8')}><RawSvg html={pencil} /></button>
              {profiles.length > 1 && (
                <button onClick={(e) => { e.stopPropagation(); onDelete(p.id) }} style={roundBtn('var(--pink-soft)')}><RawSvg html={trash} /></button>
              )}
            </div>
          )
        })}

        <button onClick={onAdd} style={{ marginTop: 4, background: 'linear-gradient(135deg,#FFD23F,#FF7FB0)', color: '#fff', borderRadius: 24, padding: '15px 18px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontSize: 16, fontWeight: 700, boxShadow: '0 12px 22px -10px rgba(255,127,176,.7)' }}>
          <RawSvg html={plus} /> Ajouter un enfant
        </button>
        <div style={{ fontSize: 12, color: 'var(--ink2)', fontWeight: 500, textAlign: 'center', padding: '4px 16px 0', lineHeight: 1.4 }}>Chaque enfant a son prénom, son âge et son Grabi (apparence, voix, décor).</div>
      </div>
    </div>
  )
}

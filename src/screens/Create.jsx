import Grabi from '../components/Grabi.jsx'
import RawSvg from '../components/RawSvg.jsx'

const backIcon = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4A3A66" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5 L8 12 L15 19"></path></svg>`

const CHIPS = [
  { label: '🦄 Une licorne', bg: 'var(--sky-soft)', text: 'Une licorne magique' },
  { label: '🤖 Un robot rigolo', bg: 'var(--mint-soft)', text: 'Un robot rigolo' },
  { label: '🏰 Un château magique', bg: 'var(--pink-soft)', text: 'Un château magique' },
  { label: '🐙 Une pieuvre musicienne', bg: 'var(--yellow-soft)', text: 'Une pieuvre musicienne' },
]

export default function Create({ storyText, setStoryText, onBack, onCreate, busy, error }) {
  const disabled = busy || !storyText.trim()
  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--bg)', position: 'relative', overflow: 'hidden', animation: 'gn-fadein .35s ease', paddingTop: 'env(safe-area-inset-top, 14px)' }}>
      <div style={{ position: 'absolute', bottom: -50, right: -50, width: 200, height: 200, borderRadius: '50%', background: 'var(--violet-soft)', opacity: 0.6 }} />

      <div style={{ padding: '12px 24px 0', display: 'flex', alignItems: 'center', gap: 14, position: 'relative', zIndex: 2 }}>
        <button onClick={onBack} style={{ width: 48, height: 48, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 14px rgba(74,58,102,.12)', flex: 'none' }}>
          <RawSvg html={backIcon} />
        </button>
        <div style={{ fontSize: 26, fontWeight: 700 }}>Crée ton histoire</div>
      </div>

      <div style={{ textAlign: 'center', padding: '12px 24px 0', position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'inline-block', background: '#fff', borderRadius: '22px 22px 22px 4px', padding: '12px 18px', fontSize: 17, fontWeight: 600, boxShadow: '0 8px 18px rgba(74,58,102,.12)', marginBottom: 4 }}>Raconte-moi une idée&nbsp;!</div>
        <div style={{ display: 'flex', justifyContent: 'center' }}><Grabi size={92} /></div>
      </div>

      <div style={{ padding: '10px 24px 0', position: 'relative', zIndex: 2 }}>
        <div style={{ background: '#fff', border: '3px dashed #E3B8D4', borderRadius: 28, padding: '20px 22px', minHeight: 112, display: 'flex', alignItems: 'center' }}>
          <input
            value={storyText}
            onChange={(e) => setStoryText(e.target.value)}
            placeholder="Un dragon qui adore les crêpes…"
            style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', fontFamily: 'Fredoka, sans-serif', fontSize: 21, fontWeight: 500, color: '#4A3A66', lineHeight: 1.4 }}
          />
        </div>
      </div>

      <div style={{ padding: '16px 24px 0', position: 'relative', zIndex: 2 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink2)', marginBottom: 12 }}>Ou pioche une idée&nbsp;:</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {CHIPS.map((c) => (
            <button key={c.label} onClick={() => setStoryText(c.text)} style={{ background: c.bg, padding: '11px 16px', borderRadius: 20, fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div style={{ margin: '14px 24px 0', color: '#b5527e', fontSize: 13, fontWeight: 600, lineHeight: 1.4, position: 'relative', zIndex: 2 }}>{error}</div>
      )}

      <button
        onClick={onCreate}
        disabled={disabled}
        style={{ width: '100%', marginTop: 'auto', padding: '14px 24px calc(26px + env(safe-area-inset-bottom, 0px))', position: 'relative', zIndex: 2, opacity: disabled ? 0.6 : 1 }}
      >
        <div style={{ background: 'linear-gradient(135deg,#FFD23F,#FF7FB0)', color: '#fff', borderRadius: 30, height: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontSize: 21, fontWeight: 700, boxShadow: '0 16px 30px -10px rgba(255,127,176,.7)' }}>
          {busy ? 'Grabi dessine…' : 'Crée mon histoire ✨'}
        </div>
      </button>
    </div>
  )
}

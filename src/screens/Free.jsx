import BackButton from '../components/BackButton.jsx'
import RawSvg from '../components/RawSvg.jsx'
import { FREE_STORIES } from '../lib/samples.js'

export default function Free({ onBack, onOpenReader }) {
  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--bg)', position: 'relative', overflow: 'hidden', animation: 'gn-fadein .4s cubic-bezier(.22,.61,.36,1)', paddingTop: 'calc(env(safe-area-inset-top, 14px) + 16px)' }}>
      <div style={{ position: 'absolute', top: -50, left: -40, width: 170, height: 170, borderRadius: '50%', background: 'var(--mint-soft)', opacity: 0.7 }} />
      <div style={{ padding: '14px 24px 12px', display: 'flex', alignItems: 'center', gap: 14, position: 'relative', zIndex: 2 }}>
        <BackButton onClick={onBack} />
        <div>
          <div style={{ fontSize: 26, fontWeight: 700, lineHeight: 1 }}>Histoires gratuites</div>
          <div style={{ fontSize: 14, color: 'var(--ink2)', fontWeight: 500 }}>{FREE_STORIES.length} histoires à écouter</div>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '6px 22px 22px', position: 'relative', zIndex: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignContent: 'start' }}>
        {FREE_STORIES.map((s) => (
          <button key={s.id} onClick={() => onOpenReader(s)} style={{ background: s.bg, borderRadius: 28, padding: 14, textAlign: 'center' }}>
            <div style={{ height: 116, borderRadius: 18, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {s.cover ? <img src={s.cover} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : s.svg ? <RawSvg html={s.svg} /> : null}
            </div>
            <div style={{ fontSize: 16, fontWeight: 600, marginTop: 8 }}>{s.title}</div>
            <div style={{ fontSize: 12, color: 'var(--ink2)', fontWeight: 500 }}>{s.sub}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

import Grabi from '../components/Grabi.jsx'
import BackButton from '../components/BackButton.jsx'

export default function QCM({ idea, questions, index, loading, onBack, onAnswer }) {
  const q = questions[index] || { q: '', opts: [] }
  const total = questions.length || 1
  const step = index + 1
  const progress = `${Math.round((step / total) * 100)}%`
  const showLoading = loading || questions.length === 0

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--bg)', position: 'relative', overflow: 'hidden', animation: 'gn-fadein .35s ease', paddingTop: 'calc(env(safe-area-inset-top, 14px) + 16px)' }}>
      <div style={{ position: 'absolute', top: -50, right: -50, width: 190, height: 190, borderRadius: '50%', background: 'var(--violet-soft)', opacity: 0.6 }} />
      <div style={{ padding: '6px 24px 0', display: 'flex', alignItems: 'center', gap: 14, position: 'relative', zIndex: 2 }}>
        <BackButton onClick={onBack} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>On personnalise&nbsp;✨</div>
          <div style={{ fontSize: 13, color: 'var(--ink2)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>« {idea} »</div>
        </div>
      </div>

      {showLoading ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '0 30px', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <div style={{ animation: 'gn-float 3s ease-in-out infinite' }}><Grabi size={120} /></div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#fff', borderRadius: 22, padding: '13px 20px', fontSize: 18, fontWeight: 700, boxShadow: '0 8px 18px rgba(74,58,102,.12)' }}>
            Je réfléchis à de bonnes questions
            <span style={{ display: 'inline-flex', gap: 4 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--violet)', animation: 'gn-dot 1.3s ease-in-out infinite' }} />
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--violet)', animation: 'gn-dot 1.3s ease-in-out infinite .2s' }} />
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--violet)', animation: 'gn-dot 1.3s ease-in-out infinite .4s' }} />
            </span>
          </div>
        </div>
      ) : (
        <>
          <div style={{ padding: '16px 26px 0', position: 'relative', zIndex: 2 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink2)', marginBottom: 8 }}>Question {step} / {total}</div>
            <div style={{ height: 8, borderRadius: 4, background: '#EFE7F5', overflow: 'hidden' }}>
              <div style={{ width: progress, height: '100%', background: 'var(--violet)', borderRadius: 4, transition: 'width .3s ease' }} />
            </div>
          </div>

          <div style={{ textAlign: 'center', padding: '10px 26px 0', position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}><Grabi size={78} /></div>
            <div style={{ display: 'inline-block', background: '#fff', borderRadius: 22, padding: '13px 20px', fontSize: 20, fontWeight: 700, boxShadow: '0 8px 18px rgba(74,58,102,.12)', marginTop: 2, maxWidth: 300 }}>{q.q}</div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '18px 24px 24px', position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {q.opts.map((opt, i) => (
                <button key={`${opt.label}-${i}`} onClick={() => onAnswer(opt.label)} style={{ background: '#fff', borderRadius: 24, padding: '18px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, boxShadow: '0 8px 18px -12px rgba(74,58,102,.32)' }}>
                  {opt.color ? (
                    <span style={{ width: 50, height: 50, borderRadius: '50%', background: opt.color, boxShadow: 'inset 0 -5px 8px rgba(0,0,0,.10), 0 0 0 3px #fff, 0 0 0 4px #EEE7F6' }} />
                  ) : (
                    <span style={{ fontSize: 40, lineHeight: 1 }}>{opt.emoji || '✨'}</span>
                  )}
                  <span style={{ fontSize: 16, fontWeight: 600, textAlign: 'center' }}>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

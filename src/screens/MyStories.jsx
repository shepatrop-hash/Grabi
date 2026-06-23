import Grabi from '../components/Grabi.jsx'
import BottomNav from '../components/BottomNav.jsx'
import RawSvg from '../components/RawSvg.jsx'

const badge = `<svg width="20" height="20" viewBox="0 0 40 40"><circle cx="20" cy="20" r="16" fill="#FFFDF7"></circle><g fill="none" stroke-width="3.6" stroke-linecap="round"><path d="M20,4 A16,16 0 0 1 36,20" stroke="#FF7FB0"></path><path d="M36,20 A16,16 0 0 1 20,36" stroke="#56C7FF"></path><path d="M20,36 A16,16 0 0 1 4,20" stroke="#3FD7B0"></path><path d="M4,20 A16,16 0 0 1 20,4" stroke="#FFCC3E"></path></g><circle cx="15" cy="19" r="2.3" fill="#3B2D5A"></circle><circle cx="25" cy="19" r="2.3" fill="#3B2D5A"></circle></svg>`

export default function MyStories({ stories = [], smilesOf = () => 0, onOpenReader, onCreate, onHome, onCommunity, onSettings }) {
  const total = stories.reduce((n, s) => n + smilesOf(s), 0)
  const empty = stories.length === 0

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--bg)', position: 'relative', overflow: 'hidden', animation: 'gn-fadein .35s ease', paddingTop: 'calc(env(safe-area-inset-top, 14px) + 16px)' }}>
      <div style={{ position: 'absolute', top: -50, left: -40, width: 170, height: 170, borderRadius: '50%', background: 'var(--yellow-soft)', opacity: 0.6 }} />
      <div style={{ padding: '6px 24px 0', flex: 'none', position: 'relative', zIndex: 2 }}>
        <div style={{ fontSize: 26, fontWeight: 700 }}>Mes histoires</div>
      </div>

      {!empty && (
        <div style={{ margin: '14px 24px 0', background: 'linear-gradient(135deg,#FFE7A0,#FFC4DC)', borderRadius: 28, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14, position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', justifyContent: 'center', flex: 'none' }}><Grabi size={64} /></div>
          <div style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.25, color: '#7a4a5a' }}>Bravo&nbsp;! Tes histoires ont fait sourire <span style={{ color: '#C24A7A' }}>{total} enfant{total > 1 ? 's' : ''}</span> 💛</div>
        </div>
      )}

      {empty ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '0 36px', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <div style={{ animation: 'gn-float 3s ease-in-out infinite' }}><Grabi size={130} /></div>
          <div style={{ fontSize: 19, fontWeight: 700 }}>Pas encore d'histoire</div>
          <div style={{ fontSize: 15, color: 'var(--ink2)', fontWeight: 500, maxWidth: 250, lineHeight: 1.4 }}>Invente ta première histoire, Grabi la dessine pour toi&nbsp;!</div>
          <button onClick={onCreate} style={{ marginTop: 6, background: 'linear-gradient(135deg,#FFD23F,#FF7FB0)', color: '#fff', borderRadius: 26, height: 60, padding: '0 30px', fontSize: 17, fontWeight: 700, boxShadow: '0 14px 26px -10px rgba(255,127,176,.7)' }}>Créer une histoire ✨</button>
        </div>
      ) : (
        <div style={{ flex: 1, overflowY: 'auto', padding: '18px 24px 18px', display: 'flex', flexDirection: 'column', gap: 14, position: 'relative', zIndex: 2 }}>
          {stories.map((s) => (
            <button key={s.id} onClick={() => onOpenReader(s)} style={{ background: '#fff', borderRadius: 24, padding: 14, display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 8px 20px -12px rgba(74,58,102,.28)', textAlign: 'left' }}>
              <div style={{ width: 64, height: 64, borderRadius: 18, background: 'var(--violet-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', overflow: 'hidden', fontSize: 30 }}>
                {s.cover ? <img src={s.cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '📖'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 17, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.title}</div>
                <div style={{ fontSize: 13, color: '#1f9e7a', fontWeight: 600, marginTop: 2 }}>{s.published ? 'Publiée' : 'Gardée pour toi'} · {s.pages?.length || 0} pages</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'var(--yellow-soft)', padding: '7px 12px', borderRadius: 18, flex: 'none' }}>
                <RawSvg html={badge} />
                <span style={{ fontSize: 16, fontWeight: 700 }}>{smilesOf(s)}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      <BottomNav active="mine" onHome={onHome} onCommunity={onCommunity} onCreate={onCreate} onSettings={onSettings} />
    </div>
  )
}

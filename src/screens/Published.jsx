import Grabi from '../components/Grabi.jsx'

const CONFETTI = [
  { top: 120, left: 60, w: 12, bg: '#FF7FB0', d: '3s', delay: '0s' },
  { top: 90, left: 150, w: 10, bg: '#56C7FF', d: '3.6s', delay: '.5s' },
  { top: 110, right: 70, w: 13, bg: '#FFCC3E', d: '3.2s', delay: '.9s' },
  { top: 80, right: 130, w: 9, bg: '#3FD7B0', d: '4s', delay: '.3s' },
  { top: 140, left: 250, w: 11, bg: '#A98CFF', d: '3.4s', delay: '1.2s' },
]

export default function Published({ onMine, onHome }) {
  return (
    <div style={{ height: '100dvh', color: 'var(--ink)', background: 'linear-gradient(165deg,#CFF3E6 0%,#FFF1C9 55%,#FFD9E6 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
      {CONFETTI.map((c, i) => (
        <div key={i} style={{ position: 'absolute', top: c.top, left: c.left, right: c.right, width: c.w, height: c.w, borderRadius: 3, background: c.bg, animation: `gn-fall ${c.d} linear infinite ${c.delay}` }} />
      ))}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 36px', textAlign: 'center', width: '100%' }}>
        <div style={{ animation: 'gn-pop 2.4s ease-in-out infinite' }}><Grabi size={150} /></div>
        <div style={{ fontSize: 32, fontWeight: 700, marginTop: 18 }}>C'est publié&nbsp;! 🎉</div>
        <div style={{ fontSize: 17, fontWeight: 500, color: '#6b5e86', lineHeight: 1.45, marginTop: 8, maxWidth: 280 }}>Ton histoire part faire sourire les copains. Grabi est tout fier de toi&nbsp;!</div>
        <button onClick={onMine} style={{ marginTop: 30, background: 'var(--violet)', color: '#fff', borderRadius: 28, height: 62, width: '100%', maxWidth: 280, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, boxShadow: '0 14px 28px -10px rgba(169,140,255,.7)' }}>Voir mes histoires</button>
        <button onClick={onHome} style={{ marginTop: 18, fontSize: 15, fontWeight: 600, color: '#7d6fa6' }}>Revenir à l'accueil</button>
      </div>
    </div>
  )
}

import Grabi from '../components/Grabi.jsx'
import RawSvg from '../components/RawSvg.jsx'

const twinkle = (fill) => `<svg width="24" height="24" viewBox="0 0 24 24" fill="${fill}"><path d="M12,0 L14.5,9 L24,12 L14.5,15 L12,24 L9.5,15 L0,12 L9.5,9 Z"></path></svg>`
const ring = `<svg width="220" height="220" viewBox="0 0 220 220" fill="none"><circle cx="110" cy="110" r="100" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-dasharray="2 22" opacity=".8"></circle></svg>`

const dot = (delay) => ({ width: 8, height: 8, borderRadius: '50%', background: 'var(--card)', animation: `gn-dot 1.3s ease-in-out infinite ${delay}` })

export default function Generating() {
  return (
    <div style={{ height: '100dvh', color: '#fff', background: 'linear-gradient(165deg,#8FD9FF 0%,#B6A8FF 52%,#FFA9CE 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 120, left: 54, animation: 'gn-twinkle 2.4s ease-in-out infinite' }}><RawSvg html={twinkle('#fff')} /></div>
      <div style={{ position: 'absolute', top: 200, right: 50, animation: 'gn-twinkle 2.9s ease-in-out infinite .6s' }}><RawSvg html={twinkle('#fff')} /></div>
      <div style={{ position: 'absolute', bottom: 230, left: 70, animation: 'gn-twinkle 2.2s ease-in-out infinite 1s' }}><RawSvg html={twinkle('#fff')} /></div>
      <div style={{ position: 'absolute', top: 300, left: 40, animation: 'gn-twinkle 3.1s ease-in-out infinite .3s' }}><RawSvg html={twinkle('#FFF3B0')} /></div>
      <div style={{ position: 'absolute', bottom: 300, right: 64, animation: 'gn-twinkle 2.6s ease-in-out infinite .9s' }}><RawSvg html={twinkle('#FFF3B0')} /></div>

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 46 }}>
        <div style={{ position: 'absolute', width: 240, height: 240, borderRadius: '50%', background: 'rgba(255,255,255,.25)', animation: 'gn-pulse 2.6s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', animation: 'gn-spin 9s linear infinite' }}><RawSvg html={ring} /></div>
        <div style={{ animation: 'gn-float 3s ease-in-out infinite' }}><Grabi size={150} /></div>
      </div>

      <div style={{ fontSize: 27, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4, textShadow: '0 2px 8px rgba(120,80,160,.25)' }}>
        Je dessine ton histoire
        <span style={{ display: 'inline-flex', gap: 5, marginLeft: 4 }}>
          <span style={dot('0s')} />
          <span style={dot('.2s')} />
          <span style={dot('.4s')} />
        </span>
      </div>
      <div style={{ fontSize: 16, fontWeight: 500, marginTop: 10, opacity: 0.92 }}>Encore quelques coups de crayon&nbsp;!</div>
    </div>
  )
}

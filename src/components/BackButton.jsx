import RawSvg from './RawSvg.jsx'

const backIcon = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4A3A66" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5 L8 12 L15 19"></path></svg>`

export default function BackButton({ onClick, size = 48 }) {
  return (
    <button onClick={onClick} style={{ width: size, height: size, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 14px rgba(74,58,102,.12)', flex: 'none' }}>
      <RawSvg html={backIcon} />
    </button>
  )
}

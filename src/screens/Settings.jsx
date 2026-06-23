import Grabi from '../components/Grabi.jsx'
import RawSvg from '../components/RawSvg.jsx'

const chevron = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C3BBD2" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6 L15 12 L9 18"></path></svg>`
const soundIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1f9e7a" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9 H8 L13 5 V19 L8 15 H4 Z"></path><path d="M17 9 a4 4 0 0 1 0 6"></path></svg>`
const clockIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3A8AC0" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M12 7 V12 L15 14"></path></svg>`
const crownIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="#8B6FE0"><path d="M3 7 l4 5 5-7 5 7 4-5 -2 12 H5 Z"></path></svg>`
const lockIcon = `<svg width="19" height="21" viewBox="0 0 24 26" fill="none"><path d="M6 12 V9 a6 6 0 0 1 12 0 V12" stroke="#C79A2E" stroke-width="2.4" stroke-linecap="round"></path><rect x="4" y="11" width="16" height="12" rx="4" fill="#E0B84A"></rect></svg>`
const helpIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C24A7A" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M9.2 9.2 a2.8 2.8 0 0 1 5.2 1.3 c0 1.8-2.4 2.2-2.4 3.7"></path><circle cx="12" cy="17.2" r="0.6" fill="#C24A7A"></circle></svg>`

const navHome = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C3BBD2" stroke-width="2.2"><path d="M4 11.5 L12 4.5 L20 11.5 V20 H4 Z"></path></svg>`
const navCommunity = `<svg width="28" height="28" viewBox="0 0 40 40"><circle cx="20" cy="20" r="15" fill="none" stroke="#C3BBD2" stroke-width="2.6"></circle><circle cx="15" cy="19" r="2.2" fill="#C3BBD2"></circle><circle cx="25" cy="19" r="2.2" fill="#C3BBD2"></circle><path d="M15,25 Q20,29 25,25" stroke="#C3BBD2" stroke-width="2.2" fill="none" stroke-linecap="round"></path></svg>`
const navBookmark = `<svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#C3BBD2" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4 H17 V20 L12 16 L7 20 Z"></path></svg>`
const fabPlus = `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.8" stroke-linecap="round"><path d="M12 5 V19 M5 12 H19"></path></svg>`
const gearW = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3.1"></circle><path d="M19.4 13a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1.08 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`

const VOICES = ['Douce', 'Rigolote', 'Magique', 'Robot']

const rowStyle = { background: '#fff', borderRadius: 22, padding: '13px 16px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 6px 16px -12px rgba(74,58,102,.3)' }
const iconBox = (bg) => ({ width: 42, height: 42, borderRadius: 14, background: bg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' })
const navBtn = { width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }

export default function Settings({ voice, onVoice, onSubscribe, onHome, onCommunity, onCreate, onMine }) {
  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--bg)', position: 'relative', overflow: 'hidden', animation: 'gn-fadein .35s ease', paddingTop: 'calc(env(safe-area-inset-top, 14px) + 16px)' }}>
      <div style={{ position: 'absolute', top: -50, right: -40, width: 170, height: 170, borderRadius: '50%', background: 'var(--sky-soft)', opacity: 0.55 }} />
      <div style={{ padding: '6px 24px 0', flex: 'none', position: 'relative', zIndex: 2 }}>
        <div style={{ fontSize: 26, fontWeight: 700 }}>Paramètres</div>
        <div style={{ fontSize: 14, color: 'var(--ink2)', fontWeight: 500 }}>Réglages &amp; espace parents</div>
      </div>

      <div style={{ margin: '16px 24px 0', background: '#fff', borderRadius: 26, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 8px 20px -12px rgba(74,58,102,.28)', position: 'relative', zIndex: 2 }}>
        <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'var(--violet-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', overflow: 'hidden' }}><Grabi size={54} /></div>
        <div style={{ flex: 1 }}><div style={{ fontSize: 18, fontWeight: 700 }}>Léa</div><div style={{ fontSize: 13, color: 'var(--ink2)', fontWeight: 500 }}>5 ans · profil enfant</div></div>
        <RawSvg html={chevron} />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px 12px', display: 'flex', flexDirection: 'column', gap: 12, position: 'relative', zIndex: 2 }}>
        <div style={rowStyle}>
          <span style={iconBox('var(--mint-soft)')}><RawSvg html={soundIcon} /></span>
          <div style={{ flex: 1, fontSize: 16, fontWeight: 600 }}>Son &amp; voix</div>
          <span style={{ width: 46, height: 27, borderRadius: 14, background: 'var(--mint)', position: 'relative', flex: 'none' }}><span style={{ position: 'absolute', top: 3, right: 3, width: 21, height: 21, borderRadius: '50%', background: '#fff' }} /></span>
        </div>

        <div style={{ background: '#fff', borderRadius: 22, padding: '14px 16px', boxShadow: '0 6px 16px -12px rgba(74,58,102,.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ ...iconBox('var(--violet-soft)'), fontSize: 20 }}>🎙️</span>
            <div style={{ flex: 1, fontSize: 16, fontWeight: 600 }}>Voix de Grabi</div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
            {VOICES.map((v) => {
              const active = voice === v
              return (
                <button key={v} onClick={() => onVoice(v)} style={{ background: active ? 'var(--violet)' : '#F1EEF8', color: active ? '#fff' : 'var(--ink2)', padding: '8px 16px', borderRadius: 18, fontSize: 14, fontWeight: 600 }}>{v}</button>
              )
            })}
          </div>
        </div>

        <div style={rowStyle}>
          <span style={iconBox('var(--sky-soft)')}><RawSvg html={clockIcon} /></span>
          <div style={{ flex: 1, fontSize: 16, fontWeight: 600 }}>Temps d'écran</div>
          <span style={{ fontSize: 13, color: 'var(--ink2)', fontWeight: 600, whiteSpace: 'nowrap' }}>30 min/j</span>
          <RawSvg html={chevron} />
        </div>

        <button onClick={onSubscribe} style={{ ...rowStyle, textAlign: 'left' }}>
          <span style={iconBox('var(--violet-soft)')}><RawSvg html={crownIcon} /></span>
          <div style={{ flex: 1, fontSize: 16, fontWeight: 600 }}>Mon abonnement</div>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#7d5fc4', background: 'var(--violet-soft)', padding: '5px 10px', borderRadius: 14 }}>Gratuit</span>
          <RawSvg html={chevron} />
        </button>

        <div style={rowStyle}>
          <span style={iconBox('var(--yellow-soft)')}><RawSvg html={lockIcon} /></span>
          <div style={{ flex: 1, fontSize: 16, fontWeight: 600 }}>Espace parents</div>
          <RawSvg html={chevron} />
        </div>

        <div style={rowStyle}>
          <span style={iconBox('var(--pink-soft)')}><RawSvg html={helpIcon} /></span>
          <div style={{ flex: 1, fontSize: 16, fontWeight: 600 }}>Aide &amp; contact</div>
          <RawSvg html={chevron} />
        </div>
      </div>

      <div style={{ flex: 'none', padding: '8px 26px calc(env(safe-area-inset-bottom, 0px) + 20px)' }}>
        <div style={{ background: '#fff', borderRadius: 30, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-around', boxShadow: '0 10px 26px -8px rgba(74,58,102,.28)' }}>
          <button onClick={onHome} style={navBtn}><RawSvg html={navHome} /></button>
          <button onClick={onCommunity} style={navBtn}><RawSvg html={navCommunity} /></button>
          <button onClick={onCreate} style={{ width: 62, height: 62, borderRadius: '50%', background: 'linear-gradient(135deg,#FFD23F,#FF7FB0)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: -24, boxShadow: '0 12px 22px -6px rgba(255,127,176,.75)' }}><RawSvg html={fabPlus} /></button>
          <button onClick={onMine} style={navBtn}><RawSvg html={navBookmark} /></button>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--violet)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><RawSvg html={gearW} /></div>
        </div>
      </div>
    </div>
  )
}

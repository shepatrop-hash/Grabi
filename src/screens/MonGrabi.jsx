import { useState, useEffect } from 'react'
import Grabi from '../components/Grabi.jsx'
import RawSvg from '../components/RawSvg.jsx'
import BackButton from '../components/BackButton.jsx'
import { load, save } from '../lib/store.js'
import { ACCESSORIES, DEFAULT_ACC, VOICE_SAMPLE } from '../lib/grabiCustom.js'
import { speak, ttsSupported } from '../lib/tts.js'

const checkBadge = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13 l4 4 L19 6"></path></svg>`
const playMini = `<svg width="15" height="15" viewBox="0 0 24 24" fill="#7d5fc4"><path d="M8 5 L19 12 L8 19 Z"></path></svg>`

const VOICES = [
  { key: 'Douce', emoji: '🌙', desc: 'Calme et tendre' },
  { key: 'Rigolote', emoji: '🤪', desc: 'Vive et amusante' },
  { key: 'Magique', emoji: '✨', desc: 'Douce et féérique' },
  { key: 'Robot', emoji: '🤖', desc: 'Drôle et métallique' },
]

const card = { background: '#fff', borderRadius: 24, padding: '16px 18px', boxShadow: '0 6px 16px -12px rgba(74,58,102,.3)' }
const sectionTitle = { fontSize: 13, fontWeight: 700, color: 'var(--ink2)', textTransform: 'uppercase', letterSpacing: '.04em', margin: '4px 4px 0' }

export default function MonGrabi({ voice, onVoice, voiceOn = true, onToggleVoice, onBack, onPlay }) {
  const [acc, setAcc] = useState(() => load('acc', DEFAULT_ACC))
  useEffect(() => save('acc', acc), [acc])

  const toggleAcc = (key) => setAcc((a) => ({ ...a, [key]: !a[key] }))

  const testVoice = (v) => {
    onVoice(v)
    if (ttsSupported()) speak(VOICE_SAMPLE, v)
  }

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: 'linear-gradient(180deg,#FFF7EC 0%,#F4EEFF 100%)', position: 'relative', overflow: 'hidden', animation: 'gn-fadein .35s ease', paddingTop: 'calc(env(safe-area-inset-top, 14px) + 16px)' }}>
      <div style={{ padding: '6px 24px 0', display: 'flex', alignItems: 'center', gap: 14, flex: 'none', position: 'relative', zIndex: 2 }}>
        <BackButton onClick={onBack} />
        <div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>Mon Grabi</div>
          <div style={{ fontSize: 13, color: 'var(--ink2)', fontWeight: 500 }}>Apparence &amp; voix</div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 24px calc(env(safe-area-inset-bottom, 0px) + 20px)', display: 'flex', flexDirection: 'column', gap: 16, position: 'relative', zIndex: 2 }}>
        {/* Aperçu de la mascotte avec ses accessoires */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 8 }}>
          <div style={{ position: 'relative', width: 150, height: 150 }}>
            <Grabi size={150} acc={acc} />
          </div>
        </div>

        {/* Apparence */}
        <div style={sectionTitle}>Apparence</div>
        <div style={{ ...card, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10 }}>
          {ACCESSORIES.map((a) => (
            <button key={a.key} onClick={() => toggleAcc(a.key)} style={{ position: 'relative', background: acc[a.key] ? 'var(--violet-soft)' : '#F6F3FB', borderRadius: 18, padding: '12px 4px', textAlign: 'center', transition: 'background .15s ease' }}>
              {acc[a.key] && (
                <span style={{ position: 'absolute', top: 5, right: 5, width: 18, height: 18, borderRadius: '50%', background: 'var(--mint)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><RawSvg html={checkBadge} /></span>
              )}
              <div style={{ fontSize: 26, lineHeight: 1 }}>{a.emoji}</div>
              <div style={{ fontSize: 12, fontWeight: 600, marginTop: 3 }}>{a.label}</div>
            </button>
          ))}
        </div>

        {/* Voix */}
        <div style={{ ...sectionTitle, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>Voix de Grabi</span>
          <button onClick={onToggleVoice} style={{ display: 'flex', alignItems: 'center', gap: 7, textTransform: 'none', letterSpacing: 0 }}>
            <span style={{ fontSize: 12, color: voiceOn ? 'var(--ink2)' : '#C24A7A', fontWeight: 700 }}>{voiceOn ? 'Activée' : 'Coupée'}</span>
            <span style={{ width: 40, height: 23, borderRadius: 12, background: voiceOn ? 'var(--mint)' : '#D9D3E4', position: 'relative', flex: 'none', transition: 'background .2s ease' }}><span style={{ position: 'absolute', top: 3, left: voiceOn ? 20 : 3, width: 17, height: 17, borderRadius: '50%', background: '#fff', transition: 'left .2s ease' }} /></span>
          </button>
        </div>
        <div style={{ ...card, display: 'flex', flexDirection: 'column', gap: 10, opacity: voiceOn ? 1 : 0.55 }}>
          {VOICES.map((v) => {
            const active = voice === v.key
            return (
              <button key={v.key} onClick={() => testVoice(v.key)} style={{ display: 'flex', alignItems: 'center', gap: 13, background: active ? 'var(--violet-soft)' : '#F6F3FB', borderRadius: 18, padding: '11px 14px', textAlign: 'left', border: active ? '2px solid var(--violet)' : '2px solid transparent' }}>
                <span style={{ fontSize: 24, flex: 'none' }}>{v.emoji}</span>
                <span style={{ flex: 1 }}>
                  <span style={{ display: 'block', fontSize: 16, fontWeight: 700 }}>{v.key}</span>
                  <span style={{ display: 'block', fontSize: 12, color: 'var(--ink2)', fontWeight: 500 }}>{v.desc}</span>
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#fff', borderRadius: 14, padding: '6px 11px', fontSize: 12, fontWeight: 700, color: '#7d5fc4', flex: 'none' }}><RawSvg html={playMini} />Écouter</span>
              </button>
            )
          })}
          {!ttsSupported() && (
            <div style={{ fontSize: 12, color: 'var(--ink2)', fontWeight: 500, textAlign: 'center', paddingTop: 2 }}>Aperçu audio non disponible sur ce navigateur.</div>
          )}
        </div>

        {/* Raccourci compagnon */}
        <button onClick={onPlay} style={{ background: 'linear-gradient(135deg,#FFD23F,#FF7FB0)', color: '#fff', borderRadius: 24, padding: '15px 18px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, fontSize: 16, fontWeight: 700, boxShadow: '0 12px 22px -10px rgba(255,127,176,.7)' }}>
          🫶 Jouer avec Grabi
        </button>
      </div>
    </div>
  )
}

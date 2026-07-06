import { useState } from 'react'
import RawSvg from '../components/RawSvg.jsx'
import BackButton from '../components/BackButton.jsx'
import { load, save } from '../lib/store.js'

const clockIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3A8AC0" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M12 7 V12 L15 14"></path></svg>`
const voiceIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7d5fc4" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="3" width="6" height="11" rx="3"></rect><path d="M5 11 a7 7 0 0 0 14 0 M12 18 V21"></path></svg>`
const soundIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1f9e7a" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9 H8 L13 5 V19 L8 15 H4 Z"></path><path d="M17 9 a4 4 0 0 1 0 6"></path></svg>`
const musicIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C77DBB" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18 V6 l10-2 V16"></path><circle cx="6.5" cy="18" r="2.5"></circle><circle cx="16.5" cy="16" r="2.5"></circle></svg>`
const crownIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="#8B6FE0"><path d="M3 7 l4 5 5-7 5 7 4-5 -2 12 H5 Z"></path></svg>`
const helpIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C24A7A" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M9.2 9.2 a2.8 2.8 0 0 1 5.2 1.3 c0 1.8-2.4 2.2-2.4 3.7"></path><circle cx="12" cy="17.2" r="0.6" fill="#C24A7A"></circle></svg>`
const communityIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7d5fc4" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><circle cx="9" cy="11" r="1"></circle><circle cx="15" cy="11" r="1"></circle><path d="M9 15 q3 2.4 6 0"></path></svg>`
const bellIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C79A2E" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9 a6 6 0 0 1 12 0 c0 5 2 6 2 6 H4 s2 -1 2 -6"></path><path d="M10 20 a2 2 0 0 0 4 0"></path></svg>`
const docIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3A8AC0" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3 H14 L19 8 V21 H7 Z"></path><path d="M14 3 V8 H19 M10 13 H16 M10 17 H16"></path></svg>`
const trashIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C24A7A" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 7 H19 M9 7 V5 a1 1 0 0 1 1-1 h4 a1 1 0 0 1 1 1 V7 M7 7 l1 12 a1 1 0 0 0 1 1 h6 a1 1 0 0 0 1-1 l1-12"></path></svg>`
const chevron = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C3BBD2" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6 L15 12 L9 18"></path></svg>`
const lockBig = `<svg width="40" height="46" viewBox="0 0 40 46"><path d="M11,20 V14 a9,9 0 0 1 18,0 V20" fill="none" stroke="#A98CFF" stroke-width="4.5" stroke-linecap="round"></path><rect x="6" y="19" width="28" height="22" rx="7" fill="#A98CFF"></rect><circle cx="20" cy="28" r="3.6" fill="#fff"></circle><rect x="18.3" y="29" width="3.4" height="8" rx="1.6" fill="#fff"></rect></svg>`

const card = { background: 'var(--card)', borderRadius: 22, padding: '13px 16px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 6px 16px -12px rgba(74,58,102,.3)' }
const iconBox = (bg) => ({ width: 42, height: 42, borderRadius: 14, background: bg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' })
const sectionTitle = { fontSize: 13, fontWeight: 700, color: 'var(--ink2)', textTransform: 'uppercase', letterSpacing: '.04em', margin: '4px 4px 0' }

const SCREEN_OPTIONS = [15, 30, 45, 60, 0] // 0 = illimité
const fmtTime = (t) => (t === 0 ? 'Illimité' : `${t} min`)

function Toggle({ on }) {
  return (
    <span style={{ width: 46, height: 27, borderRadius: 14, background: on ? 'var(--mint)' : 'var(--track-off)', position: 'relative', flex: 'none', transition: 'background .2s ease' }}>
      <span style={{ position: 'absolute', top: 3, left: on ? 22 : 3, width: 21, height: 21, borderRadius: '50%', background: 'var(--knob)', transition: 'left .2s ease' }} />
    </span>
  )
}

const backspaceIcon = `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#7d5fc4" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 5 H8 L3 12 L8 19 H21 Z"></path><path d="M12 9.5 L17 14.5 M17 9.5 L12 14.5"></path></svg>`

// Porte parentale : code PIN à 4 chiffres, défini par le parent au 1er accès.
function ParentGate({ onUnlock, onBack }) {
  const stored = load('parentPin', null)
  const [entered, setEntered] = useState('')
  const [step, setStep] = useState(stored ? 'enter' : 'create') // create -> confirm, ou enter
  const [firstPin, setFirstPin] = useState('')
  const [error, setError] = useState('')

  const titles = { create: 'Crée ton code parent', confirm: 'Confirme ton code', enter: 'Entre ton code parent' }
  const subtitles = {
    create: 'Choisis un code à 4 chiffres. Les enfants ne doivent pas le connaître.',
    confirm: 'Saisis-le une deuxième fois pour vérifier.',
    enter: 'Réservé aux grands 🔒',
  }

  function submit(code) {
    if (step === 'create') {
      setFirstPin(code); setEntered(''); setStep('confirm')
    } else if (step === 'confirm') {
      if (code === firstPin) { save('parentPin', code); onUnlock() }
      else { setError('Les codes ne correspondent pas, recommence.'); setEntered(''); setFirstPin(''); setStep('create') }
    } else {
      if (code === stored) onUnlock()
      else { setError('Code incorrect, réessaie.'); setEntered('') }
    }
  }
  function press(d) {
    if (entered.length >= 4) return
    const next = entered + d
    setError(''); setEntered(next)
    if (next.length === 4) setTimeout(() => submit(next), 130)
  }
  function del() { setError(''); setEntered((e) => e.slice(0, -1)) }
  function forgot() {
    if (window.confirm('Réinitialiser le code parent ? Tu devras en choisir un nouveau.')) {
      save('parentPin', null); setStep('create'); setEntered(''); setFirstPin(''); setError('')
    }
  }

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del']
  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--bg)', position: 'relative', overflow: 'hidden', animation: 'gn-fadein .35s ease', paddingTop: 'calc(env(safe-area-inset-top, 14px) + 16px)' }}>
      <div style={{ padding: '6px 24px 0', flex: 'none' }}><BackButton onClick={onBack} /></div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 32px', textAlign: 'center' }}>
        <RawSvg html={lockBig} />
        <div style={{ fontSize: 24, fontWeight: 700, marginTop: 14 }}>{titles[step]}</div>
        <div style={{ fontSize: 14, color: 'var(--ink2)', fontWeight: 500, lineHeight: 1.45, marginTop: 8, maxWidth: 300 }}>{subtitles[step]}</div>
        <div style={{ display: 'flex', gap: 16, marginTop: 26 }}>
          {[0, 1, 2, 3].map((i) => (
            <span key={i} style={{ width: 18, height: 18, borderRadius: '50%', background: i < entered.length ? 'var(--violet)' : 'var(--track-off)', transition: 'background .15s ease' }} />
          ))}
        </div>
        <div style={{ minHeight: 22, marginTop: 14 }}>{error && <div style={{ fontSize: 14, color: '#C24A7A', fontWeight: 600 }}>{error}</div>}</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 72px)', gap: 14, marginTop: 4 }}>
          {keys.map((k, i) => {
            if (k === '') return <span key={i} />
            if (k === 'del') return <button key={i} onClick={del} style={{ width: 72, height: 72, borderRadius: 24, background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><RawSvg html={backspaceIcon} /></button>
            return <button key={i} onClick={() => press(k)} style={{ width: 72, height: 72, borderRadius: 24, background: 'var(--card)', fontSize: 26, fontWeight: 700, color: 'var(--ink)', boxShadow: '0 8px 18px -12px rgba(74,58,102,.35)' }}>{k}</button>
          })}
        </div>
        {step === 'enter' && <button onClick={forgot} style={{ marginTop: 22, fontSize: 13, fontWeight: 600, color: 'var(--ink2)', background: 'none' }}>Code oublié&nbsp;?</button>}
      </div>
    </div>
  )
}

export default function EspaceParents({ screenTime = 30, onScreenTime, usedMin = 0, voiceOn = true, onToggleVoice, effectsOn = true, onToggleEffects, musicOn = true, onToggleMusic, allowPublish = true, onToggleAllowPublish, reminder = { on: false, time: '20:00' }, onToggleReminder, onReminderTime, premium, onSubscribe, onLegal, onResetData, onBack }) {
  const [unlocked, setUnlocked] = useState(false)
  if (!unlocked) return <ParentGate onUnlock={() => setUnlocked(true)} onBack={onBack} />

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--bg)', position: 'relative', overflow: 'hidden', animation: 'gn-fadein .35s ease', paddingTop: 'calc(env(safe-area-inset-top, 14px) + 16px)' }}>
      <div style={{ padding: '6px 24px 0', display: 'flex', alignItems: 'center', gap: 14, flex: 'none' }}>
        <BackButton onClick={onBack} />
        <div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>Espace parents</div>
          <div style={{ fontSize: 13, color: 'var(--ink2)', fontWeight: 500 }}>Contrôles &amp; sécurité</div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 24px calc(env(safe-area-inset-bottom, 0px) + 20px)', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Temps d'écran */}
        <div style={sectionTitle}>Temps d'écran</div>
        <div style={{ background: 'var(--card)', borderRadius: 22, padding: '14px 16px', boxShadow: '0 6px 16px -12px rgba(74,58,102,.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={iconBox('var(--sky-soft)')}><RawSvg html={clockIcon} /></span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 600 }}>Limite quotidienne</div>
              <div style={{ fontSize: 13, color: 'var(--ink2)', fontWeight: 500 }}>{screenTime === 0 ? 'Aucune limite' : `${screenTime} minutes par jour`}</div>
            </div>
            {screenTime > 0 && (
              <span style={{ fontSize: 12, fontWeight: 700, color: usedMin >= screenTime ? '#C24A7A' : '#1f9e7a', background: usedMin >= screenTime ? 'var(--pink-soft)' : 'var(--mint-soft)', padding: '5px 10px', borderRadius: 14, whiteSpace: 'nowrap' }}>{usedMin} min aujourd'hui</span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
            {SCREEN_OPTIONS.map((t) => {
              const active = screenTime === t
              return (
                <button key={t} onClick={() => onScreenTime(t)} style={{ background: active ? 'var(--sky)' : 'var(--card-soft)', color: active ? '#fff' : 'var(--ink2)', padding: '8px 14px', borderRadius: 16, fontSize: 14, fontWeight: 700 }}>{fmtTime(t)}</button>
              )
            })}
          </div>
        </div>

        {/* Audio — deux réglages séparés */}
        <div style={sectionTitle}>Audio</div>
        <button onClick={onToggleVoice} style={{ ...card, width: '100%', textAlign: 'left' }}>
          <span style={iconBox('var(--violet-soft)')}><RawSvg html={voiceIcon} /></span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 600 }}>Voix de Grabi</div>
            <div style={{ fontSize: 12, color: 'var(--ink2)', fontWeight: 500 }}>Lecture audio des histoires</div>
          </div>
          <Toggle on={voiceOn} />
        </button>
        <button onClick={onToggleEffects} style={{ ...card, width: '100%', textAlign: 'left' }}>
          <span style={iconBox('var(--mint-soft)')}><RawSvg html={soundIcon} /></span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 600 }}>Sons &amp; effets</div>
            <div style={{ fontSize: 12, color: 'var(--ink2)', fontWeight: 500 }}>Bruitages et réactions de Grabi</div>
          </div>
          <Toggle on={effectsOn} />
        </button>
        <button onClick={onToggleMusic} style={{ ...card, width: '100%', textAlign: 'left' }}>
          <span style={iconBox('var(--pink-soft)')}><RawSvg html={musicIcon} /></span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 600 }}>Musique de fond</div>
            <div style={{ fontSize: 12, color: 'var(--ink2)', fontWeight: 500 }}>Ambiance douce en boucle</div>
          </div>
          <Toggle on={musicOn} />
        </button>

        {/* Confidentialité */}
        <div style={sectionTitle}>Confidentialité</div>
        <button onClick={onToggleAllowPublish} style={{ ...card, width: '100%', textAlign: 'left' }}>
          <span style={iconBox('var(--violet-soft)')}><RawSvg html={communityIcon} /></span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 600 }}>Publication communauté</div>
            <div style={{ fontSize: 12, color: 'var(--ink2)', fontWeight: 500 }}>{allowPublish ? "L'enfant peut publier ses histoires" : 'Publication bloquée'}</div>
          </div>
          <Toggle on={allowPublish} />
        </button>

        {/* Rappel */}
        <div style={sectionTitle}>Rappel</div>
        <div style={{ background: 'var(--card)', borderRadius: 22, padding: '13px 16px', boxShadow: '0 6px 16px -12px rgba(74,58,102,.3)' }}>
          <button onClick={onToggleReminder} style={{ display: 'flex', alignItems: 'center', gap: 14, width: '100%', textAlign: 'left' }}>
            <span style={iconBox('var(--yellow-soft)')}><RawSvg html={bellIcon} /></span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 600 }}>Histoire du soir</div>
              <div style={{ fontSize: 12, color: 'var(--ink2)', fontWeight: 500 }}>Un petit rappel pour lire ensemble</div>
            </div>
            <Toggle on={reminder.on} />
          </button>
          {reminder.on && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--card-soft)' }}>
              <span style={{ fontSize: 15, fontWeight: 600 }}>Heure du rappel</span>
              <input type="time" value={reminder.time} onChange={(e) => onReminderTime(e.target.value)} style={{ background: 'var(--card-soft)', border: 'none', borderRadius: 14, padding: '9px 14px', fontSize: 16, fontWeight: 700, fontFamily: 'inherit', color: 'var(--ink)' }} />
            </div>
          )}
        </div>

        {/* Compte */}
        <div style={sectionTitle}>Compte</div>
        <button onClick={onSubscribe} style={{ ...card, width: '100%', textAlign: 'left' }}>
          <span style={iconBox('var(--violet-soft)')}><RawSvg html={crownIcon} /></span>
          <div style={{ flex: 1, fontSize: 16, fontWeight: 600 }}>Abonnement &amp; achats</div>
          <span style={{ fontSize: 12, fontWeight: 700, color: premium ? '#a07d2a' : '#7d5fc4', background: premium ? 'var(--yellow-soft)' : 'var(--violet-soft)', padding: '5px 10px', borderRadius: 14 }}>{premium ? 'Premium' : 'Gratuit'}</span>
          <RawSvg html={chevron} />
        </button>
        <a href="mailto:bonjour@grabi.app" style={{ ...card, textDecoration: 'none', color: 'inherit' }}>
          <span style={iconBox('var(--pink-soft)')}><RawSvg html={helpIcon} /></span>
          <div style={{ flex: 1, fontSize: 16, fontWeight: 600 }}>Aide &amp; contact</div>
          <RawSvg html={chevron} />
        </a>
        <button onClick={onLegal} style={{ ...card, width: '100%', textAlign: 'left' }}>
          <span style={iconBox('var(--sky-soft)')}><RawSvg html={docIcon} /></span>
          <div style={{ flex: 1, fontSize: 16, fontWeight: 600 }}>Confidentialité &amp; CGU</div>
          <RawSvg html={chevron} />
        </button>

        {/* Données */}
        <div style={sectionTitle}>Données</div>
        <button onClick={onResetData} style={{ ...card, width: '100%', textAlign: 'left' }}>
          <span style={iconBox('var(--pink-soft)')}><RawSvg html={trashIcon} /></span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#C24A7A' }}>Réinitialiser l'application</div>
            <div style={{ fontSize: 12, color: 'var(--ink2)', fontWeight: 500 }}>Efface histoires &amp; réglages de cet appareil</div>
          </div>
        </button>

        <div style={{ fontSize: 11, color: 'var(--ink2)', fontWeight: 500, textAlign: 'center', padding: '6px 12px 0', lineHeight: 1.4 }}>Les données sont enregistrées uniquement sur cet appareil. Grabi v1.0</div>
      </div>
    </div>
  )
}

import { useState, useRef, useEffect } from 'react'
import Grabi from '../components/Grabi.jsx'
import RawSvg from '../components/RawSvg.jsx'
import { VOICE_SAMPLE } from '../lib/grabiCustom.js'
import { speak, ttsSupported, stopSpeak } from '../lib/tts.js'
import { VOICES, voiceSampleUrl } from '../lib/voices.js'
import AgeStepper from '../components/AgeStepper.jsx'

// Premier lancement : bienvenue -> comment ça marche -> prénom/âge -> voix -> (paywall).
// Chaque voix a SON moteur : l'aperçu utilise ce moteur -> ce qu'on entend = ce qu'on aura vraiment.

const playMini = `<svg width="15" height="15" viewBox="0 0 24 24" fill="#7d5fc4"><path d="M8 5 L19 12 L8 19 Z"></path></svg>`
const backIcon = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7d5fc4" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5 L8 12 L15 19"></path></svg>`

const STEPS_HOW = [
  { emoji: '💡', title: 'Raconte une idée', text: "Ton enfant décrit ce qu'il imagine : un dragon, une fusée, un doudou perdu…" },
  { emoji: '🎨', title: 'Grabi la dessine', text: 'Une histoire illustrée, douce et rassurante, apparaît en quelques instants.' },
  { emoji: '🌙', title: 'Vous l\'écoutez ensemble', text: 'Une jolie voix la raconte, avec une musique douce pour s\'endormir.' },
]

const primaryBtn ={ width: '100%', background: 'var(--violet)', color: '#fff', borderRadius: 26, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, boxShadow: '0 14px 28px -10px rgba(169,140,255,.7)' }

export default function Onboarding({ voice = 'Aria', onVoice, onFinish, backRef }) {
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [age, setAge] = useState(5)
  const [previewing, setPreviewing] = useState('')
  const audioRef = useRef(null)

  // Coupe tout aperçu de voix en quittant l'écran ou en changeant d'étape.
  useEffect(() => () => { if (audioRef.current) audioRef.current.pause(); stopSpeak() }, [])
  const stopPreview = () => { if (audioRef.current) { audioRef.current.pause(); audioRef.current = null } stopSpeak(); setPreviewing('') }

  // Précharge les 4 extraits EMBARQUÉS (public/voices) dès l'ouverture -> lecture instantanée.
  useEffect(() => {
    VOICES.forEach(({ key }) => { fetch(voiceSampleUrl(key)).catch(() => {}) })
  }, [])

  // Aperçu de la voix : joue l'extrait embarqué (instantané, 0 crédit) ; repli voix navigateur.
  const testVoice = async (v) => {
    onVoice && onVoice(v)
    stopPreview()
    setPreviewing(v)
    try {
      const a = new Audio(voiceSampleUrl(v))
      audioRef.current = a
      a.onended = () => setPreviewing('')
      a.onerror = () => { setPreviewing(''); if (ttsSupported()) speak(VOICE_SAMPLE, v) }
      await a.play()
    } catch {
      setPreviewing('')
      if (ttsSupported()) speak(VOICE_SAMPLE, v)
    }
  }

  const TOTAL = 4
  const next = () => { stopPreview(); setStep((s) => Math.min(TOTAL - 1, s + 1)) }
  const back = () => { stopPreview(); setStep((s) => Math.max(0, s - 1)) }

  // Bouton retour Android : recule d'une étape tant qu'on n'est pas à la 1ère (sinon quitte).
  useEffect(() => {
    if (!backRef) return
    backRef.current = () => { if (step > 0) { back(); return true } return false }
    return () => { if (backRef) backRef.current = null }
  }, [step, backRef])
  const finish = () => { stopPreview(); onFinish && onFinish({ name: name.trim() || 'Mon enfant', age: `${age} ${age <= 1 ? 'an' : 'ans'}` }) }

  const Dots = () => (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: '4px 0 2px' }}>
      {Array.from({ length: TOTAL }).map((_, i) => (
        <span key={i} style={{ width: i === step ? 22 : 8, height: 8, borderRadius: 8, background: i === step ? 'var(--violet)' : 'var(--card-soft)', transition: 'width .2s ease, background .2s ease' }} />
      ))}
    </div>
  )

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--bg)', position: 'relative', overflow: 'hidden', animation: 'gn-fadein .35s ease', paddingTop: 'calc(env(safe-area-inset-top, 14px) + 14px)' }}>
      {/* Bulles décoratives */}
      <div style={{ position: 'absolute', top: -60, right: -50, width: 190, height: 190, borderRadius: '50%', background: 'var(--yellow-soft)', opacity: 0.5 }} />
      <div style={{ position: 'absolute', bottom: -70, left: -60, width: 200, height: 200, borderRadius: '50%', background: 'var(--violet-soft)', opacity: 0.5 }} />

      {/* Barre du haut : retour (dès l'étape 1) + points de progression */}
      <div style={{ flex: 'none', display: 'flex', alignItems: 'center', gap: 10, padding: '2px 20px 6px', position: 'relative', zIndex: 2 }}>
        <button onClick={back} aria-label="Retour" style={{ width: 42, height: 42, borderRadius: '50%', background: step > 0 ? 'var(--card)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: step > 0 ? '0 4px 12px rgba(74,58,102,.12)' : 'none', visibility: step > 0 ? 'visible' : 'hidden' }}><RawSvg html={backIcon} /></button>
      </div>

      {/* Contenu de l'étape */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 26px 10px', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 2 }}>
        {step === 0 && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 8 }}>
            <div style={{ animation: 'gn-float 3s ease-in-out infinite' }}><Grabi size={150} /></div>
            <div style={{ fontSize: 30, fontWeight: 800, marginTop: 10 }}>Bienvenue dans Grabi&nbsp;💜</div>
            <div style={{ fontSize: 16.5, color: 'var(--ink2)', fontWeight: 500, lineHeight: 1.5, maxWidth: 320, marginTop: 4 }}>Des histoires du soir magiques, inventées rien que pour ton enfant — illustrées et racontées à voix haute.</div>
          </div>
        )}

        {step === 1 && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14 }}>
            <div style={{ fontSize: 26, fontWeight: 800, textAlign: 'center', marginBottom: 8 }}>Comment ça marche&nbsp;?</div>
            {STEPS_HOW.map((s) => (
              <div key={s.title} style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'var(--card)', borderRadius: 24, padding: '16px 18px', boxShadow: '0 8px 20px -14px rgba(74,58,102,.3)' }}>
                <div style={{ width: 54, height: 54, borderRadius: 18, background: 'var(--violet-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flex: 'none' }}>{s.emoji}</div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 17, fontWeight: 700 }}>{s.title}</div>
                  <div style={{ fontSize: 13.5, color: 'var(--ink2)', fontWeight: 500, lineHeight: 1.4, marginTop: 2 }}>{s.text}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {step === 2 && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 20 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center' }}><div style={{ width: 100, height: 100, borderRadius: '50%', background: 'var(--violet-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}><Grabi size={86} /></div></div>
              <div style={{ fontSize: 25, fontWeight: 800, marginTop: 14 }}>Qui va écouter&nbsp;?</div>
              <div style={{ fontSize: 14, color: 'var(--ink2)', fontWeight: 500, marginTop: 4 }}>Grabi personnalise chaque histoire.</div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--ink2)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 8, marginLeft: 4 }}>Prénom de l'enfant</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={20}
                placeholder="Son prénom"
                autoFocus
                style={{ width: '100%', background: 'var(--card)', border: '2px solid var(--card-border)', borderRadius: 20, padding: '15px 18px', fontSize: 18, fontWeight: 600, color: 'var(--ink)', outline: 'none', boxShadow: '0 6px 16px -12px rgba(74,58,102,.3)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--ink2)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 16, marginLeft: 4, textAlign: 'center' }}>Âge de l'enfant</label>
              <AgeStepper age={age} setAge={setAge} />
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 25, fontWeight: 800 }}>Choisis la voix de Grabi</div>
              <div style={{ fontSize: 14, color: 'var(--ink2)', fontWeight: 500, marginTop: 4 }}>Touche une voix pour l'écouter. Tu pourras la changer plus tard.</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {VOICES.map((v) => {
                const active = voice === v.key
                return (
                  <button key={v.key} onClick={() => testVoice(v.key)} style={{ display: 'flex', alignItems: 'center', gap: 13, background: active ? 'var(--violet-soft)' : 'var(--card)', borderRadius: 20, padding: '13px 15px', textAlign: 'left', border: active ? '2px solid var(--violet)' : '2px solid transparent', boxShadow: '0 6px 16px -12px rgba(74,58,102,.3)' }}>
                    <span style={{ fontSize: 26, flex: 'none' }}>{v.emoji}</span>
                    <span style={{ flex: 1 }}>
                      <span style={{ display: 'block', fontSize: 17, fontWeight: 700 }}>{v.label} <span style={{ fontSize: 13, color: 'var(--ink2)' }}>{v.genre === 'f' ? '♀' : '♂'}</span></span>
                      <span style={{ display: 'block', fontSize: 12.5, color: 'var(--ink2)', fontWeight: 500 }}>{v.desc}</span>
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'var(--card)', borderRadius: 14, padding: '7px 12px', fontSize: 12, fontWeight: 700, color: 'var(--ink)', flex: 'none', minWidth: 78, justifyContent: 'center' }}>{previewing === v.key ? '🎙️…' : (<><RawSvg html={playMini} />Écouter</>)}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bas : progression + bouton d'action */}
      <div style={{ flex: 'none', padding: '6px 26px calc(env(safe-area-inset-bottom, 0px) + 20px)', position: 'relative', zIndex: 2 }}>
        <Dots />
        <button onClick={step < TOTAL - 1 ? next : finish} style={{ ...primaryBtn, marginTop: 12 }}>
          {step === 0 ? "C'est parti ✨" : step < TOTAL - 1 ? 'Suivant' : 'Continuer'}
        </button>
      </div>
    </div>
  )
}

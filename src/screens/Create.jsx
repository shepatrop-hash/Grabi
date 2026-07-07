import { useState, useRef, useEffect } from 'react'
import { Capacitor } from '@capacitor/core'
import Grabi from '../components/Grabi.jsx'
import RawSvg from '../components/RawSvg.jsx'

const backIcon = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4A3A66" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5 L8 12 L15 19"></path></svg>`
const micIcon = `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="3" width="6" height="11" rx="3"></rect><path d="M5 11 a7 7 0 0 0 14 0"></path><path d="M12 18 V21 M8.5 21 H15.5"></path></svg>`

// Reconnaissance vocale du navigateur (gratuite). Absente sur Firefox ET dans la WebView Android.
const SR = typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : null
// Sur l'app native (WebView Android), l'API Web Speech n'existe pas → on passe par le plugin natif.
const IS_NATIVE = Capacitor.isNativePlatform()
const MIC_OK = IS_NATIVE || !!SR

const CHIPS = [
  { label: '🦄 Une licorne', bg: 'var(--sky-soft)', text: 'Une licorne magique' },
  { label: '🤖 Un robot rigolo', bg: 'var(--mint-soft)', text: 'Un robot rigolo' },
  { label: '🏰 Un château magique', bg: 'var(--pink-soft)', text: 'Un château magique' },
  { label: '🐙 Une pieuvre musicienne', bg: 'var(--yellow-soft)', text: 'Une pieuvre musicienne' },
]

export default function Create({ storyText, setStoryText, onBack, onCreate, busy, error }) {
  const disabled = busy || !storyText.trim()
  const [listening, setListening] = useState(false)
  const recRef = useRef(null)
  const baseRef = useRef('') // texte déjà présent avant la dictée (pour AJOUTER, pas remplacer)
  const nativeRef = useRef(null) // module du plugin natif Capacitor

  const applyTranscript = (txt) => setStoryText((baseRef.current + txt).replace(/\s{2,}/g, ' ').slice(0, 300))

  async function stopMic() {
    try { if (recRef.current) recRef.current.stop() } catch {}
    try { if (nativeRef.current) { await nativeRef.current.stop(); await nativeRef.current.removeAllListeners() } } catch {}
    recRef.current = null
    setListening(false)
  }

  // Coupe le micro si on quitte l'écran.
  useEffect(() => () => { stopMic() }, [])

  // Micro NATIF (app Android : la WebView ne gère pas l'API Web Speech).
  async function startNative() {
    try {
      const { SpeechRecognition } = await import('@capacitor-community/speech-recognition')
      nativeRef.current = SpeechRecognition
      const perm = await SpeechRecognition.requestPermissions().catch(() => null)
      if (perm && perm.speechRecognition && perm.speechRecognition !== 'granted') return
      await SpeechRecognition.removeAllListeners().catch(() => {})
      baseRef.current = storyText ? storyText.trim() + ' ' : ''
      await SpeechRecognition.addListener('partialResults', (data) => {
        const txt = (data && data.matches && data.matches[0]) || ''
        if (txt) applyTranscript(txt)
      })
      await SpeechRecognition.addListener('listeningState', (data) => {
        if (data && data.status === 'stopped') setListening(false)
      })
      setListening(true)
      await SpeechRecognition.start({ language: 'fr-FR', maxResults: 2, partialResults: true, popup: false })
    } catch { setListening(false) }
  }

  // Micro WEB (navigateur : API Web Speech).
  function startWeb() {
    const rec = new SR()
    rec.lang = 'fr-FR'
    rec.continuous = true
    rec.interimResults = true
    baseRef.current = storyText ? storyText.trim() + ' ' : ''
    rec.onresult = (e) => { let txt = ''; for (let i = 0; i < e.results.length; i++) txt += e.results[i][0].transcript; applyTranscript(txt) }
    rec.onend = () => setListening(false)
    rec.onerror = () => setListening(false)
    recRef.current = rec
    try { rec.start(); setListening(true) } catch { setListening(false) }
  }

  const toggleMic = () => {
    if (listening) { stopMic(); return }
    if (IS_NATIVE) startNative()
    else if (SR) startWeb()
  }

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--bg)', position: 'relative', overflow: 'hidden', animation: 'gn-fadein .35s ease', paddingTop: 'env(safe-area-inset-top, 14px)' }}>
      <div style={{ position: 'absolute', bottom: -50, right: -50, width: 200, height: 200, borderRadius: '50%', background: 'var(--violet-soft)', opacity: 0.6 }} />

      <div style={{ padding: '12px 24px 0', display: 'flex', alignItems: 'center', gap: 14, position: 'relative', zIndex: 2 }}>
        <button onClick={onBack} style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--card)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 14px rgba(74,58,102,.12)', flex: 'none' }}>
          <RawSvg html={backIcon} />
        </button>
        <div style={{ fontSize: 26, fontWeight: 700 }}>Crée ton histoire</div>
      </div>

      <div style={{ textAlign: 'center', padding: '12px 24px 0', position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'inline-block', background: 'var(--card)', borderRadius: '22px 22px 22px 4px', padding: '12px 18px', fontSize: 17, fontWeight: 600, boxShadow: '0 8px 18px rgba(74,58,102,.12)', marginBottom: 4 }}>Raconte-moi une idée&nbsp;! {MIC_OK ? 'Tape ou parle 🎙️' : ''}</div>
        <div style={{ display: 'flex', justifyContent: 'center' }}><Grabi size={92} /></div>
      </div>

      <div style={{ padding: '10px 24px 0', position: 'relative', zIndex: 2 }}>
        <div style={{ background: 'var(--card)', border: '3px dashed #E3B8D4', borderRadius: 28, padding: '16px 16px 16px 22px', minHeight: 112, display: 'flex', alignItems: 'center', gap: 12 }}>
          <input
            value={storyText}
            onChange={(e) => setStoryText(e.target.value)}
            placeholder="Un dragon qui adore les crêpes…"
            style={{ flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'Fredoka, sans-serif', fontSize: 21, fontWeight: 500, color: 'var(--ink)', lineHeight: 1.4 }}
          />
          {MIC_OK && (
            <button
              onClick={toggleMic}
              aria-label={listening ? 'Arrêter le micro' : 'Dicter au micro'}
              style={{ flex: 'none', width: 58, height: 58, borderRadius: '50%', background: listening ? '#FF5C7A' : 'linear-gradient(135deg,#A98CFF,#7C6FE0)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: listening ? '0 0 0 7px rgba(255,92,122,.22)' : '0 8px 18px -6px rgba(124,111,224,.6)', animation: listening ? 'gn-pulse 1.1s ease-in-out infinite' : 'none', transition: 'background .2s ease' }}
            >
              <RawSvg html={micIcon} />
            </button>
          )}
        </div>
        {listening && (
          <div style={{ textAlign: 'center', fontSize: 14, color: '#C24A7A', fontWeight: 700, marginTop: 12 }}>🎙️ Je t'écoute… parle&nbsp;! (appuie à nouveau pour arrêter)</div>
        )}
      </div>

      <div style={{ padding: '16px 24px 0', position: 'relative', zIndex: 2 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink2)', marginBottom: 12 }}>Ou pioche une idée&nbsp;:</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {CHIPS.map((c) => (
            <button key={c.label} onClick={() => setStoryText(c.text)} style={{ background: c.bg, padding: '11px 16px', borderRadius: 20, fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div style={{ margin: '14px 24px 0', color: '#b5527e', fontSize: 13, fontWeight: 600, lineHeight: 1.4, position: 'relative', zIndex: 2 }}>{error}</div>
      )}

      <button
        onClick={onCreate}
        disabled={disabled}
        style={{ width: '100%', marginTop: 'auto', padding: '14px 24px calc(26px + env(safe-area-inset-bottom, 0px))', position: 'relative', zIndex: 2, opacity: disabled ? 0.6 : 1 }}
      >
        <div style={{ background: 'linear-gradient(135deg,#FFD23F,#FF7FB0)', color: '#fff', borderRadius: 30, height: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontSize: 21, fontWeight: 700, boxShadow: '0 16px 30px -10px rgba(255,127,176,.7)' }}>
          {busy ? 'Grabi dessine…' : 'Crée mon histoire ✨'}
        </div>
      </button>
    </div>
  )
}

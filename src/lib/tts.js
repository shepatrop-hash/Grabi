// Lecture audio des histoires via l'API Web Speech (intégrée au navigateur,
// gratuite et hors-ligne). Chaque "voix de Grabi" = un réglage débit/hauteur.
const PRESETS = {
  Douce: { rate: 0.92, pitch: 1.05 },
  Rigolote: { rate: 1.12, pitch: 1.45 },
  Magique: { rate: 0.96, pitch: 1.28 },
  Robot: { rate: 0.82, pitch: 0.5 },
}

export function ttsSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

let frVoice = null
function pickVoice() {
  if (!ttsSupported()) return null
  const voices = window.speechSynthesis.getVoices()
  frVoice = voices.find((v) => /^fr/i.test(v.lang)) || voices[0] || null
  return frVoice
}
if (ttsSupported()) {
  pickVoice()
  // Les voix se chargent de façon asynchrone sur certains navigateurs.
  window.speechSynthesis.onvoiceschanged = pickVoice
}

// Lit un texte. onend est appelé à la fin (utile pour enchaîner les pages).
export function speak(text, voiceName, { onend } = {}) {
  if (!ttsSupported() || !text) {
    onend && onend()
    return
  }
  const synth = window.speechSynthesis
  synth.cancel()
  const u = new SpeechSynthesisUtterance(text)
  const preset = PRESETS[voiceName] || PRESETS.Douce
  u.lang = 'fr-FR'
  u.rate = preset.rate
  u.pitch = preset.pitch
  const v = frVoice || pickVoice()
  if (v) u.voice = v
  if (onend) u.onend = onend
  synth.speak(u)
}

export function stopSpeak() {
  if (ttsSupported()) window.speechSynthesis.cancel()
}

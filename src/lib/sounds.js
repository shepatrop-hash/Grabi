// Sons de l'app : petits bruits mignons de Grabi (onomatopées) + mapping des
// musiques de fond en boucle. Les fichiers sont pré-générés (ElevenLabs SFX) et
// servis depuis /public (lecture instantanée, 0 crédit à l'usage).

const GRABI_SOUNDS = [
  '/sfx/grabi-1.mp3',
  '/sfx/grabi-2.mp3',
  '/sfx/grabi-3.mp3',
  '/sfx/grabi-4.mp3',
  '/sfx/grabi-5.mp3',
]

// Activation des effets (bruits Grabi), pilotée par le réglage « effectsOn » de l'app.
let effectsEnabled = true
export function setEffectsEnabled(v) {
  effectsEnabled = !!v
}

let lastIdx = -1
// Joue un petit bruit mignon de Grabi au hasard (évite de répéter le même).
export function playGrabiSound() {
  if (!effectsEnabled) return
  try {
    let i = Math.floor(Math.random() * GRABI_SOUNDS.length)
    if (i === lastIdx) i = (i + 1) % GRABI_SOUNDS.length
    lastIdx = i
    const a = new Audio(GRABI_SOUNDS[i])
    a.volume = 0.75
    a.play().catch(() => {})
  } catch {
    /* ignore */
  }
}

// Musiques de fond en boucle : 'app' (fond par défaut) + une par humeur d'histoire.
export const MUSIC = {
  app: '/music/app.mp3',
  cozy: '/music/mood-cozy.mp3',
  dreamy: '/music/mood-dreamy.mp3',
  adventure: '/music/mood-adventure.mp3',
  funny: '/music/mood-funny.mp3',
  calm: '/music/mood-calm.mp3',
}

// Renvoie la piste de fond pour une humeur donnée (repli sur la musique de l'app).
export function musicFor(mood) {
  return MUSIC[mood] || MUSIC.app
}

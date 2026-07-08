// Les 4 voix de narration. CHAQUE voix est liée à UN moteur :
// - engine 'gemini'  -> narration Gemini (moins cher : ~0,04 € vs ~0,22 € ElevenLabs).
// - engine 'eleven'  -> narration ElevenLabs (repli Gemini automatique si crédits épuisés).
// Le moteur suit le choix de voix : une famille qui prend une voix Gemini = narration Gemini
// = économie. Voix par défaut = Gemini (Aria) pour que « ne rien changer » reste économique.
// NB : la clé 'Douce' est conservée (voix féminine ElevenLabs) -> compat des audios déjà bakés.
export const VOICES = [
  { key: 'Aria', genre: 'f', engine: 'gemini', emoji: '🌸', label: 'Aria', desc: 'Douce et féérique' },
  { key: 'Douce', genre: 'f', engine: 'eleven', emoji: '🌙', label: 'Douce', desc: 'Tendre et posée' },
  { key: 'Malo', genre: 'm', engine: 'gemini', emoji: '🐥', label: 'Malo', desc: 'Rigolote et vive' },
  { key: 'Noe', genre: 'm', engine: 'eleven', emoji: '🧸', label: 'Noé', desc: 'Chaleureuse et calme' },
]

export const VOICE_KEYS = VOICES.map((v) => v.key)
export const DEFAULT_VOICE = 'Aria' // Gemini par défaut (économies)

// Moteur d'une voix ('gemini' | 'eleven'). Voix inconnue -> gemini (le moins cher).
export const engineOf = (key) => (VOICES.find((v) => v.key === key)?.engine || 'gemini')

// Ramène une voix stockée vers une voix valide (migration des anciennes Rigolote/Magique/Robot).
export const normalizeVoice = (key) => (VOICE_KEYS.includes(key) ? key : (key === 'Rigolote' || key === 'Robot' ? 'Malo' : key === 'Magique' ? 'Aria' : 'Douce'))

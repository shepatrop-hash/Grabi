// Personnalisation de Grabi (apparence) partagée entre l'écran « Mon Grabi »
// (dans les Paramètres) et l'écran compagnon. Une seule source de vérité pour
// les calques SVG des accessoires, afin que les deux écrans restent cohérents.

// Calques SVG superposés à la mascotte (viewBox 0 0 200 200), repris du design.
export const ACC_SVG = {
  glasses: `<g><circle cx="74" cy="96" r="22" fill="rgba(120,180,220,0.18)" stroke="#3B2D5A" stroke-width="5"></circle><circle cx="126" cy="96" r="22" fill="rgba(120,180,220,0.18)" stroke="#3B2D5A" stroke-width="5"></circle><path d="M96,93 q4,-4 8,0" fill="none" stroke="#3B2D5A" stroke-width="5" stroke-linecap="round"></path><path d="M52,92 L41,86" stroke="#3B2D5A" stroke-width="5" stroke-linecap="round"></path><path d="M148,92 L159,86" stroke="#3B2D5A" stroke-width="5" stroke-linecap="round"></path></g>`,
  scarf: `<g><path d="M56,166 Q100,150 144,166 Q150,176 142,184 Q100,166 58,184 Q50,176 56,166 Z" fill="#FF6FA6"></path><path d="M120,178 q16,6 14,28 q-2,8 -12,8 q-8,-2 -8,-10 q4,-14 -2,-24 z" fill="#E85C95"></path><path d="M70,170 L72,180 M88,166 L90,178 M108,166 L110,178 M128,170 L130,180" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".4"></path></g>`,
  bow: `<g transform="translate(150,38)"><path d="M0,0 L-20,-13 L-20,13 Z" fill="#FF8FB6"></path><path d="M0,0 L20,-13 L20,13 Z" fill="#FF8FB6"></path><circle cx="0" cy="0" r="6" fill="#E85C95"></circle></g>`,
  hat: `<g transform="rotate(-8 110 18)"><path d="M82,40 L116,-14 L140,36 Z" fill="#FF8FB6"></path><path d="M99,12 L121,8 M91,28 L131,24" stroke="#FFE08A" stroke-width="5" stroke-linecap="round"></path><ellipse cx="111" cy="37" rx="33" ry="7" fill="#9B7BF0"></ellipse><circle cx="116" cy="-16" r="8" fill="#FFCC3E"></circle></g>`,
  crown: `<g><path d="M62,44 L70,18 L86,36 L100,14 L114,36 L130,18 L138,44 Z" fill="#FFCC3E" stroke="#E0A92E" stroke-width="2.5" stroke-linejoin="round"></path><rect x="60" y="42" width="80" height="8" rx="4" fill="#E0A92E"></rect><circle cx="70" cy="18" r="4" fill="#FF7FB0"></circle><circle cx="100" cy="14" r="4.5" fill="#FF6FA6"></circle><circle cx="130" cy="18" r="4" fill="#FF7FB0"></circle></g>`,
  cape: `<g><path d="M52,150 Q100,138 148,150 L158,196 Q100,182 42,196 Z" fill="#7FB3FF"></path><path d="M52,150 Q100,138 148,150 L146,159 Q100,148 54,159 Z" fill="#5E97E8"></path></g>`,
  balloon: `<g><path d="M160,55 L160,92" stroke="#C9A9B9" stroke-width="1.6"></path><path d="M156.5,55 L163.5,55 L160,61 Z" fill="#E85C95"></path><ellipse cx="160" cy="34" rx="17" ry="21" fill="#FF6FA6"></ellipse><ellipse cx="154" cy="28" rx="4" ry="6" fill="#fff" opacity=".5"></ellipse></g>`,
}

export const ACCESSORIES = [
  { key: 'hat', emoji: '🎩', label: 'Chapeau' },
  { key: 'crown', emoji: '👑', label: 'Couronne' },
  { key: 'scarf', emoji: '🧣', label: 'Écharpe' },
  { key: 'glasses', emoji: '🕶️', label: 'Lunettes' },
  { key: 'bow', emoji: '🎀', label: 'Nœud' },
  { key: 'cape', emoji: '🦸', label: 'Cape' },
  { key: 'balloon', emoji: '🎈', label: 'Ballon' },
]

export const DEFAULT_ACC = { hat: false, crown: false, scarf: false, glasses: false, bow: false, cape: false, balloon: false }

// Ordre d'empilement (du plus en arrière au plus en avant) pour un rendu stable.
const LAYER_ORDER = ['cape', 'scarf', 'hat', 'crown', 'glasses', 'bow', 'balloon']

// Construit la chaîne SVG des accessoires actifs (à insérer dans un <svg> 0 0 200 200).
export function accOverlay(acc = {}) {
  return LAYER_ORDER.filter((k) => acc[k] && ACC_SVG[k])
    .map((k) => ACC_SVG[k])
    .join('')
}

// Décors : « chambre » de Grabi (fond derrière la mascotte dans Mon Grabi et le compagnon).
export const DECORS = [
  { key: 'none', label: 'Aucun', emoji: '🤍', bg: 'transparent', dark: false },
  { key: 'prairie', label: 'Prairie', emoji: '🌳', bg: 'linear-gradient(180deg,#DAF6E6 0%,#AEE9C9 100%)', dark: false },
  { key: 'plage', label: 'Plage', emoji: '🏖️', bg: 'linear-gradient(180deg,#C8EDFF 0%,#FFE7C2 100%)', dark: false },
  { key: 'nuit', label: 'Nuit', emoji: '🌙', bg: 'linear-gradient(180deg,#3A2D5A 0%,#5B4A86 100%)', dark: true },
  { key: 'espace', label: 'Espace', emoji: '🚀', bg: 'linear-gradient(180deg,#1C1B3A 0%,#3A2D6A 100%)', dark: true },
]
export const DEFAULT_DECOR = 'none'
export function getDecor(key) {
  return DECORS.find((d) => d.key === key) || DECORS[0]
}

// Aperçu des voix : ce que Grabi dit quand on teste une voix.
export const VOICE_SAMPLE = "Coucou, c'est moi Grabi ! On lit une jolie histoire ensemble ?"

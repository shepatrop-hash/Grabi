// Personnalisation de Grabi (apparence) partagée entre l'écran « Mon Grabi »
// (dans les Paramètres) et l'écran compagnon. Une seule source de vérité pour
// les calques SVG des accessoires, afin que les deux écrans restent cohérents.

// Calques SVG superposés à la mascotte (viewBox 0 0 200 200), repris du design.
export const ACC_SVG = {
  glasses: `<g><circle cx="74" cy="96" r="22" fill="rgba(120,180,220,0.18)" stroke="#3B2D5A" stroke-width="5"></circle><circle cx="126" cy="96" r="22" fill="rgba(120,180,220,0.18)" stroke="#3B2D5A" stroke-width="5"></circle><path d="M96,93 q4,-4 8,0" fill="none" stroke="#3B2D5A" stroke-width="5" stroke-linecap="round"></path><path d="M52,92 L41,86" stroke="#3B2D5A" stroke-width="5" stroke-linecap="round"></path><path d="M148,92 L159,86" stroke="#3B2D5A" stroke-width="5" stroke-linecap="round"></path></g>`,
  scarf: `<g><path d="M56,166 Q100,150 144,166 Q150,176 142,184 Q100,166 58,184 Q50,176 56,166 Z" fill="#FF6FA6"></path><path d="M120,178 q16,6 14,28 q-2,8 -12,8 q-8,-2 -8,-10 q4,-14 -2,-24 z" fill="#E85C95"></path><path d="M70,170 L72,180 M88,166 L90,178 M108,166 L110,178 M128,170 L130,180" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".4"></path></g>`,
  bow: `<g transform="translate(150,38)"><path d="M0,0 L-20,-13 L-20,13 Z" fill="#FF8FB6"></path><path d="M0,0 L20,-13 L20,13 Z" fill="#FF8FB6"></path><circle cx="0" cy="0" r="6" fill="#E85C95"></circle></g>`,
  hat: `<g transform="rotate(-8 110 18)"><path d="M82,40 L116,-14 L140,36 Z" fill="#FF8FB6"></path><path d="M99,12 L121,8 M91,28 L131,24" stroke="#FFE08A" stroke-width="5" stroke-linecap="round"></path><ellipse cx="111" cy="37" rx="33" ry="7" fill="#9B7BF0"></ellipse><circle cx="116" cy="-16" r="8" fill="#FFCC3E"></circle></g>`,
}

export const ACCESSORIES = [
  { key: 'hat', emoji: '🎩', label: 'Chapeau' },
  { key: 'scarf', emoji: '🧣', label: 'Écharpe' },
  { key: 'glasses', emoji: '🕶️', label: 'Lunettes' },
  { key: 'bow', emoji: '🎀', label: 'Nœud' },
]

export const DEFAULT_ACC = { hat: false, scarf: false, glasses: false, bow: false }

// Construit la chaîne SVG des accessoires actifs (à insérer dans un <svg> 0 0 200 200).
export function accOverlay(acc = {}) {
  return Object.entries(acc)
    .filter(([, on]) => on)
    .map(([k]) => ACC_SVG[k])
    .join('')
}

// Aperçu des voix : ce que Grabi dit quand on teste une voix.
export const VOICE_SAMPLE = "Coucou, c'est moi Grabi ! On lit une jolie histoire ensemble ?"

// Catégories d'histoires (Communauté + génération IA).
// Les catégories de CONTENU (une par histoire). L'IA en choisit une à la création,
// et l'enfant peut filtrer la Communauté par catégorie.
export const CATEGORIES = [
  { key: 'animaux', label: 'Animaux', emoji: '🐾' },
  { key: 'morale', label: 'Avec morale', emoji: '🦉' },
  { key: 'contes', label: 'Contes de fées', emoji: '🏰' },
  { key: 'fantastique', label: 'Fantastique', emoji: '🐉' },
  { key: 'amis', label: 'Meilleurs amis', emoji: '🤝' },
  { key: 'nature', label: 'Nature', emoji: '🌳' },
  { key: 'noel', label: 'Noël', emoji: '🎄' },
  { key: 'planetes', label: 'Planètes', emoji: '🪐' },
  { key: 'vilains', label: 'Vilains', emoji: '😈' },
  { key: 'vroom', label: 'Vroom', emoji: '🚗' },
]

export const CATEGORY_KEYS = CATEGORIES.map((c) => c.key)
export const catOf = (key) => CATEGORIES.find((c) => c.key === key) || null

// Filtres affichés en haut de la Communauté : 2 TRIS (populaire / tout nouveau)
// puis les catégories de contenu.
export const COMMUNITY_FILTERS = [
  { key: 'populaire', label: 'Populaire', emoji: '⭐', sort: true },
  { key: 'nouveau', label: 'Tout nouveau', emoji: '✨', sort: true },
  ...CATEGORIES,
]

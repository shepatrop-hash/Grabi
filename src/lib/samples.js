// Histoires intégrées. Les GRATUITES sont de vraies histoires générées (Claude + Fal),
// avec illustrations embarquées dans public/free/ (cf. scripts/gen-free-stories.mjs).
// Premium + communauté restent des exemples avec avatars SVG.
import freeStories from './free-stories.json'

const castle = `<svg width="92" height="92" viewBox="0 0 86 86"><ellipse cx="22" cy="64" rx="20" ry="9" fill="#fff" opacity=".85"></ellipse><ellipse cx="60" cy="66" rx="18" ry="8" fill="#fff" opacity=".85"></ellipse><rect x="28" y="30" width="30" height="30" rx="4" fill="#A98CFF"></rect><rect x="22" y="38" width="10" height="22" rx="3" fill="#BBA4FF"></rect><rect x="54" y="38" width="10" height="22" rx="3" fill="#BBA4FF"></rect><path d="M26,30 l6,-9 6,9 z M48,30 l6,-9 6,9 z" fill="#FF7FB0"></path><rect x="40" y="46" width="6" height="14" rx="3" fill="#fff"></rect><circle cx="43" cy="22" r="3" fill="#FFCC3E"></circle></svg>`
const whale = `<svg width="120" height="92" viewBox="0 0 150 100"><ellipse cx="70" cy="58" rx="50" ry="30" fill="#6FB7E0"></ellipse><path d="M116,46 L146,30 L146,74 Z" fill="#6FB7E0"></path><ellipse cx="62" cy="68" rx="34" ry="16" fill="#A9D9F0"></ellipse><circle cx="50" cy="50" r="4" fill="#274A5E"></circle><path d="M42,62 Q54,70 66,62" stroke="#274A5E" stroke-width="2.6" fill="none" stroke-linecap="round"></path><path d="M50,24 q-4,-10 3,-16" stroke="#A9D9F0" stroke-width="4.5" fill="none" stroke-linecap="round"></path><circle cx="52" cy="6" r="3.5" fill="#fff"></circle></svg>`
const robot = `<svg width="110" height="92" viewBox="0 0 120 100"><circle cx="60" cy="14" r="4" fill="#FF7FB0"></circle><line x1="60" y1="18" x2="60" y2="28" stroke="#B6A6D6" stroke-width="3"></line><rect x="34" y="28" width="52" height="46" rx="15" fill="#BFC2D6"></rect><circle cx="50" cy="48" r="7" fill="#fff"></circle><circle cx="70" cy="48" r="7" fill="#fff"></circle><circle cx="50" cy="49" r="3" fill="#3B2D5A"></circle><circle cx="70" cy="49" r="3" fill="#3B2D5A"></circle><path d="M52,62 Q60,68 68,62" stroke="#6E6A86" stroke-width="2.6" fill="none" stroke-linecap="round"></path><ellipse cx="100" cy="58" rx="6" ry="9" fill="#7FE0C4" transform="rotate(25 100 58)"></ellipse></svg>`

// Histoires gratuites : générées par les API (texte Claude + illustrations Fal),
// chaque page a son image dans public/free/. (id, title, sub, bg, cover, pages:[{text,image}])
// Humeur musicale par histoire (ordre : Flamby, Lyra, Doudou, Étincelle, Croco, souris).
const FREE_MOODS = ['funny', 'calm', 'cozy', 'dreamy', 'cozy', 'dreamy']
export const FREE_STORIES = freeStories.map((s, i) => ({ ...s, mood: s.mood || FREE_MOODS[i] || 'calm' }))

// Histoire premium de la semaine : la 1ère page est libre, la suite demande Premium.
export const WEEKLY_STORY = {
  id: 'weekly-chateau', title: 'Le château dans les nuages', bg: 'linear-gradient(160deg,#C7B4FF,#FFD6EA)', svg: castle,
  premium: true, freePages: 1, mood: 'dreamy',
  pages: [
    'Tout là-haut, au-dessus des nuages, se cachait un château argenté. Plume, la petite souris, poussa la grande porte dorée et entra sur la pointe des pattes…',
    'À l’intérieur, des centaines de bougies dansaient toutes seules dans les airs.',
    'Au sommet de la plus haute tour, un dragon endormi gardait un trésor… un trésor de doudous tout doux !',
    'Plume choisit le plus moelleux, fit un gros câlin au dragon, et rentra chez elle sur un rayon de lune.',
  ],
}

// Histoires de la communauté (graine). Les histoires publiées par l'enfant s'y ajoutent.
export const SEED_COMMUNITY = [
  {
    id: 'com-baleine', title: 'La baleine qui chante', author: 'par Maya, 6 ans', bg: 'var(--sky-soft)', svg: whale, smiles: 27, mood: 'calm',
    pages: [
      'Au fond de l’océan vivait une baleine qui chantait de jolies berceuses.',
      'Les petits poissons venaient de partout pour l’écouter, blottis les uns contre les autres.',
      'Et chaque soir, toute la mer s’endormait doucement, bercée par sa chanson.',
    ],
  },
  {
    id: 'com-robot', title: 'Le robot jardinier', author: 'par Tom, 5 ans', bg: 'var(--violet-soft)', svg: robot, smiles: 12, mood: 'cozy',
    pages: [
      'Robi le robot adorait s’occuper de son jardin.',
      'Il arrosait les fleurs avec des petites gouttes de pluie qu’il fabriquait lui-même.',
      'Au printemps, son jardin était le plus coloré et le plus parfumé de toute la ville.',
    ],
  },
]

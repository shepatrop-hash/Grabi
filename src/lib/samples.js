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

const car = `<svg width="118" height="80" viewBox="0 0 140 96"><ellipse cx="70" cy="84" rx="50" ry="7" fill="#fff" opacity=".65"></ellipse><rect x="24" y="44" width="92" height="30" rx="14" fill="#FF7FB0"></rect><path d="M44 44 Q54 26 70 26 Q90 26 98 44 Z" fill="#FFB0CE"></path><rect x="58" y="30" width="30" height="14" rx="5" fill="#CFEFFF"></rect><circle cx="48" cy="76" r="11" fill="#3B2D5A"></circle><circle cx="48" cy="76" r="4.5" fill="#fff"></circle><circle cx="94" cy="76" r="11" fill="#3B2D5A"></circle><circle cx="94" cy="76" r="4.5" fill="#fff"></circle><circle cx="114" cy="54" r="4" fill="#FFE08A"></circle></svg>`
const rocket = `<svg width="96" height="96" viewBox="0 0 100 100"><circle cx="78" cy="24" r="12" fill="#FFCC6A"></circle><ellipse cx="78" cy="24" rx="19" ry="5" fill="#FFB84D" opacity=".55" transform="rotate(-20 78 24)"></ellipse><path d="M40 58 Q40 20 54 12 Q68 20 68 58 Z" fill="#EAE6FF"></path><circle cx="54" cy="34" r="7" fill="#7FB0FF"></circle><path d="M40 58 L28 72 L44 66 Z" fill="#FF7FB0"></path><path d="M68 58 L80 72 L64 66 Z" fill="#FF7FB0"></path><path d="M48 66 Q54 84 60 66 Z" fill="#FFB84D"></path><circle cx="22" cy="30" r="2.4" fill="#fff"></circle><circle cx="34" cy="82" r="2.4" fill="#fff"></circle></svg>`
const tree = `<svg width="86" height="96" viewBox="0 0 90 100"><path d="M45 12 L64 40 H52 L68 62 H54 L72 82 H18 L36 62 H22 L38 40 H26 Z" fill="#4FB477"></path><rect x="40" y="82" width="10" height="10" fill="#B07A4A"></rect><path d="M45 4 l2.5 5 5.5 .5 -4 4 1 5.5 -5 -2.8 -5 2.8 1 -5.5 -4 -4 5.5 -.5 z" fill="#FFCC3E"></path><circle cx="38" cy="48" r="3" fill="#FF6B8A"></circle><circle cx="54" cy="58" r="3" fill="#FFCC3E"></circle><circle cx="45" cy="70" r="3" fill="#7FB0FF"></circle><circle cx="34" cy="72" r="2.6" fill="#FFCC3E"></circle></svg>`

// Histoires de la communauté (graine). Les histoires publiées par l'enfant s'y ajoutent.
export const SEED_COMMUNITY = [
  {
    id: 'com-baleine', title: 'La baleine qui chante', author: 'par Maya, 6 ans', bg: 'var(--sky-soft)', svg: whale, smiles: 27, mood: 'calm', categorie: 'animaux',
    pages: [
      'Au fond de l’océan vivait une baleine qui chantait de jolies berceuses.',
      'Les petits poissons venaient de partout pour l’écouter, blottis les uns contre les autres.',
      'Et chaque soir, toute la mer s’endormait doucement, bercée par sa chanson.',
    ],
  },
  {
    id: 'com-robot', title: 'Le robot jardinier', author: 'par Tom, 5 ans', bg: 'var(--violet-soft)', svg: robot, smiles: 12, mood: 'cozy', categorie: 'nature',
    pages: [
      'Robi le robot adorait s’occuper de son jardin.',
      'Il arrosait les fleurs avec des petites gouttes de pluie qu’il fabriquait lui-même.',
      'Au printemps, son jardin était le plus coloré et le plus parfumé de toute la ville.',
    ],
  },
  {
    id: 'com-voiture', title: 'La petite voiture rouge', author: 'par Léo, 5 ans', bg: 'var(--pink-soft)', svg: car, smiles: 19, mood: 'funny', categorie: 'vroom',
    pages: [
      'Vroom, la petite voiture rouge, adorait partir en balade sur les routes de campagne.',
      'Un jour, elle aida un escargot à traverser en le portant tout doucement sur son capot.',
      'Depuis, tous les animaux la saluent quand elle passe : « Bonne route, Vroom ! »',
    ],
  },
  {
    id: 'com-lune', title: 'Voyage sur la Lune', author: 'par Zoé, 6 ans', bg: 'var(--sky-soft)', svg: rocket, smiles: 23, mood: 'dreamy', categorie: 'planetes',
    pages: [
      'Nino enfila sa combinaison et grimpa dans sa fusée en carton.',
      'Trois, deux, un… décollage ! La fusée s’envola jusqu’à la Lune toute ronde.',
      'Là-haut, il fit des bonds géants avec les étoiles, puis rentra se coucher, la tête pleine de rêves.',
    ],
  },
  {
    id: 'com-sapin', title: 'Le sapin magique', author: 'par Emma, 4 ans', bg: 'var(--mint-soft)', svg: tree, smiles: 15, mood: 'cozy', categorie: 'noel',
    pages: [
      'La veille de Noël, un petit sapin s’illumina tout seul dans la forêt.',
      'Ses boules scintillaient si fort que les animaux vinrent se réchauffer autour de lui.',
      'Au matin, chacun trouva un petit cadeau accroché à ses branches. Joyeux Noël !',
    ],
  },
]

// Histoires intégrées (source unique pour les écrans Gratuites / Premium / Communauté
// et le lecteur). Chaque histoire a un avatar SVG (hero) + des pages de texte réelles
// (lues par l'audio). Les histoires créées par l'enfant ont, elles, de vraies images.

const dragon = `<svg width="92" height="92" viewBox="0 0 86 86"><path d="M30,22 L26,7 L39,18 Z" fill="#6FC79A"></path><path d="M56,22 L60,7 L47,18 Z" fill="#6FC79A"></path><circle cx="43" cy="46" r="27" fill="#9CE3B4"></circle><ellipse cx="43" cy="56" rx="15" ry="11" fill="#C6F0D4"></ellipse><circle cx="37" cy="57" r="2.2" fill="#3B6B4E"></circle><circle cx="49" cy="57" r="2.2" fill="#3B6B4E"></circle><circle cx="34" cy="41" r="6" fill="#fff"></circle><circle cx="52" cy="41" r="6" fill="#fff"></circle><circle cx="35" cy="42" r="3" fill="#3B2D5A"></circle><circle cx="53" cy="42" r="3" fill="#3B2D5A"></circle></svg>`
const unicorn = `<svg width="92" height="92" viewBox="0 0 86 86"><path d="M43,7 L37,27 L49,27 Z" fill="#FFCC3E"></path><circle cx="43" cy="48" r="27" fill="#FFFFFF" stroke="#F7DCE8" stroke-width="2"></circle><path d="M19,38 q-7,13 4,24" fill="none" stroke="#FF7FB0" stroke-width="7" stroke-linecap="round"></path><path d="M67,38 q7,13 -4,24" fill="none" stroke="#A98CFF" stroke-width="7" stroke-linecap="round"></path><circle cx="35" cy="46" r="4.5" fill="#3B2D5A"></circle><circle cx="51" cy="46" r="4.5" fill="#3B2D5A"></circle><ellipse cx="29" cy="56" rx="6" ry="4" fill="#FFC4DC"></ellipse><ellipse cx="57" cy="56" rx="6" ry="4" fill="#FFC4DC"></ellipse><path d="M37,58 Q43,64 49,58" stroke="#3B2D5A" stroke-width="3" fill="none" stroke-linecap="round"></path></svg>`
const bear = `<svg width="92" height="92" viewBox="0 0 86 86"><circle cx="27" cy="30" r="9" fill="#D9A57A"></circle><circle cx="59" cy="30" r="9" fill="#D9A57A"></circle><circle cx="43" cy="48" r="27" fill="#E8BE97"></circle><ellipse cx="43" cy="56" rx="13" ry="10" fill="#FBE6D2"></ellipse><circle cx="43" cy="52" r="3.5" fill="#5A3B22"></circle><circle cx="34" cy="44" r="3.5" fill="#3B2D5A"></circle><circle cx="52" cy="44" r="3.5" fill="#3B2D5A"></circle><path d="M38,60 Q43,64 48,60" stroke="#5A3B22" stroke-width="2.5" fill="none" stroke-linecap="round"></path></svg>`
const star = `<svg width="92" height="92" viewBox="0 0 86 86"><path d="M43,10 L52,33 L77,34 L57,49 L64,73 L43,59 L22,73 L29,49 L9,34 L34,33 Z" fill="#FFCC3E"></path><circle cx="36" cy="42" r="3.4" fill="#3B2D5A"></circle><circle cx="50" cy="42" r="3.4" fill="#3B2D5A"></circle><ellipse cx="30" cy="49" rx="4" ry="2.6" fill="#FF9FC4"></ellipse><ellipse cx="56" cy="49" rx="4" ry="2.6" fill="#FF9FC4"></ellipse><path d="M38,48 Q43,53 48,48" stroke="#3B2D5A" stroke-width="2.6" fill="none" stroke-linecap="round"></path></svg>`
const croco = `<svg width="92" height="92" viewBox="0 0 86 86"><circle cx="30" cy="30" r="10" fill="#7FCB86"></circle><circle cx="56" cy="30" r="10" fill="#7FCB86"></circle><circle cx="30" cy="29" r="4.5" fill="#fff"></circle><circle cx="56" cy="29" r="4.5" fill="#fff"></circle><circle cx="31" cy="30" r="2.2" fill="#3B2D5A"></circle><circle cx="57" cy="30" r="2.2" fill="#3B2D5A"></circle><ellipse cx="43" cy="54" rx="29" ry="16" fill="#8AD191"></ellipse><path d="M18,55 h50" stroke="#4F8A57" stroke-width="2.5" stroke-linecap="round"></path><path d="M24,55 l3,-6 3,6 z M34,55 l3,-6 3,6 z M44,55 l3,-6 3,6 z M54,55 l3,-6 3,6 z" fill="#fff"></path></svg>`
const mouse = `<svg width="92" height="92" viewBox="0 0 86 86"><circle cx="27" cy="29" r="14" fill="#C9C9D6"></circle><circle cx="59" cy="29" r="14" fill="#C9C9D6"></circle><circle cx="27" cy="29" r="8" fill="#FFC4DC"></circle><circle cx="59" cy="29" r="8" fill="#FFC4DC"></circle><circle cx="43" cy="50" r="23" fill="#D8D8E4"></circle><circle cx="35" cy="48" r="3.4" fill="#3B2D5A"></circle><circle cx="51" cy="48" r="3.4" fill="#3B2D5A"></circle><circle cx="43" cy="56" r="3.2" fill="#FF7FB0"></circle><path d="M43,59 v4" stroke="#3B2D5A" stroke-width="2" stroke-linecap="round"></path></svg>`
const castle = `<svg width="92" height="92" viewBox="0 0 86 86"><ellipse cx="22" cy="64" rx="20" ry="9" fill="#fff" opacity=".85"></ellipse><ellipse cx="60" cy="66" rx="18" ry="8" fill="#fff" opacity=".85"></ellipse><rect x="28" y="30" width="30" height="30" rx="4" fill="#A98CFF"></rect><rect x="22" y="38" width="10" height="22" rx="3" fill="#BBA4FF"></rect><rect x="54" y="38" width="10" height="22" rx="3" fill="#BBA4FF"></rect><path d="M26,30 l6,-9 6,9 z M48,30 l6,-9 6,9 z" fill="#FF7FB0"></path><rect x="40" y="46" width="6" height="14" rx="3" fill="#fff"></rect><circle cx="43" cy="22" r="3" fill="#FFCC3E"></circle></svg>`
const whale = `<svg width="120" height="92" viewBox="0 0 150 100"><ellipse cx="70" cy="58" rx="50" ry="30" fill="#6FB7E0"></ellipse><path d="M116,46 L146,30 L146,74 Z" fill="#6FB7E0"></path><ellipse cx="62" cy="68" rx="34" ry="16" fill="#A9D9F0"></ellipse><circle cx="50" cy="50" r="4" fill="#274A5E"></circle><path d="M42,62 Q54,70 66,62" stroke="#274A5E" stroke-width="2.6" fill="none" stroke-linecap="round"></path><path d="M50,24 q-4,-10 3,-16" stroke="#A9D9F0" stroke-width="4.5" fill="none" stroke-linecap="round"></path><circle cx="52" cy="6" r="3.5" fill="#fff"></circle></svg>`
const robot = `<svg width="110" height="92" viewBox="0 0 120 100"><circle cx="60" cy="14" r="4" fill="#FF7FB0"></circle><line x1="60" y1="18" x2="60" y2="28" stroke="#B6A6D6" stroke-width="3"></line><rect x="34" y="28" width="52" height="46" rx="15" fill="#BFC2D6"></rect><circle cx="50" cy="48" r="7" fill="#fff"></circle><circle cx="70" cy="48" r="7" fill="#fff"></circle><circle cx="50" cy="49" r="3" fill="#3B2D5A"></circle><circle cx="70" cy="49" r="3" fill="#3B2D5A"></circle><path d="M52,62 Q60,68 68,62" stroke="#6E6A86" stroke-width="2.6" fill="none" stroke-linecap="round"></path><ellipse cx="100" cy="58" rx="6" ry="9" fill="#7FE0C4" transform="rotate(25 100 58)"></ellipse></svg>`

export const FREE_STORIES = [
  {
    id: 'free-dragon', title: 'Le petit dragon', sub: '3 min · audio', bg: 'var(--mint-soft)', svg: dragon,
    pages: [
      'Il était une fois un petit dragon tout vert qui adorait les crêpes au sucre.',
      'Chaque matin, il préparait une grande montagne de crêpes dorées et toutes chaudes.',
      'Ce matin-là, il restait une seule crêpe. Alors il la partagea avec son amie la souris. Quel gentil petit dragon !',
    ],
  },
  {
    id: 'free-licorne', title: 'Lila la licorne', sub: '4 min · audio', bg: 'var(--pink-soft)', svg: unicorn,
    pages: [
      'Lila la licorne avait une crinière qui brillait de toutes les couleurs de l’arc-en-ciel.',
      'Un jour, le ciel devint tout gris. Lila secoua sa crinière magique pour redonner des couleurs aux nuages.',
      'Le soir venu, un arc-en-ciel géant illumina le ciel. Tous les amis dansèrent de joie !',
    ],
  },
  {
    id: 'free-ourson', title: 'Bouba l’ourson', sub: '5 min · audio', bg: 'var(--yellow-soft)', svg: bear,
    pages: [
      'Bouba l’ourson cherchait un câlin avant d’aller dormir.',
      'Il demanda au hibou, puis au renard, puis à la lune… mais personne n’avait le temps.',
      'Alors sa maman le serra très fort dans ses bras. C’était le plus doux des câlins du monde.',
    ],
  },
  {
    id: 'free-etoile', title: 'L’étoile rieuse', sub: '3 min · audio', bg: 'var(--sky-soft)', svg: star,
    pages: [
      'Tout en haut du ciel vivait une petite étoile qui riait tout le temps.',
      'Une nuit, elle vit un enfant qui avait peur du noir. Elle brilla plus fort, rien que pour lui.',
      'L’enfant sourit et s’endormit tout doucement. Depuis, l’étoile veille sur tous les rêveurs.',
    ],
  },
  {
    id: 'free-croco', title: 'Croco le câlin', sub: '4 min · audio', bg: 'var(--mint-soft)', svg: croco,
    pages: [
      'Croco le crocodile avait l’air tout féroce… mais en vrai, il adorait les câlins !',
      'Les animaux avaient un peu peur de ses grandes dents. Alors Croco leur offrit des fleurs.',
      'Bientôt, tout le monde voulut un câlin de Croco, le plus doux des crocodiles.',
    ],
  },
  {
    id: 'free-souris', title: 'Mimi la souris', sub: '3 min · audio', bg: 'var(--violet-soft)', svg: mouse,
    pages: [
      'Mimi la petite souris rêvait de toucher la lune.',
      'Elle grimpa sur une montagne de fromage, puis sur un grand nuage tout doux.',
      'La lune lui fit un clin d’œil et lui offrit une étoile. Mimi rentra, le cœur tout content.',
    ],
  },
]

// Histoire premium de la semaine : la 1ère page est libre, la suite demande Premium.
export const WEEKLY_STORY = {
  id: 'weekly-chateau', title: 'Le château dans les nuages', bg: 'linear-gradient(160deg,#C7B4FF,#FFD6EA)', svg: castle,
  premium: true, freePages: 1,
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
    id: 'com-baleine', title: 'La baleine qui chante', author: 'par Maya, 6 ans', bg: 'var(--sky-soft)', svg: whale, smiles: 27,
    pages: [
      'Au fond de l’océan vivait une baleine qui chantait de jolies berceuses.',
      'Les petits poissons venaient de partout pour l’écouter, blottis les uns contre les autres.',
      'Et chaque soir, toute la mer s’endormait doucement, bercée par sa chanson.',
    ],
  },
  {
    id: 'com-robot', title: 'Le robot jardinier', author: 'par Tom, 5 ans', bg: 'var(--violet-soft)', svg: robot, smiles: 12,
    pages: [
      'Robi le robot adorait s’occuper de son jardin.',
      'Il arrosait les fleurs avec des petites gouttes de pluie qu’il fabriquait lui-même.',
      'Au printemps, son jardin était le plus coloré et le plus parfumé de toute la ville.',
    ],
  },
]

// Histoires intégrées. Les GRATUITES sont de vraies histoires générées (Claude + Fal),
// avec illustrations embarquées dans public/free/ (cf. scripts/gen-free-stories.mjs).
// Premium + communauté restent des exemples avec avatars SVG.
import freeStories from './free-stories.json'

const castle = `<svg width="92" height="92" viewBox="0 0 86 86"><ellipse cx="22" cy="64" rx="20" ry="9" fill="#fff" opacity=".85"></ellipse><ellipse cx="60" cy="66" rx="18" ry="8" fill="#fff" opacity=".85"></ellipse><rect x="28" y="30" width="30" height="30" rx="4" fill="#A98CFF"></rect><rect x="22" y="38" width="10" height="22" rx="3" fill="#BBA4FF"></rect><rect x="54" y="38" width="10" height="22" rx="3" fill="#BBA4FF"></rect><path d="M26,30 l6,-9 6,9 z M48,30 l6,-9 6,9 z" fill="#FF7FB0"></path><rect x="40" y="46" width="6" height="14" rx="3" fill="#fff"></rect><circle cx="43" cy="22" r="3" fill="#FFCC3E"></circle></svg>`

// Histoires gratuites : générées par les API (texte Claude + illustrations Fal),
// chaque page a son image dans public/free/. (id, title, sub, bg, cover, pages:[{text,image}])
// Humeur musicale par histoire (ordre : Flamby, Lyra, Doudou, Étincelle, Croco, souris).
const FREE_MOODS = ['funny', 'calm', 'cozy', 'dreamy', 'cozy', 'dreamy']
export const FREE_STORIES = freeStories.map((s, i) => ({ ...s, mood: s.mood || FREE_MOODS[i] || 'calm', audioProvider: 'eleven' }))

// Encart « événement » de l'accueil : null = pas de gros encart (cas par défaut). Quand un
// événement arrive (ex. un épisode animé Grabi qui sort), y mettre un objet, ex. :
//   { badge: '🎬 Nouvel épisode', title: 'Grabi en 3D', subtitle: 'Le tout premier dessin animé !', emoji: '🎬' }
export const FEATURED_EVENT = null

// Histoire premium de la semaine : la 1ère page est libre, la suite demande Premium.
export const WEEKLY_STORY = {
  id: 'weekly-chateau', title: 'Le château dans les nuages', bg: 'linear-gradient(160deg,#C7B4FF,#FFD6EA)', svg: castle,
  premium: true, freePages: 1, mood: 'dreamy', audioProvider: 'eleven',
  pages: [
    'Tout là-haut, au-dessus des nuages, se cachait un château argenté. Plume, la petite souris, poussa la grande porte dorée et entra sur la pointe des pattes…',
    'À l’intérieur, des centaines de bougies dansaient toutes seules dans les airs.',
    'Au sommet de la plus haute tour, un dragon endormi gardait un trésor… un trésor de doudous tout doux !',
    'Plume choisit le plus moelleux, fit un gros câlin au dragon, et rentra chez elle sur un rayon de lune.',
  ],
}

// Communauté « Les histoires des enfants » : il n'y a PAS (encore) de serveur de partage.
// Publier une histoire la marque juste comme `published` en local, et elle apparaît dans cet
// onglet sur CET appareil. On ne met donc AUCUNE fausse histoire d'exemple ici (avant, 5 histoires
// factices « par Maya, 6 ans »… laissaient croire à une vraie communauté). Un vrai partage
// entre enfants nécessitera un backend (à faire plus tard).
export const SEED_COMMUNITY = []

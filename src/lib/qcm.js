// Construit les questions de personnalisation selon l'idée de l'enfant.
// Porté fidèlement depuis le prototype Claude Design.
export function buildQcm(text) {
  const t = (text || '').toLowerCase()
  const has = (...w) => w.some((x) => t.includes(x))

  const lieu = {
    q: "Où se passe l'aventure ?",
    opts: [
      { label: 'Dans la forêt', emoji: '🌳' },
      { label: 'Dans la mer', emoji: '🌊' },
      { label: "Dans l'espace", emoji: '🚀' },
      { label: 'Au château', emoji: '🏰' },
    ],
  }
  const ambiance = {
    q: 'Quelle ambiance ?',
    opts: [
      { label: 'Rigolote', emoji: '😄' },
      { label: 'Magique', emoji: '✨' },
      { label: 'Toute douce', emoji: '🌙' },
      { label: "Pleine d'action", emoji: '⚡' },
    ],
  }

  const Q = []
  if (has('dragon')) {
    Q.push({ q: 'De quelle couleur est le dragon ?', opts: [{ label: 'Vert', color: '#7FD0A0' }, { label: 'Rouge', color: '#FF7E7E' }, { label: 'Bleu', color: '#7FC5E8' }, { label: 'Violet', color: '#B79CFF' }, { label: 'Doré', color: '#FFCC3E' }, { label: 'Rose', color: '#FF9FC4' }] })
    Q.push({ q: 'Il crache quoi, ce dragon ?', opts: [{ label: 'Du feu', emoji: '🔥' }, { label: 'Des bulles', emoji: '🫧' }, { label: 'Des confettis', emoji: '🎉' }, { label: 'Des fleurs', emoji: '🌸' }] })
  } else if (has('licorne')) {
    Q.push({ q: 'Couleur de sa crinière ?', opts: [{ label: 'Arc-en-ciel', color: '#FF9FC4' }, { label: 'Rose', color: '#FF7FB0' }, { label: 'Bleue', color: '#7FC5E8' }, { label: 'Dorée', color: '#FFCC3E' }, { label: 'Violette', color: '#B79CFF' }, { label: 'Verte', color: '#8FD9A8' }] })
    Q.push({ q: 'Son pouvoir magique ?', opts: [{ label: 'Voler', emoji: '🪽' }, { label: 'Faire briller', emoji: '✨' }, { label: 'Soigner', emoji: '💖' }, { label: 'Geler', emoji: '❄️' }] })
  } else if (has('robot')) {
    Q.push({ q: 'De quelle couleur est le robot ?', opts: [{ label: 'Gris', color: '#C9C9D6' }, { label: 'Bleu', color: '#7FC5E8' }, { label: 'Rouge', color: '#FF7E7E' }, { label: 'Jaune', color: '#FFCC3E' }, { label: 'Vert', color: '#8FD9A8' }, { label: 'Rose', color: '#FF9FC4' }] })
    Q.push({ q: 'Que sait-il faire ?', opts: [{ label: 'Danser', emoji: '🕺' }, { label: 'Voler', emoji: '🚀' }, { label: 'Chanter', emoji: '🎤' }, { label: 'Cuisiner', emoji: '🍳' }] })
  } else if (has('pieuvre', 'poulpe', 'poisson', 'baleine', 'sirène', 'sirene', 'crabe')) {
    Q.push({ q: 'De quelle couleur est le héros ?', opts: [{ label: 'Bleu', color: '#7FC5E8' }, { label: 'Rose', color: '#FF9FC4' }, { label: 'Violet', color: '#B79CFF' }, { label: 'Orange', color: '#FFB36B' }, { label: 'Vert', color: '#8FD9A8' }, { label: 'Jaune', color: '#FFCC3E' }] })
    Q.push({ q: 'Son instrument préféré ?', opts: [{ label: 'Guitare', emoji: '🎸' }, { label: 'Tambour', emoji: '🥁' }, { label: 'Flûte', emoji: '🎵' }, { label: 'Trompette', emoji: '🎺' }] })
  } else if (has('chat', 'chaton')) {
    Q.push({ q: 'De quelle couleur est le chat ?', opts: [{ label: 'Roux', color: '#FFB36B' }, { label: 'Noir', color: '#4A4458' }, { label: 'Blanc', color: '#F3EFE6' }, { label: 'Gris', color: '#C9C9D6' }, { label: 'Tigré', color: '#E0A772' }, { label: 'Rose', color: '#FF9FC4' }] })
  } else if (has('chien', 'chiot')) {
    Q.push({ q: 'De quelle couleur est le chien ?', opts: [{ label: 'Beige', color: '#E8C79A' }, { label: 'Brun', color: '#A06A3E' }, { label: 'Noir', color: '#4A4458' }, { label: 'Blanc', color: '#F3EFE6' }, { label: 'Roux', color: '#FFB36B' }, { label: 'Gris', color: '#C9C9D6' }] })
  } else if (has('ours', 'ourson')) {
    Q.push({ q: "De quelle couleur est l'ourson ?", opts: [{ label: 'Brun', color: '#C98A5A' }, { label: 'Beige', color: '#E8C79A' }, { label: 'Blanc', color: '#F3EFE6' }, { label: 'Roux', color: '#FFB36B' }, { label: 'Gris', color: '#C9C9D6' }, { label: 'Rose', color: '#FF9FC4' }] })
  } else if (has('enfant', 'fille', 'garçon', 'garcon', 'bébé', 'bebe', 'petit', 'petite', 'héros', 'heros')) {
    Q.push({ q: "C'est une fille ou un garçon ?", opts: [{ label: 'Une fille', emoji: '👧' }, { label: 'Un garçon', emoji: '👦' }, { label: 'Surprise', emoji: '✨' }] })
    Q.push({ q: 'De quelle couleur est sa peau ?', opts: [{ label: 'Claire', color: '#FAD9BC' }, { label: 'Dorée', color: '#E3A86E' }, { label: 'Brune', color: '#A06A3E' }, { label: 'Foncée', color: '#6E4423' }] })
    Q.push({ q: 'Son super-pouvoir ?', opts: [{ label: 'Voler', emoji: '🦸' }, { label: 'Super force', emoji: '💪' }, { label: 'Invisible', emoji: '👻' }, { label: 'Parler aux animaux', emoji: '🐾' }] })
  } else {
    Q.push({ q: "C'est l'histoire de qui ?", opts: [{ label: 'Une fille', emoji: '👧' }, { label: 'Un garçon', emoji: '👦' }, { label: 'Un animal', emoji: '🐰' }, { label: 'Une créature', emoji: '🐲' }] })
    Q.push({ q: 'De quelle couleur est le héros ?', opts: [{ label: 'Rose', color: '#FF9FC4' }, { label: 'Bleu', color: '#7FC5E8' }, { label: 'Vert', color: '#8FD9A8' }, { label: 'Violet', color: '#B79CFF' }, { label: 'Jaune', color: '#FFCC3E' }, { label: 'Rouge', color: '#FF7E7E' }] })
  }
  if (!has('mer', 'océan', 'ocean', 'château', 'chateau', 'espace', 'forêt', 'foret', 'nuage')) Q.push(lieu)
  Q.push(ambiance)
  return Q
}

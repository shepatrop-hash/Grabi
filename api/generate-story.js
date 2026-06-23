import Anthropic from '@anthropic-ai/sdk'

// Modèle configurable. Défaut : Opus 4.8 (qualité max).
// Pour réduire le coût à l'échelle : STORY_MODEL=claude-sonnet-4-6
const MODEL = process.env.STORY_MODEL || 'claude-opus-4-8'

// Laisse le temps à Claude d'écrire l'histoire (sinon timeout serverless à ~10s).
export const config = { maxDuration: 60 }

const SYSTEM = `Tu es l'auteur des histoires de Grabi, une application d'histoires du soir pour enfants de 3 à 7 ans, en français.
Tu écris des histoires douces, positives et rassurantes à partir de l'idée d'un enfant.

Règles strictes :
- Public 3 à 7 ans : aucun contenu effrayant, violent, triste durablement, ni thème d'adulte.
- Vocabulaire simple, phrases courtes, ton chaleureux et joueur.
- Toujours une fin rassurante et bienveillante.
- Longueur totale ~400 à 500 mots (environ 3 minutes lues à voix haute), découpée en 5 à 6 scènes.

Pour chaque scène, fournis aussi un "prompt_illustration" EN ANGLAIS décrivant l'ACTION et le DÉCOR
de la scène (qui fait quoi, où, ambiance), avec le même personnage principal d'une scène à l'autre.
Ne précise PAS le style de rendu : il est appliqué automatiquement et identique partout.

Fournis aussi "personnages" : 1 à 3 éléments clés (le héros principal, et au plus 1-2 personnages,
objets ou lieux récurrents importants). Pour chacun : un "nom" court en français, et une "description"
EN ANGLAIS des traits PHYSIQUES, très détaillée et surtout CONSTANTE (espèce/type, forme, COULEUR
précise et stable, grands yeux ronds expressifs, vêtements ou détails distinctifs) — elle sert d'image
de référence pour garder le personnage identique. Ne décris PAS le style de rendu (il est fixé à part).
Les "prompt_illustration" décrivent l'action et le décor de chaque scène en réutilisant ces personnages.`

// Schéma de sortie structurée : { titre, pages: [{ texte, prompt_illustration }] }
const SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    titre: { type: 'string' },
    personnages: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          nom: { type: 'string' },
          description: { type: 'string' },
        },
        required: ['nom', 'description'],
      },
    },
    pages: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          texte: { type: 'string' },
          prompt_illustration: { type: 'string' },
        },
        required: ['texte', 'prompt_illustration'],
      },
    },
  },
  required: ['titre', 'personnages', 'pages'],
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Méthode non autorisée.' })
    return
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    res.status(500).json({ error: 'ANTHROPIC_API_KEY manquante (voir .env.example).' })
    return
  }

  try {
    const { idea, answers } = req.body || {}
    if (!idea || typeof idea !== 'string') {
      res.status(400).json({ error: "L'idée de l'enfant est manquante." })
      return
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const userContent = `Idée de l'enfant : "${idea}"
Préférences (questionnaire) : ${JSON.stringify(answers || {})}

Écris l'histoire complète en respectant toutes les règles, puis renvoie-la au format demandé.`

    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 4000,
      system: [{ type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } }],
      messages: [{ role: 'user', content: userContent }],
      output_config: { format: { type: 'json_schema', schema: SCHEMA } },
    })

    if (message.stop_reason === 'refusal') {
      res.status(422).json({ error: "Cette idée n'a pas pu être transformée en histoire. Essaie une autre idée toute douce." })
      return
    }

    const textBlock = message.content.find((b) => b.type === 'text')
    const story = JSON.parse(textBlock.text)

    // ÉTAPE SUIVANTE : pour chaque page, générer l'illustration avec Qwen Image 2
    // à partir de page.prompt_illustration (appel serveur, clé QWEN_API_KEY),
    // puis renvoyer aussi les URLs d'images.

    res.status(200).json({ story, model: message.model })
  } catch (err) {
    console.error('generate-story error:', err)
    res.status(500).json({ error: String(err?.message || err) })
  }
}

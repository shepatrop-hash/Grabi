import Anthropic from '@anthropic-ai/sdk'

// Modèle pour les questions (rapide). Par défaut : celui des histoires, sinon Opus 4.8.
const MODEL = process.env.QUESTIONS_MODEL || process.env.STORY_MODEL || 'claude-opus-4-8'

export const config = { maxDuration: 30 }

const SYSTEM = `Tu prépares un petit questionnaire de personnalisation pour une histoire d'enfant (3 à 7 ans), en français, à partir de l'idée que l'enfant vient de taper.

Génère 2 ou 3 questions COURTES, joyeuses et surtout ADAPTÉES AU CONTEXTE EXACT de l'idée (jamais génériques) : apparence du héros, son objet/pouvoir, le lieu, un détail rigolo propre à CETTE histoire, l'ambiance…

Règles :
- Chaque question a 3 ou 4 options.
- Chaque option a un "label" court ET, au choix : soit un "emoji" rigolo, soit (uniquement pour une question de couleur) un "color" en hexadécimal #RRGGBB. Jamais les deux à la fois.
- Mets au plus UNE question de couleur. Ton chaleureux et enfantin.`

const SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    questions: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          q: { type: 'string' },
          opts: {
            type: 'array',
            items: {
              type: 'object',
              additionalProperties: false,
              properties: {
                label: { type: 'string' },
                emoji: { type: 'string' },
                color: { type: 'string' },
              },
              required: ['label'],
            },
          },
        },
        required: ['q', 'opts'],
      },
    },
  },
  required: ['questions'],
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
    const { idea } = req.body || {}
    if (!idea || typeof idea !== 'string') {
      res.status(400).json({ error: "L'idée de l'enfant est manquante." })
      return
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 1500,
      system: [{ type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } }],
      messages: [{ role: 'user', content: `Idée de l'enfant : "${idea}"\n\nGénère le questionnaire adapté à cette idée.` }],
      output_config: { format: { type: 'json_schema', schema: SCHEMA } },
    })

    if (message.stop_reason === 'refusal') {
      res.status(422).json({ error: 'Idée non valide.' })
      return
    }

    const textBlock = message.content.find((b) => b.type === 'text')
    const data = JSON.parse(textBlock.text)
    res.status(200).json({ questions: Array.isArray(data.questions) ? data.questions : [] })
  } catch (err) {
    console.error('generate-questions error:', err)
    res.status(500).json({ error: String(err?.message || err) })
  }
}

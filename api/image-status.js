import { fal } from '@fal-ai/client'
import { abuseBlocked } from './_guard.js'

// Interroge la file Fal pour un job soumis par /api/generate-image.
// Réponses : { url, model } si terminé, sinon { status: 'IN_QUEUE' | 'IN_PROGRESS' }.
export const config = { maxDuration: 30 }

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Méthode non autorisée.' })
    return
  }
  if (abuseBlocked(req, res)) return
  if (!process.env.FAL_KEY) {
    res.status(500).json({ error: 'FAL_KEY manquante.' })
    return
  }

  try {
    const { request_id, model } = req.body || {}
    if (!request_id || !model) {
      res.status(400).json({ error: 'request_id ou model manquant.' })
      return
    }

    fal.config({ credentials: process.env.FAL_KEY })

    const status = await fal.queue.status(model, { requestId: request_id, logs: false })

    if (status.status === 'COMPLETED') {
      const result = await fal.queue.result(model, { requestId: request_id })
      const url = result?.data?.images?.[0]?.url
      if (!url) {
        res.status(502).json({ error: "Pas d'image renvoyée par Fal." })
        return
      }
      res.status(200).json({ url, model })
      return
    }

    res.status(200).json({ status: status.status || 'IN_PROGRESS' })
  } catch (err) {
    console.error('image-status error:', err)
    res.status(500).json({ error: String(err?.message || err) })
  }
}

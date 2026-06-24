import { useEffect, useRef } from 'react'

// Musique de fond en boucle, volume doux. Démarre au 1er geste de l'utilisateur
// (les navigateurs bloquent l'autoplay avec son avant interaction). Change de piste
// sans accroc quand on entre/sort d'une histoire. Se coupe si `enabled` est false.
export default function BackgroundMusic({ track, enabled = true, volume = 0.3 }) {
  const ref = useRef(null)
  const started = useRef(false)

  // Élément audio unique (créé une fois).
  useEffect(() => {
    const a = new Audio()
    a.loop = true
    a.volume = volume
    a.preload = 'auto'
    ref.current = a
    return () => {
      a.pause()
      ref.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Changement de piste + (dés)activation.
  useEffect(() => {
    const a = ref.current
    if (!a) return
    if (track) {
      const full = new URL(track, window.location.href).href
      if (a.src !== full) a.src = track
    }
    if (enabled && started.current && track) a.play().catch(() => {})
    if (!enabled) a.pause()
    a.volume = volume
  }, [track, enabled, volume])

  // Démarrage au 1er geste (clic/tap/clavier), une seule fois.
  useEffect(() => {
    if (started.current) return
    const start = () => {
      started.current = true
      const a = ref.current
      if (a && enabled && track) a.play().catch(() => {})
      window.removeEventListener('pointerdown', start)
      window.removeEventListener('keydown', start)
    }
    window.addEventListener('pointerdown', start)
    window.addEventListener('keydown', start)
    return () => {
      window.removeEventListener('pointerdown', start)
      window.removeEventListener('keydown', start)
    }
  }, [enabled, track])

  return null
}

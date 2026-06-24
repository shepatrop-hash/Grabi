import { useEffect, useRef } from 'react'

// Musique de fond en BOUCLE PARFAITE : deux lecteurs <audio> se relaient avec un
// fondu enchaîné (crossfade) de ~2 s, pour qu'on n'entende JAMAIS la couture fin->début.
// Volume doux, démarre au 1er geste (politique autoplay), change de piste proprement,
// se coupe si `enabled` = false.
const FADE = 2.0 // durée du fondu (secondes)

export default function BackgroundMusic({ track, enabled = true, volume = 0.3 }) {
  const els = useRef([]) // [audioA, audioB]
  const active = useRef(0)
  const started = useRef(false)
  const trackRef = useRef(track)
  const enabledRef = useRef(enabled)
  const volRef = useRef(volume)

  useEffect(() => { trackRef.current = track }, [track])
  useEffect(() => { enabledRef.current = enabled }, [enabled])
  useEffect(() => { volRef.current = volume }, [volume])

  const startActive = () => {
    const cur = els.current[active.current]
    if (!cur || !trackRef.current) return
    if (!cur.src) cur.src = trackRef.current
    cur.play().catch(() => {})
  }

  // Création des 2 lecteurs + boucle de surveillance (crossfade).
  useEffect(() => {
    const a = new Audio()
    const b = new Audio()
    ;[a, b].forEach((el) => { el.preload = 'auto'; el.loop = false; el.volume = 0 })
    els.current = [a, b]

    const id = setInterval(() => {
      const arr = els.current
      if (arr.length < 2 || !enabledRef.current || !started.current || !trackRef.current) return

      // Filet de sécurité : si rien ne joue, on relance le lecteur actif.
      if (arr.every((el) => el.paused)) { startActive(); return }

      const cur = arr[active.current]
      const oth = arr[1 - active.current]
      const dur = cur.duration
      if (dur && !isNaN(dur) && !cur.paused) {
        const rem = dur - cur.currentTime
        // Proche de la fin : on démarre l'autre lecteur pour enchaîner.
        if (rem <= FADE && oth.paused) {
          oth.src = trackRef.current
          try { oth.currentTime = 0 } catch {}
          oth.volume = 0
          oth.play().catch(() => {})
          active.current = 1 - active.current
        }
      }
      // Volumes : fondu sortant (fin) + fondu entrant (début).
      for (const el of arr) {
        if (el.paused) continue
        const d = el.duration || 0
        const r = d - el.currentTime
        let v = volRef.current
        if (d && r <= FADE) v = volRef.current * Math.max(0, r / FADE)
        else if (el.currentTime < FADE) v = volRef.current * Math.min(1, el.currentTime / FADE)
        el.volume = Math.max(0, Math.min(1, v))
        if (d && r <= 0.06) el.pause() // fin atteinte -> l'autre a pris le relais
      }
    }, 120)

    return () => { clearInterval(id); ;[a, b].forEach((el) => el.pause()); els.current = [] }
  }, [])

  // Changement de piste : recharge le lecteur actif sur la nouvelle piste.
  useEffect(() => {
    const arr = els.current
    if (arr.length < 2 || !track) return
    const full = new URL(track, window.location.href).href
    const cur = arr[active.current]
    if (cur.src === full) return
    arr.forEach((el) => el.pause())
    cur.src = track
    cur.volume = 0
    try { cur.currentTime = 0 } catch {}
    if (enabledRef.current && started.current) cur.play().catch(() => {})
  }, [track])

  // Activer / couper.
  useEffect(() => {
    const arr = els.current
    if (arr.length < 2) return
    if (!enabled) arr.forEach((el) => el.pause())
    else if (started.current) startActive()
  }, [enabled])

  // Démarrage au 1er geste utilisateur.
  useEffect(() => {
    if (started.current) return
    const start = () => {
      started.current = true
      if (enabledRef.current) startActive()
      window.removeEventListener('pointerdown', start)
      window.removeEventListener('keydown', start)
    }
    window.addEventListener('pointerdown', start)
    window.addEventListener('keydown', start)
    return () => {
      window.removeEventListener('pointerdown', start)
      window.removeEventListener('keydown', start)
    }
  }, [])

  return null
}

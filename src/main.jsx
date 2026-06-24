import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './theme.css'

// Sur tablette / grand écran, l'app est mise à l'échelle (téléphone agrandi et
// encadré) pour utiliser l'espace, sans toucher au design mobile. On calcule le
// facteur ici pour qu'il s'adapte à toute taille (portrait/paysage) sans déborder.
function fitAppScale() {
  const root = document.documentElement
  if (window.innerWidth < 700) {
    root.style.setProperty('--app-scale', '1')
    return
  }
  const s = Math.min((window.innerWidth * 0.97) / 430, (window.innerHeight * 0.96) / 860)
  root.style.setProperty('--app-scale', String(Math.min(s, 1.5)))
}
fitAppScale()
window.addEventListener('resize', fitAppScale)

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

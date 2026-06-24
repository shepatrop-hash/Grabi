// La mascotte Grabi (public/grabi.png) + les accessoires choisis par l'enfant.
// Les accessoires sont superposés ET animés avec la mascotte (effet « attaché »)
// pour qu'on retrouve le Grabi personnalisé partout dans l'app.
// `size` = largeur/hauteur en px. Passe `acc` pour un rendu live (écrans de
// personnalisation) ; sinon le composant lit la personnalisation sauvegardée.
import RawSvg from './RawSvg.jsx'
import { load } from '../lib/store.js'
import { accOverlay, DEFAULT_ACC } from '../lib/grabiCustom.js'

export default function Grabi({ size = 110, acc, overlay = true }) {
  const layers = overlay ? accOverlay(acc || load('acc', DEFAULT_ACC)) : ''
  return (
    <span
      style={{
        display: 'inline-block',
        position: 'relative',
        width: size,
        height: size,
        lineHeight: 0,
        animation: 'grabi-bob 2.8s ease-in-out infinite',
        transformOrigin: '50% 80%',
      }}
    >
      <img
        src="/grabi.png"
        alt="Grabi"
        width={size}
        height={size}
        style={{ display: 'block', width: size, height: size, objectFit: 'contain' }}
      />
      {layers && (
        <RawSvg
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
          html={`<svg width="${size}" height="${size}" viewBox="0 0 200 200" style="overflow:visible">${layers}</svg>`}
        />
      )}
    </span>
  )
}

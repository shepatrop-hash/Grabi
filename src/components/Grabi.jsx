// La mascotte Grabi : illustration du nouveau design (public/grabi.png).
// `size` = largeur/hauteur en px. L'animation grabi-bob est dans theme.css.
export default function Grabi({ size = 110 }) {
  return (
    <span style={{ display: 'inline-block', lineHeight: 0 }}>
      <img
        src="/grabi.png"
        alt="Grabi"
        width={size}
        height={size}
        style={{
          display: 'block',
          width: size,
          height: size,
          objectFit: 'contain',
          animation: 'grabi-bob 2.8s ease-in-out infinite',
          transformOrigin: '50% 80%',
        }}
      />
    </span>
  )
}

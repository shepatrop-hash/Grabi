// Petit utilitaire : affiche un SVG décoratif (repris du prototype) sans avoir
// à convertir chaque attribut en camelCase. Le contenu est toujours une chaîne
// constante de notre code (jamais une saisie utilisateur), donc sans risque.
export default function RawSvg({ html, style }) {
  return (
    <span
      style={{ display: 'inline-flex', lineHeight: 0, ...style }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

import BackButton from '../components/BackButton.jsx'

const card = { background: '#fff', borderRadius: 22, padding: '18px 18px', boxShadow: '0 6px 16px -12px rgba(74,58,102,.3)' }
const h = { fontSize: 17, fontWeight: 700, marginBottom: 8 }
const p = { fontSize: 14, color: 'var(--ink)', fontWeight: 500, lineHeight: 1.55, margin: '0 0 8px' }

export default function Legal({ onBack }) {
  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--bg)', position: 'relative', overflow: 'hidden', animation: 'gn-fadein .35s ease', paddingTop: 'calc(env(safe-area-inset-top, 14px) + 16px)' }}>
      <div style={{ padding: '6px 24px 0', display: 'flex', alignItems: 'center', gap: 14, flex: 'none' }}>
        <BackButton onClick={onBack} />
        <div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>Confidentialité &amp; CGU</div>
          <div style={{ fontSize: 13, color: 'var(--ink2)', fontWeight: 500 }}>Informations légales</div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px calc(env(safe-area-inset-bottom, 0px) + 20px)', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={card}>
          <div style={h}>🔒 Confidentialité</div>
          <p style={p}>Grabi est conçu pour les enfants. Nous collectons le minimum de données et ne créons aucun profil publicitaire.</p>
          <p style={p}>Le prénom et l'âge de l'enfant, ses histoires, ses réglages et son compagnon sont enregistrés <b>uniquement sur cet appareil</b> (stockage local du navigateur). Ils ne sont pas envoyés sur nos serveurs.</p>
          <p style={p}>La création d'histoire envoie l'idée saisie et les réponses du questionnaire à nos prestataires d'IA (génération de texte et d'images) le temps de produire l'histoire. Aucune donnée personnelle identifiante n'y est ajoutée.</p>
          <p style={{ ...p, marginBottom: 0 }}>Conformément au RGPD, vous pouvez effacer toutes les données à tout moment depuis <b>Espace parents → Réinitialiser l'application</b>.</p>
        </div>

        <div style={card}>
          <div style={h}>📜 Conditions d'utilisation</div>
          <p style={p}>Grabi propose des histoires à lire et à écouter, ainsi qu'un outil de création d'histoires illustrées. L'usage est destiné à un cadre familial.</p>
          <p style={p}>Les contenus créés doivent rester adaptés à un jeune public. La publication dans la communauté est contrôlable par les parents et peut être désactivée.</p>
          <p style={{ ...p, marginBottom: 0 }}>L'abonnement Premium est sans engagement et résiliable à tout moment. Le paiement est géré par la boutique d'applications de votre appareil.</p>
        </div>

        <div style={card}>
          <div style={h}>📬 Contact</div>
          <p style={p}>Une question, une demande relative à vos données ou un signalement ?</p>
          <a href="mailto:bonjour@grabi.app" style={{ fontSize: 15, fontWeight: 700, color: 'var(--violet)', textDecoration: 'none' }}>bonjour@grabi.app</a>
        </div>

        <div style={{ fontSize: 11, color: 'var(--ink2)', fontWeight: 500, textAlign: 'center', padding: '4px 12px 0', lineHeight: 1.4 }}>Grabi v1.0 · Dernière mise à jour : juin 2026</div>
      </div>
    </div>
  )
}

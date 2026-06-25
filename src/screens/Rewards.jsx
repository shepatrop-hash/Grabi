import Grabi from '../components/Grabi.jsx'
import RawSvg from '../components/RawSvg.jsx'
import BackButton from '../components/BackButton.jsx'
import { load } from '../lib/store.js'

const lockIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C3BBD2" stroke-width="2.4" stroke-linecap="round"><rect x="4" y="10" width="16" height="11" rx="2.5"></rect><path d="M8 10 V7 a4 4 0 0 1 8 0 V10"></path></svg>`

const statCard = (value, label, color) => ({ value, label, color })

export default function Rewards({ child = { name: 'Léa' }, stories = [], smilesOf = () => 0, onBack }) {
  const created = stories.length
  const published = stories.filter((s) => s.published).length
  const hearts = stories.reduce((sum, s) => sum + (smilesOf(s) || 0), 0)
  const happiness = load('happiness', 62)

  const stats = [
    statCard(created, 'Histoires créées', 'var(--violet)'),
    statCard(published, 'Publiées', 'var(--pink)'),
    statCard(hearts, 'Cœurs reçus', '#e8638f'),
  ]

  const badges = [
    { emoji: '🌟', label: 'Première histoire', desc: 'Créer 1 histoire', earned: created >= 1 },
    { emoji: '✍️', label: 'Petit conteur', desc: 'Créer 3 histoires', earned: created >= 3 },
    { emoji: '📚', label: 'Grand conteur', desc: 'Créer 10 histoires', earned: created >= 10 },
    { emoji: '🎨', label: 'Artiste', desc: 'Publier 1 histoire', earned: published >= 1 },
    { emoji: '💝', label: 'Cœur de la communauté', desc: 'Recevoir 5 cœurs', earned: hearts >= 5 },
    { emoji: '🫶', label: 'Ami de Grabi', desc: 'Bonheur à 80', earned: happiness >= 80 },
  ]
  const earnedCount = badges.filter((b) => b.earned).length

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--bg)', position: 'relative', overflow: 'hidden', animation: 'gn-fadein .35s ease', paddingTop: 'calc(env(safe-area-inset-top, 14px) + 16px)' }}>
      <div style={{ padding: '6px 24px 0', display: 'flex', alignItems: 'center', gap: 14, flex: 'none' }}>
        <BackButton onClick={onBack} />
        <div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>Mes récompenses</div>
          <div style={{ fontSize: 13, color: 'var(--ink2)', fontWeight: 500 }}>{earnedCount} badge{earnedCount > 1 ? 's' : ''} sur {badges.length}</div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 24px calc(env(safe-area-inset-bottom, 0px) + 20px)', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* En-tête avec Grabi + message */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'var(--card)', borderRadius: 24, padding: '14px 18px', boxShadow: '0 6px 16px -12px rgba(74,58,102,.3)' }}>
          <Grabi size={64} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 700 }}>Bravo {child.name} !</div>
            <div style={{ fontSize: 13, color: 'var(--ink2)', fontWeight: 500, lineHeight: 1.4 }}>Continue de créer des histoires pour gagner des badges 🌈</div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 10 }}>
          {stats.map((s) => (
            <div key={s.label} style={{ flex: 1, background: 'var(--card)', borderRadius: 20, padding: '14px 6px', textAlign: 'center', boxShadow: '0 6px 16px -12px rgba(74,58,102,.3)' }}>
              <div style={{ fontSize: 26, fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 11.5, color: 'var(--ink2)', fontWeight: 600, lineHeight: 1.2, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Badges */}
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink2)', textTransform: 'uppercase', letterSpacing: '.04em', marginLeft: 4 }}>Badges</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {badges.map((b) => (
            <div key={b.label} style={{ position: 'relative', background: 'var(--card)', borderRadius: 22, padding: '16px 12px', textAlign: 'center', boxShadow: '0 6px 16px -12px rgba(74,58,102,.3)', opacity: b.earned ? 1 : 0.7 }}>
              {!b.earned && <span style={{ position: 'absolute', top: 10, right: 10 }}><RawSvg html={lockIcon} /></span>}
              <div style={{ fontSize: 40, lineHeight: 1, filter: b.earned ? 'none' : 'grayscale(1)' }}>{b.emoji}</div>
              <div style={{ fontSize: 14, fontWeight: 700, marginTop: 8 }}>{b.label}</div>
              <div style={{ fontSize: 12, color: b.earned ? 'var(--mint)' : 'var(--ink2)', fontWeight: 600, marginTop: 3 }}>{b.earned ? 'Obtenu ✓' : b.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

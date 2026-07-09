import Grabi from '../components/Grabi.jsx'
import RawSvg from '../components/RawSvg.jsx'
import BottomNav from '../components/BottomNav.jsx'
import { WEEKLY_STORY, FREE_STORIES } from '../lib/samples.js'

const iconBooks = `<svg width="40" height="40" viewBox="0 0 46 46"><rect x="8" y="27" width="30" height="9" rx="3.5" fill="#FF7FB0"></rect><rect x="6" y="17.5" width="34" height="9" rx="3.5" fill="#56C7FF"></rect><rect x="10" y="8" width="26" height="9" rx="3.5" fill="#3FD7B0"></rect></svg>`
const iconWand = `<svg width="38" height="38" viewBox="0 0 46 46"><line x1="11" y1="36" x2="30" y2="17" stroke="#A98CFF" stroke-width="5.5" stroke-linecap="round"></line><path d="M33,9 L35,14 L40,16 L35,18 L33,23 L31,18 L26,16 L31,14 Z" fill="#FFCC3E"></path><circle cx="15" cy="13" r="2.5" fill="#FF7FB0"></circle><circle cx="40" cy="32" r="2.5" fill="#3FD7B0"></circle></svg>`
const playWhite = `<svg width="22" height="22" viewBox="0 0 24 24" fill="#7d5fc4"><path d="M8 5 L19 12 L8 19 Z"></path></svg>`

// Accueil volontairement épuré : le parcours du soir (écouter la semaine, gratuites, créer).
// Les copains et les épisodes animés vivent dans leurs onglets (Copains, Découvrir).
export default function Home({ childName = 'Léa', createStatus = {}, onOpenReader, onGoFree, onGoPremium, onGoCreate, onGoCommunity, onGoSettings }) {
  // Indice de quota sur la carte « Crée ton histoire » (selon l'abonnement).
  const createHint = createStatus.plan === 'paid' ? `${createStatus.left} / 10 ce mois`
    : createStatus.plan === 'trial' ? (createStatus.left > 0 ? '1 histoire offerte ✨' : 'Passe au premium')
    : '📖 ou 🎤'

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--bg)', position: 'relative', overflow: 'hidden', animation: 'gn-fadein .35s ease' }}>
      <div style={{ position: 'absolute', top: -70, right: -60, width: 220, height: 220, borderRadius: '50%', background: 'var(--yellow-soft)', opacity: 0.6 }} />

      {/* En-tête : salutation + mascotte */}
      <div style={{ flex: 'none', padding: 'calc(env(safe-area-inset-top, 14px) + 18px) 24px 4px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative', zIndex: 2 }}>
        <div style={{ paddingTop: 6 }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink2)' }}>Bonsoir {childName}&nbsp;🌙</div>
          <div style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.12, maxWidth: 200, marginTop: 3 }}>Prêt·e pour l'histoire du soir&nbsp;?</div>
        </div>
        <div style={{ flex: 'none' }}><Grabi size={96} /></div>
      </div>

      {/* Contenu défilable */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 24px 18px', display: 'flex', flexDirection: 'column', gap: 22, position: 'relative', zIndex: 2 }}>
        {/* Histoire de la semaine — mise en avant */}
        <div style={{ background: WEEKLY_STORY.bg, borderRadius: 30, padding: '20px 22px', boxShadow: '0 16px 32px -16px rgba(150,110,220,.6)', position: 'relative', flexShrink: 0 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,.85)', color: '#7d5fc4', fontSize: 12.5, fontWeight: 800, padding: '5px 12px', borderRadius: 16 }}>✨ Nouvelle chaque semaine</span>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 14 }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.15, color: '#3B2D5A' }}>{WEEKLY_STORY.title}</div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: '#6E5FA0', marginTop: 5 }}>Une histoire plus longue à savourer</div>
            </div>
            <div style={{ width: 82, height: 82, borderRadius: '50%', background: 'rgba(255,255,255,.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><div style={{ transform: 'scale(.9)' }}><RawSvg html={WEEKLY_STORY.svg} /></div></div>
          </div>
          <button onClick={() => onOpenReader && onOpenReader(WEEKLY_STORY, 'home')} style={{ marginTop: 16, background: 'var(--card)', borderRadius: 22, padding: '11px 20px', display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 15.5, fontWeight: 800, color: 'var(--ink)', boxShadow: '0 8px 18px -8px rgba(74,58,102,.4)' }}><RawSvg html={playWhite} />Écouter</button>
        </div>

        {/* Deux entrées : gratuites + créer */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <button onClick={onGoFree} style={{ background: 'var(--yellow-soft)', borderRadius: 26, padding: '16px 16px 18px', textAlign: 'left', boxShadow: '0 12px 24px -14px rgba(255,180,40,.7)' }}>
            <div style={{ width: 54, height: 54, borderRadius: 18, background: 'var(--card)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><RawSvg html={iconBooks} /></div>
            <div style={{ fontSize: 16.5, fontWeight: 800, marginTop: 12, lineHeight: 1.1 }}>Histoires<br />gratuites</div>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--free-sub)', marginTop: 4 }}>{FREE_STORIES.length} histoires</div>
          </button>
          <button onClick={onGoCreate} style={{ background: 'var(--violet-soft)', borderRadius: 26, padding: '16px 16px 18px', textAlign: 'left', boxShadow: '0 12px 24px -14px rgba(169,140,255,.6)' }}>
            <div style={{ width: 54, height: 54, borderRadius: 18, background: 'var(--card)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><RawSvg html={iconWand} /></div>
            <div style={{ fontSize: 16.5, fontWeight: 800, marginTop: 12, lineHeight: 1.1 }}>Crée ton<br />histoire</div>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--create-sub)', marginTop: 4 }}>{createHint}</div>
          </button>
        </div>
      </div>

      <BottomNav active="accueil" onAccueil={() => {}} onDecouvrir={onGoPremium} onCopains={onGoCommunity} onMonCoin={onGoSettings} />
    </div>
  )
}

import { useState, useEffect, useRef } from 'react'
import Home from './screens/Home.jsx'
import Onboarding from './screens/Onboarding.jsx'
import Create from './screens/Create.jsx'
import Free from './screens/Free.jsx'
import Premium from './screens/Premium.jsx'
import Subscribe from './screens/Subscribe.jsx'
import Boutique from './screens/Boutique.jsx'
import BottomNav from './components/BottomNav.jsx'
import Settings from './screens/Settings.jsx'
import MonGrabi from './screens/MonGrabi.jsx'
import EspaceParents from './screens/EspaceParents.jsx'
import MonAbonnement from './screens/MonAbonnement.jsx'
import EditProfile from './screens/EditProfile.jsx'
import Legal from './screens/Legal.jsx'
import Rewards from './screens/Rewards.jsx'
import ScreenLock from './screens/ScreenLock.jsx'
import { ensurePermission, showNotification, msUntil } from './lib/notify.js'
import QCM from './screens/QCM.jsx'
import Generating from './screens/Generating.jsx'
import Reader from './screens/Reader.jsx'
import Community from './screens/Community.jsx'
import MyStories from './screens/MyStories.jsx'
import Published from './screens/Published.jsx'
import Admin from './screens/Admin.jsx'
import TopBack from './components/BackButton.jsx'
import BackgroundMusic from './components/BackgroundMusic.jsx'
import RawSvg from './components/RawSvg.jsx'
import { generateStory, generateImage, generateQuestions, generateAudio, resolveProvider } from './lib/api.js'
import { normalizeVoice, DEFAULT_VOICE } from './lib/voices.js'
import { audioKey, warmStory } from './lib/audioCache.js'
import { setEffectsEnabled, musicFor, MUSIC } from './lib/sounds.js'
import { buildQcm } from './lib/qcm.js'
import { load, save, newId } from './lib/store.js'
import { initBilling, purchase, restore as restoreBilling, billingReady } from './lib/billing.js'
import { normalizeCrystals, applyGrants, canCreate, spendStory } from './lib/crystals.js'
import { fetchContent, saveContent } from './lib/content.js'

const todayKey = () => new Date().toISOString().slice(0, 10)
import { FREE_STORIES, WEEKLY_STORY, SEED_COMMUNITY, FEATURED_EVENT } from './lib/samples.js'

// Cible du bouton « retour » Android pour chaque écran (le lecteur gère son origine ;
// l'accueil quitte l'app). Évite que « retour » ferme l'app depuis un sous-menu.
const BACK_TARGET = {
  create: 'home', qcm: 'create', generating: 'home', ready: 'home',
  free: 'home', premium: 'home', subscribe: 'home', boutique: 'home', settings: 'home',
  'edit-profile': 'settings', legal: 'espace-parents', rewards: 'settings',
  'mon-grabi': 'settings', 'espace-parents': 'settings', 'mon-abonnement': 'settings',
  community: 'home', mine: 'settings', published: 'mine', admin: 'home',
}

// Ordre des 4 onglets de la navbar → sens du glissement (swipe) entre onglets frères.
const TAB_INDEX = { home: 0, premium: 1, community: 2, settings: 3 }
const TAB_ORDER = ['home', 'premium', 'community', 'settings']
// Écran → onglet actif de la navbar (et écrans qui AFFICHENT la navbar persistante).
const NAV_ACTIVE = { home: 'accueil', premium: 'decouvrir', community: 'copains', settings: 'moncoin', mine: 'moncoin' }

const musicOnIcon = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7d5fc4" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18 V6 l10-2 V16"></path><circle cx="6.5" cy="18" r="2.5"></circle><circle cx="16.5" cy="16" r="2.5"></circle></svg>`
const musicOffIcon = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C24A7A" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18 V6 l10-2 V16"></path><circle cx="6.5" cy="18" r="2.5"></circle><circle cx="16.5" cy="16" r="2.5"></circle><path d="M3 3 L21 21"></path></svg>`

function Ready({ story, voice = 'Douce', childName = '', onKeep, onListen, onPublish, allowPublish = true, adminPublish = null }) {
  const [images, setImages] = useState({}) // index -> url | 'error'
  const [provider, setProvider] = useState(null) // moteur voix pour l'histoire (selon la voix choisie)

  // Décide le moteur de narration UNE fois : Gemini si voix Gemini, sinon ElevenLabs si crédits.
  useEffect(() => {
    if (!story?.pages) return
    let cancelled = false
    const chars = story.pages.reduce((n, p) => n + (p?.texte?.length || 0), 0)
    resolveProvider(voice, chars).then((prov) => { if (!cancelled) setProvider(prov) })
    return () => { cancelled = true }
  }, [story, voice])

  useEffect(() => {
    if (!story?.pages) return
    let cancelled = false
    setImages({})
    // Une illustration par scène, directement en texte→image (simple et rapide).
    story.pages.forEach((p, i) => {
      generateImage(p.prompt_illustration)
        .then(({ url }) => {
          if (!cancelled) setImages((m) => ({ ...m, [i]: url || 'error' }))
        })
        .catch(() => {
          if (!cancelled) setImages((m) => ({ ...m, [i]: 'error' }))
        })
    })
    return () => {
      cancelled = true
    }
  }, [story])

  // Pré-génère la NARRATION de chaque page EN ARRIÈRE-PLAN (en même temps que les images)
  // et la met en cache → lecture INSTANTANÉE dans le lecteur (plus de « Grabi prépare sa voix »).
  // warmStory vit au niveau module : le préchargement SE TERMINE et se met en cache même si
  // on quitte cet écran pour ouvrir le lecteur (avant, tout était annulé au démontage → le
  // résultat déjà en cours de génération était jeté → la voix se régénérait à chaque page).
  useEffect(() => {
    if (!story?.pages || !provider) return // attend que le moteur soit décidé
    warmStory(
      story.pages
        .filter((p) => p.texte)
        .map((p) => {
          const text = p.texte
          return { key: audioKey(text, voice, provider), run: () => generateAudio(text, voice, provider).then((d) => d?.url || null) }
        })
    )
  }, [story, voice, provider])

  const assemble = () => {
    const pages = (story?.pages || []).map((p, i) => ({
      text: p.texte,
      image: images[i] && images[i] !== 'error' ? images[i] : null,
      // On garde le prompt d'illustration : si on quitte AVANT la fin des images, le lecteur
      // pourra régénérer celles qui manquent (plus d'histoire « finie sans images »).
      prompt: p.prompt_illustration || null,
    }))
    return {
      title: story?.titre || 'Mon histoire',
      bg: 'linear-gradient(160deg,#C8EDFF,#E6DDFF)',
      pages,
      cover: pages.find((p) => p.image)?.image || null,
      personnages: story?.personnages || [],
      mood: story?.mood || 'calm',
      categorie: story?.categorie || 'fantastique',
      voice, // la voix (donc le moteur) avec laquelle l'histoire a été créée
      audioProvider: provider || 'gemini', // indice de moteur (le lecteur re-décide selon la voix)
    }
  }

  // Couverture = la première illustration disponible.
  const cover = (story?.pages || []).map((_, i) => images[i]).find((u) => u && u !== 'error') || null

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', position: 'relative', overflow: 'hidden', padding: 'calc(env(safe-area-inset-top, 14px) + 20px) 28px calc(env(safe-area-inset-bottom, 0px) + 28px)', animation: 'gn-fadein .4s cubic-bezier(.22,.61,.36,1)' }}>
      <div style={{ position: 'absolute', top: 'calc(env(safe-area-inset-top, 14px) + 14px)', left: 20, zIndex: 3 }}><TopBack onClick={() => onKeep(assemble())} /></div>

      <div style={{ fontSize: 24, fontWeight: 800, textAlign: 'center', marginBottom: 22, display: 'flex', alignItems: 'center', gap: 8 }}>✨ Ton histoire est prête&nbsp;!</div>

      {/* Carte couverture */}
      <div style={{ width: '100%', maxWidth: 360, background: 'var(--card)', borderRadius: 28, overflow: 'hidden', boxShadow: '0 22px 46px -20px rgba(0,0,0,.45)' }}>
        <div style={{ aspectRatio: '1 / 1', background: 'var(--violet-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {cover ? (
            <img src={cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontSize: 14, color: 'var(--ink2)', fontWeight: 600, textAlign: 'center', padding: 20 }}>Grabi dessine la couverture… 🎨</span>
          )}
        </div>
        <div style={{ padding: '18px 20px 22px', textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.2 }}>{story?.titre}</div>
          {childName ? <div style={{ fontSize: 14, color: 'var(--ink2)', fontWeight: 500, marginTop: 5 }}>inventée par {childName}</div> : null}
        </div>
      </div>

      {/* Actions */}
      <button onClick={() => onListen(assemble())} style={{ width: '100%', maxWidth: 360, marginTop: 26, background: 'linear-gradient(135deg,#FFD23F,#FFB43A)', color: '#4A3A66', borderRadius: 26, padding: '17px 12px', fontSize: 17, fontWeight: 800, boxShadow: '0 12px 26px -10px rgba(255,180,40,.75)' }}>▶&nbsp;&nbsp;{adminPublish ? 'Écouter (aperçu)' : 'Écouter mon histoire'}</button>

      {adminPublish ? (
        <>
          <button onClick={() => adminPublish(assemble())} style={{ width: '100%', maxWidth: 360, marginTop: 12, background: 'var(--violet)', color: '#fff', borderRadius: 26, padding: '15px 12px', fontSize: 15.5, fontWeight: 800, boxShadow: '0 12px 26px -10px rgba(169,140,255,.7)' }}>📚 Publier au catalogue</button>
          <div style={{ fontSize: 12.5, color: 'var(--ink2)', fontWeight: 500, textAlign: 'center', marginTop: 16, maxWidth: 300, lineHeight: 1.45 }}>Elle rejoindra « Histoires longues » pour tout le monde.</div>
        </>
      ) : allowPublish ? (
        <>
          <button onClick={() => onPublish(assemble())} style={{ width: '100%', maxWidth: 360, marginTop: 12, background: 'transparent', border: '2px solid var(--card-soft)', color: 'var(--ink)', borderRadius: 26, padding: '15px 12px', fontSize: 15, fontWeight: 700 }}>Partager avec les copains</button>
          <div style={{ fontSize: 12.5, color: 'var(--ink2)', fontWeight: 500, textAlign: 'center', marginTop: 16, maxWidth: 300, lineHeight: 1.45 }}>Elle rejoindra « Les histoires des enfants ».</div>
        </>
      ) : (
        <div style={{ fontSize: 12.5, color: 'var(--ink2)', fontWeight: 500, textAlign: 'center', marginTop: 16, maxWidth: 300, lineHeight: 1.45 }}>Le partage est désactivé dans l'Espace parents.</div>
      )}
    </div>
  )
}

export default function App() {
  // Premier lancement -> onboarding (bienvenue, prénom/âge, voix) puis paywall.
  const [onboarded, setOnboarded] = useState(() => load('onboarded', false))
  const [screen, _setScreen] = useState(() => (load('onboarded', false) ? 'home' : 'onboarding'))
  const [navAnim, setNavAnim] = useState('') // classe d'anim de la transition d'écran en cours
  // Navigation via la navbar entre onglets frères → glissement latéral (sens = ordre des onglets).
  // Sinon fondu. `go(x, anim)` force une anim précise (zoom en entrant dans une carte).
  const setScreen = (x) => {
    const from = TAB_INDEX[screen]
    const to = TAB_INDEX[x]
    setNavAnim(from != null && to != null && from !== to ? (to > from ? 'gn-slide-fwd' : 'gn-slide-back') : '')
    _setScreen(x)
  }
  const go = (x, anim) => { setNavAnim(anim || ''); _setScreen(x) }
  const [storyText, setStoryText] = useState('')
  const [error, setError] = useState('')
  const [story, setStory] = useState(null) // histoire brute en cours (avant sauvegarde)
  const [qcmQuestions, setQcmQuestions] = useState([])
  const [qcmIndex, setQcmIndex] = useState(0)
  const [qcmAnswers, setQcmAnswers] = useState({})
  const [qcmLoading, setQcmLoading] = useState(false)
  const [reader, setReader] = useState(null) // { story, origin }

  // --- Données persistées (localStorage) ---
  const [stories, setStories] = useState(() => load('stories', []))
  const [smiles, setSmiles] = useState(() => load('smiles', {}))
  const [given, setGiven] = useState(() => load('given', {}))
  const [voice, setVoice] = useState(() => normalizeVoice(load('voice', DEFAULT_VOICE)))
  // Deux réglages audio indépendants : la voix (narration des histoires) et les
  // sons/effets. Migration depuis l'ancien réglage unique « soundOn ».
  const [voiceOn, setVoiceOn] = useState(() => load('voiceOn', load('soundOn', true)))
  const [effectsOn, setEffectsOn] = useState(() => load('effectsOn', true))
  const [musicOn, setMusicOn] = useState(() => load('musicOn', true))
  // Plan d'abonnement : 'none' (rien) · 'trial' (essai 3 j) · 'paid' (payant). Migration
  // depuis l'ancien booléen « premium » (true = payant). « premium » (accès lecture) en découle.
  const [plan, setPlan] = useState(() => load('plan', load('premium', false) ? 'paid' : 'none'))
  const premium = plan === 'trial' || plan === 'paid'
  // Solde de cristaux colorés (une histoire = STORY_COST cristaux). Accueil offert + bonus
  // mensuel pour les abonnés payants + packs (voir lib/crystals.js). Remplace l'ancien quota.
  const [crystals, setCrystals] = useState(() => normalizeCrystals(load('crystals', {})))
  const [payReason, setPayReason] = useState('subscribe') // motif d'ouverture du paywall
  // Contenu éditable à distance (événement à la une, épisodes, histoires longues) — lu au
  // démarrage depuis /api/content. adminPass = mot de passe admin en session ; adminDraft =
  // l'histoire en cours de création est destinée au CATALOGUE (pas au compte perso).
  const [content, setContent] = useState({ featuredEvent: null, seasons: [], longStories: [] })
  const [adminPass, setAdminPass] = useState('')
  const [adminDraft, setAdminDraft] = useState(false)
  const [editing, setEditing] = useState(false) // mode édition admin sur l'app réelle
  const [child, setChild] = useState(() => load('child', { name: 'Léa', age: '5 ans' }))
  const [screenTime, setScreenTime] = useState(() => load('screenTime', 0))
  const [favorites, setFavorites] = useState(() => load('favorites', {}))
  const [reads, setReads] = useState(() => load('reads', { total: 0, streak: 0, lastDay: '' }))
  const [allowPublish, setAllowPublish] = useState(() => load('allowPublish', true))
  const [reminder, setReminder] = useState(() => load('reminder', { on: false, time: '20:00' }))
  const [decor, setDecor] = useState(() => load('decor', 'none'))
  // Thème : SOMBRE (« Pénombre ») par défaut pour tout le monde ; clair en option
  // dans « Mon coin ». (On ignore l'ancien « nightMode » : le nouveau défaut est sombre.)
  const [darkMode, setDarkMode] = useState(() => load('darkMode', true))
  // Suivi du temps d'écran du jour : { date, seconds (utilisées), bonus (min ajoutées par un parent) }
  const [usage, setUsage] = useState(() => {
    const u = load('usage', { date: todayKey(), seconds: 0, bonus: 0 })
    return u.date === todayKey() ? u : { date: todayKey(), seconds: 0, bonus: 0 }
  })

  useEffect(() => save('stories', stories), [stories])
  useEffect(() => save('smiles', smiles), [smiles])
  useEffect(() => save('given', given), [given])
  useEffect(() => save('voice', voice), [voice])
  useEffect(() => save('voiceOn', voiceOn), [voiceOn])
  useEffect(() => save('effectsOn', effectsOn), [effectsOn])
  useEffect(() => save('musicOn', musicOn), [musicOn])
  useEffect(() => setEffectsEnabled(effectsOn), [effectsOn])
  useEffect(() => save('plan', plan), [plan])
  useEffect(() => save('crystals', crystals), [crystals])
  // Crédits automatiques : cristaux d'accueil (une fois) + bonus mensuel pour les abonnés payants.
  // applyGrants est idempotent (drapeaux welcomed/grantMonth) -> pas de double-crédit.
  useEffect(() => { setCrystals((c) => applyGrants(c, plan)) }, [plan])
  useEffect(() => save('onboarded', onboarded), [onboarded])

  // Facturation (RevenueCat) : au démarrage, synchronise le vrai plan (natif uniquement).
  useEffect(() => {
    initBilling().then((p) => {
      if (p === 'trial' || p === 'paid') setPlan(p) // abo confirmé par RevenueCat -> surclasse
      else if (p === 'none' && billingReady()) setPlan('none') // natif + "aucun abo" -> rétrograde (anti-triche)
      // p === null (indéterminé) -> on ne touche à rien (ne pas rétrograder un vrai payant sur erreur réseau)
    }).catch(() => {})
  }, [])

  // Contenu à distance : chargé au démarrage. URL ?admin -> ouvre l'espace admin.
  useEffect(() => {
    fetchContent().then(setContent).catch(() => {})
    try { if (window.location.search.includes('admin')) setScreen('admin') } catch {}
  }, [])
  useEffect(() => save('child', child), [child])
  useEffect(() => save('screenTime', screenTime), [screenTime])
  useEffect(() => save('favorites', favorites), [favorites])
  useEffect(() => save('reads', reads), [reads])
  useEffect(() => save('allowPublish', allowPublish), [allowPublish])
  useEffect(() => save('reminder', reminder), [reminder])
  useEffect(() => save('decor', decor), [decor])
  useEffect(() => save('darkMode', darkMode), [darkMode])
  useEffect(() => save('usage', usage), [usage])

  // Compte le temps passé dans l'app (par tranches de 20 s), avec remise à zéro
  // quotidienne. Sert à appliquer réellement la limite de temps d'écran.
  useEffect(() => {
    const id = setInterval(() => {
      setUsage((u) => {
        const today = todayKey()
        if (u.date !== today) return { date: today, seconds: 0, bonus: 0 }
        return { ...u, seconds: u.seconds + 20 }
      })
    }, 20000)
    return () => clearInterval(id)
  }, [])

  // Limite atteinte ? (screenTime en minutes, 0 = illimité ; bonus parent ajouté)
  const screenLocked = screenTime > 0 && usage.date === todayKey() && usage.seconds >= (screenTime + usage.bonus) * 60

  // Rappel « histoire du soir » : tant que l'app est ouverte, on programme une
  // notification douce à l'heure choisie (puis chaque jour). Sans backend, le
  // rappel ne se déclenche pas application fermée.
  useEffect(() => {
    if (!reminder.on) return
    let timer
    const schedule = () => {
      timer = setTimeout(() => {
        showNotification('Grabi 💜', "C'est l'heure de l'histoire du soir !")
        schedule()
      }, msUntil(reminder.time))
    }
    schedule()
    return () => clearTimeout(timer)
  }, [reminder])

  // Bouton retour Android : revenir en arrière dans l'app au lieu de la quitter.
  // navRef garde toujours l'écran courant pour que le listener (enregistré une fois) soit à jour.
  const navRef = useRef({ screen })
  navRef.current = { screen, origin: reader?.origin }
  // Pendant l'onboarding, le bouton retour recule d'une étape (l'Onboarding pose ce
  // callback ; il renvoie true s'il a consommé le retour, false si on est à la 1ère étape).
  const onbBackRef = useRef(null)
  useEffect(() => {
    let handle
    import('@capacitor/app')
      .then(async (m) => {
        handle = await m.App.addListener('backButton', () => {
          const { screen: s, origin } = navRef.current
          if (s === 'onboarding') { if (onbBackRef.current && onbBackRef.current()) return; return m.App.exitApp() }
          if (s === 'reader') return setScreen(origin || 'home')
          if (BACK_TARGET[s]) return setScreen(BACK_TARGET[s])
          m.App.exitApp() // sur l'accueil : quitter l'app
        })
      })
      .catch(() => {})
    return () => { if (handle && handle.remove) handle.remove() }
  }, [])

  // --- Création : QCM contextuel ---
  async function startQcm() {
    const idea = storyText.trim()
    if (!idea) return
    setError('')
    setQcmIndex(0)
    setQcmAnswers({})
    setQcmQuestions([])
    setQcmLoading(true)
    setScreen('qcm')
    try {
      const data = await generateQuestions(idea)
      setQcmQuestions(data?.questions?.length ? data.questions : buildQcm(idea))
    } catch {
      setQcmQuestions(buildQcm(idea))
    } finally {
      setQcmLoading(false)
    }
  }

  function answerQcm(value) {
    const q = qcmQuestions[qcmIndex]
    const answers = { ...qcmAnswers, [q?.q || qcmIndex]: value }
    setQcmAnswers(answers)
    if (qcmIndex >= qcmQuestions.length - 1) {
      runGenerate(storyText.trim(), answers)
    } else {
      setQcmIndex(qcmIndex + 1)
    }
  }

  async function runGenerate(idea, answers) {
    setError('')
    setStory(null)
    setScreen('generating')
    try {
      const data = await generateStory(idea, answers)
      setStory(data.story)
      // Création réussie → on dépense les cristaux de l'histoire.
      // Sauf pour un brouillon admin (destiné au catalogue, pas au compte perso).
      if (!adminDraft) setCrystals((c) => spendStory(c))
      setScreen('ready')
    } catch (e) {
      setError(
        "La génération n'a pas marché. En local, le moteur d'histoires (Claude) ne tourne qu'avec une clé API. Détail : " +
          (e?.message || e),
      )
      setScreen('create')
    }
  }

  // --- Bibliothèque ---
  function saveStory(assembled, published) {
    const id = newId()
    const entry = { id, ...assembled, published: !!published, createdAt: Date.now() }
    setStories((list) => [entry, ...list])
    setSmiles((m) => ({ ...m, [id]: 0 }))
    setStoryText('')
    setStory(null)
    setScreen(published ? 'published' : 'mine')
  }

  // Abonnement : achat réel via Google Play (natif) ; sur le web, on simule le tunnel pour tester.
  async function startSubscribe() {
    if (billingReady()) {
      try {
        const p = await purchase() // 'none' | 'trial' | 'paid'
        if (p && p !== 'none') { setPlan(p); setScreen('home') }
      } catch (e) {
        console.warn('[subscribe]', e) // achat annulé ou erreur : on ne débloque pas
      }
    } else {
      // Web (pas de facturation réelle) : 1er abonnement → essai (1 création),
      // puis, une fois l'essai épuisé, un 2e passage → payant (10/mois).
      setPlan((cur) => (cur === 'none' ? 'trial' : 'paid'))
      setScreen('home')
    }
  }
  async function restorePremium() {
    if (billingReady()) {
      const p = await restoreBilling()
      setPlan(p)
      window.alert(p !== 'none' ? 'Ton abonnement a été restauré ✨' : "Aucun achat à restaurer.")
    } else {
      window.alert(premium ? 'Tes achats sont déjà actifs ✨' : "Aucun achat à restaurer pour le moment.")
    }
  }

  // Ouvre le paywall avec un motif (adapte le message : 1re fois, essai épuisé…).
  function openPaywall(reason = 'subscribe') {
    setPayReason(reason)
    setScreen('subscribe')
  }

  // Les « histoires des copains » (publiées par d'autres enfants) sont réservées aux
  // abonnés et à l'essai gratuit. Sans abo → paywall.
  function goCommunity() {
    if (plan !== 'none') { setScreen('community'); return }
    openPaywall('community')
  }

  // Entrée « Crée ton histoire ». Assez de cristaux → atelier. Sinon :
  //  - sans abonnement → paywall abo + essai gratuit (teste 1 histoire gratos, + option cristaux) ;
  //  - abonné à sec → boutique de cristaux.
  function goCreate() {
    setAdminDraft(false) // création normale (pas un brouillon catalogue)
    if (canCreate(crystals)) { go('create', 'gn-zoom'); return }
    if (plan === 'none') { openPaywall('create'); return }
    setScreen('boutique')
  }

  // Achat d'un pack de cristaux. L'achat réel (RevenueCat, produit consommable sur Android,
  // DERRIÈRE le contrôle parental) + le crédit du solde côté serveur seront branchés à l'étape
  // suivante, une fois les produits créés dans Play Console / RevenueCat. Pour l'instant on informe.
  function buyPack() {
    window.alert('La boutique de cristaux arrive très bientôt ✨\nElle s\'activera dès que les packs seront prêts côté Google Play.')
  }

  // --- Espace admin : contenu à distance ---
  // Enregistre le contenu (optimiste : l'app reflète l'édition tout de suite, puis persiste).
  async function persistContent(next) {
    setContent(next)
    try {
      await saveContent(adminPass, next)
    } catch (e) {
      window.alert("Échec de l'enregistrement : " + (e?.message || e))
    }
    return next
  }
  // Lance la création d'une histoire longue DESTINÉE AU CATALOGUE (pas de quota, pas au compte perso).
  function startAdminStory() {
    setAdminDraft(true)
    setStoryText('')
    setStory(null)
    setScreen('create')
  }
  // Publie l'histoire assemblée dans le catalogue partagé (Blob), puis retour à l'admin.
  async function publishLongStory(assembled) {
    const entry = { id: newId(), ...assembled, premium: true, createdAt: Date.now() }
    try {
      await persistContent({ ...content, longStories: [entry, ...content.longStories] })
      setAdminDraft(false)
      setStoryText('')
      setStory(null)
      window.alert('Histoire publiée au catalogue ✨')
      setScreen('admin')
    } catch (e) {
      window.alert('Échec de la publication : ' + (e?.message || e))
    }
  }
  // « Écouter mon histoire » : on garde l'histoire ET on ouvre le lecteur directement.
  function saveAndListen(assembled) {
    const id = newId()
    const entry = { id, ...assembled, published: false, createdAt: Date.now() }
    setStories((list) => [entry, ...list])
    setSmiles((m) => ({ ...m, [id]: 0 }))
    setStoryText('')
    setStory(null)
    openReader(entry, 'mine')
  }

  const smilesOf = (item) => smiles[item.id] ?? item.smiles ?? 0
  function giveGrabi(item) {
    if (given[item.id]) return
    setGiven((g) => ({ ...g, [item.id]: true }))
    setSmiles((m) => ({ ...m, [item.id]: smilesOf(item) + 1 }))
  }

  const communityList = [...stories.filter((s) => s.published), ...SEED_COMMUNITY]
  const favoriteStories = [...stories, ...FREE_STORIES, WEEKLY_STORY, ...SEED_COMMUNITY].filter((s) => favorites[s.id])

  function toggleFavorite(id) {
    if (!id) return
    setFavorites((f) => ({ ...f, [id]: !f[id] }))
  }

  // Partage = drapeau `published` (l'histoire apparaît dans « Les histoires des enfants »).
  // Activable/désactivable À TOUT MOMENT (depuis le lecteur ou Mes histoires) — plus de
  // choix unique et définitif au moment de la création.
  function togglePublish(id) {
    if (!id) return
    setStories((list) => list.map((s) => (s.id === id ? { ...s, published: !s.published } : s)))
  }

  function deleteStory(item) {
    if (!item?.id) return
    if (!window.confirm(`Supprimer « ${item.title} » ?`)) return
    setStories((list) => list.filter((s) => s.id !== item.id))
    setFavorites((f) => { const n = { ...f }; delete n[item.id]; return n })
    setSmiles((m) => { const n = { ...m }; delete n[item.id]; return n })
    setGiven((g) => { const n = { ...g }; delete n[item.id]; return n })
  }

  // --- Lecteur ---
  function openReader(storyObj, origin) {
    if (!storyObj) return
    // Compte la lecture (les récompenses encouragent à lire plutôt qu'à créer).
    setReads((r) => {
      const today = todayKey()
      if (r.lastDay === today) return { ...r, total: (r.total || 0) + 1 }
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
      const streak = r.lastDay === yesterday ? (r.streak || 0) + 1 : 1
      return { total: (r.total || 0) + 1, streak, lastDay: today }
    })
    setReader({ story: storyObj, origin: origin || 'home' })
    setScreen('reader')
  }

  // Le lecteur a régénéré une illustration manquante (histoire quittée avant la fin de
  // la création) : on la sauvegarde dans la bibliothèque pour ne PLUS la refaire ensuite.
  function persistStoryImage(storyId, pageIndex, url) {
    if (!storyId || !url) return
    setStories((list) => list.map((s) => {
      if (s.id !== storyId) return s
      const pages = (s.pages || []).map((p, i) => {
        if (i !== pageIndex) return p
        const base = typeof p === 'string' ? { text: p } : { ...p }
        return { ...base, image: url }
      })
      return { ...s, pages, cover: s.cover || url }
    }))
  }

  function saveChild(next) {
    setChild(next)
    setScreen('settings')
  }

  // Fin de l'onboarding : on enregistre le profil enfant + la voix (déjà posée en direct),
  // on marque l'app comme découverte, et on amène à l'essai gratuit (paywall).
  function finishOnboarding({ name, age }) {
    setChild({ name: name || 'Mon enfant', age: age || '5 ans' })
    setOnboarded(true)
    openPaywall('subscribe')
  }

  async function toggleReminder() {
    if (reminder.on) {
      setReminder((r) => ({ ...r, on: false }))
      return
    }
    const ok = await ensurePermission()
    if (!ok) {
      window.alert("Pour recevoir le rappel, autorise les notifications dans ton navigateur.")
      return
    }
    setReminder((r) => ({ ...r, on: true }))
  }

  function resetData() {
    if (!window.confirm("Effacer toutes les histoires et réglages de cet appareil ? Cette action est définitive.")) return
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith('grabi:'))
        .forEach((k) => localStorage.removeItem(k))
    } catch {}
    window.location.reload()
  }

  // Musique de fond : ambiance de l'histoire dans le lecteur, sinon musique de l'app.
  const musicTrack = screen === 'reader' ? musicFor(reader?.story?.mood) : MUSIC.app

  const screenAnim = navAnim // classe d'anim, calculée au moment de la navigation (persiste pendant l'anim)

  // Navigation vers un onglet (navbar OU swipe). Copains est gaté (abo requis).
  const navTab = (target) => { if (target === 'community') goCommunity(); else setScreen(target) }
  // Swipe horizontal (droite ↔ gauche) = changer d'onglet, comme cliquer sur la navbar.
  // Seulement sur un onglet, et seulement pour un geste franchement horizontal.
  // ⚠️ On écoute les événements TACTILES (touchstart/touchend) : sur mobile, le navigateur
  // annule la séquence *pointer* dès qu'il gère le défilement, donc onPointerUp ne se
  // déclenchait pas. touchend, lui, se déclenche toujours. Le pointer ne sert que pour la SOURIS.
  const swipeRef = useRef(null)
  const justSwipedRef = useRef(false)
  const beginSwipe = (x, y) => { justSwipedRef.current = false; swipeRef.current = TAB_INDEX[screen] != null ? { x, y } : null }
  const endSwipe = (x, y) => {
    const s = swipeRef.current
    swipeRef.current = null
    if (!s) return
    const dx = x - s.x
    const dy = y - s.y
    if (Math.abs(dx) < 55 || Math.abs(dx) < Math.abs(dy) * 1.3) return // pas un swipe horizontal franc
    const next = TAB_ORDER[TAB_INDEX[screen] + (dx < 0 ? 1 : -1)] // vers la gauche → onglet suivant
    if (next) { justSwipedRef.current = true; navTab(next) }
  }
  const onTouchStart = (e) => { const t = e.touches && e.touches[0]; if (t) beginSwipe(t.clientX, t.clientY) }
  const onTouchEnd = (e) => { const t = e.changedTouches && e.changedTouches[0]; if (t) endSwipe(t.clientX, t.clientY) }
  const onPointerDown = (e) => { if (e.pointerType === 'mouse') beginSwipe(e.clientX, e.clientY) }
  const onPointerUp = (e) => { if (e.pointerType === 'mouse') endSwipe(e.clientX, e.clientY) }
  // Après un swipe, on annule le clic qui suivrait (sinon on ouvrirait aussi la carte sous le doigt).
  const onSwipeClickCapture = (e) => { if (justSwipedRef.current) { justSwipedRef.current = false; e.preventDefault(); e.stopPropagation() } }

  return (
    <div className="app-shell" data-theme={darkMode ? 'dark' : 'light'} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} onPointerDown={onPointerDown} onPointerUp={onPointerUp} onClickCapture={onSwipeClickCapture}>
      <BackgroundMusic track={musicTrack} enabled={musicOn} />
      <div style={{ display: 'contents' }} className={screenAnim || undefined}>
      {screen === 'onboarding' && (
        <Onboarding voice={voice} onVoice={setVoice} onFinish={finishOnboarding} backRef={onbBackRef} />
      )}
      {screen === 'home' && (
        <Home
          childName={child.name}
          event={content.featuredEvent || FEATURED_EVENT}
          isPremium={premium}
          editing={editing}
          onSaveContent={persistContent}
          content={content}
          crystals={crystals.balance}
          onGoFree={() => go('free', 'gn-zoom')}
          onGoLong={() => go('premium', 'gn-zoom')}
          onGoPremium={() => setScreen('premium')}
          onGoCreate={goCreate}
          onGoBoutique={() => setScreen('boutique')}
          onGoCommunity={goCommunity}
          onGoSettings={() => setScreen('settings')}
        />
      )}
      {screen === 'create' && (
        <Create storyText={storyText} setStoryText={setStoryText} onBack={() => setScreen(adminDraft ? 'admin' : 'home')} onCreate={startQcm} busy={false} error={error} />
      )}
      {screen === 'qcm' && (
        <QCM idea={storyText} questions={qcmQuestions} index={qcmIndex} loading={qcmLoading} onBack={() => setScreen('create')} onAnswer={answerQcm} />
      )}
      {screen === 'generating' && <Generating />}
      {screen === 'ready' && <Ready story={story} voice={voice} childName={child.name} onKeep={(s) => saveStory(s, false)} onListen={(s) => saveAndListen(s)} onPublish={(s) => saveStory(s, true)} allowPublish={allowPublish} adminPublish={adminDraft ? publishLongStory : null} />}
      {screen === 'free' && <Free onBack={() => setScreen('home')} onOpenReader={(s) => openReader(s, 'free')} />}
      {screen === 'premium' && (
        <Premium isPremium={premium} content={content} editing={editing} onSaveContent={persistContent} longStories={content.longStories} onSubscribe={() => openPaywall('subscribe')} onOpenReader={(s) => openReader(s, 'premium')} onHome={() => setScreen('home')} onCommunity={goCommunity} onSettings={() => setScreen('settings')} />
      )}
      {screen === 'subscribe' && (
        <Subscribe reason={payReason} onClose={() => setScreen('home')} onStart={startSubscribe} onBuyCrystals={() => setScreen('boutique')} />
      )}
      {screen === 'boutique' && (
        <Boutique crystals={crystals.balance} onBuy={buyPack} onSubscribe={() => openPaywall('subscribe')} onClose={() => setScreen('home')} />
      )}
      {screen === 'settings' && (
        <Settings
          premium={premium}
          child={child}
          darkMode={darkMode}
          onToggleDark={() => setDarkMode((d) => !d)}
          onEditProfile={() => setScreen('edit-profile')}
          onMonGrabi={() => setScreen('mon-grabi')}
          onRewards={() => setScreen('rewards')}
          onEspaceParents={() => setScreen('espace-parents')}
          onHome={() => setScreen('home')}
          onCommunity={goCommunity}
          onDecouvrir={() => setScreen('premium')}
          onMine={() => setScreen('mine')}
        />
      )}
      {screen === 'edit-profile' && (
        <EditProfile child={child} onSave={saveChild} onBack={() => setScreen('settings')} />
      )}
      {screen === 'legal' && <Legal onBack={() => setScreen('espace-parents')} />}
      {screen === 'rewards' && <Rewards child={child} stories={stories} reads={reads} smilesOf={smilesOf} onBack={() => setScreen('settings')} />}
      {screen === 'mon-grabi' && (
        <MonGrabi
          voice={voice}
          onVoice={setVoice}
          voiceOn={voiceOn}
          onToggleVoice={() => setVoiceOn((s) => !s)}
          decor={decor}
          onDecor={setDecor}
          onBack={() => setScreen('settings')}
        />
      )}
      {screen === 'espace-parents' && (
        <EspaceParents
          screenTime={screenTime}
          onScreenTime={setScreenTime}
          usedMin={Math.floor(usage.seconds / 60)}
          voiceOn={voiceOn}
          onToggleVoice={() => setVoiceOn((s) => !s)}
          effectsOn={effectsOn}
          onToggleEffects={() => setEffectsOn((s) => !s)}
          musicOn={musicOn}
          onToggleMusic={() => setMusicOn((s) => !s)}
          allowPublish={allowPublish}
          onToggleAllowPublish={() => setAllowPublish((s) => !s)}
          reminder={reminder}
          onToggleReminder={toggleReminder}
          onReminderTime={(t) => setReminder((r) => ({ ...r, time: t }))}
          premium={premium}
          onSubscribe={() => setScreen('mon-abonnement')}
          onLegal={() => setScreen('legal')}
          onResetData={resetData}
          onBack={() => setScreen('settings')}
        />
      )}
      {screen === 'mon-abonnement' && (
        <MonAbonnement
          premium={premium}
          onSubscribe={() => openPaywall('subscribe')}
          onCancel={() => { if (window.confirm("Résilier ton abonnement Premium ?")) setPlan('none') }}
          onRestore={restorePremium}
          onBack={() => setScreen('settings')}
        />
      )}
      {screen === 'community' && (
        <Community
          list={communityList}
          smilesOf={smilesOf}
          given={given}
          onGive={giveGrabi}
          onOpenReader={(s) => openReader(s, 'community')}
          onHome={() => setScreen('home')}
          onDecouvrir={() => setScreen('premium')}
          onSettings={() => setScreen('settings')}
        />
      )}
      {screen === 'mine' && (
        <MyStories
          stories={stories}
          favoriteStories={favoriteStories}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          onDelete={deleteStory}
          onTogglePublish={togglePublish}
          smilesOf={smilesOf}
          onOpenReader={(s) => openReader(s, 'mine')}
          onCreate={goCreate}
          onHome={() => setScreen('home')}
          onCommunity={goCommunity}
          onDecouvrir={() => setScreen('premium')}
          onSettings={() => setScreen('settings')}
        />
      )}
      {screen === 'published' && <Published onMine={() => setScreen('mine')} onHome={() => setScreen('home')} />}
      {screen === 'admin' && (
        <Admin
          onAuth={(pass) => { setAdminPass(pass); setEditing(true); setScreen('home') }}
          onClose={() => setScreen('home')}
        />
      )}

      </div>
      {/* Navbar PERSISTANTE : rendue une seule fois, FIXE et HORS de l'animation d'écran → elle
          ne bouge plus pendant les transitions. Affichée seulement sur les onglets. */}
      {NAV_ACTIVE[screen] && (
        <div style={{ position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 40 }}>
          <BottomNav active={NAV_ACTIVE[screen]} onAccueil={() => navTab('home')} onDecouvrir={() => navTab('premium')} onCopains={() => navTab('community')} onMonCoin={() => navTab('settings')} />
        </div>
      )}
      {/* Barre flottante « mode édition » : présente sur toute l'app quand l'admin édite. */}
      {editing && (
        <div style={{ position: 'fixed', left: '50%', transform: 'translateX(-50%)', bottom: 'calc(env(safe-area-inset-bottom, 0px) + 96px)', zIndex: 9999, display: 'flex', alignItems: 'center', gap: 12, background: 'linear-gradient(135deg,#FF8FB6,#A98CFF)', color: '#fff', borderRadius: 24, padding: '9px 10px 9px 16px', boxShadow: '0 14px 30px -8px rgba(169,140,255,.7)' }}>
          <span style={{ fontSize: 13.5, fontWeight: 800 }}>✏️ Mode édition</span>
          <button onClick={() => setEditing(false)} style={{ background: 'rgba(255,255,255,.9)', color: '#7d5fc4', borderRadius: 16, padding: '7px 13px', fontSize: 13, fontWeight: 800 }}>Quitter</button>
        </div>
      )}
      {screen === 'reader' && (
        <Reader
          story={reader?.story}
          isPremium={premium}
          voice={voice}
          soundOn={voiceOn}
          isFavorite={!!favorites[reader?.story?.id]}
          onToggleFavorite={() => reader?.story?.id && toggleFavorite(reader.story.id)}
          isShared={stories.some((s) => s.id === reader?.story?.id && s.published)}
          onToggleShare={stories.some((s) => s.id === reader?.story?.id) ? () => togglePublish(reader.story.id) : undefined}
          onClose={() => setScreen(reader?.origin || 'home')}
          onSubscribe={() => openPaywall('subscribe')}
          onImage={(i, url) => persistStoryImage(reader?.story?.id, i, url)}
        />
      )}
      {/* Couper / remettre la musique de fond — accessible depuis n'importe quel écran */}
      <button
        onClick={() => setMusicOn((s) => !s)}
        aria-label={musicOn ? 'Couper la musique' : 'Remettre la musique'}
        title={musicOn ? 'Couper la musique' : 'Remettre la musique'}
        style={{ position: 'fixed', right: 'calc(env(safe-area-inset-right, 0px) + 14px)', bottom: 'calc(env(safe-area-inset-bottom, 0px) + 92px)', width: 42, height: 42, borderRadius: '50%', background: musicOn ? 'rgba(255,255,255,.92)' : 'rgba(255,224,233,.96)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(74,58,102,.22)', zIndex: 9998 }}
      >
        <RawSvg html={musicOn ? musicOnIcon : musicOffIcon} />
      </button>
      {screenLocked && (
        <ScreenLock onGrantMore={() => setUsage((u) => ({ ...u, bonus: u.bonus + 15 }))} />
      )}
    </div>
  )
}

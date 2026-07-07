import { useState, useEffect } from 'react'
import Home from './screens/Home.jsx'
import Create from './screens/Create.jsx'
import GrabiCompanion from './screens/GrabiCompanion.jsx'
import Free from './screens/Free.jsx'
import Premium from './screens/Premium.jsx'
import Subscribe from './screens/Subscribe.jsx'
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
import TopBack from './components/BackButton.jsx'
import BackgroundMusic from './components/BackgroundMusic.jsx'
import RawSvg from './components/RawSvg.jsx'
import { generateStory, generateImage, generateQuestions, generateAudio } from './lib/api.js'
import { audioKey, getCachedAudio, putCachedAudio } from './lib/audioCache.js'
import { setEffectsEnabled, musicFor, MUSIC } from './lib/sounds.js'
import { buildQcm } from './lib/qcm.js'
import { load, save, newId } from './lib/store.js'
import { initBilling, purchase, restore as restoreBilling, billingReady } from './lib/billing.js'

const todayKey = () => new Date().toISOString().slice(0, 10)
import { FREE_STORIES, WEEKLY_STORY, SEED_COMMUNITY } from './lib/samples.js'

const musicOnIcon = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7d5fc4" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18 V6 l10-2 V16"></path><circle cx="6.5" cy="18" r="2.5"></circle><circle cx="16.5" cy="16" r="2.5"></circle></svg>`
const musicOffIcon = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C24A7A" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18 V6 l10-2 V16"></path><circle cx="6.5" cy="18" r="2.5"></circle><circle cx="16.5" cy="16" r="2.5"></circle><path d="M3 3 L21 21"></path></svg>`

function Ready({ story, voice = 'Douce', childName = '', onKeep, onListen, onPublish, allowPublish = true }) {
  const [images, setImages] = useState({}) // index -> url | 'error'

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
  useEffect(() => {
    if (!story?.pages) return
    let cancelled = false
    story.pages.forEach((p) => {
      const text = p.texte
      if (!text) return
      const key = audioKey(text, voice)
      getCachedAudio(key).then((cached) => {
        if (cancelled || cached) return // déjà en cache -> rien à faire
        generateAudio(text, voice)
          .then((d) => { if (!cancelled && d?.url) putCachedAudio(key, d.url) })
          .catch(() => {})
      })
    })
    return () => {
      cancelled = true
    }
  }, [story, voice])

  const assemble = () => {
    const pages = (story?.pages || []).map((p, i) => ({
      text: p.texte,
      image: images[i] && images[i] !== 'error' ? images[i] : null,
    }))
    return {
      title: story?.titre || 'Mon histoire',
      bg: 'linear-gradient(160deg,#C8EDFF,#E6DDFF)',
      pages,
      cover: pages.find((p) => p.image)?.image || null,
      personnages: story?.personnages || [],
      mood: story?.mood || 'calm',
    }
  }

  // Couverture = la première illustration disponible.
  const cover = (story?.pages || []).map((_, i) => images[i]).find((u) => u && u !== 'error') || null

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', position: 'relative', overflow: 'hidden', padding: 'calc(env(safe-area-inset-top, 14px) + 20px) 28px calc(env(safe-area-inset-bottom, 0px) + 28px)', animation: 'gn-fadein .35s ease' }}>
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
      <button onClick={() => onListen(assemble())} style={{ width: '100%', maxWidth: 360, marginTop: 26, background: 'linear-gradient(135deg,#FFD23F,#FFB43A)', color: '#4A3A66', borderRadius: 26, padding: '17px 12px', fontSize: 17, fontWeight: 800, boxShadow: '0 12px 26px -10px rgba(255,180,40,.75)' }}>▶&nbsp;&nbsp;Écouter mon histoire</button>

      {allowPublish ? (
        <>
          <button onClick={() => onPublish(assemble())} style={{ width: '100%', maxWidth: 360, marginTop: 12, background: 'transparent', border: '2px solid var(--card-soft)', color: 'var(--ink)', borderRadius: 26, padding: '15px 12px', fontSize: 15, fontWeight: 700 }}>Partager avec les copains</button>
          <div style={{ fontSize: 12.5, color: 'var(--ink2)', fontWeight: 500, textAlign: 'center', marginTop: 16, maxWidth: 300, lineHeight: 1.45 }}>Papa ou maman valide avant que ton histoire soit visible.</div>
        </>
      ) : (
        <div style={{ fontSize: 12.5, color: 'var(--ink2)', fontWeight: 500, textAlign: 'center', marginTop: 16, maxWidth: 300, lineHeight: 1.45 }}>Le partage est désactivé dans l'Espace parents.</div>
      )}
    </div>
  )
}

export default function App() {
  const [screen, setScreen] = useState('home')
  const [storyText, setStoryText] = useState('')
  const [error, setError] = useState('')
  const [story, setStory] = useState(null) // histoire brute en cours (avant sauvegarde)
  const [qcmQuestions, setQcmQuestions] = useState([])
  const [qcmIndex, setQcmIndex] = useState(0)
  const [qcmAnswers, setQcmAnswers] = useState({})
  const [qcmLoading, setQcmLoading] = useState(false)
  const [reader, setReader] = useState(null) // { story, origin }
  const [grabiBack, setGrabiBack] = useState('home') // écran de retour depuis le compagnon

  // --- Données persistées (localStorage) ---
  const [stories, setStories] = useState(() => load('stories', []))
  const [smiles, setSmiles] = useState(() => load('smiles', {}))
  const [given, setGiven] = useState(() => load('given', {}))
  const [voice, setVoice] = useState(() => load('voice', 'Douce'))
  // Deux réglages audio indépendants : la voix (narration des histoires) et les
  // sons/effets. Migration depuis l'ancien réglage unique « soundOn ».
  const [voiceOn, setVoiceOn] = useState(() => load('voiceOn', load('soundOn', true)))
  const [effectsOn, setEffectsOn] = useState(() => load('effectsOn', true))
  const [musicOn, setMusicOn] = useState(() => load('musicOn', true))
  const [premium, setPremium] = useState(() => load('premium', false))
  const [child, setChild] = useState(() => load('child', { name: 'Léa', age: '5 ans' }))
  const [screenTime, setScreenTime] = useState(() => load('screenTime', 0))
  const [favorites, setFavorites] = useState(() => load('favorites', {}))
  const [reads, setReads] = useState(() => load('reads', { total: 0, streak: 0, lastDay: '' }))
  const [allowPublish, setAllowPublish] = useState(() => load('allowPublish', true))
  const [reminder, setReminder] = useState(() => load('reminder', { on: false, time: '20:00' }))
  const [decor, setDecor] = useState(() => load('decor', 'none'))
  const [nightMode, setNightMode] = useState(() => load('nightMode', false))
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
  useEffect(() => save('premium', premium), [premium])

  // Facturation (RevenueCat) : au démarrage, synchronise le vrai statut Premium (natif uniquement).
  useEffect(() => {
    initBilling().then((active) => { if (active) setPremium(true) }).catch(() => {})
  }, [])
  useEffect(() => save('child', child), [child])
  useEffect(() => save('screenTime', screenTime), [screenTime])
  useEffect(() => save('favorites', favorites), [favorites])
  useEffect(() => save('reads', reads), [reads])
  useEffect(() => save('allowPublish', allowPublish), [allowPublish])
  useEffect(() => save('reminder', reminder), [reminder])
  useEffect(() => save('decor', decor), [decor])
  useEffect(() => save('nightMode', nightMode), [nightMode])
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

  // Abonnement : achat réel via Google Play (natif) ; sur le web, on débloque en mock pour tester le parcours.
  async function startSubscribe() {
    if (billingReady()) {
      try {
        const ok = await purchase()
        if (ok) { setPremium(true); setScreen('home') }
      } catch (e) {
        console.warn('[subscribe]', e) // achat annulé ou erreur : on ne débloque pas
      }
    } else {
      setPremium(true)
      setScreen('home')
    }
  }
  async function restorePremium() {
    if (billingReady()) {
      const ok = await restoreBilling()
      setPremium(ok)
      window.alert(ok ? 'Ton abonnement a été restauré ✨' : "Aucun achat à restaurer.")
    } else {
      window.alert(premium ? 'Tes achats sont déjà actifs ✨' : "Aucun achat à restaurer pour le moment.")
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

  function saveChild(next) {
    setChild(next)
    setScreen('settings')
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

  return (
    <div className="app-shell" data-theme={nightMode ? 'night' : 'day'}>
      <BackgroundMusic track={musicTrack} enabled={musicOn} />
      {screen === 'home' && (
        <Home
          childName={child.name}
          onGoFree={() => setScreen('free')}
          onGoPremium={() => setScreen('premium')}
          onGoCreate={() => setScreen('create')}
          onGoCommunity={() => setScreen('community')}
          onGoMine={() => setScreen('mine')}
          onGoSettings={() => setScreen('settings')}
          onGoGrabi={() => { setGrabiBack('home'); setScreen('grabi') }}
        />
      )}
      {screen === 'create' && (
        <Create storyText={storyText} setStoryText={setStoryText} onBack={() => setScreen('home')} onCreate={startQcm} busy={false} error={error} />
      )}
      {screen === 'qcm' && (
        <QCM idea={storyText} questions={qcmQuestions} index={qcmIndex} loading={qcmLoading} onBack={() => setScreen('create')} onAnswer={answerQcm} />
      )}
      {screen === 'generating' && <Generating />}
      {screen === 'ready' && <Ready story={story} voice={voice} childName={child.name} onKeep={(s) => saveStory(s, false)} onListen={(s) => saveAndListen(s)} onPublish={(s) => saveStory(s, true)} allowPublish={allowPublish} />}
      {screen === 'free' && <Free onBack={() => setScreen('home')} onOpenReader={(s) => openReader(s, 'free')} />}
      {screen === 'premium' && (
        <Premium isPremium={premium} onBack={() => setScreen('home')} onSubscribe={() => setScreen('subscribe')} onOpenReader={(s) => openReader(s, 'premium')} />
      )}
      {screen === 'subscribe' && (
        <Subscribe onClose={() => setScreen('home')} onStart={startSubscribe} />
      )}
      {screen === 'settings' && (
        <Settings
          premium={premium}
          child={child}
          nightMode={nightMode}
          onToggleNight={() => setNightMode((n) => !n)}
          onEditProfile={() => setScreen('edit-profile')}
          onMonGrabi={() => setScreen('mon-grabi')}
          onPlayGrabi={() => { setGrabiBack('settings'); setScreen('grabi') }}
          onRewards={() => setScreen('rewards')}
          onEspaceParents={() => setScreen('espace-parents')}
          onHome={() => setScreen('home')}
          onCommunity={() => setScreen('community')}
          onCreate={() => setScreen('create')}
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
          onPlay={() => { setGrabiBack('mon-grabi'); setScreen('grabi') }}
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
          onSubscribe={() => setScreen('subscribe')}
          onCancel={() => { if (window.confirm("Résilier ton abonnement Premium ?")) setPremium(false) }}
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
          onCreate={() => setScreen('create')}
          onMine={() => setScreen('mine')}
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
          smilesOf={smilesOf}
          onOpenReader={(s) => openReader(s, 'mine')}
          onCreate={() => setScreen('create')}
          onHome={() => setScreen('home')}
          onCommunity={() => setScreen('community')}
          onSettings={() => setScreen('settings')}
        />
      )}
      {screen === 'published' && <Published onMine={() => setScreen('mine')} onHome={() => setScreen('home')} />}
      {screen === 'reader' && (
        <Reader
          story={reader?.story}
          isPremium={premium}
          voice={voice}
          soundOn={voiceOn}
          isFavorite={!!favorites[reader?.story?.id]}
          onToggleFavorite={() => reader?.story?.id && toggleFavorite(reader.story.id)}
          onClose={() => setScreen(reader?.origin || 'home')}
          onSubscribe={() => setScreen('subscribe')}
        />
      )}
      {screen === 'grabi' && <GrabiCompanion decor={decor} onBack={() => setScreen(grabiBack)} />}
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

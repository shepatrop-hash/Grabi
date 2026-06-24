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
import { ensurePermission, showNotification, msUntil } from './lib/notify.js'
import QCM from './screens/QCM.jsx'
import Generating from './screens/Generating.jsx'
import Reader from './screens/Reader.jsx'
import Community from './screens/Community.jsx'
import MyStories from './screens/MyStories.jsx'
import Published from './screens/Published.jsx'
import TopBack from './components/BackButton.jsx'
import { generateStory, generateImage, generateQuestions } from './lib/api.js'
import { buildQcm } from './lib/qcm.js'
import { load, save, newId } from './lib/store.js'
import { SEED_COMMUNITY } from './lib/samples.js'

function Ready({ story, onKeep, onPublish, allowPublish = true }) {
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
    }
  }

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--bg)', padding: 'calc(env(safe-area-inset-top, 14px) + 12px) 24px calc(env(safe-area-inset-bottom, 0px) + 24px)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <TopBack onClick={() => onKeep(assemble())} />
        <div style={{ fontSize: 22, fontWeight: 700 }}>Ton histoire est prête</div>
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, textAlign: 'center', marginTop: 10 }}>{story?.titre}</div>
      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto' }}>
        {(story?.pages || []).map((p, i) => {
          const img = images[i]
          return (
            <div key={i} style={{ background: '#fff', borderRadius: 22, padding: 14, boxShadow: '0 8px 18px -12px rgba(74,58,102,.3)' }}>
              <div style={{ aspectRatio: '1 / 1', borderRadius: 16, overflow: 'hidden', background: 'var(--violet-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                {img && img !== 'error' ? (
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : img === 'error' ? (
                  <span style={{ fontSize: 13, color: 'var(--ink2)', padding: 12, textAlign: 'center' }}>Illustration indisponible</span>
                ) : (
                  <span style={{ fontSize: 14, color: 'var(--ink2)', fontWeight: 600, textAlign: 'center', padding: 12 }}>Grabi dessine… 🎨</span>
                )}
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--violet)' }}>Page {i + 1}</div>
              <div style={{ fontSize: 16, lineHeight: 1.5, marginTop: 4 }}>{p.texte}</div>
            </div>
          )
        })}
      </div>
      <div style={{ flex: 'none', display: 'flex', gap: 12, paddingTop: 14 }}>
        <button onClick={() => onKeep(assemble())} style={{ flex: 1, background: allowPublish ? '#fff' : 'linear-gradient(135deg,#FF8FB6,#A98CFF)', border: allowPublish ? '2px solid #EDE7F5' : 'none', borderRadius: 22, padding: '14px 12px', fontSize: 15, fontWeight: 700, color: allowPublish ? 'var(--ink)' : '#fff' }}>Garder pour moi</button>
        {allowPublish && (
          <button onClick={() => onPublish(assemble())} style={{ flex: 1, background: 'linear-gradient(135deg,#FF8FB6,#A98CFF)', color: '#fff', borderRadius: 22, padding: '14px 12px', fontSize: 15, fontWeight: 700 }}>Publier ✨</button>
        )}
      </div>
      {!allowPublish && (
        <div style={{ flex: 'none', textAlign: 'center', fontSize: 12, color: 'var(--ink2)', fontWeight: 500, paddingTop: 10 }}>La publication est désactivée dans l'Espace parents.</div>
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

  // --- Données persistées (localStorage) ---
  const [stories, setStories] = useState(() => load('stories', []))
  const [smiles, setSmiles] = useState(() => load('smiles', {}))
  const [given, setGiven] = useState(() => load('given', {}))
  const [voice, setVoice] = useState(() => load('voice', 'Douce'))
  // Deux réglages audio indépendants : la voix (narration des histoires) et les
  // sons/effets. Migration depuis l'ancien réglage unique « soundOn ».
  const [voiceOn, setVoiceOn] = useState(() => load('voiceOn', load('soundOn', true)))
  const [effectsOn, setEffectsOn] = useState(() => load('effectsOn', true))
  const [premium, setPremium] = useState(() => load('premium', false))
  const [child, setChild] = useState(() => load('child', { name: 'Léa', age: '5 ans' }))
  const [screenTime, setScreenTime] = useState(() => load('screenTime', 30))
  const [allowPublish, setAllowPublish] = useState(() => load('allowPublish', true))
  const [reminder, setReminder] = useState(() => load('reminder', { on: false, time: '20:00' }))

  useEffect(() => save('stories', stories), [stories])
  useEffect(() => save('smiles', smiles), [smiles])
  useEffect(() => save('given', given), [given])
  useEffect(() => save('voice', voice), [voice])
  useEffect(() => save('voiceOn', voiceOn), [voiceOn])
  useEffect(() => save('effectsOn', effectsOn), [effectsOn])
  useEffect(() => save('premium', premium), [premium])
  useEffect(() => save('child', child), [child])
  useEffect(() => save('screenTime', screenTime), [screenTime])
  useEffect(() => save('allowPublish', allowPublish), [allowPublish])
  useEffect(() => save('reminder', reminder), [reminder])

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

  const smilesOf = (item) => smiles[item.id] ?? item.smiles ?? 0
  function giveGrabi(item) {
    if (given[item.id]) return
    setGiven((g) => ({ ...g, [item.id]: true }))
    setSmiles((m) => ({ ...m, [item.id]: smilesOf(item) + 1 }))
  }

  const communityList = [...stories.filter((s) => s.published), ...SEED_COMMUNITY]

  // --- Lecteur ---
  function openReader(storyObj, origin) {
    if (!storyObj) return
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

  return (
    <div className="app-shell">
      {screen === 'home' && (
        <Home
          childName={child.name}
          onGoFree={() => setScreen('free')}
          onGoPremium={() => setScreen('premium')}
          onGoCreate={() => setScreen('create')}
          onGoCommunity={() => setScreen('community')}
          onGoMine={() => setScreen('mine')}
          onGoSettings={() => setScreen('settings')}
          onGoGrabi={() => setScreen('grabi')}
        />
      )}
      {screen === 'create' && (
        <Create storyText={storyText} setStoryText={setStoryText} onBack={() => setScreen('home')} onCreate={startQcm} busy={false} error={error} />
      )}
      {screen === 'qcm' && (
        <QCM idea={storyText} questions={qcmQuestions} index={qcmIndex} loading={qcmLoading} onBack={() => setScreen('create')} onAnswer={answerQcm} />
      )}
      {screen === 'generating' && <Generating />}
      {screen === 'ready' && <Ready story={story} onKeep={(s) => saveStory(s, false)} onPublish={(s) => saveStory(s, true)} allowPublish={allowPublish} />}
      {screen === 'free' && <Free onBack={() => setScreen('home')} onOpenReader={(s) => openReader(s, 'free')} />}
      {screen === 'premium' && (
        <Premium isPremium={premium} onBack={() => setScreen('home')} onSubscribe={() => setScreen('subscribe')} onOpenReader={(s) => openReader(s, 'premium')} />
      )}
      {screen === 'subscribe' && (
        <Subscribe onClose={() => setScreen('home')} onStart={() => { setPremium(true); setScreen('home') }} />
      )}
      {screen === 'settings' && (
        <Settings
          premium={premium}
          child={child}
          onEditProfile={() => setScreen('edit-profile')}
          onMonGrabi={() => setScreen('mon-grabi')}
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
      {screen === 'mon-grabi' && (
        <MonGrabi
          voice={voice}
          onVoice={setVoice}
          voiceOn={voiceOn}
          onToggleVoice={() => setVoiceOn((s) => !s)}
          onBack={() => setScreen('settings')}
          onPlay={() => setScreen('grabi')}
        />
      )}
      {screen === 'espace-parents' && (
        <EspaceParents
          screenTime={screenTime}
          onScreenTime={setScreenTime}
          voiceOn={voiceOn}
          onToggleVoice={() => setVoiceOn((s) => !s)}
          effectsOn={effectsOn}
          onToggleEffects={() => setEffectsOn((s) => !s)}
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
          onRestore={() => window.alert(premium ? 'Tes achats sont déjà actifs ✨' : "Aucun achat à restaurer pour le moment.")}
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
          onClose={() => setScreen(reader?.origin || 'home')}
          onSubscribe={() => setScreen('subscribe')}
        />
      )}
      {screen === 'grabi' && <GrabiCompanion onBack={() => setScreen('home')} />}
    </div>
  )
}

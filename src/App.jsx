import { useState, useEffect } from 'react'
import Home from './screens/Home.jsx'
import Create from './screens/Create.jsx'
import GrabiCompanion from './screens/GrabiCompanion.jsx'
import Free from './screens/Free.jsx'
import Premium from './screens/Premium.jsx'
import Subscribe from './screens/Subscribe.jsx'
import Settings from './screens/Settings.jsx'
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

function Ready({ story, onKeep, onPublish }) {
  const [images, setImages] = useState({}) // index -> url | 'error'
  const [phase, setPhase] = useState('refs') // 'refs' (personnages) | 'scenes'

  useEffect(() => {
    if (!story?.pages) return
    let cancelled = false
    setImages({})
    setPhase('refs')

    ;(async () => {
      // 1) Images de référence des personnages/éléments (texte→image) pour la cohérence
      let refUrls = []
      const persos = (story.personnages || []).slice(0, 3)
      if (persos.length) {
        const results = await Promise.all(
          persos.map((pr) =>
            generateImage(`${pr.description}. Full body character reference, single character, centered, plain soft solid pastel background.`)
              .then((d) => d.url)
              .catch(() => null),
          ),
        )
        refUrls = results.filter(Boolean)
      }
      if (cancelled) return
      setPhase('scenes')

      // 2) Chaque scène, en passant les références (mode édition) -> personnages cohérents
      story.pages.forEach((p, i) => {
        generateImage(p.prompt_illustration, refUrls)
          .then(({ url }) => {
            if (!cancelled) setImages((m) => ({ ...m, [i]: url || 'error' }))
          })
          .catch(() => {
            if (!cancelled) setImages((m) => ({ ...m, [i]: 'error' }))
          })
      })
    })()

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
                  <span style={{ fontSize: 14, color: 'var(--ink2)', fontWeight: 600, textAlign: 'center', padding: 12 }}>{phase === 'refs' ? 'Grabi prépare les personnages… ✨' : 'Grabi dessine… 🎨'}</span>
                )}
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--violet)' }}>Page {i + 1}</div>
              <div style={{ fontSize: 16, lineHeight: 1.5, marginTop: 4 }}>{p.texte}</div>
            </div>
          )
        })}
      </div>
      <div style={{ flex: 'none', display: 'flex', gap: 12, paddingTop: 14 }}>
        <button onClick={() => onKeep(assemble())} style={{ flex: 1, background: '#fff', border: '2px solid #EDE7F5', borderRadius: 22, padding: '14px 12px', fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>Garder pour moi</button>
        <button onClick={() => onPublish(assemble())} style={{ flex: 1, background: 'linear-gradient(135deg,#FF8FB6,#A98CFF)', color: '#fff', borderRadius: 22, padding: '14px 12px', fontSize: 15, fontWeight: 700 }}>Publier ✨</button>
      </div>
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
  const [soundOn, setSoundOn] = useState(() => load('soundOn', true))
  const [premium, setPremium] = useState(() => load('premium', false))
  const [child, setChild] = useState(() => load('child', { name: 'Léa', age: '5 ans' }))
  const [screenTime, setScreenTime] = useState(() => load('screenTime', 30))

  useEffect(() => save('stories', stories), [stories])
  useEffect(() => save('smiles', smiles), [smiles])
  useEffect(() => save('given', given), [given])
  useEffect(() => save('voice', voice), [voice])
  useEffect(() => save('soundOn', soundOn), [soundOn])
  useEffect(() => save('premium', premium), [premium])
  useEffect(() => save('child', child), [child])
  useEffect(() => save('screenTime', screenTime), [screenTime])

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

  function editChild() {
    const name = window.prompt("Prénom de l'enfant ?", child.name)
    if (name && name.trim()) setChild((c) => ({ ...c, name: name.trim() }))
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
      {screen === 'ready' && <Ready story={story} onKeep={(s) => saveStory(s, false)} onPublish={(s) => saveStory(s, true)} />}
      {screen === 'free' && <Free onBack={() => setScreen('home')} onOpenReader={(s) => openReader(s, 'free')} />}
      {screen === 'premium' && (
        <Premium isPremium={premium} onBack={() => setScreen('home')} onSubscribe={() => setScreen('subscribe')} onOpenReader={(s) => openReader(s, 'premium')} />
      )}
      {screen === 'subscribe' && (
        <Subscribe onClose={() => setScreen('home')} onStart={() => { setPremium(true); setScreen('home') }} />
      )}
      {screen === 'settings' && (
        <Settings
          voice={voice}
          onVoice={setVoice}
          soundOn={soundOn}
          onToggleSound={() => setSoundOn((s) => !s)}
          premium={premium}
          child={child}
          onEditProfile={editChild}
          screenTime={screenTime}
          onCycleScreenTime={() => setScreenTime((t) => (t >= 60 ? 15 : t + 15))}
          onSubscribe={() => setScreen('subscribe')}
          onHome={() => setScreen('home')}
          onCommunity={() => setScreen('community')}
          onCreate={() => setScreen('create')}
          onMine={() => setScreen('mine')}
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
          soundOn={soundOn}
          onClose={() => setScreen(reader?.origin || 'home')}
          onSubscribe={() => setScreen('subscribe')}
        />
      )}
      {screen === 'grabi' && <GrabiCompanion onBack={() => setScreen('home')} />}
    </div>
  )
}

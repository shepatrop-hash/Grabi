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
import Grabi from './components/Grabi.jsx'
import RawSvg from './components/RawSvg.jsx'
import { generateStory, generateImage } from './lib/api.js'
import { buildQcm } from './lib/qcm.js'

const backIcon = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4A3A66" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5 L8 12 L15 19"></path></svg>`

function TopBack({ onBack }) {
  return (
    <button onClick={onBack} style={{ width: 48, height: 48, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 14px rgba(74,58,102,.12)', flex: 'none' }}>
      <RawSvg html={backIcon} />
    </button>
  )
}

function Ready({ story, onBack, onPublish }) {
  const [images, setImages] = useState({}) // index -> url | 'error'

  useEffect(() => {
    if (!story?.pages) return
    let cancelled = false
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

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--bg)', padding: 'calc(env(safe-area-inset-top, 14px) + 12px) 24px calc(env(safe-area-inset-bottom, 0px) + 24px)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <TopBack onBack={onBack} />
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
                  <span style={{ fontSize: 14, color: 'var(--ink2)', fontWeight: 600 }}>Grabi dessine… 🎨</span>
                )}
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--violet)' }}>Page {i + 1}</div>
              <div style={{ fontSize: 16, lineHeight: 1.5, marginTop: 4 }}>{p.texte}</div>
            </div>
          )
        })}
      </div>
      <div style={{ flex: 'none', display: 'flex', gap: 12, paddingTop: 14 }}>
        <button onClick={onBack} style={{ flex: 1, background: '#fff', border: '2px solid #EDE7F5', borderRadius: 22, padding: '14px 12px', fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>Garder pour moi</button>
        <button onClick={onPublish} style={{ flex: 1, background: 'linear-gradient(135deg,#FF8FB6,#A98CFF)', color: '#fff', borderRadius: 22, padding: '14px 12px', fontSize: 15, fontWeight: 700 }}>Publier ✨</button>
      </div>
    </div>
  )
}

function Placeholder({ title, onBack }) {
  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--bg)', padding: 'calc(env(safe-area-inset-top, 14px) + 12px) 24px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <TopBack onBack={onBack} />
        <div style={{ fontSize: 24, fontWeight: 700 }}>{title}</div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, textAlign: 'center' }}>
        <Grabi size={120} />
        <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--ink2)', maxWidth: 240 }}>Cet écran arrive bientôt — on le construit juste après. 💛</div>
      </div>
    </div>
  )
}

export default function App() {
  const [screen, setScreen] = useState('home')
  const [storyText, setStoryText] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [story, setStory] = useState(null)
  const [voice, setVoice] = useState('Douce')
  const [qcmQuestions, setQcmQuestions] = useState([])
  const [qcmIndex, setQcmIndex] = useState(0)
  const [qcmAnswers, setQcmAnswers] = useState({})
  const [readerType, setReaderType] = useState('free')

  function startQcm() {
    const idea = storyText.trim()
    if (!idea) return
    setQcmQuestions(buildQcm(idea))
    setQcmIndex(0)
    setQcmAnswers({})
    setError('')
    setScreen('qcm')
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
        "La génération n'a pas marché. En local, le moteur d'histoires (Claude) ne tourne qu'avec « vercel dev » + ta clé API. Détail : " +
          (e?.message || e),
      )
      setScreen('create')
    }
  }

  function openReader(type) {
    setReaderType(type)
    setScreen('reader')
  }

  return (
    <div className="app-shell">
      {screen === 'home' && (
        <Home
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
        <Create
          storyText={storyText}
          setStoryText={setStoryText}
          onBack={() => setScreen('home')}
          onCreate={startQcm}
          busy={busy}
          error={error}
        />
      )}
      {screen === 'qcm' && (
        <QCM
          idea={storyText}
          questions={qcmQuestions}
          index={qcmIndex}
          onBack={() => setScreen('create')}
          onAnswer={answerQcm}
        />
      )}
      {screen === 'generating' && <Generating />}
      {screen === 'ready' && <Ready story={story} onBack={() => setScreen('home')} onPublish={() => setScreen('published')} />}
      {screen === 'free' && <Free onBack={() => setScreen('home')} onOpenReader={openReader} />}
      {screen === 'premium' && <Premium onBack={() => setScreen('home')} onSubscribe={() => setScreen('subscribe')} onOpenReader={openReader} />}
      {screen === 'subscribe' && <Subscribe onClose={() => setScreen('home')} onStart={() => setScreen('home')} />}
      {screen === 'settings' && (
        <Settings
          voice={voice}
          onVoice={setVoice}
          onSubscribe={() => setScreen('subscribe')}
          onHome={() => setScreen('home')}
          onCommunity={() => setScreen('community')}
          onCreate={() => setScreen('create')}
          onMine={() => setScreen('mine')}
        />
      )}
      {screen === 'community' && (
        <Community
          onOpenReader={openReader}
          onHome={() => setScreen('home')}
          onCreate={() => setScreen('create')}
          onMine={() => setScreen('mine')}
          onSettings={() => setScreen('settings')}
        />
      )}
      {screen === 'mine' && (
        <MyStories
          onOpenReader={openReader}
          onHome={() => setScreen('home')}
          onCommunity={() => setScreen('community')}
          onCreate={() => setScreen('create')}
          onSettings={() => setScreen('settings')}
        />
      )}
      {screen === 'published' && <Published onMine={() => setScreen('mine')} onHome={() => setScreen('home')} />}
      {screen === 'reader' && <Reader storyType={readerType} onClose={() => setScreen(readerType === 'weekly' ? 'premium' : 'free')} onSubscribe={() => setScreen('subscribe')} />}
      {screen === 'grabi' && <GrabiCompanion onBack={() => setScreen('home')} />}
    </div>
  )
}

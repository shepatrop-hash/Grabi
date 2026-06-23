import BackButton from '../components/BackButton.jsx'
import RawSvg from '../components/RawSvg.jsx'

const STORIES = [
  { title: 'Le petit dragon', sub: '3 min · audio', bg: 'var(--mint-soft)', svg: `<svg width="92" height="92" viewBox="0 0 86 86"><path d="M30,22 L26,7 L39,18 Z" fill="#6FC79A"></path><path d="M56,22 L60,7 L47,18 Z" fill="#6FC79A"></path><circle cx="43" cy="46" r="27" fill="#9CE3B4"></circle><ellipse cx="43" cy="56" rx="15" ry="11" fill="#C6F0D4"></ellipse><circle cx="37" cy="57" r="2.2" fill="#3B6B4E"></circle><circle cx="49" cy="57" r="2.2" fill="#3B6B4E"></circle><circle cx="34" cy="41" r="6" fill="#fff"></circle><circle cx="52" cy="41" r="6" fill="#fff"></circle><circle cx="35" cy="42" r="3" fill="#3B2D5A"></circle><circle cx="53" cy="42" r="3" fill="#3B2D5A"></circle></svg>` },
  { title: 'Lila la licorne', sub: '4 min · audio', bg: 'var(--pink-soft)', svg: `<svg width="92" height="92" viewBox="0 0 86 86"><path d="M43,7 L37,27 L49,27 Z" fill="#FFCC3E"></path><circle cx="43" cy="48" r="27" fill="#FFFFFF" stroke="#F7DCE8" stroke-width="2"></circle><path d="M19,38 q-7,13 4,24" fill="none" stroke="#FF7FB0" stroke-width="7" stroke-linecap="round"></path><path d="M67,38 q7,13 -4,24" fill="none" stroke="#A98CFF" stroke-width="7" stroke-linecap="round"></path><circle cx="35" cy="46" r="4.5" fill="#3B2D5A"></circle><circle cx="51" cy="46" r="4.5" fill="#3B2D5A"></circle><ellipse cx="29" cy="56" rx="6" ry="4" fill="#FFC4DC"></ellipse><ellipse cx="57" cy="56" rx="6" ry="4" fill="#FFC4DC"></ellipse><path d="M37,58 Q43,64 49,58" stroke="#3B2D5A" stroke-width="3" fill="none" stroke-linecap="round"></path></svg>` },
  { title: "Bouba l'ourson", sub: '5 min · audio', bg: 'var(--yellow-soft)', svg: `<svg width="92" height="92" viewBox="0 0 86 86"><circle cx="27" cy="30" r="9" fill="#D9A57A"></circle><circle cx="59" cy="30" r="9" fill="#D9A57A"></circle><circle cx="43" cy="48" r="27" fill="#E8BE97"></circle><ellipse cx="43" cy="56" rx="13" ry="10" fill="#FBE6D2"></ellipse><circle cx="43" cy="52" r="3.5" fill="#5A3B22"></circle><circle cx="34" cy="44" r="3.5" fill="#3B2D5A"></circle><circle cx="52" cy="44" r="3.5" fill="#3B2D5A"></circle><path d="M38,60 Q43,64 48,60" stroke="#5A3B22" stroke-width="2.5" fill="none" stroke-linecap="round"></path></svg>` },
  { title: "L'étoile rieuse", sub: '3 min · audio', bg: 'var(--sky-soft)', svg: `<svg width="92" height="92" viewBox="0 0 86 86"><path d="M43,10 L52,33 L77,34 L57,49 L64,73 L43,59 L22,73 L29,49 L9,34 L34,33 Z" fill="#FFCC3E"></path><circle cx="36" cy="42" r="3.4" fill="#3B2D5A"></circle><circle cx="50" cy="42" r="3.4" fill="#3B2D5A"></circle><ellipse cx="30" cy="49" rx="4" ry="2.6" fill="#FF9FC4"></ellipse><ellipse cx="56" cy="49" rx="4" ry="2.6" fill="#FF9FC4"></ellipse><path d="M38,48 Q43,53 48,48" stroke="#3B2D5A" stroke-width="2.6" fill="none" stroke-linecap="round"></path></svg>` },
  { title: 'Croco le câlin', sub: '4 min · audio', bg: 'var(--mint-soft)', svg: `<svg width="92" height="92" viewBox="0 0 86 86"><circle cx="30" cy="30" r="10" fill="#7FCB86"></circle><circle cx="56" cy="30" r="10" fill="#7FCB86"></circle><circle cx="30" cy="29" r="4.5" fill="#fff"></circle><circle cx="56" cy="29" r="4.5" fill="#fff"></circle><circle cx="31" cy="30" r="2.2" fill="#3B2D5A"></circle><circle cx="57" cy="30" r="2.2" fill="#3B2D5A"></circle><ellipse cx="43" cy="54" rx="29" ry="16" fill="#8AD191"></ellipse><path d="M18,55 h50" stroke="#4F8A57" stroke-width="2.5" stroke-linecap="round"></path><path d="M24,55 l3,-6 3,6 z M34,55 l3,-6 3,6 z M44,55 l3,-6 3,6 z M54,55 l3,-6 3,6 z" fill="#fff"></path></svg>` },
  { title: 'Mimi la souris', sub: '3 min · audio', bg: 'var(--violet-soft)', svg: `<svg width="92" height="92" viewBox="0 0 86 86"><circle cx="27" cy="29" r="14" fill="#C9C9D6"></circle><circle cx="59" cy="29" r="14" fill="#C9C9D6"></circle><circle cx="27" cy="29" r="8" fill="#FFC4DC"></circle><circle cx="59" cy="29" r="8" fill="#FFC4DC"></circle><circle cx="43" cy="50" r="23" fill="#D8D8E4"></circle><circle cx="35" cy="48" r="3.4" fill="#3B2D5A"></circle><circle cx="51" cy="48" r="3.4" fill="#3B2D5A"></circle><circle cx="43" cy="56" r="3.2" fill="#FF7FB0"></circle><path d="M43,59 v4" stroke="#3B2D5A" stroke-width="2" stroke-linecap="round"></path></svg>` },
]

export default function Free({ onBack, onOpenReader }) {
  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--bg)', position: 'relative', overflow: 'hidden', animation: 'gn-fadein .35s ease', paddingTop: 'calc(env(safe-area-inset-top, 14px) + 16px)' }}>
      <div style={{ position: 'absolute', top: -50, left: -40, width: 170, height: 170, borderRadius: '50%', background: 'var(--mint-soft)', opacity: 0.7 }} />
      <div style={{ padding: '14px 24px 12px', display: 'flex', alignItems: 'center', gap: 14, position: 'relative', zIndex: 2 }}>
        <BackButton onClick={onBack} />
        <div>
          <div style={{ fontSize: 26, fontWeight: 700, lineHeight: 1 }}>Histoires gratuites</div>
          <div style={{ fontSize: 14, color: 'var(--ink2)', fontWeight: 500 }}>12 histoires à écouter</div>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '6px 22px 22px', position: 'relative', zIndex: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignContent: 'start' }}>
        {STORIES.map((s) => (
          <button key={s.title} onClick={() => onOpenReader('free')} style={{ background: s.bg, borderRadius: 28, padding: 14, textAlign: 'center' }}>
            <div style={{ height: 104, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><RawSvg html={s.svg} /></div>
            <div style={{ fontSize: 16, fontWeight: 600, marginTop: 6 }}>{s.title}</div>
            <div style={{ fontSize: 12, color: 'var(--ink2)', fontWeight: 500 }}>{s.sub}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

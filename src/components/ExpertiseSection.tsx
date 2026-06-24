import { useEffect, useRef, useState } from 'react';
import type { ExpertisePanel } from '../types';

const FALLBACK: ExpertisePanel[] = [
  { num: '01', img: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=380&q=70', alt: 'Mobile', title: 'Mobile Engineering', desc: 'Production experience across Flutter, SwiftUI, React Native, and Kotlin — including complex native integrations, build pipelines, and lifecycle management.', tags: ['Flutter', 'SwiftUI', 'React Native', 'Jetpack Compose/Kotlin'] },
  { num: '02', img: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=380&q=70', alt: 'Web', title: 'Web & Backend', desc: 'React as a primary web toolkit, with Blazor WebAssembly for .NET-integrated projects. ASP.NET Core APIs, deployment on DigitalOcean, and TypeScript throughout.', tags: ['React', 'Blazor WASM', 'C#', 'ASP.NET Core'] },
  { num: '03', img: 'https://images.unsplash.com/photo-1676299081847-824916de030a?w=380&q=70', alt: 'AI', title: 'AI & Research', desc: 'MSc thesis on heuristic search in robotic task planning. Applied AI integration via Anthropic Claude and Gemini APIs in production chat and content systems.', tags: ['Heuristic Search', 'Task Planning', 'Claude API', 'Gemini'] },
  { num: '04', img: 'https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=380&q=70', alt: 'Spatial', title: 'Spatial Computing', desc: 'Early visionOS developer. RealityKit, ARKit, hand-tracking gesture systems, custom animation via FromToByAnimation, and spatial UI architecture.', tags: ['visionOS', 'RealityKit', 'ARKit', 'SwiftUI'] },
  { num: '05', img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=380&q=70', alt: 'Architecture', title: 'Architecture & Systems', desc: 'DDD, Observable patterns, cross-platform middleware design, CI/CD pipelines, and long-horizon product engineering on ZOME over 8 years.', tags: ['DDD', 'Observable', 'CI/CD', 'systemd'] },
];

export default function ExpertiseSection() {
  const [panels, setPanels] = useState<ExpertisePanel[]>(FALLBACK);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/carkus/carkus-data/main/expertise.json')
      .then(r => r.json())
      .then((data: ExpertisePanel[]) => { if (data?.length) setPanels(data); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let isDown = false, startX = 0, scrollLeft = 0;
    const onDown  = (e: MouseEvent) => { isDown = true; startX = e.pageX - el.offsetLeft; scrollLeft = el.scrollLeft; el.style.cursor = 'grabbing'; };
    const onLeave = () => { isDown = false; el.style.cursor = 'grab'; };
    const onUp    = () => { isDown = false; el.style.cursor = 'grab'; };
    const onMove  = (e: MouseEvent) => { if (!isDown) return; e.preventDefault(); el.scrollLeft = scrollLeft - (e.pageX - el.offsetLeft - startX) * 1.4; };
    el.addEventListener('mousedown', onDown);
    el.addEventListener('mouseleave', onLeave);
    el.addEventListener('mouseup', onUp);
    el.addEventListener('mousemove', onMove);
    el.style.cursor = 'grab';
    return () => { el.removeEventListener('mousedown', onDown); el.removeEventListener('mouseleave', onLeave); el.removeEventListener('mouseup', onUp); el.removeEventListener('mousemove', onMove); };
  }, [panels]);

  return (
    <section id="expertise">
      <div className="section-inner">
        <div className="section-eyebrow reveal">Expertise</div>
        <h2 className="section-heading reveal reveal-delay-1">Areas of depth</h2>
      </div>
      <div style={{ maxWidth: 1280, margin: '0 auto', paddingLeft: '3rem', paddingRight: '3rem' }}>
        <div className="scroll-hint reveal" style={{ padding: '1.4rem 0 1.4rem', maxWidth: 'none', margin: 0 }}>
          Drag to explore <span>→</span>
        </div>
      </div>
      <div style={{ maxWidth: 1280, margin: '0 auto', overflow: 'hidden' }}>
        <div className="expertise-scroll-area" id="expertiseScroll" ref={scrollRef}>
          {panels.map(p => (
            <div key={p.num} className="expertise-panel" data-num={p.num}>
              <img src={p.img} alt={p.alt} style={{ width: '100%', height: 140, objectFit: 'cover', marginBottom: '1.5rem', filter: 'brightness(0.8)' }} />
              <div className="expertise-panel-title">{p.title}</div>
              <p className="expertise-panel-desc">{p.desc}</p>
              <div className="expertise-tags">
                {p.tags.map(t => <span key={t} className="skill-box etag">{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

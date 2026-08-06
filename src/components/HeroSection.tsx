import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import type { WorkItem } from '../types';
import { downloadCv } from '../utils/cvPdf';

const FALLBACK: WorkItem[] = [
  {
    title: 'ZOME — Spatial Messenger',
    tags: ['Cross-platform', 'Swift', 'Kotlin', 'visionOS'],
    imageUrl: 'https://images.unsplash.com/photo-1759661990336-51bd4b951fea?w=600&q=80',
    imageAlt: 'ZOME platform',
    description: '',
    featured: true,
    links: [
      { label: 'App Store ↗', url: 'https://itunes.apple.com/us/app/zome/id1382123356?ls=1&mt=8' },
      { label: 'Play Store ↗', url: 'https://play.google.com/store/apps/details?id=com.zomecorp.zome' },
    ],
  },
  {
    title: 'Chatty Prayers',
    tags: ['Blazor', 'C#', 'AI'],
    imageUrl: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80',
    imageAlt: 'Chatty Prayers',
    description: '',
    featured: false,
    links: [],
  },
];

export default function HeroSection() {
  const [items, setItems] = useState<WorkItem[]>(FALLBACK);
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    
    fetch('/data/workitems.json', { signal: controller.signal } )
      .then(r => r.json())
      .then((data: WorkItem[]) => { 
        console.log('Loaded workitems data');
        const featured = data.filter(i => i.featured);
        if (featured.length > 0) setItems(featured);
      })
      .catch((error) => {
        // 3. Ignore the error if it was intentionally aborted by React
        if (error.name !== 'AbortError') {
          console.error('Failed to load workitems data:', error);
        }
      });

    // 4. Cancel the fetch immediately if React unmounts/remounts the component
    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (items.length <= 1) return;
    timerRef.current = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx(i => (i + 1) % items.length);
        setVisible(true);
      }, 700);
    }, 11000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [items]);

  const current = items[idx];

  return (
    <section id="hero">
      <div className="hero-bg" />
      <div className="hero-grid-lines" />
      <div className="hero-inner">
        <div className="hero-content">
          <div className="hero-eyebrow">Senior Software Engineer</div>
          <h1 className="hero-name">Mark<br /><em>Scicluna</em></h1>
          <p className="hero-title">Cross-Platform · Spatial Computing · AI Systems</p>
          <div className="hero-desc">
            <p>Production-grade cross-platform experiences — web to mobile, React/Blazor to Flutter/SwiftUI.</p>
            <p>Applied AI research and engineering — RAG, agentic orchestration, and structured LLM systems.</p>
            <p>Based in Melbourne. 10+ years shipping real products.</p>
          </div>
          <div className="hero-link-stack">
            <Link to="/profile" className="btn-ghost">Profile, References &amp; Media ↗</Link>
          </div>
          <div className="hero-ctas">
            <a href="#work" className="btn-primary">View Work →</a>
            <a href="#" className="btn-ghost" onClick={e => { e.preventDefault(); downloadCv(); }}>Download CV ↓</a>
          </div>
          <div className="hero-social">
            <a href="https://github.com/carkus" target="_blank" rel="noopener noreferrer" className="social-link">GitHub ↗</a>
            <a href="https://www.linkedin.com/in/mark-scicluna-b907809/" target="_blank" rel="noopener noreferrer" className="social-link">LinkedIn ↗</a>
            <a href="mailto:dicarkus@hotmail.com" className="social-link">Email ↗</a>
          </div>
        </div>
        <div className="hero-visual">
          <div className="platform-card">
            <img className="platform-img" src={current.imageUrl} alt={current.imageAlt} style={{ opacity: visible ? 0.85 : 0, ...(current.heroImagePosition ? { '--img-pos': current.heroImagePosition } as React.CSSProperties : {}) }} />
            <div className="platform-overlay" />
            {current.links.length > 0 && (
              <div className="platform-links" style={{ opacity: visible ? 1 : 0 }}>
                {current.links.map(l => (
                  <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className="platform-link">{l.label}</a>
                ))}
              </div>
            )}
            <div className="platform-label" style={{ opacity: visible ? 1 : 0 }}>
              <span>Featured Platform</span>
              <p>{current.title}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

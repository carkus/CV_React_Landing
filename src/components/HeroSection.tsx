import { useEffect, useRef, useState } from 'react';
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

const DWELL_MS = 10000; // time each project sits fully visible before sliding on
const SLIDE_MS = 1400;  // slide transition duration

export default function HeroSection() {
  const [items, setItems] = useState<WorkItem[]>(FALLBACK);
  const [idx, setIdx] = useState(0);
  const [sliding, setSliding] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch('/data/workitems.json', { signal: controller.signal } )
      .then(r => r.json())
      .then((data: WorkItem[]) => {
        // Rotate through every project with an image, not just the featured
        // few, so the card shows more of the work rather than the same 2-3 —
        // except items explicitly opted out via heroExclude.
        const withImages = data.filter(i => i.imageUrl && !i.heroExclude);
        if (withImages.length > 0) setItems(withImages);
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          console.error('Failed to load workitems data:', error);
        }
      });

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (items.length <= 1) return;
    timerRef.current = setInterval(() => setSliding(true), DWELL_MS);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [items]);

  // Called when the slide-out/slide-in transform transition finishes: commit
  // the new index and snap the track back to 0% with no transition, so the
  // now-current slide is pixel-identical to where the incoming slide just
  // landed — no flicker, ready for the next cycle to slide in from the right.
  const handleTransitionEnd = () => {
    if (!sliding) return;
    setIdx(i => (i + 1) % items.length);
    setSliding(false);
  };

  const current = items[idx];
  const next = items[(idx + 1) % items.length];

  const renderSlide = (item: WorkItem) => (
    <>
      <img
        className="platform-img"
        src={item.imageUrl}
        alt={item.imageAlt}
        style={{
          ...(item.heroImageOffset != null
            // Clamped 0-100 — outside that range the image is pushed past its
            // own edge and a blank gap shows through instead of any content.
            ? { '--img-pos': `${Math.min(100, Math.max(0, item.heroImageOffset))}% center` } as React.CSSProperties
            : item.heroImagePosition ? { '--img-pos': item.heroImagePosition } as React.CSSProperties : {}),
          ...(item.heroImageTransform ? { transform: item.heroImageTransform } : {}),
        }}
      />
      <div className="platform-overlay" />
      {item.links.length > 0 && (
        <div className="platform-links">
          {item.links.map(l => (
            <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className="platform-link">{l.label}</a>
          ))}
        </div>
      )}
      <div className="platform-label">
        <span>Featured Platform</span>
        <p>{item.title}</p>
        {item.description && <p className="platform-desc">{item.description}</p>}
      </div>
    </>
  );

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
            <p>Production-grade cross-platform experiences. Web to mobile, React/Blazor to Flutter/SwiftUI.</p>
            <p>Building AI features that hold up outside a demo — RAG search, structured outputs, fallback across providers so one API outage doesn't take the feature down with it.</p>
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
            <div
              className="platform-track"
              onTransitionEnd={handleTransitionEnd}
              style={{
                transform: `translateX(${sliding ? '-50%' : '0%'})`,
                transition: sliding ? `transform ${SLIDE_MS}ms ease` : 'none',
              }}
            >
              <div className="platform-slide">{renderSlide(current)}</div>
              <div className="platform-slide">{renderSlide(next)}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

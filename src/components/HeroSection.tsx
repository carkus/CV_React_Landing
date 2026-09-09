import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { WorkGroup, WorkItem } from '../types';
import { resolveImgPos } from '../utils/imagePosition';

// Back to a static pre-baked PDF — JobFit's own CV generator (GET
// /api/cv/download) now requires a profileId it has no default for, so the
// public download link 500'd. Update this path whenever a fresher CV is
// dropped into public/files/.
const CV_PDF_PATH = '/files/mark_scicluna_cv_sep2026.pdf';

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

// Same icon choice as WorkSection.tsx's LinkIcon — App Store/Play Store get
// their platform glyph via devicon, anything else falls back to a plain
// external-link arrow. Duplicated rather than imported since WorkSection
// doesn't export it and the two sections already carry their own separate
// FALLBACK data.
function LinkIcon({ label }: { label: string }) {
  if (/app store/i.test(label)) return <i className="devicon-apple-original" aria-hidden="true" />;
  if (/play store/i.test(label)) return <i className="devicon-android-plain" aria-hidden="true" />;
  return <span aria-hidden="true">↗</span>;
}

const DWELL_MS = 10000; // time each project sits fully visible before sliding on
const SLIDE_MS = 1400;  // slide transition duration
const SWIPE_THRESHOLD_PX = 40; // minimum horizontal drag before it counts as a swipe, not a tap

export default function HeroSection() {
  const [items, setItems] = useState<WorkItem[]>(FALLBACK);
  const [idx, setIdx] = useState(0);
  // null = idle; 'next'/'prev' = a slide transition is currently animating
  // toward that direction, driven either by the dwell timer or a swipe.
  const [pending, setPending] = useState<'next' | 'prev' | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dragRef = useRef<{ startX: number } | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch('/data/workitems.json', { signal: controller.signal } )
      .then(r => r.json())
      .then((data: WorkGroup[]) => {
        // workitems.json is grouped by subsection — flatten before filtering,
        // otherwise .featured is read off the group object (always
        // undefined) and the hero silently falls back to FALLBACK.
        // Only featured projects rotate through the hero card, and only if
        // they have an image — heroExclude opts a featured item out anyway.
        const featured = data.flatMap(g => g.items).filter(i => i.featured && i.imageUrl && !i.heroExclude);
        if (featured.length > 0) setItems(featured);
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

  // (Re)starts the auto-advance clock. Pulled out so a manual swipe can reset
  // the dwell period instead of the next auto-advance landing a moment later.
  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (items.length > 1) {
      // Functional update + only set if idle: a tick that lands mid-swipe
      // just no-ops instead of stomping the in-progress transition.
      timerRef.current = setInterval(() => setPending(p => p ?? 'next'), DWELL_MS);
    }
  };

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const triggerSlide = (dir: 'next' | 'prev') => {
    setPending(p => p ?? dir);
    resetTimer();
  };

  // Called when the track's transform transition finishes: commit the index
  // change and snap the track back to the idle -33.3333% with no transition,
  // so the now-current slide is pixel-identical to where the incoming slide
  // just landed — no flicker, ready for the next swipe or auto-advance.
  const handleTransitionEnd = () => {
    if (!pending) return;
    const dir = pending;
    setIdx(i => dir === 'next' ? (i + 1) % items.length : (i - 1 + items.length) % items.length);
    setPending(null);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    dragRef.current = { startX: e.clientX };
  };
  const handlePointerUp = (e: React.PointerEvent) => {
    const drag = dragRef.current;
    dragRef.current = null;
    if (!drag || items.length <= 1) return;
    const deltaX = e.clientX - drag.startX;
    // Small movement (or none) is a tap/click — let links underneath fire
    // normally. No whole-card launch-on-tap here: it fought the swipe/dot
    // slide selector (a tap meant to browse the carousel kept opening the
    // link instead), so launching is only via the round link buttons now.
    if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX) return;
    triggerSlide(deltaX < 0 ? 'next' : 'prev');
  };
  const handlePointerCancel = () => { dragRef.current = null; };

  // Tap a dot, jump straight to that slide — no animation, no adjacency
  // special-casing, just index → index.
  const goToIndex = (i: number) => {
    if (i === idx) return;
    setPending(null);
    setIdx(i);
    resetTimer();
  };

  const prev = items[(idx - 1 + items.length) % items.length];
  const current = items[idx];
  const next = items[(idx + 1) % items.length];

  // The dot to highlight jumps to the target as soon as a slide starts
  // animating, rather than waiting for handleTransitionEnd to commit idx —
  // it should track what's sliding into view, not what's sliding out.
  const displayIdx = pending === 'next'
    ? (idx + 1) % items.length
    : pending === 'prev'
      ? (idx - 1 + items.length) % items.length
      : idx;

  const renderSlide = (item: WorkItem) => {
    const imgPos = resolveImgPos(item.heroImageOffset, item.heroImageOffsetY, item.heroImagePosition);
    return (
    <>
      <img
        className="platform-img"
        src={item.imageUrl}
        alt={item.imageAlt}
        style={{
          ...(imgPos ? { '--img-pos': imgPos } as React.CSSProperties : {}),
          ...(item.heroImageTransform ? { transform: item.heroImageTransform } : {}),
        }}
      />
      <div className="platform-overlay" />
      {item.links.filter(l => !!l.url).length > 0 && (
        <div className="platform-links">
          {item.links.filter(l => !!l.url).map(l => (
            <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className="platform-link" aria-label={l.label} title={l.label}>
              <LinkIcon label={l.label} />
            </a>
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
  };

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
            <p>Cross-platform and native on mobile.</p>
            <p>React and .NET on web.</p>
            <p>SwiftUI, Flutter, and Kotlin on device.</p>
            <p>Production-grade AI systems: Agentic RAG, MCP, structured outputs, and multi-provider.</p>
            <p>Based in Melbourne.</p>
          </div>
          <div className="hero-link-stack">
            <Link to="/profile" className="btn-ghost">Profile, References &amp; Media ↗</Link>
          </div>
          <div className="hero-status">
            <span className="hero-status-dot" />
            Open to remote opportunities
          </div>
          <div className="hero-ctas">
            <a href="#work" className="btn-primary">View Work →</a>
            <a href={CV_PDF_PATH} download className="btn-ghost nav-cv-btn">CV ↓</a>
          </div>
          <div className="hero-social">
            <a href="https://github.com/carkus" target="_blank" rel="noopener noreferrer" className="social-link">GitHub ↗</a>
            <a href="https://www.linkedin.com/in/mark-scicluna-b907809/" target="_blank" rel="noopener noreferrer" className="social-link">LinkedIn ↗</a>
            <a href="mailto:dicarkus@hotmail.com" className="social-link">Email ↗</a>
          </div>
        </div>
        <div className="hero-visual">
          <div
            className="platform-card"
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
          >
            <div
              className="platform-track"
              onTransitionEnd={handleTransitionEnd}
              style={{
                transform: `translateX(${
                  pending === 'next' ? '-66.6666%' : pending === 'prev' ? '0%' : '-33.3333%'
                })`,
                transition: pending ? `transform ${SLIDE_MS}ms ease` : 'none',
              }}
            >
              <div className="platform-slide">{renderSlide(prev)}</div>
              <div className="platform-slide">{renderSlide(current)}</div>
              <div className="platform-slide">{renderSlide(next)}</div>
            </div>
            {items.length > 1 && (
              <div className="platform-dots">
                {items.map((item, i) => (
                  <button
                    key={item.title}
                    type="button"
                    aria-label={`Show ${item.title}`}
                    className={`platform-dot${i === displayIdx ? ' active' : ''}`}
                    onClick={e => { e.stopPropagation(); goToIndex(i); }}
                    onPointerDown={e => e.stopPropagation()}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

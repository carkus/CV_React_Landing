import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { WorkItem } from '../types';
import { useWorkGroups } from '../data/projects';
import { LinkIcon } from './WorkSection';
import SocialLinks from './SocialLinks';
import { frameStyle } from '../utils/imageFrame';
import { CV_PDF_PATH, downloadCv } from '../data/cv';
import { resolveMedia } from '../utils/media';
import { useCardSlideshow } from '../utils/useCardSlideshow';
import CardSlide from './CardSlide';
import MotionToggle from './MotionToggle';
import { prefersReducedMotion } from '../motion';

const DWELL_MS = 10000; // time each project sits fully visible before sliding on
const SLIDE_MS = 1400;  // slide transition duration
const SWIPE_THRESHOLD_PX = 40; // minimum horizontal drag before it counts as a swipe, not a tap

const cardSlides = (item: WorkItem) =>
  (item.slideshowImages ?? []).map(resolveMedia).filter(m => m.kind !== 'embed');

// A slide's image, plus the same in-card slideshow as the Work rail tiles
// (cover → gallery images/videos → cover) when `animate` is set — only the
// centred slide animates; the off-screen prev/next show just their cover.
// onCycleEnd fires when the slideshow wraps back round to the cover.
function HeroMedia({ item, animate, onCycleEnd }: { item: WorkItem; animate: boolean; onCycleEnd?: () => void }) {
  const slides = useMemo(() => cardSlides(item), [item]);
  const coverRef = useRef<HTMLImageElement>(null);
  const { frame, onScreen, next } = useCardSlideshow(
    animate ? slides.length + 1 : 1, coverRef, f => slides[f - 1]?.kind === 'video',
  );
  const lastFrame = useRef(frame);
  useEffect(() => {
    if (lastFrame.current > 0 && frame === 0) onCycleEnd?.();
    lastFrame.current = frame;
  }, [frame, onCycleEnd]);

  return (
    <>
      <img
        ref={coverRef}
        className="platform-img"
        src={item.imageUrl}
        alt={item.imageAlt}
        draggable={false}
        style={frameStyle(item.heroImageFrame)}
      />
      {animate && slides.map((m, i) => (
        <CardSlide key={m.src} media={m} className="platform-img platform-frame" active={frame === i + 1} playing={onScreen} onEnded={next} />
      ))}
    </>
  );
}

export default function HeroSection() {
  const groups = useWorkGroups();
  // Only featured projects rotate through the hero card, and only if they
  // have an image — heroExclude opts a featured item out anyway.
  const items = useMemo(
    () => groups.flatMap(g => g.items).filter(i => i.featured && i.imageUrl && !i.heroExclude),
    [groups],
  );
  const [idx, setIdx] = useState(0);
  // null = idle; 'next'/'prev' = a slide transition is currently animating
  // toward that direction, driven either by the dwell timer or a swipe.
  const [pending, setPending] = useState<'next' | 'prev' | null>(null);
  const dragRef = useRef<{ startX: number } | null>(null);
  // Bumped by a swipe so the dwell clock restarts even if idx doesn't change yet.
  const [timerKey, setTimerKey] = useState(0);
  // Auto-rotation stops for the pause button (WCAG 2.2.2) and while keyboard
  // focus is inside the card, so a slide never moves out from under focus.
  const [paused, setPaused] = useState(false);
  const [focusInside, setFocusInside] = useState(false);
  const held = paused || focusInside;

  // A project with an in-card slideshow stays up until that slideshow has
  // played through (HeroMedia's onCycleEnd); one without dwells DWELL_MS.
  // Reduced-motion users get no in-card slideshow, so they always dwell.
  const current = items[idx];
  const waitsForSlideshow = !!current && cardSlides(current).length > 0
    && !prefersReducedMotion() && !paused;

  useEffect(() => {
    if (items.length <= 1 || waitsForSlideshow || held) return;
    // Only set if idle: a tick that lands mid-swipe just no-ops instead of
    // stomping the in-progress transition.
    const t = setTimeout(() => setPending(p => p ?? 'next'), DWELL_MS);
    return () => clearTimeout(t);
  }, [idx, items.length, waitsForSlideshow, held, timerKey]);

  const handleCycleEnd = useCallback(() => {
    if (items.length > 1 && !focusInside) setPending(p => p ?? 'next');
  }, [items.length, focusInside]);

  const triggerSlide = (dir: 'next' | 'prev') => {
    setPending(p => p ?? dir);
    setTimerKey(k => k + 1);
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
  };

  const prev = items[(idx - 1 + items.length) % items.length];
  const next = items[(idx + 1) % items.length];

  // The dot to highlight jumps to the target as soon as a slide starts
  // animating, rather than waiting for handleTransitionEnd to commit idx —
  // it should track what's sliding into view, not what's sliding out.
  const displayIdx = pending === 'next'
    ? (idx + 1) % items.length
    : pending === 'prev'
      ? (idx - 1 + items.length) % items.length
      : idx;

  const renderSlide = (item: WorkItem, isCurrent = false) => {
    return (
    <>
      {/* Keyed so the centre slot remounts (back on the cover, frame 0) when
          a new project lands in it, rather than carrying the last one's frame. */}
      <HeroMedia key={item.title} item={item} animate={isCurrent && !paused} onCycleEnd={isCurrent ? handleCycleEnd : undefined} />
      <div className="platform-overlay" />
      {item.links.filter(l => !!l.url).length > 0 && (
        <div className="platform-links">
          {item.links.filter(l => !!l.url).map(l => l.inactive ? (
            <span key={l.url} className="platform-link is-inactive" role="link" aria-disabled="true" aria-label={l.label} title={l.label}>
              <LinkIcon label={l.label} />
            </span>
          ) : (
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
          <div className="hero-status">
            <span className="hero-status-dot" />
            Open to remote opportunities
          </div>
          <div className="hero-ctas">
            <a href="#work" className="btn-primary">View Work →</a>
            <a href={CV_PDF_PATH} download onClick={downloadCv} className="btn-ghost nav-cv-btn">CV ↓</a>
          </div>
          <div className="hero-link-stack">
            <Link to="/profile" className="btn-ghost hero-profile-btn">Profile, References &amp; Media&nbsp;↗</Link>
          </div>
          <div className="hero-social">
            <SocialLinks arrow={false} />
            <a href="mailto:dicarkus@hotmail.com" className="social-link">Email</a>
          </div>
        </div>
        <div className="hero-visual">
          <div
            className="platform-card"
            role="region"
            aria-roledescription="carousel"
            aria-label="Featured projects"
            onFocus={() => setFocusInside(true)}
            onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocusInside(false); }}
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
              {/* The outer two are off-screen copies of the neighbours, there
                  only for the slide animation — kept out of the tab order and
                  the accessibility tree so each project is announced once. */}
              <div className="platform-slide" aria-hidden="true" inert>{renderSlide(prev)}</div>
              <div className="platform-slide" role="group" aria-roledescription="slide" aria-label={`${idx + 1} of ${items.length}: ${current.title}`}>{renderSlide(current, true)}</div>
              <div className="platform-slide" aria-hidden="true" inert>{renderSlide(next)}</div>
            </div>
            {items.length > 1 && (
              <div className="platform-dots">
                {items.map((item, i) => (
                  <button
                    key={item.title}
                    type="button"
                    aria-label={`Show ${item.title}`}
                    aria-current={i === displayIdx ? 'true' : undefined}
                    className={`platform-dot${i === displayIdx ? ' active' : ''}`}
                    onClick={e => { e.stopPropagation(); goToIndex(i); }}
                    onPointerDown={e => e.stopPropagation()}
                  />
                ))}
                <MotionToggle paused={paused} onToggle={() => setPaused(p => !p)} what="featured projects" className="motion-toggle--on-photo" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

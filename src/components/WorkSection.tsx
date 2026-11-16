import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import ExploreLink from './ExploreLink';
import type { Rail, WorkGroup } from '../types';
import { projectBadge, useWorkGroups } from '../data/projects';
import { DISCIPLINES } from '../data/disciplines';
import { RailBlock } from './rails/BadgeRail';
import { resolveMedia } from '../utils/media';

export function SlideshowOverlay({ images, alt, startIndex, onClose, kind = 'gallery' }: { images: string[]; alt: string; startIndex: number; onClose: () => void; kind?: string }) {
  const [index, setIndex] = useState(startIndex);
  // Screenshots get a magnifying lens, on by default; toggled from the toolbar.
  const canMagnify = kind === 'screenshots';
  const [magnify, setMagnify] = useState(canMagnify);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Modal dialog behaviour: focus moves to Close on open, Tab cycles within
  // the overlay, and focus returns to whatever opened it on close.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    return () => { opener?.focus?.(); };
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>('button, [href], video[controls], iframe, [tabindex]:not([tabindex="-1"])');
        const first = focusables[0], last = focusables[focusables.length - 1];
        if (!first) return;
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        else if (!dialogRef.current.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
      }
      // A focused video uses the arrow keys to seek — leave them to it.
      if (e.target instanceof HTMLVideoElement) return;
      if (e.key === 'ArrowRight') setIndex(i => (i + 1) % images.length);
      if (e.key === 'ArrowLeft') setIndex(i => (i - 1 + images.length) % images.length);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [images.length, onClose]);

  return createPortal(
    <div ref={dialogRef} className="slideshow-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={`${alt} ${kind}`}>
      <button ref={closeRef} type="button" className="slideshow-close" onClick={onClose} aria-label={`Close ${kind}`}>✕</button>
      {canMagnify && (
        <button
          type="button"
          className={`slideshow-magnify-toggle${magnify ? ' on' : ''}`}
          onClick={e => { e.stopPropagation(); setMagnify(m => !m); }}
          aria-pressed={magnify}
          aria-label="Magnifier"
          title="Magnifier — scroll over the image to change zoom"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <circle cx="10.5" cy="10.5" r="6.5" /><path d="M15.5 15.5 21 21" />
          </svg>
        </button>
      )}
      <button
        type="button"
        className="slideshow-nav slideshow-prev"
        aria-label="Previous item"
        onClick={e => { e.stopPropagation(); setIndex(i => (i - 1 + images.length) % images.length); }}
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
      </button>
      <GalleryItem entry={images[index]} label={`${alt} — ${index + 1} of ${images.length}`} magnify={magnify} />
      <button
        type="button"
        className="slideshow-nav slideshow-next"
        aria-label="Next item"
        onClick={e => { e.stopPropagation(); setIndex(i => (i + 1) % images.length); }}
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
      </button>
      <div className="slideshow-counter" aria-live="polite">
        <span aria-hidden="true">{index + 1} / {images.length}</span>
        <span className="sr-only">Item {index + 1} of {images.length}</span>
      </div>
    </div>,
    document.body
  );
}

// One gallery entry, drawn with the viewer its file name/URL calls for (see
// utils/media.ts). Keyed on the entry so switching slides unmounts the old
// player, which stops any video that was playing.
function GalleryItem({ entry, label, magnify = false }: { entry: string; label: string; magnify?: boolean }) {
  const media = resolveMedia(entry);
  const stop = (e: React.MouseEvent) => e.stopPropagation();
  if (media.kind === 'video') {
    return (
      <video
        key={media.src}
        className="slideshow-image slideshow-video"
        src={`${media.src}#t=0.001`}
        aria-label={label}
        controls
        playsInline
        preload="metadata"
        onClick={stop}
      />
    );
  }
  if (media.kind === 'embed') {
    return (
      <iframe
        key={media.src}
        className="slideshow-image slideshow-embed"
        src={media.src}
        title={label}
        allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
        allowFullScreen
        onClick={stop}
      />
    );
  }
  if (magnify) return <MagnifiedImage key={media.src} src={media.src} alt={label} />;
  return <img key={media.src} className="slideshow-image" src={media.src} alt={label} onClick={stop} />;
}

// 600px, capped on small screens so the lens never swamps the viewport.
const lensPx = () => Math.min(600, Math.round(Math.min(window.innerWidth, window.innerHeight) * 0.6));
const ZOOM_MIN = 1.5, ZOOM_MAX = 6, ZOOM_START = 2.5;

// A screenshot with a round magnifying lens that follows the pointer (mouse,
// pen or a dragging finger). The wheel changes the zoom. The image box is
// object-fit: contain, so the lens maps the pointer onto the drawn picture
// rather than the whole box, and hides over the letterboxing.
// Lens position is written straight to the DOM — no re-render per move.
function MagnifiedImage({ src, alt }: { src: string; alt: string }) {
  const imgRef = useRef<HTMLImageElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const zoom = useRef(ZOOM_START);
  const last = useRef<{ x: number; y: number } | null>(null);

  const draw = () => {
    const img = imgRef.current, lens = lensRef.current, p = last.current;
    if (!img || !lens) return;
    if (!p || !img.naturalWidth) { lens.style.display = 'none'; return; }
    const r = img.getBoundingClientRect();
    const scale = Math.min(r.width / img.naturalWidth, r.height / img.naturalHeight);
    const w = img.naturalWidth * scale, h = img.naturalHeight * scale;
    const px = p.x - r.left - (r.width - w) / 2;
    const py = p.y - r.top - (r.height - h) / 2;
    if (px < 0 || py < 0 || px > w || py > h) { lens.style.display = 'none'; return; }
    const z = zoom.current;
    const L = lensPx();
    lens.style.display = 'block';
    lens.style.width = lens.style.height = `${L}px`;
    lens.style.left = `${p.x - L / 2}px`;
    lens.style.top = `${p.y - L / 2}px`;
    lens.style.backgroundSize = `${w * z}px ${h * z}px`;
    lens.style.backgroundPosition = `${L / 2 - px * z}px ${L / 2 - py * z}px`;
  };

  const onMove = (e: React.PointerEvent) => { last.current = { x: e.clientX, y: e.clientY }; draw(); };
  const onLeave = () => { last.current = null; draw(); };

  // Wheel zoom needs a non-passive listener to stop the page scrolling.
  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      zoom.current = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, zoom.current * (e.deltaY < 0 ? 1.15 : 1 / 1.15)));
      draw();
    };
    img.addEventListener('wheel', onWheel, { passive: false });
    return () => img.removeEventListener('wheel', onWheel);
  }, []);

  return (
    <>
      <img
        ref={imgRef}
        className="slideshow-image slideshow-image--magnify"
        src={src}
        alt={alt}
        draggable={false}
        onClick={e => e.stopPropagation()}
        onPointerDown={e => { e.stopPropagation(); onMove(e); }}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        onPointerCancel={onLeave}
      />
      <div
        ref={lensRef}
        className="slideshow-lens"
        aria-hidden="true"
        style={{ backgroundImage: `url("${src}")` }}
      />
    </>
  );
}

// Picks an icon that matches what a link actually opens, rather than a
// generic bullet for everything — App Store/Play Store get their platform
// glyph via devicon (already loaded site-wide), anything else falls back to
// a plain external-link arrow.
export function LinkIcon({ label }: { label: string }) {
  if (/app store/i.test(label)) return <i className="devicon-apple-original" aria-hidden="true" />;
  if (/play store/i.test(label)) return <i className="devicon-android-plain" aria-hidden="true" />;
  return <span aria-hidden="true">↗</span>;
}

// Each work group is shown as a slideshow rail, built from workitems.json so
// the items keep one source of truth (see data/projects.ts).
// Two prominent slides from the left, with the start of the next peeking in;
// groups with more items than that loop endlessly.
const SLIDES_PER_VIEW = 2;

function groupRail(group: WorkGroup): Rail {
  return {
    id: `work-${group.subsection}`,
    heading: group.subsection,
    layout: 'slideshow',
    perView: SLIDES_PER_VIEW,
    align: 'start',
    peek: 10,
    loop: group.items.length > SLIDES_PER_VIEW,
    height: 360,
    badges: group.items.map(i => projectBadge(i)),
  };
}

export default function WorkSection() {
  const groups = useWorkGroups();

  return (
    <section id="work">
      <div className="section-inner">
        <h2 className="section-heading reveal reveal-delay-1">Selected projects</h2>
        <RailBlock railId="featured-work" className="work-slideshow-rail rail-bleed reveal reveal-delay-2" />
        <div className="reveal reveal-delay-3">
          {groups.map(group => (
            <div key={group.subsection} className="work-group">
              <h3 className="work-subsection-header">{group.subsection}</h3>
              <RailBlock rail={groupRail(group)} className="work-group-rail rail-bleed" />
              {group.discipline && DISCIPLINES[group.discipline] && (
                <div className="work-group-deep-link">
                  <ExploreLink href={DISCIPLINES[group.discipline].path} label={`Explore ${DISCIPLINES[group.discipline].heading} in depth`} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

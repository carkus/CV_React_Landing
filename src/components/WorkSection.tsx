import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import ExploreLink from './ExploreLink';
import type { Rail, WorkGroup } from '../types';
import { projectBadge, useWorkGroups } from '../data/projects';
import { DISCIPLINES } from '../data/disciplines';
import { RailBlock } from './rails/BadgeRail';
import { resolveMedia } from '../utils/media';

export function SlideshowOverlay({ images, alt, startIndex, onClose, kind = 'gallery' }: { images: string[]; alt: string; startIndex: number; onClose: () => void; kind?: string }) {
  const [index, setIndex] = useState(startIndex);
  // Screenshots get 100/200% zoom buttons beside the image (100% is the
  // fitted view) and, under them, a magnifying-lens toggle. Both carry
  // across slides.
  const canZoom = kind === 'screenshots';
  const [zoom, setZoom] = useState(1);
  const [magnify, setMagnify] = useState(false);
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
      <button
        type="button"
        className="slideshow-nav slideshow-prev"
        aria-label="Previous item"
        onClick={e => { e.stopPropagation(); setIndex(i => (i - 1 + images.length) % images.length); }}
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
      </button>
      {canZoom ? (
        <div className="slideshow-stage" onClick={e => e.stopPropagation()}>
          <ZoomableImage key={images[index]} src={resolveMedia(images[index]).src} alt={`${alt} — ${index + 1} of ${images.length}`} zoom={zoom} magnify={magnify} />
          <div className="slideshow-zoom" role="group" aria-label="Zoom">
            {ZOOM_LEVELS.map(z => (
              <button key={z} type="button" className={zoom === z ? 'on' : ''} aria-pressed={zoom === z} onClick={() => setZoom(z)}>
                {z * 100}%
              </button>
            ))}
            <button
              type="button"
              className={`slideshow-zoom-lens${magnify ? ' on' : ''}`}
              aria-pressed={magnify}
              aria-label="Magnifier"
              title="Magnifier — scroll over the image to change its zoom"
              onClick={() => setMagnify(m => !m)}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <circle cx="10.5" cy="10.5" r="6.5" /><path d="M15.5 15.5 21 21" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <GalleryItem entry={images[index]} label={`${alt} — ${index + 1} of ${images.length}`} />
      )}
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
function GalleryItem({ entry, label }: { entry: string; label: string }) {
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
  return <img key={media.src} className="slideshow-image" src={media.src} alt={label} onClick={stop} />;
}

const ZOOM_LEVELS = [1, 2] as const;

// Magnifying lens: 600px, capped on small screens so it never swamps the
// viewport. Its own zoom (wheel-adjustable) multiplies the view's.
const lensPx = () => Math.min(600, Math.round(Math.min(window.innerWidth, window.innerHeight) * 0.6));
const LENS_MIN = 1.5, LENS_MAX = 6, LENS_START = 2.5;

// A screenshot in a fixed square view at 100% or 200% of its fitted size.
// At 200% it scrolls and drags to pan; each zoom change re-centres it.
// With `magnify`, a round lens follows the pointer over the drawn picture
// (the img is object-fit: contain, so letterboxing is skipped) and the wheel
// changes the lens zoom. Lens position is written straight to the DOM — no
// re-render per move.
function ZoomableImage({ src, alt, zoom, magnify }: { src: string; alt: string; zoom: number; magnify: boolean }) {
  const viewRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; left: number; top: number } | null>(null);
  const lensZoom = useRef(LENS_START);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const magnifyRef = useRef(magnify);

  const drawLens = () => {
    const img = imgRef.current, lens = lensRef.current, p = pointer.current;
    if (!img || !lens) return;
    if (!magnifyRef.current || !p || !img.naturalWidth) { lens.style.display = 'none'; return; }
    const r = img.getBoundingClientRect();
    const scale = Math.min(r.width / img.naturalWidth, r.height / img.naturalHeight);
    const w = img.naturalWidth * scale, h = img.naturalHeight * scale;
    const px = p.x - r.left - (r.width - w) / 2;
    const py = p.y - r.top - (r.height - h) / 2;
    if (px < 0 || py < 0 || px > w || py > h) { lens.style.display = 'none'; return; }
    const z = lensZoom.current, L = lensPx();
    lens.style.display = 'block';
    lens.style.width = lens.style.height = `${L}px`;
    lens.style.left = `${p.x - L / 2}px`;
    lens.style.top = `${p.y - L / 2}px`;
    lens.style.backgroundSize = `${w * z}px ${h * z}px`;
    lens.style.backgroundPosition = `${L / 2 - px * z}px ${L / 2 - py * z}px`;
  };

  useEffect(() => { magnifyRef.current = magnify; drawLens(); });

  useLayoutEffect(() => {
    const v = viewRef.current;
    if (!v) return;
    v.scrollLeft = (v.scrollWidth - v.clientWidth) / 2;
    v.scrollTop = (v.scrollHeight - v.clientHeight) / 2;
  }, [zoom]);

  // With the lens on, the wheel zooms the lens rather than scrolling the
  // view — a non-passive listener so it can stop the scroll.
  useEffect(() => {
    const v = viewRef.current;
    if (!v || !magnify) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      lensZoom.current = Math.min(LENS_MAX, Math.max(LENS_MIN, lensZoom.current * (e.deltaY < 0 ? 1.15 : 1 / 1.15)));
      drawLens();
    };
    v.addEventListener('wheel', onWheel, { passive: false });
    return () => v.removeEventListener('wheel', onWheel);
  }, [magnify]);

  const pans = zoom > 1;
  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => { drag.current = null; e.currentTarget.classList.remove('dragging'); };
  return (
    <div
      ref={viewRef}
      className={`slideshow-image slideshow-zoom-view${pans ? ' pans' : ''}${magnify ? ' magnify' : ''}`}
      onPointerDown={e => {
        pointer.current = { x: e.clientX, y: e.clientY };
        drawLens();
        if (!pans) return;
        const v = e.currentTarget;
        drag.current = { x: e.clientX, y: e.clientY, left: v.scrollLeft, top: v.scrollTop };
        v.setPointerCapture(e.pointerId);
        v.classList.add('dragging');
      }}
      onPointerMove={e => {
        pointer.current = { x: e.clientX, y: e.clientY };
        const d = drag.current;
        if (d) {
          e.currentTarget.scrollLeft = d.left - (e.clientX - d.x);
          e.currentTarget.scrollTop = d.top - (e.clientY - d.y);
        }
        drawLens();
      }}
      onPointerUp={endDrag}
      onPointerCancel={e => { endDrag(e); pointer.current = null; drawLens(); }}
      onPointerLeave={() => { if (!drag.current) { pointer.current = null; drawLens(); } }}
      onScroll={drawLens}
    >
      <img ref={imgRef} src={src} alt={alt} draggable={false} style={{ width: `${zoom * 100}%`, height: `${zoom * 100}%` }} />
      <div ref={lensRef} className="slideshow-lens" aria-hidden="true" style={{ backgroundImage: `url("${src}")` }} />
    </div>
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

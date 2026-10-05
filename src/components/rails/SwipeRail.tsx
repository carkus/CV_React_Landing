import { Children, cloneElement, isValidElement, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';

// Generic horizontal swipe track — knows nothing about badges or data, just
// lays out whatever children it's given. Touch devices get native momentum
// swiping; mouse users can drag (same idea as ExpertiseSection's
// drag-scroll) or use the buttons.
//
// variant 'row'       — children at their own widths, snap to the left edge.
// variant 'slideshow' — one child at a time, snapped to the centre, with
//                       `peek`% of each neighbour showing either side; the
//                       centred child gets .is-active, the rest are dimmed.
//                       `perView` > 1 shows that many slides at once.
//
// `loop` (slideshow only) makes it endless: the children are rendered three
// times — [copies | originals | copies] — and whenever scrolling settles on a
// copy, the track jumps instantly to the same slide in the original set, so
// there's always more to scroll in either direction.

const DRAG_THRESHOLD_PX = 6;
// How long scrolling must be quiet before a looping rail re-centres.
const SETTLE_MS = 140;
// Autoplay only runs while the rail crosses this central band of the
// viewport (rootMargin trims 45% off the top and bottom).
const AUTOPLAY_BAND = '-45% 0px -45% 0px';
// How often autoplay re-checks whether it's allowed to move.
const AUTOPLAY_TICK_MS = 200;

export interface SwipeRailProps {
  children: ReactNode;
  label?: string;
  variant?: 'row' | 'slideshow';
  /** Slideshow: percent of the rail's width each neighbour shows. */
  peek?: number;
  /** Slideshow: slides visible at once (exposed to CSS as --per-view). */
  perView?: number;
  /** Slideshow: wrap around endlessly. */
  loop?: boolean;
  /** Slideshow: 'center' snaps the active slide to the middle; 'start' snaps
   *  to the left edge, marks the first `perView` slides in view as active,
   *  and shows `peek`% of the next one on the right only. */
  align?: 'center' | 'start';
  /** Slideshow: auto-advance every this many ms while the rail sits at the
   *  vertical centre of the screen; 0 turns it off. Pauses on hover and for
   *  a full interval after any manual swipe, click or key press. */
  autoplayMs?: number;
  /** Slide/badge height in px, exposed to CSS as --slide-h. */
  height?: number;
}

export default function SwipeRail({ children, label, variant = 'row', peek = 8, perView = 1, loop = false, align = 'center', autoplayMs = 5000, height }: SwipeRailProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [active, setActive] = useState(0);
  const [dragging, setDragging] = useState(false);
  const rawActiveRef = useRef(0);
  const items = Children.toArray(children);
  const count = items.length;
  const slideshow = variant === 'slideshow';
  const looping = slideshow && loop && count > 1;
  const startAligned = slideshow && align === 'start';
  const copies = (prefix: string) =>
    items.map((c, i) => (isValidElement(c) ? cloneElement(c, { key: `${prefix}-${i}` }) : c));
  const rendered = looping ? [...copies('pre'), ...items, ...copies('post')] : items;

  // Index of the child nearest the snap point — the track's centre, or its
  // left edge when start-aligned.
  const nearestIndex = useCallback((el: HTMLDivElement) => {
    const base = (el.children[0] as HTMLElement | undefined)?.offsetLeft ?? 0;
    const mid = el.scrollLeft + el.clientWidth / 2;
    let best = 0, bestDist = Infinity;
    Array.from(el.children).forEach((c, i) => {
      const child = c as HTMLElement;
      const dist = startAligned
        ? Math.abs(child.offsetLeft - base - el.scrollLeft)
        : Math.abs(child.offsetLeft + child.offsetWidth / 2 - mid);
      if (dist < bestDist) { bestDist = dist; best = i; }
    });
    return best;
  }, [startAligned]);

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 2);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
    if (slideshow) {
      const raw = nearestIndex(el);
      const idx = looping ? raw % count : raw;
      rawActiveRef.current = raw;
      setActive(idx);
      // Start-aligned rails mark every fully-shown slide active. --per-view
      // is read back from CSS since media queries change it.
      const span = startAligned
        ? Math.max(1, Math.round(parseFloat(getComputedStyle(el).getPropertyValue('--per-view')) || perView))
        : 1;
      // Children are arbitrary markup, so mark the active ones on the DOM
      // directly rather than asking every child type to accept a prop. When
      // looping, every copy of an active slide is marked, so the jump back to
      // the originals doesn't replay the fade-in.
      Array.from(el.children).forEach((c, i) => {
        const offset = looping ? ((i % count) - idx + count) % count : i - raw;
        c.classList.toggle('is-active', offset >= 0 && offset < span);
        if (looping) {
          if (i < count || i >= 2 * count) c.setAttribute('aria-hidden', 'true');
          else c.removeAttribute('aria-hidden');
        }
      });
    }
  }, [slideshow, looping, startAligned, perView, count, nearestIndex]);

  // Scroll position that snaps child `i` into place — centred, or flush left
  // when start-aligned.
  const centreOf = useCallback((el: HTMLDivElement, i: number) => {
    const child = el.children[i] as HTMLElement | undefined;
    if (!child) return el.scrollLeft;
    if (startAligned) return child.offsetLeft - (el.children[0] as HTMLElement).offsetLeft;
    return child.offsetLeft - (el.clientWidth - child.offsetWidth) / 2;
  }, [startAligned]);

  // Looping: start on the first original, not the first copy.
  useLayoutEffect(() => {
    const el = trackRef.current;
    if (!el || !looping) return;
    el.scrollTo({ left: centreOf(el, count), behavior: 'instant' });
  }, [looping, count, centreOf]);

  // Looping: once scrolling settles on a copy, jump to the same slide in the
  // original set. Both sit at the same snapped alignment, so it's invisible.
  useEffect(() => {
    const el = trackRef.current;
    if (!el || !looping) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const recentre = () => {
      if (el.classList.contains('dragging')) return;
      const raw = nearestIndex(el);
      if (raw >= count && raw < 2 * count) return;
      const target = raw < count ? raw + count : raw - count;
      const a = el.children[raw] as HTMLElement, b = el.children[target] as HTMLElement;
      el.scrollTo({ left: el.scrollLeft + b.offsetLeft - a.offsetLeft, behavior: 'instant' });
    };
    const onScroll = () => { clearTimeout(timer); timer = setTimeout(recentre, SETTLE_MS); };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => { clearTimeout(timer); el.removeEventListener('scroll', onScroll); };
  }, [looping, count, nearestIndex]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    update();
    el.addEventListener('scroll', update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => { el.removeEventListener('scroll', update); ro.disconnect(); };
  }, [update, children]);

  // Mouse drag only — touch and pen already scroll natively. Scroll-snap is
  // switched off for the duration of a drag (via .dragging) so the track
  // follows the pointer instead of fighting it, then re-snaps on release.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let down = false, moved = false, startX = 0, startScroll = 0;

    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      down = true; moved = false; startX = e.clientX; startScroll = el.scrollLeft;
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) < DRAG_THRESHOLD_PX) return;
      if (!moved) { moved = true; setDragging(true); el.setPointerCapture(e.pointerId); }
      el.scrollLeft = startScroll - dx;
    };
    const onUp = (e: PointerEvent) => {
      if (!down) return;
      down = false;
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
      setDragging(false);
    };
    // A drag that ends over a link or button mustn't also count as a click.
    const onClickCapture = (e: MouseEvent) => {
      if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; }
    };

    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);
    el.addEventListener('click', onClickCapture, true);
    return () => {
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
      el.removeEventListener('click', onClickCapture, true);
    };
  }, []);

  // `i` is a rendered-child index (so, when looping, it can be a copy).
  const goToRaw = (i: number) => {
    const el = trackRef.current;
    if (!el || !el.children[i]) return;
    el.scrollTo({ left: centreOf(el, i), behavior: 'smooth' });
  };
  // `i` is a slide number, 0..count-1 — for the dots.
  const goTo = (i: number) => goToRaw(looping ? count + i : i);

  const step = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    if (looping) goToRaw(Math.min(3 * count - 1, Math.max(0, rawActiveRef.current + dir)));
    else if (slideshow) goTo(Math.min(count - 1, Math.max(0, active + dir)));
    else el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  const prevDisabled = looping ? false : slideshow && !startAligned ? active === 0 : !canPrev;
  const nextDisabled = looping ? false : slideshow && !startAligned ? active >= count - 1 : !canNext;

  // Autoplay's "next": a non-looping rail wraps back to the first slide.
  const advance = () => (looping || !nextDisabled ? step(1) : goTo(0));
  const advanceRef = useRef(advance);
  useEffect(() => { advanceRef.current = advance; });

  useEffect(() => {
    const root = rootRef.current, track = trackRef.current;
    if (!slideshow || !autoplayMs || count < 2 || !root || !track) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let centred = false;
    const io = new IntersectionObserver(([e]) => { centred = e.isIntersecting; }, { rootMargin: AUTOPLAY_BAND });
    io.observe(root);

    // Hover is read live from :hover rather than tracked via pointerenter —
    // enter events don't fire when the page scrolls a rail under a still
    // mouse. Gated on (hover: hover) so a tap's sticky :hover on touch
    // screens doesn't freeze autoplay.
    const canHover = window.matchMedia('(hover: hover)').matches;
    const isHovered = () => canHover && root.matches(':hover');

    // `last` restarts whenever autoplay is held off (off-centre, hovered,
    // tab hidden) or the user interacts, so the next step always comes a
    // full interval after the slideshow is free to move again.
    let last = Date.now();
    const interacted = () => { last = Date.now(); };
    const timer = setInterval(() => {
      const now = Date.now();
      if (!centred || isHovered() || document.hidden) { last = now; return; }
      if (now - last < autoplayMs) return;
      last = now;
      advanceRef.current();
    }, AUTOPLAY_TICK_MS);

    const userEvents = ['pointerdown', 'wheel', 'touchstart', 'keydown'] as const;
    userEvents.forEach(t => root.addEventListener(t, interacted, { passive: true }));
    return () => {
      clearInterval(timer);
      io.disconnect();
      userEvents.forEach(t => root.removeEventListener(t, interacted));
    };
  }, [slideshow, autoplayMs, count]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!slideshow) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
  };

  const style = {
    ...(slideshow ? { '--peek': `${peek}%`, '--per-view': perView } : {}),
    ...(height ? { '--slide-h': `${height}px` } : {}),
  } as CSSProperties;

  const showControls = slideshow ? count > 1 : canPrev || canNext;

  return (
    <div ref={rootRef} className={`swipe-rail swipe-rail--${variant}${slideshow && perView > 1 ? ' swipe-rail--multi' : ''}${startAligned ? ' swipe-rail--start' : ''}${canPrev ? ' can-prev' : ''}${canNext ? ' can-next' : ''}`} style={style}>
      <div
        ref={trackRef}
        className={`swipe-rail-track${dragging ? ' dragging' : ''}`}
        role="region"
        aria-label={label}
        aria-roledescription={slideshow ? 'carousel' : undefined}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onDragStart={e => e.preventDefault()}
      >
        {rendered}
      </div>
      {showControls && (
        <div className="swipe-rail-controls">
          <button type="button" className="swipe-rail-btn" onClick={() => step(-1)} disabled={prevDisabled} aria-label="Previous"><Chevron dir="left" /></button>
          {slideshow && (
            <div className="swipe-rail-dots">
              {Array.from({ length: count }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`swipe-rail-dot${i === active ? ' active' : ''}`}
                  onClick={() => goTo(i)}
                  aria-label={`Go to slide ${i + 1} of ${count}`}
                  aria-current={i === active}
                />
              ))}
            </div>
          )}
          <button type="button" className="swipe-rail-btn" onClick={() => step(1)} disabled={nextDisabled} aria-label="Next"><Chevron dir="right" /></button>
        </div>
      )}
    </div>
  );
}

function Chevron({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={dir === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} />
    </svg>
  );
}

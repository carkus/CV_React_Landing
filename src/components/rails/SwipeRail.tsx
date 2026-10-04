import { Children, useCallback, useEffect, useRef, useState } from 'react';
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

const DRAG_THRESHOLD_PX = 6;

export interface SwipeRailProps {
  children: ReactNode;
  label?: string;
  variant?: 'row' | 'slideshow';
  /** Slideshow: percent of the rail's width each neighbour shows. */
  peek?: number;
  /** Slide/badge height in px, exposed to CSS as --slide-h. */
  height?: number;
}

export default function SwipeRail({ children, label, variant = 'row', peek = 8, height }: SwipeRailProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [active, setActive] = useState(0);
  const [dragging, setDragging] = useState(false);
  const count = Children.count(children);
  const slideshow = variant === 'slideshow';

  // Index of the child whose centre is nearest the track's centre.
  const nearestIndex = useCallback((el: HTMLDivElement) => {
    const mid = el.scrollLeft + el.clientWidth / 2;
    let best = 0, bestDist = Infinity;
    Array.from(el.children).forEach((c, i) => {
      const child = c as HTMLElement;
      const dist = Math.abs(child.offsetLeft + child.offsetWidth / 2 - mid);
      if (dist < bestDist) { bestDist = dist; best = i; }
    });
    return best;
  }, []);

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 2);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
    if (slideshow) {
      const idx = nearestIndex(el);
      setActive(idx);
      // Children are arbitrary markup, so mark the active one on the DOM
      // directly rather than asking every child type to accept a prop.
      Array.from(el.children).forEach((c, i) => c.classList.toggle('is-active', i === idx));
    }
  }, [slideshow, nearestIndex]);

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

  const goTo = (i: number) => {
    const el = trackRef.current;
    const child = el?.children[i] as HTMLElement | undefined;
    if (!el || !child) return;
    el.scrollTo({ left: child.offsetLeft - (el.clientWidth - child.offsetWidth) / 2, behavior: 'smooth' });
  };

  const step = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    if (slideshow) goTo(Math.min(count - 1, Math.max(0, active + dir)));
    else el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!slideshow) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
  };

  const style = {
    ...(slideshow ? { '--peek': `${peek}%` } : {}),
    ...(height ? { '--slide-h': `${height}px` } : {}),
  } as CSSProperties;

  const prevDisabled = slideshow ? active === 0 : !canPrev;
  const nextDisabled = slideshow ? active >= count - 1 : !canNext;
  const showControls = slideshow ? count > 1 : canPrev || canNext;

  return (
    <div className={`swipe-rail swipe-rail--${variant}${canPrev ? ' can-prev' : ''}${canNext ? ' can-next' : ''}`} style={style}>
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
        {children}
      </div>
      {showControls && (
        <div className="swipe-rail-controls">
          <button type="button" className="swipe-rail-btn" onClick={() => step(-1)} disabled={prevDisabled} aria-label="Previous">‹</button>
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
          <button type="button" className="swipe-rail-btn" onClick={() => step(1)} disabled={nextDisabled} aria-label="Next">›</button>
        </div>
      )}
    </div>
  );
}

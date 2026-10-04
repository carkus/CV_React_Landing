import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

// Generic horizontal swipe row — knows nothing about badges or data, just
// lays out whatever children it's given in a snapping, scrollable track.
// Touch devices get native momentum swiping; mouse users can drag (same
// idea as ExpertiseSection's drag-scroll) or use the arrow buttons.

const DRAG_THRESHOLD_PX = 6;

export default function SwipeRail({ children, label }: { children: ReactNode; label?: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [dragging, setDragging] = useState(false);

  const updateEdges = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 2);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateEdges();
    el.addEventListener('scroll', updateEdges, { passive: true });
    const ro = new ResizeObserver(updateEdges);
    ro.observe(el);
    return () => { el.removeEventListener('scroll', updateEdges); ro.disconnect(); };
  }, [updateEdges, children]);

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
    // A drag that ends over a link mustn't also count as a click on it.
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

  const page = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  return (
    <div className={`swipe-rail${canPrev ? ' can-prev' : ''}${canNext ? ' can-next' : ''}`}>
      <div
        ref={trackRef}
        className={`swipe-rail-track${dragging ? ' dragging' : ''}`}
        role="region"
        aria-label={label}
        tabIndex={0}
        onDragStart={e => e.preventDefault()}
      >
        {children}
      </div>
      {(canPrev || canNext) && (
        <div className="swipe-rail-controls">
          <button type="button" className="swipe-rail-btn" onClick={() => page(-1)} disabled={!canPrev} aria-label="Scroll left">‹</button>
          <button type="button" className="swipe-rail-btn" onClick={() => page(1)} disabled={!canNext} aria-label="Scroll right">›</button>
        </div>
      )}
    </div>
  );
}

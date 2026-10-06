import { useEffect, useState } from 'react';

// In-card slideshow timing, drawn fresh before every change so no two gaps
// are the same and side-by-side cards never fall into step: each gallery
// image shows for SLIDE_MIN_MS plus up to SLIDE_RANGE_MS; back on the cover (title) image
// it rests for COVER_MS plus up to COVER_JITTER_MS.
const SLIDE_MIN_MS = 2400;
const SLIDE_RANGE_MS = 3200; // 2.4–5.6 s
const COVER_MS = 5000;
const COVER_JITTER_MS = 2500;

// Cycles cover → gallery images → cover … while the card is on screen. Frame 0
// is the cover. Stops (on the cover) for reduced-motion users and while the
// card is scrolled out of view.
export function useCardSlideshow(frameCount: number, anchor: React.RefObject<HTMLElement | null>) {
  const [frame, setFrame] = useState(0);
  const [onScreen, setOnScreen] = useState(false);

  useEffect(() => {
    const el = anchor.current;
    if (!el || frameCount < 2) return;
    const obs = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [anchor, frameCount]);

  useEffect(() => {
    if (!onScreen || frameCount < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const delay = frame === 0
      ? COVER_MS + Math.random() * COVER_JITTER_MS
      : SLIDE_MIN_MS + Math.random() * SLIDE_RANGE_MS;
    const t = setTimeout(() => setFrame(f => (f + 1) % frameCount), delay);
    return () => clearTimeout(t);
  }, [frame, onScreen, frameCount]);

  return frame;
}

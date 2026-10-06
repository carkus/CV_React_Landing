import { useEffect, useState } from 'react';

// In-card slideshow timing, each value picked once per card so cards side by
// side keep different rhythms instead of flipping together: every gallery
// image shows for SLIDE_MS ± SLIDE_JITTER_MS; back on the cover (title) image
// it rests for COVER_MS plus up to COVER_JITTER_MS.
const SLIDE_MS = 3000;
const SLIDE_JITTER_MS = 600;
const COVER_MS = 10000;
const COVER_JITTER_MS = 5000;

// Cycles cover → gallery images → cover … while the card is on screen. Frame 0
// is the cover. Stops (on the cover) for reduced-motion users and while the
// card is scrolled out of view.
export function useCardSlideshow(frameCount: number, anchor: React.RefObject<HTMLElement | null>) {
  const [frame, setFrame] = useState(0);
  const [onScreen, setOnScreen] = useState(false);
  const [coverDelay] = useState(() => COVER_MS + Math.random() * COVER_JITTER_MS);
  const [slideDelay] = useState(() => SLIDE_MS + (Math.random() * 2 - 1) * SLIDE_JITTER_MS);

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
    const delay = frame === 0 ? coverDelay : slideDelay;
    const t = setTimeout(() => setFrame(f => (f + 1) % frameCount), delay);
    return () => clearTimeout(t);
  }, [frame, onScreen, frameCount, coverDelay, slideDelay]);

  return frame;
}

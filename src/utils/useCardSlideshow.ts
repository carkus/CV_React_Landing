import { useCallback, useEffect, useState } from 'react';

// In-card slideshow timing, drawn fresh before every change so no two gaps
// are the same and side-by-side cards never fall into step: each gallery
// image shows for SLIDE_MIN_MS plus up to SLIDE_RANGE_MS; back on the cover (title) image
// it rests for COVER_MS plus up to COVER_JITTER_MS.
const SLIDE_MIN_MS = 2400;
const SLIDE_RANGE_MS = 3200; // 2.4–5.6 s
const COVER_MS = 5000;
const COVER_JITTER_MS = 2500;
// A video frame waits for its clip to end (the slide calls `next`); this is
// only the backstop for a clip that's very long, stalls or never plays.
const VIDEO_MAX_MS = 60000;

// Cycles cover → gallery frames → cover … while the card is on screen. Frame 0
// is the cover. Stops (on the cover) for reduced-motion users and while the
// card is scrolled out of view. `isVideoFrame(i)` marks frames that hold until
// `next()` is called instead of using the timer.
export function useCardSlideshow(
  frameCount: number,
  anchor: React.RefObject<HTMLElement | null>,
  isVideoFrame: (frame: number) => boolean = () => false,
) {
  const [frame, setFrame] = useState(0);
  const [onScreen, setOnScreen] = useState(false);
  const next = useCallback(() => setFrame(f => (f + 1) % frameCount), [frameCount]);
  const holdsForVideo = isVideoFrame(frame);

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
    const delay = holdsForVideo
      ? VIDEO_MAX_MS
      : frame === 0
        ? COVER_MS + Math.random() * COVER_JITTER_MS
        : SLIDE_MIN_MS + Math.random() * SLIDE_RANGE_MS;
    const t = setTimeout(next, delay);
    return () => clearTimeout(t);
  }, [frame, onScreen, frameCount, holdsForVideo, next]);

  return { frame, onScreen, next };
}

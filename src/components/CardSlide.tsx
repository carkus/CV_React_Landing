import { useEffect, useRef } from 'react';
import type { GalleryMedia } from '../utils/media';

// One frame of an in-card slideshow (see utils/useCardSlideshow.ts), stacked
// over the cover and faded in by an `.active` class. Images just sit there; a
// video plays muted from the start each time its frame comes round, pauses
// while the card is off screen, and calls onEnded when it finishes (or fails)
// so the slideshow can move on. Sound and controls are the Gallery overlay's job.
export default function CardSlide({ media, className, active, playing, onEnded }: {
  media: GalleryMedia;
  className: string;
  active: boolean;
  /** False while the card is scrolled out of view: an active video pauses. */
  playing: boolean;
  onEnded: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wasActive = useRef(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (active && !wasActive.current) v.currentTime = 0;
    wasActive.current = active;
    if (active && playing) {
      // A rejected play() (e.g. a codec the browser lacks) is covered by the
      // slideshow's fallback timer.
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [active, playing]);

  const cls = `${className}${active ? ' active' : ''}`;
  if (media.kind === 'video') {
    return (
      <video
        ref={videoRef}
        className={cls}
        src={`${media.src}#t=0.001`}
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
        onEnded={() => { if (active) onEnded(); }}
        onError={() => { if (active) onEnded(); }}
      />
    );
  }
  return <img className={cls} src={media.src} alt="" aria-hidden="true" loading="lazy" draggable={false} />;
}

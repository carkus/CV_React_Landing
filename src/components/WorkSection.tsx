import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import ExploreLink from './ExploreLink';
import type { Rail, WorkGroup } from '../types';
import { projectBadge, useWorkGroups } from '../data/projects';
import { DISCIPLINES } from '../data/disciplines';
import { RailBlock } from './rails/BadgeRail';
import { resolveMedia } from '../utils/media';

export function SlideshowOverlay({ images, alt, startIndex, onClose }: { images: string[]; alt: string; startIndex: number; onClose: () => void }) {
  const [index, setIndex] = useState(startIndex);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      // A focused video uses the arrow keys to seek — leave them to it.
      if (e.target instanceof HTMLVideoElement) return;
      if (e.key === 'ArrowRight') setIndex(i => (i + 1) % images.length);
      if (e.key === 'ArrowLeft') setIndex(i => (i - 1 + images.length) % images.length);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [images.length, onClose]);

  return createPortal(
    <div className="slideshow-overlay" onClick={onClose}>
      <button type="button" className="slideshow-close" onClick={onClose} aria-label="Close slideshow">✕</button>
      <button
        type="button"
        className="slideshow-nav slideshow-prev"
        aria-label="Previous item"
        onClick={e => { e.stopPropagation(); setIndex(i => (i - 1 + images.length) % images.length); }}
      >
        ‹
      </button>
      <GalleryItem entry={images[index]} label={`${alt} — ${index + 1} of ${images.length}`} />
      <button
        type="button"
        className="slideshow-nav slideshow-next"
        aria-label="Next item"
        onClick={e => { e.stopPropagation(); setIndex(i => (i + 1) % images.length); }}
      >
        ›
      </button>
      <div className="slideshow-counter">{index + 1} / {images.length}</div>
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
        <RailBlock railId="featured-work" className="work-slideshow-rail reveal reveal-delay-2" />
        <div className="reveal reveal-delay-3">
          {groups.map(group => (
            <div key={group.subsection} className="work-group">
              <div className="work-subsection-header">{group.subsection}</div>
              <RailBlock rail={groupRail(group)} className="work-group-rail" />
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

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import type { Badge, Rail, WorkGroup, WorkItem } from '../types';
import { DISCIPLINES } from '../data/disciplines';
import { RailBlock } from './rails/BadgeRail';
import { resolveMedia } from '../utils/media';

const FALLBACK: WorkGroup[] = [
  {
    subsection: 'Frontend',
    discipline: 'web',
    items: [
      { title: 'ZOME — Cross-platform product suite', tags: ['Cross-platform', 'Swift', 'Kotlin', 'visionOS'], imageUrl: 'https://images.unsplash.com/photo-1759661990336-51bd4b951fea?w=900&q=80', imageAlt: 'ZOME platform', description: 'End-to-end product suite spanning iOS, Android, and Apple Vision Pro — built cross-platform with native platform SDKs.', featured: true, links: [{ label: 'App Store ↗', url: 'https://itunes.apple.com/us/app/zome/id1382123356?ls=1&mt=8' }, { label: 'Play Store ↗', url: 'https://play.google.com/store/apps/details?id=com.zomecorp.zome' }] },
      { title: 'Chatty Prayers', tags: ['Blazor', 'C#', 'AI'], imageUrl: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80', imageAlt: 'Chatty Prayers', description: 'AI-assisted prayer and devotional web app built with Blazor WebAssembly.', featured: false, links: [] },
      { title: 'Spatial UI Components', tags: ['visionOS', 'RealityKit'], imageUrl: 'https://images.unsplash.com/photo-1713445289643-fa1902dd9a03?w=600&q=80', imageAlt: 'visionOS spatial', description: 'A library of reusable spatial UI components for Apple Vision Pro using RealityKit and SwiftUI.', featured: false, links: [] },
      { title: 'PDF Form Builder', tags: ['Blazor', 'PDF Generation', 'AI'], imageUrl: 'https://images.unsplash.com/photo-1602407294553-6ac9170b3ed0?w=600&q=80', imageAlt: 'CV Builder', description: 'A browser-based drag-and-drop editor for building and exporting PDF forms, now featuring AI-powered form generation.', featured: true, links: [{ label: 'Open Editor ↗', url: 'https://editor.carkus.com/form-editor' }] },
      { title: 'Search in Robotic Task Planning', tags: ['Research', 'AI Planning'], imageUrl: 'https://images.unsplash.com/photo-1647427060118-4911c9821b82?w=600&q=80', imageAlt: 'Robotics research', description: 'Academic research into heuristic search algorithms, applied to autonomous robotic task planning.', featured: false, links: [] },
    ],
  },
  {
    subsection: 'Backend',
    discipline: 'ai',
    items: [
      { title: 'ChattyPrayers.Api', tags: ['ASP.NET Core', 'Claude API', 'Gemini API', 'Ollama', 'RAG'], imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80', imageAlt: 'Server infrastructure', description: 'ASP.NET Core API powering streaming chat, multi-participant AI debate, SVG generation, and RAG-based conversation search via Ollama embeddings.', featured: false, links: [] },
      { title: 'MarkdownForms.Api', tags: ['.NET Core', 'Markdown', 'PDF Generation', 'Claude API'], imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14431b9?w=600&q=80', imageAlt: 'Code editor', description: 'A .NET API that renders and processes dynamic form schemas defined in Markdown — PDF export with AcroForm generation and AI-assisted field population.', featured: false, links: [] },
    ],
  },
];

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
// the items keep one source of truth. Photo items become `work` badges;
// image-less entries become plain `card` badges linking to their first URL.
// Two prominent slides from the left, with the start of the next peeking in;
// groups with more items than that loop endlessly.
const SLIDES_PER_VIEW = 2;

function toBadge(item: WorkItem): Badge {
  const openLinks = item.links.filter(l => !!l.url);
  if (!item.imageUrl) {
    return { type: 'card', id: item.title, title: item.title, text: item.description, tags: item.tags, href: openLinks[0]?.url };
  }
  return {
    type: 'work',
    id: item.title,
    title: item.title,
    description: item.description,
    tags: item.tags,
    imageUrl: item.imageUrl,
    imageAlt: item.imageAlt,
    imageOffsetX: item.imageOffsetX,
    imageOffsetY: item.imageOffsetY,
    imagePosition: item.imagePosition,
    links: openLinks,
    slideshowImages: item.slideshowImages,
  };
}

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
    badges: group.items.map(toBadge),
  };
}

export default function WorkSection() {
  const [groups, setGroups] = useState<WorkGroup[]>(FALLBACK);

  useEffect(() => {
    fetch('/data/workitems.json')
      .then(r => r.json())
      .then((data: WorkGroup[]) => { if (data?.length) setGroups(data); })
      .catch(() => {});
  }, []);

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
                  <Link to={DISCIPLINES[group.discipline].path} className="btn-ghost">
                    Explore {DISCIPLINES[group.discipline].heading} in depth →
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

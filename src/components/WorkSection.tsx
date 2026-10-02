import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import type { WorkGroup, WorkItem } from '../types';
import { resolveImgPos } from '../utils/imagePosition';
import { DISCIPLINES } from '../data/disciplines';

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
        aria-label="Previous image"
        onClick={e => { e.stopPropagation(); setIndex(i => (i - 1 + images.length) % images.length); }}
      >
        ‹
      </button>
      <img
        className="slideshow-image"
        src={images[index]}
        alt={`${alt} — ${index + 1} of ${images.length}`}
        onClick={e => e.stopPropagation()}
      />
      <button
        type="button"
        className="slideshow-nav slideshow-next"
        aria-label="Next image"
        onClick={e => { e.stopPropagation(); setIndex(i => (i + 1) % images.length); }}
      >
        ›
      </button>
      <div className="slideshow-counter">{index + 1} / {images.length}</div>
    </div>,
    document.body
  );
}

// Picks an icon that matches what a link actually opens, rather than a
// generic bullet for everything — App Store/Play Store get their platform
// glyph via devicon (already loaded site-wide), anything else falls back to
// a plain external-link arrow.
function LinkIcon({ label }: { label: string }) {
  if (/app store/i.test(label)) return <i className="devicon-apple-original" aria-hidden="true" />;
  if (/play store/i.test(label)) return <i className="devicon-android-plain" aria-hidden="true" />;
  return <span aria-hidden="true">↗</span>;
}

// Flat "small project" look — title/description/tags, no image — reused
// as-is from the standalone Small Projects section so an entry can be
// embedded straight into a Selected Projects row without inventing a new
// style for it. Same --w-driven width-percentage sizing as the photo tiles
// so it slots into .work-grid like any other item; height is left auto
// rather than the tiles' fixed 300px, matching the small-project card's own
// look (it stretches to match a row's tallest item only if it shares one).
function PlainWorkItemCard({ item }: { item: WorkItem }) {
  const openLinks = item.links.filter(l => !!l.url);
  const primaryUrl = openLinks[0]?.url;
  const style = { '--w': item.width ?? 34 } as React.CSSProperties;
  const inner = (
    <>
      <div className="small-project-title">{item.title}</div>
      <p className="small-project-desc">{item.description}</p>
      <div className="small-project-tags">
        {item.tags.map(t => <span key={t} className="skill-box work-tag">{t}</span>)}
      </div>
    </>
  );

  return primaryUrl ? (
    <a href={primaryUrl} target="_blank" rel="noopener noreferrer" className="small-project-card small-project-card-link" style={style}>
      {inner}
      <span className="small-project-arrow">↗</span>
    </a>
  ) : (
    <div className="small-project-card" style={style}>{inner}</div>
  );
}

// Full-bleed photo tile, fixed height (not square) — image fills the entire
// box, title + link icons pinned in a top scrim bar, description slides up
// on hover only (no tap-to-pin — a click just opens the card's primary link
// in a new tab, like clicking through a normal card), tags sit in their own
// persistent footer. item.width is a literal CSS width percentage (34 for a
// third of a 3-per-row row, 40/50/60 pairing up for 2-per-row) passed
// through as the --w custom property .work-grid's flexbox layout consumes
// directly. Items with no imageUrl render as a PlainWorkItemCard instead.
function WorkItemCard({ item }: { item: WorkItem }) {
  const [slideshowOpen, setSlideshowOpen] = useState(false);
  if (!item.imageUrl) return <PlainWorkItemCard item={item} />;
  const hasSlideshow = !!item.slideshowImages && item.slideshowImages.length > 0;
  // A link like "Coming Soon" with an empty url is a label, not an open-able
  // link — skip rendering its arrow icon.
  const openLinks = item.links.filter(l => !!l.url);
  const primaryUrl = openLinks[0]?.url;
  const imgPos = resolveImgPos(item.imageOffset, item.imageOffsetY, item.imagePosition);

  return (
    <div
      className={`work-item${primaryUrl ? '' : ' no-link'}`}
      style={{ '--w': item.width ?? 34 } as React.CSSProperties}
      onClick={() => { if (primaryUrl) window.open(primaryUrl, '_blank', 'noopener,noreferrer'); }}
    >
      <img
        src={item.imageUrl}
        alt={item.imageAlt}
        style={imgPos ? { '--img-pos': imgPos } as React.CSSProperties : undefined}
      />
      {item.credit && (
        <a href={item.credit.url} target="_blank" rel="noopener noreferrer" className="work-item-credit" onClick={e => e.stopPropagation()}>© {item.credit.name}</a>
      )}
      <div className="work-item-top-bar">
        <div className="work-item-title">{item.title}</div>
        {(openLinks.length > 0 || hasSlideshow) && (
          <div className="work-item-icons">
            {openLinks.map(l => (
              <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className="work-item-icon-link" aria-label={l.label} title={l.label} onClick={e => e.stopPropagation()}>
                <LinkIcon label={l.label} />
              </a>
            ))}
            {hasSlideshow && (
              <button type="button" className="work-item-icon-link" aria-label="View slideshow" title="Slideshow" onClick={e => { e.stopPropagation(); setSlideshowOpen(true); }}>
                <span aria-hidden="true">↗</span>
              </button>
            )}
          </div>
        )}
      </div>
      <div className="work-item-overlay">
        <p className="work-item-desc">{item.description}</p>
      </div>
      <div className="work-item-footer">
        {item.tags.map(t => <span key={t} className="skill-box work-tag">{t}</span>)}
      </div>
      {hasSlideshow && slideshowOpen && (
        <SlideshowOverlay images={item.slideshowImages!} alt={item.imageAlt ?? item.title} startIndex={0} onClose={() => setSlideshowOpen(false)} />
      )}
    </div>
  );
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
        <div className="reveal reveal-delay-3">
          {groups.map(group => (
            <div key={group.subsection} className="work-group">
              <div className="work-subsection-header">{group.subsection}</div>
              <div className="work-grid">
                {group.items.map(item => <WorkItemCard key={item.title} item={item} />)}
              </div>
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

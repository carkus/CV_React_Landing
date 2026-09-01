import { Fragment, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { WorkItem } from '../types';
import { resolveImgPos } from '../utils/imagePosition';

const FALLBACK: WorkItem[] = [
  { subsection: 'Frontend', title: 'ZOME — Cross-platform product suite', tags: ['Cross-platform', 'Swift', 'Kotlin', 'visionOS'], imageUrl: 'https://images.unsplash.com/photo-1759661990336-51bd4b951fea?w=900&q=80', imageAlt: 'ZOME platform', description: 'End-to-end product suite spanning iOS, Android, and Apple Vision Pro — built cross-platform with native platform SDKs.', featured: true, links: [{ label: 'App Store ↗', url: 'https://itunes.apple.com/us/app/zome/id1382123356?ls=1&mt=8' }, { label: 'Play Store ↗', url: 'https://play.google.com/store/apps/details?id=com.zomecorp.zome' }] },
  { title: 'Chatty Prayers', tags: ['Blazor', 'C#', 'AI'], imageUrl: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80', imageAlt: 'Chatty Prayers', description: 'AI-assisted prayer and devotional web app built with Blazor WebAssembly.', featured: false, links: [] },
  { title: 'Spatial UI Components', tags: ['visionOS', 'RealityKit'], imageUrl: 'https://images.unsplash.com/photo-1713445289643-fa1902dd9a03?w=600&q=80', imageAlt: 'visionOS spatial', description: 'A library of reusable spatial UI components for Apple Vision Pro using RealityKit and SwiftUI.', featured: false, links: [] },
  { title: 'PDF Form Builder', tags: ['Blazor', 'PDF Generation', 'AI'], imageUrl: 'https://images.unsplash.com/photo-1602407294553-6ac9170b3ed0?w=600&q=80', imageAlt: 'CV Builder', description: 'A browser-based drag-and-drop editor for building and exporting PDF forms, now featuring AI-powered form generation.', featured: true, links: [{ label: 'Open Editor ↗', url: 'https://editor.carkus.com/form-editor' }] },
  { title: 'Search in Robotic Task Planning', tags: ['Research', 'AI Planning'], imageUrl: 'https://images.unsplash.com/photo-1647427060118-4911c9821b82?w=600&q=80', imageAlt: 'Robotics research', description: 'Academic research into heuristic search algorithms, applied to autonomous robotic task planning.', featured: false, links: [] },
  { subsection: 'Backend', title: 'ChattyPrayers.Api', tags: ['ASP.NET Core', 'Claude API', 'Gemini API', 'Ollama', 'RAG'], imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80', imageAlt: 'Server infrastructure', description: 'ASP.NET Core API powering streaming chat, multi-participant AI debate, SVG generation, and RAG-based conversation search via Ollama embeddings.', featured: false, links: [] },
  { title: 'MarkdownForms.Api', tags: ['.NET Core', 'Markdown', 'PDF Generation', 'Claude API'], imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14431b9?w=600&q=80', imageAlt: 'Code editor', description: 'A .NET API that renders and processes dynamic form schemas defined in Markdown — PDF export with AcroForm generation and AI-assisted field population.', featured: false, links: [] },
];

function SlideshowOverlay({ images, alt, startIndex, onClose }: { images: string[]; alt: string; startIndex: number; onClose: () => void }) {
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

// Flat, split-layout card — image on the left, content stacked on the right
// (description, title, links, tags), matching .small-project-card's plainer
// aesthetic instead of the old full-bleed photo tile with slide-up overlay.
function WorkItemCard({ item }: { item: WorkItem }) {
  const [slideshowOpen, setSlideshowOpen] = useState(false);
  const hasSlideshow = !!item.slideshowImages && item.slideshowImages.length > 0;
  const imgPos = resolveImgPos(item.imageOffset, item.imageOffsetY, item.imagePosition);

  return (
    <div className="work-item">
      <div className="work-item-media">
        <img
          src={item.imageUrl}
          alt={item.imageAlt}
          style={imgPos ? { '--img-pos': imgPos } as React.CSSProperties : undefined}
        />
        {item.credit && (
          <a href={item.credit.url} target="_blank" rel="noopener noreferrer" className="work-item-credit">© {item.credit.name}</a>
        )}
      </div>
      <div className="work-item-body">
        <p className="work-item-desc">{item.description}</p>
        <div className="work-item-title">{item.title}</div>
        {(item.links.length > 0 || hasSlideshow) && (
          <div className="work-item-links">
            {item.links.map(l => <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className="work-item-link">{l.label}</a>)}
            {hasSlideshow && (
              <button type="button" className="work-item-link work-item-link-btn" onClick={() => setSlideshowOpen(true)}>
                Slideshow ↗
              </button>
            )}
          </div>
        )}
        <div className="work-item-tag">
          {item.tags.map(t => <span key={t} className="skill-box work-tag">{t}</span>)}
        </div>
      </div>
      {hasSlideshow && slideshowOpen && (
        <SlideshowOverlay images={item.slideshowImages!} alt={item.imageAlt} startIndex={0} onClose={() => setSlideshowOpen(false)} />
      )}
    </div>
  );
}

export default function WorkSection() {
  const [items, setItems] = useState<WorkItem[]>(FALLBACK);

  useEffect(() => {
    fetch('/data/workitems.json')
      .then(r => r.json())
      .then((data: WorkItem[]) => { if (data?.length) setItems(data); })
      .catch(() => {});
  }, []);

  return (
    <section id="work">
      <div className="section-inner">
        <div className="section-eyebrow reveal">Work</div>
        <h2 className="section-heading reveal reveal-delay-1">Selected projects</h2>
        <div className="work-summation reveal reveal-delay-2">
          <div className="work-summation-col">
            <div className="work-summation-label">Frontend</div>
            <ul className="work-summation-list">
              <li>Cross-platform mobile, AI-integrated web, and spatial computing — shipped to App Store, Play Store, and Vision Pro</li>
              <li>Native Swift/SwiftUI for iOS and visionOS, and React/Blazor for the web layer</li>
              <li>Claude and Gemini APIs wired directly into the UI, backed by multi-provider LLM cascades, RAG pipelines, and MCP tool integrations for structured, context-aware AI features</li>
            </ul>
            <div className="work-summation-tags">
              {['Cross-platform', 'Swift / SwiftUI', 'visionOS', 'React', 'Blazor', 'Claude API', 'Gemini API'].map(t => <span key={t} className="skill-box work-tag">{t}</span>)}
            </div>
          </div>
          <div className="work-summation-divider" />
          <div className="work-summation-col">
            <div className="work-summation-label">Backend</div>
            <ul className="work-summation-list">
              <li>NodeJS or .NET backends, streaming AI over SSE</li>
              <li>Multi-provider LLM orchestration with Ollama fallback, RAG via embedding search</li>
              <li>Agentic document pipelines with LangGraph and LlamaIndex, plus PDF generation and MCP tool servers for Claude Code and Claude Desktop</li>
              <li>Structured prompt engineering with validated, typed outputs</li>
            </ul>
            <div className="work-summation-tags">
              {['Node JS', 'ASP.NET Core', 'Python', 'Ollama', 'RAG', 'PDF Generation', 'Multi-provider LLM'].map(t => <span key={t} className="skill-box work-tag">{t}</span>)}
            </div>
          </div>
        </div>
        <div className="section-stack reveal reveal-delay-3">
          <span className="section-stack-label">This site was built with:</span>
          <span className="skill-box work-tag">React</span>
          <span className="skill-box work-tag">TypeScript</span>
          <span className="skill-box work-tag">Vite</span>
        </div>
        <div className="reveal reveal-delay-3">
          <div className="work-grid">
            {items.map(item => (
              <Fragment key={item.title}>
                {item.subsection && <div className="work-subsection-header">{item.subsection}</div>}
                <WorkItemCard item={item} />
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

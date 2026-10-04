import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import SwipeRail from './SwipeRail';
import { LinkIcon, SlideshowOverlay } from '../WorkSection';
import { resolveImgPos } from '../../utils/imagePosition';
import type { Badge, CardBadge, HtmlBadge, Rail, WorkBadge } from '../../types';

// Data-driven layer over SwipeRail.
//
//   <RailBlock railId="featured-work" />   — loads that rail from /data/rails.json
//   <RailBlock rail={{ id, layout, badges }} />  — renders inline data
//
// RailBlock has no section chrome and fills whatever box it's put in (a grid
// cell, a column, a card), so it can be dropped anywhere on any page.
// BadgeRail (default export) wraps one in a full home-page section with the
// rail's eyebrow/heading/intro.
//
// Each badge is drawn by the renderer registered for its `type`. To add a
// new kind of badge: add its interface to the Badge union in types.ts, then
// add a renderer to RENDERERS below.

/** Used until rails.json loads, and if it fails or lacks a rail. */
const FALLBACK: Rail[] = [
  {
    id: 'deep-dives',
    eyebrow: 'Deep dives',
    heading: 'Explore by discipline',
    badges: [
      { type: 'card', id: 'web', size: 'md', href: '/web', icon: '◧', eyebrow: 'Web', title: 'Web & Backend', text: 'React, Blazor and .NET — collaborative editors, PDF builders, shared auth.', cta: 'Explore →' },
      { type: 'card', id: 'ai', size: 'md', href: '/ai', icon: '✦', eyebrow: 'AI', title: 'AI Systems', text: 'Self-scaffolding agents, MCP, provider cascades, RAG and structured output.', cta: 'Explore →' },
      { type: 'card', id: 'mobile', size: 'md', href: '/mobile', icon: '◫', eyebrow: 'Mobile', title: 'Mobile & Spatial', text: 'Eight years on ZOME across iOS, Android, Vision Pro and Android XR.', cta: 'Explore →' },
    ],
  },
];

// One shared request for every rail on the page.
let railsPromise: Promise<Rail[]> | null = null;
function loadRails(): Promise<Rail[]> {
  railsPromise ??= fetch('/data/rails.json')
    .then(r => (r.ok ? r.json() : []))
    .then(data => (Array.isArray(data) ? data : []))
    .catch(() => []);
  return railsPromise;
}

/** The rail with this id — fallback copy first, rails.json once loaded. */
function useRail(railId: string | undefined): Rail | undefined {
  const [rail, setRail] = useState<Rail | undefined>(() => FALLBACK.find(r => r.id === railId));
  useEffect(() => {
    if (!railId) return;
    let cancelled = false;
    loadRails().then(rails => {
      const found = rails.find(r => r.id === railId);
      if (!cancelled && found?.badges?.length) setRail(found);
    });
    return () => { cancelled = true; };
  }, [railId]);
  return rail;
}

/* ── Renderers ─────────────────────────────────────────────────── */

function CardBadgeView({ badge }: { badge: CardBadge }) {
  const imgPos = resolveImgPos(badge.imageOffset, badge.imageOffsetY, undefined);
  return (
    <>
      {badge.imageUrl ? (
        <div className="rail-card-media">
          <img
            src={badge.imageUrl}
            alt={badge.imageAlt ?? badge.title}
            loading="lazy"
            draggable={false}
            style={imgPos ? { '--img-pos': imgPos } as React.CSSProperties : undefined}
          />
        </div>
      ) : badge.icon ? (
        <div className="info-card-icon rail-card-icon">{badge.icon}</div>
      ) : null}
      <div className="rail-card-body">
        {badge.eyebrow && <div className="rail-card-eyebrow">{badge.eyebrow}</div>}
        <div className="rail-card-title">{badge.title}</div>
        {badge.text && <p className="rail-card-text">{badge.text}</p>}
        {badge.tags && badge.tags.length > 0 && (
          <div className="rail-card-tags">
            {badge.tags.map(t => <span key={t} className="skill-box etag">{t}</span>)}
          </div>
        )}
        {badge.cta && <div className="rail-card-cta">{badge.cta}</div>}
      </div>
    </>
  );
}

function HtmlBadgeView({ badge }: { badge: HtmlBadge }) {
  return <div className="rail-html" dangerouslySetInnerHTML={{ __html: badge.html }} />;
}

// Same anatomy as the Work grid's photo tile, except the description is
// always visible (a slideshow slide is big enough to carry it) rather than
// hover-only.
function WorkBadgeView({ badge }: { badge: WorkBadge }) {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const imgPos = resolveImgPos(badge.imageOffset, badge.imageOffsetY, undefined);
  const openLinks = (badge.links ?? []).filter(l => !!l.url);
  const hasGallery = !!badge.slideshowImages?.length;

  return (
    <>
      <img
        className="rail-work-img"
        src={badge.imageUrl}
        alt={badge.imageAlt ?? badge.title}
        loading="lazy"
        draggable={false}
        style={{
          ...(imgPos ? { '--img-pos': imgPos } : {}),
          ...(badge.imageScale != null ? { '--img-scale': badge.imageScale } : {}),
        } as React.CSSProperties}
      />
      <div className="rail-work-scrim" />
      {(openLinks.length > 0 || hasGallery) && (
        <div className="rail-work-icons">
          {openLinks.map(l => (
            <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className="work-item-icon-link" aria-label={l.label} title={l.label} draggable={false}>
              <LinkIcon label={l.label} />
            </a>
          ))}
          {hasGallery && (
            <button type="button" className="rail-work-gallery" onClick={() => setGalleryOpen(true)}>
              Gallery · {badge.slideshowImages!.length}
            </button>
          )}
        </div>
      )}
      <div className="rail-work-body">
        {badge.eyebrow && <div className="rail-work-eyebrow">{badge.eyebrow}</div>}
        <div className="rail-work-title">{badge.title}</div>
        {badge.description && <p className="rail-work-desc">{badge.description}</p>}
        {badge.tags && badge.tags.length > 0 && (
          <div className="rail-work-tags">
            {badge.tags.map(t => <span key={t} className="skill-box work-tag">{t}</span>)}
          </div>
        )}
      </div>
      {hasGallery && galleryOpen && (
        <SlideshowOverlay images={badge.slideshowImages!} alt={badge.imageAlt ?? badge.title} startIndex={0} onClose={() => setGalleryOpen(false)} />
      )}
    </>
  );
}

const RENDERERS: { [K in Badge['type']]: (badge: Extract<Badge, { type: K }>) => ReactNode } = {
  card: badge => <CardBadgeView badge={badge} />,
  html: badge => <HtmlBadgeView badge={badge} />,
  work: badge => <WorkBadgeView badge={badge} />,
};

function renderBadge(badge: Badge): ReactNode {
  const render = RENDERERS[badge.type] as ((b: Badge) => ReactNode) | undefined;
  return render ? render(badge) : null;
}

function badgeKey(badge: Badge, i: number): string {
  return badge.id ?? ('title' in badge ? badge.title : undefined) ?? String(i);
}

function BadgeShell({ badge }: { badge: Badge }) {
  const className = `rail-badge rail-badge--${badge.type} rail-badge--${badge.size ?? 'md'}${'href' in badge && badge.href ? ' rail-badge--link' : ''}${badge.className ? ` ${badge.className}` : ''}`;
  const style = badge.width ? { '--badge-w': `${badge.width}px` } as React.CSSProperties : undefined;
  const content = renderBadge(badge);
  const href = 'href' in badge ? badge.href : undefined;

  if (!href) return <div className={className} style={style}>{content}</div>;
  if (href.startsWith('/')) return <Link to={href} className={className} style={style} draggable={false}>{content}</Link>;
  return <a href={href} target="_blank" rel="noopener noreferrer" className={className} style={style} draggable={false}>{content}</a>;
}

/* ── Public components ─────────────────────────────────────────── */

/** Drop-in rail: give it a railId (from rails.json) or inline rail data. No
 *  section chrome — it fills the box it's placed in. */
export function RailBlock({ railId, rail: inline, className }: { railId?: string; rail?: Rail; className?: string }) {
  const loaded = useRail(inline ? undefined : railId);
  const rail = inline ?? loaded;
  if (!rail || !rail.badges.length) return null;

  return (
    <div className={`rail-block${className ? ` ${className}` : ''}`}>
      <SwipeRail
        label={rail.heading ?? rail.eyebrow ?? rail.id}
        variant={rail.layout ?? 'row'}
        peek={rail.peek}
        height={rail.height}
      >
        {rail.badges.map((b, i) => <BadgeShell key={badgeKey(b, i)} badge={b} />)}
      </SwipeRail>
    </div>
  );
}

/** A full home-page section around the rail with this id from rails.json. */
export default function BadgeRail({ railId, sectionId }: { railId: string; sectionId?: string }) {
  const rail = useRail(railId);
  if (!rail) return null;

  return (
    <section id={sectionId ?? `rail-${rail.id}`} className="rail-section">
      <div className="section-inner">
        {rail.eyebrow && <div className="section-eyebrow reveal">{rail.eyebrow}</div>}
        {rail.heading && <h2 className="section-heading reveal reveal-delay-1">{rail.heading}</h2>}
        {rail.intro && <p className="section-intro reveal reveal-delay-2">{rail.intro}</p>}
        <RailBlock rail={rail} />
      </div>
    </section>
  );
}

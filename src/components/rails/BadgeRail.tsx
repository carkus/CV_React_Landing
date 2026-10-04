import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import SwipeRail from './SwipeRail';
import { resolveImgPos } from '../../utils/imagePosition';
import type { Badge, CardBadge, HtmlBadge, Rail } from '../../types';

// Data-driven layer over SwipeRail: looks a rail up by id in
// /data/rails.json and renders each badge with the renderer registered for
// its `type`. To add a new kind of badge: add its interface to the Badge
// union in types.ts, then add a renderer to RENDERERS below.

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
    .catch(() => []);
  return railsPromise;
}

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

const RENDERERS: { [K in Badge['type']]: (badge: Extract<Badge, { type: K }>) => ReactNode } = {
  card: badge => <CardBadgeView badge={badge} />,
  html: badge => <HtmlBadgeView badge={badge} />,
};

function renderBadge(badge: Badge): ReactNode {
  const render = RENDERERS[badge.type] as ((b: Badge) => ReactNode) | undefined;
  return render ? render(badge) : null;
}

function BadgeShell({ badge }: { badge: Badge }) {
  const className = `rail-badge rail-badge--${badge.type} rail-badge--${badge.size ?? 'md'}${badge.href ? ' rail-badge--link' : ''}${badge.className ? ` ${badge.className}` : ''}`;
  const style = badge.width ? { '--badge-w': `${badge.width}px` } as React.CSSProperties : undefined;
  const content = renderBadge(badge);

  if (!badge.href) return <div className={className} style={style}>{content}</div>;
  if (badge.href.startsWith('/')) return <Link to={badge.href} className={className} style={style} draggable={false}>{content}</Link>;
  return <a href={badge.href} target="_blank" rel="noopener noreferrer" className={className} style={style} draggable={false}>{content}</a>;
}

/** Renders a rail's badges in a SwipeRail with no section chrome — for
 *  embedding inside an existing section. */
export function BadgeRailRow({ rail }: { rail: Rail }) {
  return (
    <SwipeRail label={rail.heading ?? rail.eyebrow ?? rail.id}>
      {rail.badges.map((b, i) => (
        <BadgeShell key={b.id ?? (b.type === 'card' ? b.title : undefined) ?? i} badge={b} />
      ))}
    </SwipeRail>
  );
}

/** A full home-page section for the rail with this id from rails.json. */
export default function BadgeRail({ railId, sectionId }: { railId: string; sectionId?: string }) {
  const [rail, setRail] = useState<Rail | undefined>(() => FALLBACK.find(r => r.id === railId));

  useEffect(() => {
    let cancelled = false;
    loadRails().then(rails => {
      const found = Array.isArray(rails) ? rails.find(r => r.id === railId) : undefined;
      if (!cancelled && found?.badges?.length) setRail(found);
    });
    return () => { cancelled = true; };
  }, [railId]);

  if (!rail) return null;

  return (
    <section id={sectionId ?? `rail-${rail.id}`} className="rail-section">
      <div className="section-inner">
        {rail.eyebrow && <div className="section-eyebrow reveal">{rail.eyebrow}</div>}
        {rail.heading && <h2 className="section-heading reveal reveal-delay-1">{rail.heading}</h2>}
        {rail.intro && <p className="section-intro reveal reveal-delay-2">{rail.intro}</p>}
        <BadgeRailRow rail={rail} />
      </div>
    </section>
  );
}

export interface WorkLink {
  label: string;
  url: string;
}

export interface WorkCredit {
  name: string;
  url: string;
}

export interface WorkItem {
  title: string;
  tags: string[];
  /** Omit to render this entry as a flat, image-less "small project" card
   *  (see PlainWorkItemCard in WorkSection.tsx) instead of the full-bleed
   *  photo tile. */
  imageUrl?: string;
  imageAlt?: string;
  description: string;
  featured: boolean;
  links: WorkLink[];
  credit?: WorkCredit;
  imagePosition?: string;
  /** Plain horizontal crop offset for the work-grid tile image, 0–100 (percent from
   *  the left). Simpler alternative to imagePosition's raw CSS string — just a
   *  number to nudge left/right. Takes precedence over imagePosition when both
   *  are set. Mirrors heroImageOffset below, but for the grid tile instead of
   *  the hero slide. */
  imageOffset?: number;
  /** Plain vertical crop offset for the work-grid tile image, 0–100 (percent from
   *  the top). Vertical counterpart to imageOffset — 0 shows the top of the
   *  image, 100 the bottom. Takes precedence over imagePosition when both are
   *  set. Mirrors heroImageOffsetY below, but for the grid tile instead of the
   *  hero slide. */
  imageOffsetY?: number;
  heroImagePosition?: string;
  /** Plain horizontal crop offset for the hero slide image, 0–100 (percent from
   *  the left). Simpler alternative to heroImagePosition's raw CSS string —
   *  just a number to nudge left/right. Takes precedence over heroImagePosition
   *  when both are set. */
  heroImageOffset?: number;
  /** Plain vertical crop offset for the hero slide image, 0–100 (percent from
   *  the top). Vertical counterpart to heroImageOffset — 0 shows the top of the
   *  image, 100 the bottom. Takes precedence over heroImagePosition when both
   *  are set. */
  heroImageOffsetY?: number;
  /** Raw CSS `transform` value (e.g. 'scale(1.15) translateY(-4%)') applied to
   *  the hero slide image, for fine-tuning framing/zoom beyond what
   *  heroImagePosition's object-position crop anchor alone can reach. */
  heroImageTransform?: string;
  width?: number;
  height?: number;
  slideshowImages?: string[];
  /** When true, this item is skipped by the hero rotation even if it has an imageUrl. */
  heroExclude?: boolean;
}

/** A named group of work items — the subsection heading wraps its own block
 *  of content (its own heading + its own row-wrapping item grid) rather than
 *  being one more entry injected into a shared row of items. */
export interface WorkGroup {
  subsection: string;
  items: WorkItem[];
  /** Deep-dive page this group links to ('web' | 'ai' | 'mobile'). When set,
   *  an "Explore … in depth" button renders under the group's grid. */
  discipline?: 'web' | 'ai' | 'mobile';
}

export interface Skill {
  name: string;
  cat: string;
  icon: string;
  pct: number;
  group?: string;
}

export interface ExpertisePanel {
  num: string;
  img: string;
  alt: string;
  title: string;
  desc: string;
  tags: string[];
}

export interface TimelineEntry {
  year: string[];
  role: string;
  org: string;
  desc: string;
  tags: string[];
}

export interface Achievement {
  icon: string;
  title: string;
  points: string[];
  tags: string[];
}

export interface SmallProject {
  title: string;
  description: string;
  tags: string[];
  url?: string;
}

/* ── Badge rails ──────────────────────────────────────────────────
   Data structure behind the horizontal swipe rails (BadgeRail.tsx). A rail
   is a titled row of badges; each badge picks a renderer by its `type`, so
   new kinds of badge are added by registering a renderer, not by changing
   the rail. Sections of the site get converted to rails by expressing their
   content as Rail data. */

/** Preset badge widths — see .rail-badge--* in index.css. */
export type BadgeSize = 'sm' | 'md' | 'lg' | 'xl';

interface BadgeBase {
  /** Stable React key; falls back to the title or index. */
  id?: string;
  size?: BadgeSize;
  /** Exact width in px — overrides size. Capped to the viewport on phones. */
  width?: number;
  /** Makes the whole badge a link. Paths starting with '/' route in-app;
   *  anything else opens in a new tab. */
  href?: string;
  /** Extra class names on the badge wrapper, for one-off styling. */
  className?: string;
}

/** Free-form badge: its own HTML markup, rendered as-is. Only for content
 *  from this site's own data files — it is injected without sanitising. */
export interface HtmlBadge extends BadgeBase {
  type: 'html';
  html: string;
}

/** Structured badge: optional image or icon, eyebrow, title, text, tags. */
export interface CardBadge extends BadgeBase {
  type: 'card';
  title: string;
  eyebrow?: string;
  text?: string;
  tags?: string[];
  /** Short glyph shown in a square chip when there's no image. */
  icon?: string;
  imageUrl?: string;
  imageAlt?: string;
  /** Same 0–100 crop offsets as WorkItem.imageOffset / imageOffsetY. */
  imageOffset?: number;
  imageOffsetY?: number;
  /** Optional call-to-action label shown at the bottom, e.g. "Explore →". */
  cta?: string;
}

/** Project tile modelled on the Work grid's photo tiles: full-bleed image,
 *  title, description, tags, store/launch link icons, and an optional
 *  screenshot gallery. Uses `links` rather than `href` (the tile holds
 *  several links, so the tile itself can't also be one). */
export interface WorkBadge extends Omit<BadgeBase, 'href'> {
  type: 'work';
  title: string;
  description?: string;
  tags?: string[];
  imageUrl: string;
  imageAlt?: string;
  imageOffset?: number;
  imageOffsetY?: number;
  /** Zoom factor, e.g. 1.2 — scales around the offset focal point. */
  imageScale?: number;
  links?: WorkLink[];
  slideshowImages?: string[];
  /** Short mono label above the title, e.g. "Personal · 2026". */
  eyebrow?: string;
}

export type Badge = HtmlBadge | CardBadge | WorkBadge;

/** 'row' — badges at their own widths, left-aligned, swipe freely.
 *  'slideshow' — one badge at a time, centred and snapped, with a sliver of
 *  the neighbours showing either side, plus dots. */
export type RailLayout = 'row' | 'slideshow';

export interface Rail {
  /** Lookup key — a page places a rail with <BadgeRail railId="…" />. */
  id: string;
  eyebrow?: string;
  heading?: string;
  intro?: string;
  /** Defaults to 'row'. */
  layout?: RailLayout;
  /** Slideshow only: how much of each neighbour peeks in, as a percent of
   *  the rail's width per side. Defaults to 8. */
  peek?: number;
  /** Badge height in px (slideshow slides, and work badges in a row).
   *  Defaults to 420 for slideshows, 340 for rows. */
  height?: number;
  badges: Badge[];
}

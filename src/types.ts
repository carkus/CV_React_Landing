export interface WorkLink {
  label: string;
  url: string;
}

export interface WorkCredit {
  name: string;
  url: string;
}

export interface WorkItem {
  /** Stable key — rails place a project by it ({ "type": "project", "ref": … }). */
  id: string;
  title: string;
  tags: string[];
  /** Omit to render this entry as a flat, image-less "small project" card
   *  (see PlainWorkItemCard in WorkSection.tsx) instead of the full-bleed
   *  photo tile. */
  imageUrl?: string;
  imageAlt?: string;
  description: string;
  /** Shorter copy for tight placements (the Selected projects rail); falls
   *  back to description. */
  summary?: string;
  featured: boolean;
  links: WorkLink[];
  credit?: WorkCredit;
  imagePosition?: string;
  /** Pixel nudge for the work tile image, from its imagePosition anchor
   *  (default centre). Positive moves the image right. */
  imageOffsetX?: number;
  /** Pixel nudge for the work tile image, from its imagePosition anchor
   *  (default centre). Positive moves the image down. */
  imageOffsetY?: number;
  heroImagePosition?: string;
  /** Pixel nudges for the hero slide image, from its heroImagePosition anchor
   *  (default centre). Positive X moves right, positive Y moves down. */
  heroImageOffsetX?: number;
  heroImageOffsetY?: number;
  /** Raw CSS `transform` value (e.g. 'scale(1.15) translateY(-4%)') applied to
   *  the hero slide image, for fine-tuning framing/zoom beyond what
   *  heroImagePosition's object-position crop anchor alone can reach. */
  heroImageTransform?: string;
  width?: number;
  height?: number;
  /** Gallery entries: images, video files (.mp4/.mov/.webm…) or YouTube/Vimeo
   *  URLs — the viewer is picked per entry. A bare file name resolves to
   *  /img/ (images) or /files/ (videos). See utils/media.ts. */
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
  /** Pixel nudges from the image's centre, as WorkItem.imageOffsetX / imageOffsetY. */
  imageOffsetX?: number;
  imageOffsetY?: number;
  /** Bullet points under the text — dash-marked, like the case studies. */
  points?: string[];
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
  /** Pixel nudges from imagePosition, as WorkItem.imageOffsetX / imageOffsetY. */
  imageOffsetX?: number;
  imageOffsetY?: number;
  /** Zoom factor, e.g. 1.2 — scales around the offset focal point. */
  imageScale?: number;
  /** Raw CSS object-position — same as WorkItem.imagePosition; the 0–100
   *  offsets above take precedence when set. */
  imagePosition?: string;
  links?: WorkLink[];
  /** Gallery entries: images, video files (.mp4/.mov/.webm…) or YouTube/Vimeo
   *  URLs — the viewer is picked per entry. A bare file name resolves to
   *  /img/ (images) or /files/ (videos). See utils/media.ts. */
  slideshowImages?: string[];
  /** Short mono label above the title, e.g. "Personal · 2026". */
  eyebrow?: string;
}

export type Badge = HtmlBadge | CardBadge | WorkBadge;

/** A project from workitems.json placed in a rail by id, so its copy lives in
 *  one place. Resolves to a work badge (or a card, for image-less projects)
 *  using the project's summary; any other field set here overrides the
 *  project's value for this placement only. */
export interface ProjectRef extends Partial<Omit<WorkBadge, 'type'>> {
  type: 'project';
  ref: string;
}

/** 'row' — badges at their own widths, left-aligned, swipe freely.
 *  'slideshow' — one badge at a time, centred and snapped, with a sliver of
 *  the neighbours showing either side, plus dots. */
export type RailLayout = 'row' | 'slideshow';

/** Colour scheme for the section a rail sits in — a set of CSS custom
 *  properties (see .tone-* in index.css), so every badge type picks it up
 *  without per-section overrides. 'default' follows the site theme; 'pale'
 *  is the fixed light-blue panel look used by the AI sections. */
export type RailTone = 'default' | 'pale';

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
  /** Slideshow only: slides visible at once on desktop (each is 1/perView of
   *  the rail's width; drops to one slide on phones). Defaults to 1. */
  perView?: number;
  /** Slideshow only: wrap around endlessly instead of stopping at the ends. */
  loop?: boolean;
  /** Slideshow only: 'center' (default) centres the active slide; 'start'
   *  shows `perView` prominent slides from the left edge with `peek`% of the
   *  next one on the right. */
  align?: 'center' | 'start';
  /** Slideshow only: seconds between automatic "next" steps while the rail
   *  sits at the vertical centre of the screen. Defaults to 5; 0 disables. */
  autoplay?: number;
  /** Minimum badge height in px. Slideshow slides otherwise all stretch to
   *  the tallest one; work (photo) badges default to 420. */
  height?: number;
  /** Section colour scheme — BadgeRail sections only. Defaults to 'default'. */
  tone?: RailTone;
  /** Link button under the rail, e.g. { label: "Explore AI in depth →", href: "/ai" }. */
  cta?: { label: string; href: string };
  badges: (Badge | ProjectRef)[];
}

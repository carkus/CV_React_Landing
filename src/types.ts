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
  imageUrl: string;
  imageAlt: string;
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
  subsection?: string;
  slideshowImages?: string[];
  /** When true, this item is skipped by the hero rotation even if it has an imageUrl. */
  heroExclude?: boolean;
}

export interface Skill {
  name: string;
  cat: string;
  icon: string;
  pct: number;
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

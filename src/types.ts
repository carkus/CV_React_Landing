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
  heroImagePosition?: string;
  /** Plain horizontal crop offset for the hero slide image, 0–100 (percent from
   *  the left). Simpler alternative to heroImagePosition's raw CSS string —
   *  just a number to nudge left/right. Takes precedence over heroImagePosition
   *  when both are set. */
  heroImageOffset?: number;
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

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
  width?: 25 | 33 | 50 | 66 | 75 | 100;
  subsection?: string;
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

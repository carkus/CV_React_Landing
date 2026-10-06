// One framing system for every cropped (object-fit: cover) image on the site.
//
// Each placement of an image carries its own ImageFrame, so the same picture
// can be framed differently in each place without one affecting another:
//   WorkItem.imageFrame        — Work rail tile (and project badges)
//   WorkItem.heroImageFrame    — hero slideshow card
//   DisciplineProject.imageFrame — case study on the /web, /ai, /mobile pages
//   CardBadge/WorkBadge.imageFrame — hand-written rail badges
//
// frameStyle() turns a frame into the --img-pos / --img-scale custom
// properties that every framed image's CSS rule reads.

import type { CSSProperties } from 'react';

export interface ImageFrame {
  /** Crop anchor — any CSS object-position, e.g. "left center" or "30% 20%".
   *  Defaults to centre. */
  position?: string;
  /** Pixel nudges from the anchor. Positive X moves the image right,
   *  positive Y moves it down. Not clamped, so big nudges can expose an edge. */
  offsetX?: number;
  offsetY?: number;
  /** Zoom, e.g. 1.2 for 20% larger — scales around the framed focal point. */
  scale?: number;
}

const X_KEYWORDS: Record<string, string> = { left: '0%', center: '50%', right: '100%' };
const Y_KEYWORDS: Record<string, string> = { top: '0%', center: '50%', bottom: '100%' };

/** Splits a CSS position on top-level whitespace, keeping calc(...) intact. */
const splitTokens = (value: string): string[] => {
  const tokens: string[] = [];
  let depth = 0;
  let current = '';
  for (const ch of value.trim()) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (/\s/.test(ch) && depth === 0) {
      if (current) tokens.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  if (current) tokens.push(current);
  return tokens;
};

/** Parses a 1- or 2-value object-position into [x, y] lengths/percentages.
 *  Returns undefined for anything fancier (e.g. 4-value edge offsets). */
const parseBase = (position: string | undefined): [string, string] | undefined => {
  const tokens = splitTokens(position ?? '');
  if (tokens.length === 0) return ['50%', '50%'];
  if (tokens.length === 1) {
    const [t] = tokens;
    if (t === 'top' || t === 'bottom') return ['50%', Y_KEYWORDS[t]];
    return [X_KEYWORDS[t] ?? t, '50%'];
  }
  if (tokens.length === 2) {
    let [a, b] = tokens;
    // Keyword pairs may be written y-first ("top left").
    if ((a === 'top' || a === 'bottom') || (b === 'left' || b === 'right')) [a, b] = [b, a];
    return [X_KEYWORDS[a] ?? a, Y_KEYWORDS[b] ?? b];
  }
  return undefined;
};

const nudge = (base: string, px: number | undefined): string =>
  px ? `calc(${base} + ${px}px)` : base;

/** The object-position for a frame: the anchor plus any pixel nudges. */
const resolveImgPos = (
  offsetX: number | undefined,
  offsetY: number | undefined,
  position: string | undefined,
): string | undefined => {
  if (!offsetX && !offsetY) return position;
  const base = parseBase(position);
  if (!base) return position;
  return `${nudge(base[0], offsetX)} ${nudge(base[1], offsetY)}`;
};

/** Inline style for a framed image; undefined when the frame is empty. */
export function frameStyle(frame: ImageFrame | undefined): CSSProperties | undefined {
  if (!frame) return undefined;
  const pos = resolveImgPos(frame.offsetX, frame.offsetY, frame.position);
  const style: Record<string, string | number> = {};
  if (pos) style['--img-pos'] = pos;
  if (frame.scale != null && frame.scale !== 1) style['--img-scale'] = frame.scale;
  return Object.keys(style).length ? style as CSSProperties : undefined;
}

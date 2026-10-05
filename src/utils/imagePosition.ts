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

/** Resolves the `--img-pos` CSS custom property (object-position) for an image.
 *  `position` is the anchor (any CSS object-position, default centre);
 *  `offsetX` / `offsetY` are pixel nudges from that anchor — positive X moves
 *  the image right, positive Y moves it down. Large nudges can expose a gap at
 *  the image's edge, since pixels aren't clamped. Returns undefined when
 *  nothing is set, so the CSS var is left unset. */
export const resolveImgPos = (
  offsetX: number | undefined,
  offsetY: number | undefined,
  position: string | undefined,
): string | undefined => {
  if (!offsetX && !offsetY) return position;
  const base = parseBase(position);
  if (!base) return position;
  return `${nudge(base[0], offsetX)} ${nudge(base[1], offsetY)}`;
};

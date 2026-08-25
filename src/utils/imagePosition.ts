const clampPct = (n: number): number => Math.min(100, Math.max(0, n));

/** Resolves the `--img-pos` CSS custom property (object-position) for an image,
 *  from a plain 0–100 X/Y offset pair — clamped so an out-of-range value doesn't
 *  push the image past its own edge, leaving a blank gap — or a raw CSS
 *  object-position string fallback. Either offset may be set on its own; the
 *  other axis then defaults to 'center'. Returns undefined when neither an
 *  offset nor a position string is set, so the CSS var is left unset. */
export const resolveImgPos = (
  offsetX: number | undefined,
  offsetY: number | undefined,
  position: string | undefined,
): string | undefined => {
  if (offsetX != null || offsetY != null) {
    const x = offsetX != null ? `${clampPct(offsetX)}%` : 'center';
    const y = offsetY != null ? `${clampPct(offsetY)}%` : 'center';
    return `${x} ${y}`;
  }
  return position;
};

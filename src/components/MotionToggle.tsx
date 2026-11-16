// Pause/play button for anything that moves or changes on its own for more
// than five seconds (WCAG 2.2.2). `what` names the thing in the label,
// e.g. "featured projects" → "Pause featured projects".
export default function MotionToggle({ paused, onToggle, what, className = '' }: {
  paused: boolean;
  onToggle: () => void;
  what: string;
  className?: string;
}) {
  const label = `${paused ? 'Play' : 'Pause'} ${what}`;
  return (
    <button
      type="button"
      className={`motion-toggle ${className}`}
      onClick={e => { e.stopPropagation(); onToggle(); }}
      onPointerDown={e => e.stopPropagation()}
      aria-label={label}
      title={label}
    >
      <span aria-hidden="true">{paused ? '▶' : '❚❚'}</span>
    </button>
  );
}

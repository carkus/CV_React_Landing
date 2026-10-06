import { Link } from 'react-router-dom';

// Editorial "read more" link used for every "Explore … in depth" style call to
// action: mono uppercase label on a hairline underline, then a hairline arrow
// pill — the same pill the rail prev/next buttons use. Any trailing arrow
// character in the label (→ / ↗) is dropped, since the pill draws its own.
export default function ExploreLink({ href, label }: { href: string; label: string }) {
  const external = !href.startsWith('/') && !href.startsWith('#');
  const text = label.replace(/\s*[→↗]\s*$/, '');
  const body = (
    <>
      <span className="explore-link-label">{text}</span>
      <span className="explore-link-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d={external ? 'M8 16L16 8M9 8h7v7' : 'M5 12h14M13 6l6 6-6 6'} />
        </svg>
      </span>
    </>
  );
  return external
    ? <a href={href} target="_blank" rel="noopener noreferrer" className="explore-link">{body}</a>
    : <Link to={href} className="explore-link">{body}</Link>;
}

// First focusable element on every page (WCAG 2.4.1): jumps keyboard and
// screen-reader users past the nav to the page's <main id="main">. Handled
// in JS rather than as a plain #main hash so the URL isn't changed and focus
// really lands inside main (some browsers only scroll on a hash jump).
export default function SkipLink() {
  const skip = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const main = document.getElementById('main');
    if (!main) return;
    e.preventDefault();
    main.focus();
    main.scrollIntoView();
  };
  return <a href="#main" className="skip-link" onClick={skip}>Skip to content</a>;
}

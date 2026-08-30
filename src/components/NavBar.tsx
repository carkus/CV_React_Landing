import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

// CV generation moved server-side — the button calls JobFit's own CV generator directly
// (GET /api/cv/download, a fresh render on every click) instead of building a PDF
// client-side or linking to a pre-baked static file. JobFit's dev server is hardcoded to
// port 5173 (jobfit/Program.cs); mirrors the PORTFOLIO_API_BASE pattern already used in
// AskSection.tsx/FooterSection.tsx. Update the prod URL once JobFit is actually deployed.
const JOBFIT_API_BASE = import.meta.env.DEV ? 'http://localhost:5173' : 'https://jobfit.carkus.com';
const CV_PDF_PATH = `${JOBFIT_API_BASE}/api/cv/download`;

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  const close = () => setOpen(false);

  // Close the drawer on an outside tap/click or on any page scroll —
  // it's an overlay, not a persistent panel, so it shouldn't linger once
  // the visitor's attention has clearly moved elsewhere.
  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (e: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) close();
    };
    const handleScroll = () => close();

    document.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [open]);

  return (
    <nav ref={navRef}>
      <div className="nav-inner">
        <Link to="/" className="nav-logo">Mark Scicluna</Link>
        <ul className="nav-links">
          <li><a href="#about">About</a></li>
          <li><a href="#ask">Ask AI</a></li>
          <li><a href="#skills">Skills</a></li>
          <li><a href="#work">Work</a></li>
          <li><a href="#expertise">Expertise</a></li>
          <li><a href="#timeline">Timeline</a></li>
          <li><a href="#contact">Contact</a></li>
          <li><a href={CV_PDF_PATH} download className="nav-app-link">↓ CV</a></li>
        </ul>
        <button className={`nav-hamburger${open ? ' open' : ''}`} onClick={() => setOpen(o => !o)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </div>
      <div className={`nav-drawer${open ? ' open' : ''}`}>
        <a href="#about"        onClick={close}>About</a>
        <a href="#ask"          onClick={close}>Ask AI</a>
        <a href="#skills"       onClick={close}>Skills</a>
        <a href="#work"         onClick={close}>Work</a>
        <a href="#expertise"    onClick={close}>Expertise</a>
        <a href="#timeline"     onClick={close}>Timeline</a>
        <a href="#contact"      onClick={close}>Contact</a>
        <a href={CV_PDF_PATH} download style={{ color: 'var(--accent2)' }} onClick={close}>↓ CV</a>
        <div className="nav-drawer-divider">
          <span>Elsewhere</span>
        </div>
        <a href="/profile#references" className="nav-drawer-diversion" onClick={close}>↗ Reference letters</a>
        <a href="/smooth-software" className="nav-drawer-diversion" onClick={close}>↗ Smooth Software</a>
      </div>
    </nav>
  );
}

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

// Back to a static pre-baked PDF — JobFit's own CV generator (GET
// /api/cv/download) now requires a profileId it has no default for, so the
// public download link 500'd. Update this path whenever a fresher CV is
// dropped into public/files/.
const CV_PDF_PATH = '/files/mark_scicluna_cv_sep2026.pdf';

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
        <div className="nav-right">
          <ul className="nav-links">
            <li><a href="#about">About</a></li>
            <li><a href="#ask">Ask AI</a></li>
            <li><a href="#skills">Skills</a></li>
            <li><a href="#work">Work</a></li>
            <li><a href="#timeline">Timeline</a></li>
            <li><a href="#contact">Contact</a></li>
            <li className="nav-disciplines">
              <Link to="/web">Web</Link>
              <Link to="/ai">AI</Link>
              <Link to="/mobile">Mobile</Link>
            </li>
            <li><a href={CV_PDF_PATH} download className="nav-app-link nav-cv-btn">↓ CV</a></li>
          </ul>
          <ThemeToggle />
          <button className={`nav-hamburger${open ? ' open' : ''}`} onClick={() => setOpen(o => !o)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </div>
      <div className={`nav-drawer${open ? ' open' : ''}`}>
        <a href="#about"        onClick={close}>About</a>
        <a href="#ask"          onClick={close}>Ask AI</a>
        <a href="#skills"       onClick={close}>Skills</a>
        <a href="#work"         onClick={close}>Work</a>
        <a href="#timeline"     onClick={close}>Timeline</a>
        <a href="#contact"      onClick={close}>Contact</a>
        <a href={CV_PDF_PATH} download style={{ color: '#eab308' }} onClick={close}>↓ CV</a>
        <div className="nav-drawer-divider">
          <span>Deep dives</span>
        </div>
        <Link to="/web" onClick={close}>Web &amp; Backend</Link>
        <Link to="/ai" onClick={close}>AI Systems</Link>
        <Link to="/mobile" onClick={close}>Mobile &amp; Spatial</Link>
        <div className="nav-drawer-divider">
          <span>Elsewhere</span>
        </div>
        <a href="/profile#references" className="nav-drawer-diversion" onClick={close}>↗ Reference letters</a>
        <a href="/smooth-software" className="nav-drawer-diversion" onClick={close}>↗ Smooth Software</a>
      </div>
    </nav>
  );
}

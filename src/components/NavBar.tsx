import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { CV_PDF_PATH, downloadCv } from '../data/cv';

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);

  const close = () => setOpen(false);

  // Escape closes the drawer and hands focus back to the button that opened it.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      close();
      burgerRef.current?.focus();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

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
    <nav ref={navRef} aria-label="Main">
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
            <li><a href={CV_PDF_PATH} download onClick={downloadCv} className="nav-app-link nav-cv-btn" aria-label="Download CV (PDF)">↓ CV</a></li>
          </ul>
          <ThemeToggle />
          <button
            ref={burgerRef}
            type="button"
            className={`nav-hamburger${open ? ' open' : ''}`}
            onClick={() => setOpen(o => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="nav-drawer"
          >
            <span aria-hidden="true" /><span aria-hidden="true" /><span aria-hidden="true" />
          </button>
        </div>
      </div>
      <div id="nav-drawer" className={`nav-drawer${open ? ' open' : ''}`}>
        <a href="#about"        onClick={close}>About</a>
        <a href="#ask"          onClick={close}>Ask AI</a>
        <a href="#skills"       onClick={close}>Skills</a>
        <a href="#work"         onClick={close}>Work</a>
        <a href="#timeline"     onClick={close}>Timeline</a>
        <a href="#contact"      onClick={close}>Contact</a>
        <a href={CV_PDF_PATH} download className="nav-drawer-cv" aria-label="Download CV (PDF)" onClick={e => { close(); downloadCv(e); }}>↓ CV</a>
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

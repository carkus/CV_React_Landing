import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { downloadCv } from '../utils/cvPdf';

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  const close = () => setOpen(false);
  const handleDownloadCv = (e: React.MouseEvent) => { e.preventDefault(); downloadCv(); };

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
          <li><a href="#achievements">Achievements</a></li>
          <li><a href="#ask">Ask AI</a></li>
          <li><a href="#skills">Skills</a></li>
          <li><a href="#work">Work</a></li>
          <li><a href="#expertise">Expertise</a></li>
          <li><a href="#timeline">Timeline</a></li>
          <li><a href="#contact">Contact</a></li>
          <li><a href="#" className="nav-app-link" onClick={handleDownloadCv}>↓ CV</a></li>
        </ul>
        <button className={`nav-hamburger${open ? ' open' : ''}`} onClick={() => setOpen(o => !o)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </div>
      <div className={`nav-drawer${open ? ' open' : ''}`}>
        <a href="#about"        onClick={close}>About</a>
        <a href="#achievements" onClick={close}>Achievements</a>
        <a href="#ask"          onClick={close}>Ask AI</a>
        <a href="#skills"       onClick={close}>Skills</a>
        <a href="#work"         onClick={close}>Work</a>
        <a href="#expertise"    onClick={close}>Expertise</a>
        <a href="#timeline"     onClick={close}>Timeline</a>
        <a href="#contact"      onClick={close}>Contact</a>
        <a href="#" style={{ color: 'var(--accent2)' }} onClick={e => { close(); handleDownloadCv(e); }}>↓ CV</a>
        <div className="nav-drawer-divider">
          <span>Elsewhere</span>
        </div>
        <a href="/profile#references" className="nav-drawer-diversion" onClick={close}>↗ Reference letters</a>
        <a href="/smooth-software" className="nav-drawer-diversion" onClick={close}>↗ Smooth Software</a>
      </div>
    </nav>
  );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function NavBar() {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <nav>
      <div className="nav-inner">
        <Link to="/" className="nav-logo">carkus.com</Link>
        <ul className="nav-links">
          <li><a href="#about">About</a></li>
          <li><a href="#skills">Skills</a></li>
          <li><a href="#work">Work</a></li>
          <li><a href="#expertise">Expertise</a></li>
          <li><a href="#timeline">Timeline</a></li>
          <li><a href="#contact">Contact</a></li>
          <li><a href="/files/mark-scicluna-cv-june2026.pdf" download className="nav-app-link">Download CV ↓</a></li>
        </ul>
        <button className={`nav-hamburger${open ? ' open' : ''}`} onClick={() => setOpen(o => !o)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </div>
      <div className={`nav-drawer${open ? ' open' : ''}`}>
        <a href="#about"     onClick={close}>About</a>
        <a href="#skills"    onClick={close}>Skills</a>
        <a href="#work"      onClick={close}>Work</a>
        <a href="#expertise" onClick={close}>Expertise</a>
        <a href="#timeline"  onClick={close}>Timeline</a>
        <a href="#contact"   onClick={close}>Contact</a>
        <a href="/files/mark-scicluna-cv-june2026.pdf" download style={{ color: 'var(--accent2)' }}>Download CV ↓</a>
      </div>
    </nav>
  );
}

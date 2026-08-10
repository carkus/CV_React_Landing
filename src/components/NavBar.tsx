import { useState } from 'react';
import { Link } from 'react-router-dom';
import { downloadCv } from '../utils/cvPdf';

export default function NavBar() {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);
  const handleDownloadCv = (e: React.MouseEvent) => { e.preventDefault(); downloadCv(); };

  return (
    <nav>
      <div className="nav-inner">
        <Link to="/" className="nav-logo">carkus.com</Link>
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
      </div>
    </nav>
  );
}

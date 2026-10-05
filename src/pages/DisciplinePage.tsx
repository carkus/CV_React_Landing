import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import { SlideshowOverlay } from '../components/WorkSection';
import { useDocumentMeta } from '../seo';
import { resolveImgPos } from '../utils/imagePosition';
import { DISCIPLINES, DISCIPLINE_ORDER } from '../data/disciplines';
import type { DisciplineKey, DisciplineProject } from '../data/disciplines';

// Same store-aware icon choice as the Work grid's link icons.
function LinkIcon({ label }: { label: string }) {
  if (/app store/i.test(label)) return <i className="devicon-apple-original" aria-hidden="true" />;
  if (/play store/i.test(label)) return <i className="devicon-android-plain" aria-hidden="true" />;
  return <span aria-hidden="true">↗</span>;
}

function ProjectCase({ project, index }: { project: DisciplineProject; index: number }) {
  const [slideshowOpen, setSlideshowOpen] = useState(false);
  const hasSlideshow = !!project.slideshowImages?.length;
  const openLinks = project.links.filter(l => !!l.url);
  const imgPos = resolveImgPos(project.imageOffsetX, project.imageOffsetY, project.imagePosition);
  const imgStyle = {
    ...(imgPos ? { '--img-pos': imgPos } : {}),
    ...(project.imageScale != null ? { '--img-scale': project.imageScale } : {}),
  } as React.CSSProperties;

  // Typeset like a magazine column: heading full width, then the image floats
  // in a fixed-ratio frame and the summary/highlights wrap around and under
  // it — so long copy flows on instead of stretching (and over-cropping) the
  // image. Tags/links clear the float and sit full width at the bottom.
  return (
    <article className={`dp-case${project.imageUrl ? '' : ' dp-case--plain'}`}>
      <div className="dp-case-body">
        <div className="dp-case-meta">
          <span className="dp-case-num">{String(index + 1).padStart(2, '0')}</span>
          {project.meta}
        </div>
        <h3 className="dp-case-title">{project.title}</h3>
        {project.imageUrl && (
          <figure
            className="dp-case-media"
            style={project.imageAspect ? { aspectRatio: project.imageAspect } : undefined}
          >
            <img
              src={project.imageUrl}
              alt={project.imageAlt ?? project.title}
              loading="lazy"
              style={imgStyle}
            />
            {hasSlideshow && (
              <button type="button" className="dp-case-gallery" onClick={() => setSlideshowOpen(true)}>
                View gallery · {project.slideshowImages!.length}
              </button>
            )}
          </figure>
        )}
        <p className="dp-case-summary">{project.summary}</p>
        <ul className="dp-case-highlights">
          {project.highlights.map(h => <li key={h}>{h}</li>)}
        </ul>
        <div className="dp-case-tags">
          {project.tags.map(t => <span key={t} className="skill-box etag">{t}</span>)}
        </div>
        {openLinks.length > 0 && (
          <div className="dp-case-links">
            {openLinks.map(l => (
              <a key={l.url + l.label} href={l.url} target="_blank" rel="noopener noreferrer" className="dp-case-link">
                <LinkIcon label={l.label} /> {l.label}
              </a>
            ))}
          </div>
        )}
      </div>
      {hasSlideshow && slideshowOpen && (
        <SlideshowOverlay images={project.slideshowImages!} alt={project.imageAlt ?? project.title} startIndex={0} onClose={() => setSlideshowOpen(false)} />
      )}
    </article>
  );
}

export default function DisciplinePage({ discipline }: { discipline: DisciplineKey }) {
  const d = DISCIPLINES[discipline];
  const nextKey = DISCIPLINE_ORDER[(DISCIPLINE_ORDER.indexOf(discipline) + 1) % DISCIPLINE_ORDER.length];
  const next = DISCIPLINES[nextKey];

  useDocumentMeta({ title: d.seoTitle, description: d.seoDescription, path: d.path });

  // BrowserRouter keeps the previous scroll position across route changes —
  // arriving from deep in the home page (or switching tabs here) should
  // start at the top of the new page.
  useEffect(() => { window.scrollTo(0, 0); }, [discipline]);

  return (
    <div className="pf-page dp-page">

      <nav className="pf-nav dp-nav">
        <Link to="/" className="pf-nav-back">← Home</Link>
        <div className="dp-tabs" aria-label="Disciplines">
          {DISCIPLINE_ORDER.map(k => (
            <NavLink key={k} to={DISCIPLINES[k].path} className={({ isActive }) => `dp-tab${isActive ? ' active' : ''}`}>
              {DISCIPLINES[k].label}
            </NavLink>
          ))}
        </div>
        <ThemeToggle />
      </nav>

      <header className="pf-header dp-header">
        <div className="dp-inner">
          <div className="pf-eyebrow">Mark Scicluna · {d.label}</div>
          <h1 className="pf-heading">{d.heading}</h1>
          <p className="pf-sub">{d.sub}</p>
          <div className="dp-intro-grid">
            <div className="pf-about-text">
              {d.intro.map(p => <p key={p}>{p}</p>)}
            </div>
            <div className="pf-stats">
              {d.stats.map(s => (
                <div key={s.label} className="pf-stat">
                  <div className="pf-stat-number">{s.value}</div>
                  <div className="pf-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      <section className="pf-section pf-section--alt">
        <div className="dp-inner">
          <div className="pf-section-label">How I work</div>
          <div className="dp-principles">
            {d.principles.map(p => (
              <div key={p.title} className="dp-principle">
                <div className="info-card-icon">{p.icon}</div>
                <div className="dp-principle-title">{p.title}</div>
                <p className="dp-principle-text">{p.text}</p>
              </div>
            ))}
          </div>
          <div className="dp-stack">
            <span className="dp-stack-label">Stack</span>
            {d.stack.map(t => <span key={t} className="skill-box etag">{t}</span>)}
          </div>
        </div>
      </section>

      <section className="pf-section">
        <div className="dp-inner">
          <div className="pf-section-label">Projects</div>
          <div className="dp-cases">
            {d.projects.map((p, i) => <ProjectCase key={p.title} project={p} index={i} />)}
          </div>
        </div>
      </section>

      <section className="pf-section pf-section--alt dp-next">
        <div className="dp-inner dp-next-inner">
          <div>
            <div className="pf-section-label">Next</div>
            <Link to={next.path} className="dp-next-link">{next.heading} →</Link>
          </div>
          <div className="dp-next-ctas">
            <Link to="/#contact" className="btn-primary">Get in touch</Link>
            <Link to="/profile" className="btn-ghost">References ↗</Link>
          </div>
        </div>
      </section>

      <footer className="pf-footer">
        <Link to="/" className="pf-footer-back">← Back to {window.location.host}</Link>
      </footer>
    </div>
  );
}

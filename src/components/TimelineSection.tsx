import { useEffect, useRef, useState } from 'react';
import type { TimelineEntry } from '../types';

const FALLBACK: TimelineEntry[] = [
  { year: ['2017–', '2026'], role: 'Senior Software Engineer', org: 'Rhizomenet — ZOME', desc: 'Core middle and front-end engineer on ZOME, a large-scale cross-platform product. Cross-platform UI, native iOS and Android middleware layers, and a SwiftUI/visionOS spatial computing app. Early visionOS developer within the team.', tags: ['Cross-platform', 'Swift', 'Kotlin', 'ARKit', 'React', 'TypeScript'] },
  { year: ['2018', 'MSc'], role: 'MSc Computer Science — Distinction', org: 'RMIT University', desc: 'Thesis focused on heuristic search algorithms applied to robotic task planning. Broader studies in AI, distributed systems, and software engineering theory.', tags: ['Gaming AI', 'AI Task Planning', 'Distributed Systems'] },
  { year: ['2007–', '2014'], role: 'Senior Application Developer', org: 'RMIT University', desc: 'Architected and delivered a full e-learning platform — front-end applications and middleware — serving the university\'s digital education programme. Owned the codebase across maintenance, adaptation, and new feature development.', tags: ['ActionScript', '.NET', 'HTML', 'MVC'] },
  { year: ['Personal'], role: 'carkus.com', org: 'Independent — Portfolio & Projects', desc: 'Personal projects including Chatty Prayers (Blazor AI companion app), PDF Forms (Blazor PDF builder with AcroForm generation), and spatial computing prototypes on visionOS.', tags: ['Blazor', 'Claude API', 'visionOS', 'PDF Generation'] },
];

function parseDuration(year: string[]): number | null {
  const start = parseInt(year[0].replace('–', '').trim(), 10);
  if (isNaN(start)) return null;
  const last = year[year.length - 1].trim().toLowerCase();
  if (last === 'present') return new Date().getFullYear() - start;
  const end = parseInt(last, 10);
  return !isNaN(end) && end > start ? end - start : null;
}

export default function TimelineSection() {
  const [entries, setEntries] = useState<TimelineEntry[]>(FALLBACK);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/data/timeline.json')
      .then(r => r.json())
      .then((data: TimelineEntry[]) => { if (data?.length) setEntries(data); })
      .catch(() => {});
  }, []);

  // Duration bar animation: set --dur-pct from data-pct, then animate on scroll-in
  useEffect(() => {
    const inner = innerRef.current;
    if (!inner) return;

    inner.querySelectorAll<HTMLElement>('.timeline-dur-fill').forEach(fill => {
      fill.style.setProperty('--dur-pct', fill.dataset.pct ?? '0%');
    });

    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll<HTMLElement>('.timeline-dur-fill')
            .forEach(fill => fill.classList.add('animated'));
        }
      });
    }, { threshold: 0.3 });

    inner.querySelectorAll<HTMLElement>('.timeline-item').forEach(item => obs.observe(item));
    return () => obs.disconnect();
  }, [entries]);

  const durations = entries.map(e => parseDuration(e.year));
  const maxDur    = Math.max(...durations.filter((d): d is number => d !== null), 1);

  return (
    <section id="timeline">
      <div className="section-inner">
        <div className="timeline-inner" ref={innerRef}>
          <div className="section-eyebrow reveal">Timeline</div>
          <h2 className="section-heading reveal reveal-delay-1">Career arc</h2>
          {entries.map((e, i) => {
            const dur = durations[i];
            const pct = dur !== null ? `${Math.round((dur / maxDur) * 100)}%` : null;
            return (
              <div key={i} className={`timeline-item reveal${i > 0 ? ` reveal-delay-${Math.min(i, 3)}` : ''}`}>
                <div className="timeline-year">
                  {e.year.map((y, yi) => (
                    <span key={yi}>{y}{yi < e.year.length - 1 && <br />}</span>
                  ))}
                  {pct && (
                    <div className="timeline-dur">
                      <div className="timeline-dur-bar">
                        <div className="timeline-dur-fill" data-pct={pct} />
                      </div>
                      <div className="timeline-dur-label">{dur}yr</div>
                    </div>
                  )}
                </div>
                <div className="timeline-dot" />
                <div>
                  <div className="timeline-role">{e.role}</div>
                  <div className="timeline-org">{e.org}</div>
                  <p className="timeline-desc">{e.desc}</p>
                  {e.tags.length > 0 && (
                    <div className="timeline-tags">
                      {e.tags.map(t => <span key={t} className="skill-box etag">{t}</span>)}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

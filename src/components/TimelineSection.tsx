import { useEffect, useState } from 'react';
import type { TimelineEntry } from '../types';

const FALLBACK: TimelineEntry[] = [
  { year: ['2017–', 'present'], role: 'Senior Software Engineer', org: 'Rhizomenet — ZOME', desc: 'Core middle and front-end engineer on ZOME, a large-scale cross-platform product. Flutter UI, native iOS and Android middleware layers, and a SwiftUI/visionOS spatial computing app. Early visionOS developer within the team.', tags: ['Flutter', 'Swift', 'Kotlin', 'ARKit', 'React', 'TypeScript'] },
  { year: ['2018', 'MSc'], role: 'MSc Computer Science — Distinction', org: 'RMIT University', desc: 'Thesis focused on heuristic search algorithms applied to robotic task planning. Broader studies in AI, distributed systems, and software engineering theory.', tags: ['Gaming AI', 'AI Task Planning', 'Distributed Systems'] },
  { year: ['2007–', '2014'], role: 'Senior Application Developer', org: 'RMIT University', desc: 'Architected and delivered a full e-learning platform — front-end applications and middleware — serving the university\'s digital education programme. Owned the codebase across maintenance, adaptation, and new feature development.', tags: ['ActionScript', '.NET', 'HTML', 'MVC'] },
  { year: ['Personal'], role: 'carkus.com', org: 'Independent — Portfolio & Projects', desc: 'Personal projects including Chatty Prayers (Blazor AI companion app), PDF Forms (Blazor PDF builder with AcroForm generation), and spatial computing prototypes on visionOS.', tags: ['Blazor', 'Claude API', 'visionOS', 'PDF Generation'] },
];

export default function TimelineSection() {
  const [entries, setEntries] = useState<TimelineEntry[]>(FALLBACK);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/carkus/carkus-data/main/timeline.json')
      .then(r => r.json())
      .then((data: TimelineEntry[]) => { if (data?.length) setEntries(data); })
      .catch(() => {});
  }, []);

  return (
    <section id="timeline">
      <div className="section-inner">
        <div className="timeline-inner">
          <div className="section-eyebrow reveal">Timeline</div>
          <h2 className="section-heading reveal reveal-delay-1">Career arc</h2>
          {entries.map((e, i) => (
            <div key={i} className={`timeline-item reveal${i > 0 ? ` reveal-delay-${Math.min(i, 3)}` : ''}`}>
              <div className="timeline-year" dangerouslySetInnerHTML={{ __html: e.year.join('<br>') }} />
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
          ))}
        </div>
      </div>
    </section>
  );
}

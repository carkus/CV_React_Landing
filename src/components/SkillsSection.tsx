import { useEffect, useRef, useState } from 'react';
import type { Skill } from '../types';

const FALLBACK: Skill[] = [
  { name: 'Flutter/Dart',        cat: 'Mobile',       icon: 'devicon-flutter-plain colored',    pct: 92 },
  { name: 'Swift / SwiftUI',     cat: 'Mobile',       icon: 'devicon-swift-plain colored',      pct: 92 },
  { name: 'visionOS',            cat: 'Spatial',      icon: 'devicon-apple-plain',              pct: 90 },
  { name: 'React',               cat: 'Web',          icon: 'devicon-react-original colored',   pct: 90 },
  { name: 'Claude API',          cat: 'AI',           icon: '◆',                                pct: 86 },
  { name: 'C#',                  cat: 'Language',     icon: 'devicon-csharp-plain colored',     pct: 86 },
  { name: 'Blazor',              cat: 'Web',          icon: 'devicon-blazor-plain colored',     pct: 84 },
  { name: 'TypeScript',          cat: 'Language',     icon: 'devicon-typescript-plain colored', pct: 82 },
  { name: 'React Native',        cat: 'Mobile',       icon: 'devicon-react-original colored',   pct: 80 },
  { name: 'Kotlin',              cat: 'Mobile',       icon: 'devicon-kotlin-plain colored',     pct: 80 },
  { name: 'AI Planning',         cat: 'Research',     icon: '◆',                                pct: 78 },
  { name: 'Gemini API',          cat: 'AI',           icon: 'devicon-google-plain colored',     pct: 78 },
  { name: 'Git / CI·CD',         cat: 'Tooling',      icon: 'devicon-git-plain colored',        pct: 75 },
  { name: 'Python',              cat: 'Scripting',    icon: 'devicon-python-plain colored',     pct: 74 },
  { name: 'UIKit',               cat: 'iOS',          icon: 'devicon-xcode-plain colored',      pct: 72 },
  { name: 'ASP.NET Core',        cat: 'Backend',      icon: 'devicon-dotnetcore-plain colored', pct: 70 },
  { name: 'Jetpack Compose',     cat: 'Android',      icon: 'devicon-android-plain colored',    pct: 70 },
  { name: 'ARKit',               cat: 'Spatial',      icon: 'devicon-apple-plain',              pct: 66 },
  { name: 'systemd',             cat: 'DevOps',       icon: 'devicon-linux-plain colored',      pct: 60 },
];

function buildCols(skills: Skill[]) {
  const sorted = [...skills].sort((a, b) => b.pct - a.pct);
  const cols: { header: string; skills: Skill[] }[] = [];
  if (sorted.length > 0) cols.push({ header: 'High Proficiency', skills: sorted.slice(0, 6) });
  if (sorted.length > 6) cols.push({ header: 'Extended Stack',   skills: sorted.slice(6, 12) });
  return { cols, other: sorted.slice(12) };
}

function SkillIcon({ icon }: { icon: string }) {
  if (icon.startsWith('devicon-')) return <i className={icon} />;
  if (icon.startsWith('img/'))    return <img src={`/${icon}`} alt="" />;
  return <span>{icon}</span>;
}

export default function SkillsSection() {
  const [skills, setSkills] = useState<Skill[]>(FALLBACK);
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/carkus/carkus-data/main/skills.json')
      .then(r => r.json())
      .then((data: Skill[]) => { if (data?.length) setSkills(data); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;
    let timers: ReturnType<typeof setTimeout>[] = [];

    const reset = () => {
      timers.forEach(clearTimeout);
      timers = [];
      board.querySelectorAll<HTMLElement>('.skill-row').forEach(row => {
        row.classList.remove('revealed');
        const fill = row.querySelector<HTMLElement>('.skill-row-bar-fill');
        if (fill) fill.style.transition = 'none';
      });
    };

    const cascade = () => {
      board.querySelectorAll<HTMLElement>('.skills-col').forEach(col => {
        col.querySelectorAll<HTMLElement>('.skill-row').forEach((row, i) => {
          const t = setTimeout(() => {
            const fill = row.querySelector<HTMLElement>('.skill-row-bar-fill');
            if (fill) fill.style.transition = '';
            row.classList.add('revealed');
          }, i * 90);
          timers.push(t);
        });
      });
    };

    const obs = new IntersectionObserver(entries => {
      entries[0].isIntersecting ? cascade() : reset();
    }, { threshold: 0.15 });
    obs.observe(board);
    return () => { obs.disconnect(); reset(); };
  }, [skills]);

  const { cols, other } = buildCols(skills);

  return (
    <section id="skills">
      <div className="section-inner">
        <div className="section-eyebrow reveal">Skills</div>
        <h2 className="section-heading reveal reveal-delay-1">The toolkit</h2>
        <p className="section-intro reveal reveal-delay-2">Ten years of shipping across stacks — Swift, Flutter, React, visionOS. The work that interests me most now sits at the intersection of those platforms and AI: integrating Claude and Gemini into apps that assist the user intelligently.</p>
        <p className="section-sub reveal reveal-delay-3">High proficiency covers technology I have used in my daily work over a period of years. My extended stack is what I reach for regularly and know well, and other skills round out the rest.</p>
      </div>
      <div className="section-inner" style={{ paddingTop: 0 }}>
        <div className="skills-board" id="skillsBoard" ref={boardRef}>
          {cols.map(col => (
            <div key={col.header} className="skills-col">
              <div className="skills-col-header">{col.header}</div>
              {col.skills.map(s => (
                <div key={s.name} className="skill-row" style={{ '--pct': `${s.pct}%` } as React.CSSProperties}>
                  <div className="skill-row-identity">
                    <div className="skill-row-icon"><SkillIcon icon={s.icon} /></div>
                    <div>
                      <div className="skill-row-name">{s.name}</div>
                      <div className="skill-row-cat">{s.cat}</div>
                    </div>
                  </div>
                  <div className="skill-row-meter">
                    <div className="skill-row-prof-label">
                      Proficiency <span className="skill-row-pct">{s.pct}%</span>
                    </div>
                    <div className="skill-row-bar">
                      <div className="skill-row-bar-fill" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
        {other.length > 0 && (
          <div className="skills-other-box">
            <div className="skills-col-header">Other Skills</div>
            <div className="skills-other">
              {other.map(s => <span key={s.name} className="skill-box etag">{s.name}</span>)}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

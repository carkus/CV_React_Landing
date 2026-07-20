import { useEffect, useRef, useState } from 'react';
import type { Skill } from '../types';

interface SkillsJsonGroup { pct: number; skills: { name: string; icon: string; pct: number }[]; }
type SkillsJson = Record<string, SkillsJsonGroup>;

const FALLBACK_DATA: SkillsJson = {
  Mobile: { pct: 86, skills: [
    { name: 'Cross-Platform',  icon: 'devicon-flutter-plain colored',    pct: 92 },
    { name: 'iOS',              icon: 'devicon-apple-original',           pct: 90 },
    { name: 'React Native',     icon: 'devicon-react-original colored',   pct: 80 },
    { name: 'Jetpack Compose',  icon: 'devicon-android-plain colored',    pct: 75 },
  ] },
  Spatial: { pct: 78, skills: [
    { name: 'visionOS', icon: 'devicon-apple-original', pct: 90 },
    { name: 'ARKit',    icon: 'devicon-apple-original', pct: 66 },
  ] },
  Web: { pct: 87, skills: [
    { name: 'JavaScript', icon: 'devicon-javascript-plain colored', pct: 90 },
    { name: 'React',      icon: 'devicon-react-original colored',   pct: 90 },
    { name: 'TypeScript', icon: 'devicon-typescript-plain colored', pct: 85 },
    { name: 'Blazor',     icon: 'devicon-blazor-plain colored',     pct: 84 },
  ] },
  AI: { pct: 80, skills: [
    { name: 'Claude & Gemini APIs',          icon: '◆',                            pct: 86 },
    { name: 'Agentic Orchestration',         icon: '◆',                            pct: 82 },
    { name: 'RAG Pipelines',                 icon: '◆',                            pct: 82 },
    { name: 'LangChain/LangGraph',           icon: '◆',                            pct: 78 },
    { name: 'MCP Integration',               icon: '◆',                            pct: 78 },
    { name: 'LlamaIndex',                    icon: '◆',                            pct: 76 },
    { name: 'Schema-Constrained Generation', icon: 'devicon-python-plain colored', pct: 76 },
    { name: 'LLM/PDDL Planning',             icon: '◆',                            pct: 80 },
  ] },
  Language: { pct: 81, skills: [
    { name: 'Swift / SwiftUI', icon: 'devicon-swift-plain colored',      pct: 92 },
    { name: 'Python',          icon: 'devicon-python-plain colored',     pct: 82 },
    { name: 'C#',               icon: 'devicon-csharp-plain colored',     pct: 80 },
    { name: 'Kotlin',           icon: 'devicon-kotlin-plain colored',     pct: 75 },
    { name: 'UIKit',            icon: 'devicon-xcode-plain colored',      pct: 72 },
  ] },
  Data: { pct: 75, skills: [
    { name: 'PostgreSQL', icon: 'devicon-postgresql-plain colored', pct: 80 },
    { name: 'MongoDB',    icon: 'devicon-mongodb-plain colored',    pct: 75 },
    { name: 'SQL',        icon: '◆',                                pct: 78 },
    { name: 'NoSQL',      icon: '◆',                                pct: 72 },
  ] },
  'DevOps and Tooling': { pct: 75, skills: [
    { name: 'Git / CI·CD', icon: 'devicon-git-plain colored',   pct: 75 },
    { name: 'systemd',      icon: 'devicon-linux-plain colored', pct: 60 },
  ] },
  Backend: { pct: 78, skills: [
    { name: '.NET', icon: 'devicon-dotnetcore-plain colored', pct: 78 },
  ] },
};

interface CategoryGroup { cat: string; pct: number; skills: Skill[]; }

function buildCategoryGroups(data: SkillsJson): CategoryGroup[] {
  return Object.entries(data)
    .map(([cat, group]) => ({
      cat,
      pct: group.pct,
      skills: [...group.skills]
        .sort((a, b) => b.pct - a.pct)
        .map(s => ({ name: s.name, cat, icon: s.icon, pct: s.pct })),
    }))
    .sort((a, b) => b.pct - a.pct);
}

function SkillIcon({ icon }: { icon: string }) {
  if (icon.startsWith('devicon-')) return <i className={icon} />;
  if (icon.startsWith('img/'))    return <img src={`/${icon}`} alt="" />;
  return <span>{icon}</span>;
}

function SkillTag({ s }: { s: Skill }) {
  return (
    <span className="skill-box etag">
      <span className="etag-icon"><SkillIcon icon={s.icon} /></span>
      {s.name}
    </span>
  );
}

export default function SkillsSection() {
  const [data, setData] = useState<SkillsJson>(FALLBACK_DATA);
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/data/skills.json')
      .then(r => r.json())
      .then((json: SkillsJson) => { if (json && Object.keys(json).length) setData(json); })
      .catch(() => {});
  }, []);

  // Skill row cascade — staggers the flip-in reveal of each row
  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;
    let timers: ReturnType<typeof setTimeout>[] = [];

    const reset = () => {
      timers.forEach(clearTimeout);
      timers = [];
      board.querySelectorAll<HTMLElement>('.skill-row').forEach(row => {
        row.classList.remove('revealed');
      });
    };

    const cascade = () => {
      board.querySelectorAll<HTMLElement>('.skill-row').forEach((row, i) => {
        const t = setTimeout(() => row.classList.add('revealed'), i * 90);
        timers.push(t);
      });
    };

    const obs = new IntersectionObserver(entries => {
      entries[0].isIntersecting ? cascade() : reset();
    }, { threshold: 0.15 });
    obs.observe(board);
    return () => { obs.disconnect(); reset(); };
  }, [data]);

  const groups = buildCategoryGroups(data);
  const aiGroup = groups.find(g => g.cat === 'AI');
  const arVrGroup = groups.find(g => g.cat === 'AR/VR');
  const restGroups = groups.filter(g => g.cat !== 'AI' && g.cat !== 'AR/VR');
  const topGroups = restGroups.slice(0, 3);
  const otherSkills = restGroups.slice(3)
    .flatMap(g => g.skills)
    .sort((a, b) => b.pct - a.pct);

  return (
    <section id="skills">
      <div className="section-inner">
        <div className="section-eyebrow reveal">Skills</div>
        <h2 className="section-heading reveal reveal-delay-1">The toolkit</h2>
        <p className="section-intro reveal reveal-delay-2">I have worked regularly across a number of platforms, as the roles required. From building new systems to maintaining legacy code, which has given me broad exposure to cross-platform and native mobile development, and modern web frameworks. More recently, I've been focused on AI integration — revisiting my Master's work in automation through hands-on work with LLMs, both local and cloud-hosted, building RAG pipelines, agentic workflows, and structured output systems.</p>
        <p className="section-sub reveal reveal-delay-3">High proficiency covers the categories I work with regularly, ranked by depth of experience; other skills round out the rest:</p>
      </div>

      <div className="section-inner section-inner--no-top">
        <div className="skills-tier-label">High Proficiency</div>
        <div className="skills-board" id="skillsBoard" ref={boardRef}>
          {topGroups.map(group => (
            <div key={group.cat} className="skills-cat-row">
              <div className="skills-cat-header">
                <span>{group.cat}</span>
              </div>
              <div className="skills-cat-techs">
                {group.skills.map(s => (
                  <div key={s.name} className="skill-row">
                    <div className="skill-row-identity">
                      <div className="skill-row-icon"><SkillIcon icon={s.icon} /></div>
                      <div className="skill-row-name">{s.name}</div>
                    </div>
                    <div className="skill-row-stars" title={`${s.pct}% proficiency`}>
                      {Array.from({ length: 5 }, (_, i) => (
                        <span key={i} className={`skill-row-star${i < Math.round(s.pct / 20) ? ' filled' : ''}`}>★</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        {aiGroup && (
          <div className="skills-other-box">
            <div className="skills-col-header">AI</div>
            <div className="skills-other">
              {aiGroup.skills.map(s => <SkillTag key={s.name} s={s} />)}
            </div>
          </div>
        )}
        {arVrGroup && (
          <div className="skills-other-box">
            <div className="skills-col-header">AR/VR</div>
            <div className="skills-other">
              {arVrGroup.skills.map(s => <SkillTag key={s.name} s={s} />)}
            </div>
          </div>
        )}
        {otherSkills.length > 0 && (
          <div className="skills-other-box">
            <div className="skills-col-header">Other Skills</div>
            <div className="skills-other">
              {otherSkills.map(s => <SkillTag key={s.name} s={s} />)}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

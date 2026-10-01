import { useEffect, useRef, useState } from 'react';
import type { Skill } from '../types';

const PORTFOLIO_API_BASE = import.meta.env.DEV ? 'http://localhost:5131' : 'https://api.carkus.com';

interface SkillsJsonGroup { pct: number; summary?: string; skills: { name: string; icon: string; pct: number; group?: string }[]; }
type SkillsJson = Record<string, SkillsJsonGroup>;

interface GithubLanguageCount { language: string; repoCount: number; }
interface GithubLanguageStats { languages: GithubLanguageCount[]; activeRepoCount: number; months: number; }

const LANGUAGE_ICONS: Record<string, string> = {
  TypeScript: 'devicon-typescript-plain colored',
  JavaScript: 'devicon-javascript-plain colored',
  Python: 'devicon-python-plain colored',
  'C#': 'devicon-csharp-plain colored',
  Swift: 'devicon-swift-plain colored',
  Kotlin: 'devicon-kotlin-plain colored',
  Dart: 'devicon-flutter-plain colored',
  HTML: 'devicon-html5-plain colored',
  CSS: 'devicon-css3-plain colored',
  Java: 'devicon-xcode-plain colored',
  Ruby: 'devicon-ruby-plain colored',
  Go: 'devicon-go-plain colored',
};

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
    { name: 'Self-Scaffolding Agents',       icon: '◆',                            pct: 84, group: 'Agentic Systems' },
    { name: 'Master/Worker Delegation',      icon: '◆',                            pct: 82, group: 'Agentic Systems' },
    { name: 'Self-Sequenced Planning',       icon: '◆',                            pct: 82, group: 'Agentic Systems' },
    { name: 'LLM/PDDL Planning',             icon: '◆',                            pct: 80, group: 'Agentic Systems' },
    { name: 'MCP Integration',               icon: '◆',                            pct: 78, group: 'Tools & Structured Output' },
    { name: 'Schema-Constrained Generation', icon: 'devicon-python-plain colored', pct: 76, group: 'Tools & Structured Output' },
    { name: 'LangChain/LangGraph',           icon: '◆',                            pct: 78, group: 'Tools & Structured Output' },
    { name: 'RAG Pipelines',                 icon: '◆',                            pct: 82, group: 'Retrieval' },
    { name: 'LlamaIndex',                    icon: '◆',                            pct: 76, group: 'Retrieval' },
    { name: 'Claude & Gemini APIs',          icon: '◆',                            pct: 86, group: 'Models & Providers' },
    { name: 'Token Usage & Latency Tracking', icon: '◆',                           pct: 80, group: 'Observability' },
    { name: 'Cost Tracking',                 icon: '◆',                            pct: 78, group: 'Observability' },
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

interface CategoryGroup { cat: string; pct: number; summary?: string; skills: Skill[]; }

function buildCategoryGroups(data: SkillsJson): CategoryGroup[] {
  return Object.entries(data)
    .map(([cat, group]) => ({
      cat,
      pct: group.pct,
      summary: group.summary,
      skills: [...group.skills]
        .sort((a, b) => b.pct - a.pct)
        .map(s => ({ name: s.name, cat, icon: s.icon, pct: s.pct, group: s.group })),
    }))
    .sort((a, b) => b.pct - a.pct);
}

// Splits a category's skills into named subgroups, in order of first
// appearance in the JSON (not by pct), so the data controls which subgroup
// leads. Ungrouped skills fall into a single unnamed bucket.
function buildSubgroups(cat: string, data: SkillsJson, skills: Skill[]): { name: string; skills: Skill[] }[] {
  const order = [...new Set((data[cat]?.skills ?? []).map(s => s.group ?? ''))];
  return order
    .map(name => ({ name, skills: skills.filter(s => (s.group ?? '') === name) }))
    .filter(g => g.skills.length > 0);
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
  const [githubStats, setGithubStats] = useState<GithubLanguageStats | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/data/skills.json')
      .then(r => r.json())
      .then((json: SkillsJson) => { if (json && Object.keys(json).length) setData(json); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch(`${PORTFOLIO_API_BASE}/v1/portfolio/github-languages?months=3`)
      .then(r => r.ok ? r.json() : null)
      .then((json: GithubLanguageStats | null) => { if (json?.languages?.length) setGithubStats(json); })
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
      
        <div className="work-summation reveal reveal-delay-2">
          <div className="work-summation-col">
            <div className="work-summation-label">Frontend</div>
            <ul className="work-summation-list">
              <li>Cross-platform mobile, AI-integrated web, and spatial computing — shipped to App Store, Play Store, and Vision Pro</li>
              <li>Native Swift/SwiftUI for iOS and visionOS, and React/Blazor for the web layer</li>
              <li>Claude and Gemini APIs wired directly into the UI, backed by multi-provider LLM cascades, RAG pipelines, and MCP tool integrations for structured, context-aware AI features</li>
            </ul>
            <div className="work-summation-tags">
              {['Cross-platform', 'Swift / SwiftUI', 'visionOS', 'React', 'Blazor', 'Claude API', 'Gemini API'].map(t => <span key={t} className="skill-box etag">{t}</span>)}
            </div>
          </div>
          <div className="work-summation-divider" />
          <div className="work-summation-col">
            <div className="work-summation-label">Backend</div>
            <ul className="work-summation-list">
              <li>NodeJS or .NET backends, streaming AI over SSE</li>
              <li>Multi-provider LLM orchestration with Ollama fallback, RAG via embedding search</li>
              <li>Agentic document pipelines with LangGraph and LlamaIndex, plus PDF generation and MCP tool servers for Claude Code and Claude Desktop</li>
              <li>Structured prompt engineering with validated, typed outputs</li>
            </ul>
            <div className="work-summation-tags">
              {['Node JS', 'ASP.NET Core', 'Python', 'Ollama', 'RAG', 'PDF Generation', 'Multi-provider LLM'].map(t => <span key={t} className="skill-box etag">{t}</span>)}
            </div>
          </div>
        </div>
      </div>

      <div className="section-inner section-inner--no-top">
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
            {aiGroup.summary && <p className="skills-summary">{aiGroup.summary}</p>}
            <div className="skills-subgroups">
              {buildSubgroups(aiGroup.cat, data, aiGroup.skills).map(sub => (
                <div key={sub.name} className="skills-subgroup">
                  {sub.name && <div className="skills-subgroup-label">{sub.name}</div>}
                  <div className="skills-other">
                    {sub.skills.map(s => <SkillTag key={s.name} s={s} />)}
                  </div>
                </div>
              ))}
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
        {githubStats && (
          <div className="skills-other-box">
            <div className="skills-col-header">Active on GitHub · Last {githubStats.months} Months</div>
            <div className="skills-other">
              {githubStats.languages.map(l => (
                <span key={l.language} className="skill-box etag">
                  <span className="etag-icon"><SkillIcon icon={LANGUAGE_ICONS[l.language] ?? '◆'} /></span>
                  {l.language} · {l.repoCount} {l.repoCount === 1 ? 'repo' : 'repos'}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      
    </section>
  );
}

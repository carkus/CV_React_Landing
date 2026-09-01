import { useEffect, useState } from 'react';
import type { SmallProject } from '../types';

const FALLBACK: SmallProject[] = [
  { title: 'Smooth Software', description: '80s-homage landing page — animated CRT-glow borders and retro type, built as a standalone side page off the main site.', tags: ['React', 'TypeScript', 'CSS Animation'], url: 'https://smoothsoftware.carkus.com' },
  { title: 'Auth Login', description: 'Multi-tenant shared auth server — registration, login, token refresh, email verification, and password reset, auto-provisioning a siteId per consuming project.', tags: ['ASP.NET Core', 'JWT', 'Multi-tenant'], url: 'https://auth.carkus.com' },
  { title: 'AI Agent', description: 'Self-scaffolding agent platform — describe a task in plain language and it builds a purpose-built agent (role, tools, implementation) via the Claude API.', tags: ['Claude API', 'AWS Lambda', 'Agentic'] },
  { title: 'Markdown Viewer', description: 'Lightweight Markdown rendering utility with syntax-highlighted code blocks and GitHub-flavoured Markdown support.', tags: ['React', 'react-markdown'] },
];

function SmallProjectCard({ item }: { item: SmallProject }) {
  const inner = (
    <>
      <div className="small-project-title">{item.title}</div>
      <p className="small-project-desc">{item.description}</p>
      <div className="small-project-tags">
        {item.tags.map(t => <span key={t} className="skill-box work-tag">{t}</span>)}
      </div>
    </>
  );

  return item.url ? (
    <a href={item.url} target="_blank" rel="noopener noreferrer" className="small-project-card small-project-card-link">
      {inner}
      <span className="small-project-arrow">↗</span>
    </a>
  ) : (
    <div className="small-project-card">{inner}</div>
  );
}

export default function SmallProjectsSection() {
  const [items, setItems] = useState<SmallProject[]>(FALLBACK);

  useEffect(() => {
    fetch('/data/smallprojects.json')
      .then(r => r.json())
      .then((data: SmallProject[]) => { if (data?.length) setItems(data); })
      .catch(() => {});
  }, []);

  return (
    <section id="small-projects">
      <div className="section-inner">
        <div className="section-eyebrow reveal">Also built recently</div>
        <h2 className="section-heading reveal reveal-delay-1">Small projects &amp; sites</h2>
        <div className="small-projects-grid reveal reveal-delay-2">
          {items.map(item => <SmallProjectCard key={item.title} item={item} />)}
        </div>
      </div>
    </section>
  );
}

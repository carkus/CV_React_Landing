import { Link } from 'react-router-dom';

interface AiThread { num: string; icon: string; title: string; points: string[]; tags: string[]; wide?: boolean; }

const AI_THREADS: AiThread[] = [
  {
    num: '01',
    icon: '✦',
    title: 'Agentic Systems & Planning',
    points: [
      'A master agent decomposes a plain-language goal and sequences its own plan of dependent subtasks — nothing fixed in advance',
      'Purpose-built worker agents are bootstrapped per subtask — own role, tools, and MCP access — then deployed and coordinated by the master',
      'Self-evaluation checks every response, feeding pass rates back into which models get chosen next',
      'Grounded in MSc heuristic search using PDDL robotics, now applied to LLM task-planning',
    ],
    tags: ['Self-Scaffolding Agents', 'Master/Worker Delegation', 'Self-Sequenced Planning', 'Self-Evaluation', 'MCP', 'Heuristic Search', 'PDDL'],
    wide: true,
  },
  {
    num: '02',
    icon: '⇄',
    title: 'Provider Orchestration & Resilience',
    points: ['Fallback chain across providers, with a correction-prompt retry before failing over further'],
    tags: ['Fallback Chains', 'Retry-on-Malformed', 'Parallel Ensembles'],
  },
  {
    num: '03',
    icon: '⌂',
    title: 'Local-First & Privacy',
    points: ['Local LLM as fallback or default, keeping sensitive data off the cloud'],
    tags: ['Ollama', 'Local LLM', 'Data Privacy'],
  },
  {
    num: '04',
    icon: '▤',
    title: 'Structured Output & Prompt Discipline',
    points: ['Typed, schema-validated outputs from reusable, per-task-tuned prompts'],
    tags: ['Schema-first Prompting', 'Typed Outputs', 'Prompt Templates'],
  },
  {
    num: '05',
    icon: '⌕',
    title: 'Retrieval & Grounding',
    points: ['Semantic search over my own data, chunked and pre-fetched as needed'],
    tags: ['RAG', 'Embeddings', 'Context Injection'],
  },
];

export default function AiSection() {
  return (
    <section id="ai">
      <div className="section-inner">
        <div className="section-eyebrow reveal">AI</div>
        <h2 className="section-heading reveal reveal-delay-1">AI work across fields</h2>
        <p className="section-intro reveal reveal-delay-2">Agentic systems that build their own workforce — a master agent decomposes a goal, sequences its own plan of dependent subtasks, then bootstraps and deploys purpose-built worker agents for each one, with self-evaluation feeding back into which models get used.</p>
        <div className="info-card-grid reveal reveal-delay-2">
          {AI_THREADS.map(t => (
            <div key={t.num} className={`info-card${t.wide ? ' info-card--wide' : ''}`}>
              <div className="info-card-main">
                <div className="info-card-icon">{t.icon}</div>
                <div className="info-card-body">
                  <div className="info-card-title">{t.title}</div>
                  <ul className="info-card-list">
                    {t.points.map(p => <li key={p}>{p}</li>)}
                  </ul>
                </div>
              </div>
              <div className="info-card-tags">
                {t.tags.map(tag => <span key={tag} className="skill-box ai-tag">{tag}</span>)}
              </div>
            </div>
          ))}
        </div>
        <div className="section-deep-link reveal reveal-delay-3">
          <Link to="/ai" className="btn-ghost">Explore AI projects in depth →</Link>
        </div>
      </div>
    </section>
  );
}

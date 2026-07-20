interface AiThread { num: string; icon: string; title: string; points: string[]; tags: string[]; }

const AI_THREADS: AiThread[] = [
  {
    num: '01',
    icon: '⇄',
    title: 'Provider Orchestration & Resilience',
    points: ['Fallback chain across providers, with a correction-prompt retry before failing over further'],
    tags: ['Fallback Chains', 'Retry-on-Malformed', 'Parallel Ensembles'],
  },
  {
    num: '02',
    icon: '◐',
    title: 'Local-First & Privacy',
    points: ['Local LLM as fallback or default, keeping sensitive data off the cloud'],
    tags: ['Ollama', 'Local LLM', 'Data Privacy'],
  },
  {
    num: '03',
    icon: '▤',
    title: 'Structured Output & Prompt Discipline',
    points: ['Typed, schema-validated outputs from reusable, per-task-tuned prompts'],
    tags: ['Schema-first Prompting', 'Typed Outputs', 'Prompt Templates'],
  },
  {
    num: '04',
    icon: '⌕',
    title: 'Retrieval & Grounding',
    points: ['Semantic search over my own data, chunked and pre-fetched as needed'],
    tags: ['RAG', 'Embeddings', 'Context Injection'],
  },
  {
    num: '05',
    icon: '⏱',
    title: 'Observability',
    points: ['Token usage and latency tracked per call, surfaced in the UI'],
    tags: ['Token Usage', 'Latency', 'Cost Tracking'],
  },
  {
    num: '06',
    icon: '⎇',
    title: 'Heuristic Search & LLM Planning',
    points: ['MSc heuristic search, now applied to LLM-assisted PDDL planning'],
    tags: ['Heuristic Search', 'PDDL', 'LLM Planning'],
  },
];

export default function AiSection() {
  return (
    <section id="ai">
      <div className="section-inner">
        <div className="section-eyebrow reveal">AI</div>
        <h2 className="section-heading reveal reveal-delay-1">AI work across fields</h2>
        <div className="ai-threads reveal reveal-delay-2">
          {AI_THREADS.map(t => (
            <div key={t.num} className="ai-thread">
              <div className="ai-thread-main">
                <div className="ai-thread-icon">{t.icon}</div>
                <div className="ai-thread-body">
                  <div className="ai-thread-title">{t.title}</div>
                  <ul className="ai-thread-list">
                    {t.points.map(p => <li key={p}>{p}</li>)}
                  </ul>
                </div>
              </div>
              <div className="ai-thread-tags">
                {t.tags.map(tag => <span key={tag} className="skill-box ai-tag">{tag}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

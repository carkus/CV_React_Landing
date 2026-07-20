import { useEffect, useState } from 'react';

const PORTFOLIO_API_BASE = import.meta.env.DEV ? 'http://localhost:5131' : 'https://api.carkus.com';
const PORTFOLIO_ASK_URL = `${PORTFOLIO_API_BASE}/v1/portfolio/ask`;
const PORTFOLIO_DISCUSS_URL = `${PORTFOLIO_API_BASE}/v1/portfolio/discuss`;
const PORTFOLIO_REFLECTION_URL = `${PORTFOLIO_API_BASE}/v1/portfolio/reflection`;

function DiscussForm() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();
    if (!trimmedEmail || !trimmedMessage || loading) return;

    setLoading(true);
    setStatus('idle');
    setError('');

    try {
      const res = await fetch(PORTFOLIO_DISCUSS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail, message: trimmedMessage }),
      });
      if (res.status === 429) {
        setError("You've hit the request limit for now — try again later.");
        setStatus('error');
        return;
      }
      if (!res.ok) throw new Error();
      setStatus('sent');
      setMessage('');
    } catch {
      setError("Couldn't send that — try again in a moment.");
      setStatus('error');
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button type="button" className="ai-discuss-toggle" onClick={() => setOpen(true)}>
        Want a real conversation? Leave your email →
      </button>
    );
  }

  return (
    <form className="ai-discuss-form" onSubmit={send}>
      <input
        className="ai-ask-input"
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <textarea
        className="ai-discuss-textarea"
        placeholder="What would you like to discuss?"
        value={message}
        maxLength={2000}
        onChange={e => setMessage(e.target.value)}
        required
      />
      <button className="ai-ask-submit" type="submit" disabled={loading || !email.trim() || !message.trim()}>
        {loading ? '···' : 'Send →'}
      </button>
      {status === 'sent' && <p className="ai-ask-reply">Thanks — I'll reply directly to your email shortly.</p>}
      {status === 'error' && <p className="ai-ask-error">{error}</p>}
    </form>
  );
}

function AiAsk() {
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function ask(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setError('');
    setReply('');

    try {
      const res = await fetch(PORTFOLIO_ASK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed }),
      });
      if (!res.ok) throw new Error();
      const data: { reply: string } = await res.json();
      setReply(data.reply);
    } catch {
      setError("Couldn't reach the assistant — try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  function onMessageChange(value: string) {
    setMessage(value);
    if (!value.trim()) {
      setReply('');
      setError('');
    }
  }

  return (
    <div className="ai-ask reveal reveal-delay-2">
      <form className="ai-ask-form" onSubmit={ask}>
        <input
          className="ai-ask-input"
          type="text"
          placeholder="e.g. what's his experience with RAG?"
          value={message}
          maxLength={500}
          onChange={e => onMessageChange(e.target.value)}
        />
        <button className="ai-ask-submit" type="submit" disabled={loading || !message.trim()}>
          {loading ? '···' : 'Ask →'}
        </button>
      </form>
      {error && <p className="ai-ask-error">{error}</p>}
      {reply && <p className="ai-ask-reply">{reply}</p>}
      <div className="ai-discuss">
        <DiscussForm />
      </div>
    </div>
  );
}

function AiReflection() {
  const [text, setText] = useState('');
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  useEffect(() => {
    fetch(PORTFOLIO_REFLECTION_URL)
      .then(res => (res.ok ? res.json() : null))
      .then((data: { text: string; updatedAt: string } | null) => {
        if (data?.text) {
          setText(data.text);
          setUpdatedAt(data.updatedAt);
        }
      })
      .catch(() => {});
  }, []);

  if (!text) return null;

  return (
    <div className="ai-reflection reveal reveal-delay-2">
      <div className="ai-reflection-label">In its own words</div>
      <p className="ai-reflection-text">{text}</p>
      {updatedAt && (
        <div className="ai-reflection-meta">
          Last rewrote this {new Date(updatedAt).toLocaleDateString()} — it decides for itself when to change it.
        </div>
      )}
    </div>
  );
}

export default function AskSection() {
  return (
    <section id="ask">
      <div className="section-inner">
        <div className="section-eyebrow reveal">AI Assistant</div>
        <h2 className="section-heading reveal reveal-delay-1">Ask about me...</h2>
        <AiAsk />
        <AiReflection />
      </div>
    </section>
  );
}

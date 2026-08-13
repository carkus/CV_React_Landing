import { useState } from 'react';
import { Link } from 'react-router-dom';

const PORTFOLIO_API_BASE = import.meta.env.DEV ? 'http://localhost:5131' : 'https://api.carkus.com';
const PORTFOLIO_ASK_URL = `${PORTFOLIO_API_BASE}/v1/portfolio/ask`;
const PORTFOLIO_DISCUSS_URL = `${PORTFOLIO_API_BASE}/v1/portfolio/discuss`;

// Turns mentions of internal routes (e.g. "/profile") in the AI's plain-text reply
// into real, clickable in-app links rather than dead text.
function renderReplyWithLinks(text: string) {
  const pattern = /\/profile\b/g;
  const parts: (string | React.ReactElement)[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    parts.push(
      <Link key={key++} to="/profile" className="ai-ask-link">/profile</Link>
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));

  return parts;
}

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

// Icon + label for whichever provider actually answered — the backend falls back from
// Claude to Gemini if the primary provider is unavailable, so this reflects the truth of
// what generated the reply rather than assuming a fixed provider.
const PROVIDER_ICONS: Record<string, { src: string; label: string }> = {
  Claude: { src: '/img/claude-ai.svg', label: 'Claude' },
  Gemini: { src: '/img/gemini.svg', label: 'Gemini' },
};

function AiAsk() {
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState('');
  const [provider, setProvider] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function ask(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setError('');
    setReply('');
    setProvider('');

    try {
      const res = await fetch(PORTFOLIO_ASK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed }),
      });
      if (!res.ok) throw new Error();
      const data: { reply: string; provider?: string } = await res.json();
      setReply(data.reply);
      setProvider(data.provider ?? '');
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
      setProvider('');
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
      {reply && (
        <div className="ai-ask-reply-block">
          <p className="ai-ask-reply">{renderReplyWithLinks(reply)}</p>
          {provider && PROVIDER_ICONS[provider] && (
            <div className="ai-ask-provider">
              <img src={PROVIDER_ICONS[provider].src} alt="" />
              <span>Answered by {PROVIDER_ICONS[provider].label}</span>
            </div>
          )}
        </div>
      )}
      <div className="ai-discuss">
        <DiscussForm />
      </div>
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
      </div>
    </section>
  );
}

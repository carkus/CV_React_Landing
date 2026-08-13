import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './smoothSoftware.css';

const FONT_HREF = 'https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap';

// Same backend endpoint the main site's "Ask AI" discuss form posts to — visitor's
// email + message forwarded straight to Mark's inbox, Reply-To set to the visitor.
// No new backend work needed for Smooth Software; just a differently-skinned form.
const PORTFOLIO_API_BASE = import.meta.env.DEV ? 'http://localhost:5131' : 'https://api.carkus.com';
const PORTFOLIO_DISCUSS_URL = `${PORTFOLIO_API_BASE}/v1/portfolio/discuss`;

function SmoothDiscussForm() {
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
      <button type="button" className="smooth-discuss-toggle" onClick={() => setOpen(true)}>
        Got a project in mind? Send a query →
      </button>
    );
  }

  return (
    <form className="smooth-discuss-form" onSubmit={send}>
      <input
        className="smooth-discuss-input"
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <textarea
        className="smooth-discuss-textarea"
        placeholder="What are you looking to build?"
        value={message}
        maxLength={2000}
        onChange={e => setMessage(e.target.value)}
        required
      />
      <button className="smooth-discuss-submit" type="submit" disabled={loading || !email.trim() || !message.trim()}>
        {loading ? '···' : 'Send →'}
      </button>
      {status === 'sent' && <p className="smooth-discuss-status">Thanks — I'll reply directly to your email shortly.</p>}
      {status === 'error' && <p className="smooth-discuss-status smooth-discuss-status-error">{error}</p>}
    </form>
  );
}

// This page carries its own deliberately distinct brand — the neon "postcard" mockup at
// public/img/65fd5b21-a666-4fb2-8ae4-36071a6d2631.png. Rather than re-drawing the wordmark,
// badge, and icons with fonts/CSS (which never quite matched), the hard-to-reproduce pieces
// are cropped directly out of that source image and used as real <img> assets below — see
// public/img/smooth-*.png. Only the border glow, layout, and live text are CSS. Own font
// stack, loaded on demand here so the main CV page never pays for fonts it doesn't use.
function useSmoothFonts() {
  useEffect(() => {
    if (document.querySelector(`link[href="${FONT_HREF}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = FONT_HREF;
    document.head.appendChild(link);
    return () => { link.remove(); };
  }, []);
}

const FEATURES = [
  { icon: '/img/smooth-icon-question.png', text: "Don't know your Claudes from your codes?" },
  { icon: '/img/smooth-icon-wheel.png', text: 'Need someone to steer the development and design?' },
  { icon: '/img/smooth-icon-check.png', text: 'AI-engineered and human-tested for assurance' },
  { icon: '/img/smooth-icon-dollar.png', text: 'Fixed scope, straight rates — no surprise invoices' },
];

export default function SmoothSoftware() {
  useSmoothFonts();

  useEffect(() => {
    const prev = document.title;
    document.title = 'Smooth Software — Mark Scicluna';
    return () => { document.title = prev; };
  }, []);

  return (
    <div className="smooth-page">
      <Link to="/" className="smooth-back">← Back to carkus.com</Link>
      <div className="smooth-card">
        {/* Decorative flowing neon curves, echoing the source mockup's ribbon
            accents. The real source ribbon lines sit crammed against adjacent
            text/badge art with no clean margin to crop (same issue as the
            badge's stray fragment), so these are redrawn in SVG instead —
            same trick as the card border, which held up well as a recreation. */}
        <svg className="smooth-decor-ribbon smooth-decor-ribbon-tl" viewBox="0 0 200 160" fill="none" aria-hidden="true">
          <path d="M-10,10 C40,0 90,20 110,70 C125,108 100,140 60,150" stroke="#2de0e0" strokeWidth="3" strokeLinecap="round" />
          <path d="M-10,28 C36,18 82,38 100,86 C113,120 90,148 52,158" stroke="#ff4fa8" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <svg className="smooth-decor-ribbon smooth-decor-ribbon-br" viewBox="0 0 200 140" fill="none" aria-hidden="true">
          <path d="M210,20 C160,10 120,30 100,65 C82,96 100,120 150,128" stroke="#ff8a3d" strokeWidth="3" strokeLinecap="round" />
          <path d="M210,38 C156,28 112,48 92,80 C76,108 96,130 145,138" stroke="#ff4fa8" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <div className="smooth-grid">

          <div className="smooth-col smooth-col-left">
            <h1 className="smooth-title">
              <img src="/img/smooth-heading.png" alt="Smooth Software" />
            </h1>

            <div className="smooth-offerings">
              <p className="smooth-offerings-main">Websites. Apps. Back-office tools.</p>
              <p className="smooth-offerings-sub">Fast turnaround, straight rates.</p>
            </div>

            <div className="smooth-features">
              {FEATURES.map(f => (
                <div key={f.text} className="smooth-feature">
                  <img className="smooth-feature-icon" src={f.icon} alt="" />
                  <h3 className="smooth-feature-text">{f.text}</h3>
                </div>
              ))}
            </div>

            <div className="smooth-divider">
              <span className="smooth-spark smooth-spark-left">✦</span>
              <span className="smooth-spark smooth-spark-right">✦</span>
              <div className="smooth-divider-inner">
                <p className="smooth-pitch">
                  We combine AI-accelerated engineering with human expertise<br />
                  to build reliable, high-quality software —<br />
                  <span className="smooth-pitch-fast">fast.</span>
                </p>
                <p className="smooth-pitch-sub">You get senior-level outcomes without the enterprise overhead.</p>
              </div>
            </div>

            <SmoothDiscussForm />

            <div className="smooth-contacts">
              <a href="https://instagram.com/markanthonyscicluna" target="_blank" rel="noopener noreferrer" className="smooth-contact-link">
                <span className="smooth-contact-icon">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="4.5" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                  </svg>
                </span>
                @markanthonyscicluna
              </a>
            </div>
          </div>

          <div className="smooth-col smooth-col-right">
            <div className="smooth-badge-row">
              <p className="smooth-badge-text">Available<br />Now!</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

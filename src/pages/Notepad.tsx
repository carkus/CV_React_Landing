import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDocumentMeta } from '../seo';

const WS_URL = 'wss://api.carkus.com/ws/subscribe';
const INITIAL_BACKOFF_MS = 1000;
const MAX_BACKOFF_MS = 30000;
const MAX_MESSAGES = 200;

type IncomingEnvelope = {
  type: 'message';
  id: string;
  text: string;
  timestamp: number;
};

type Status = 'connecting' | 'open' | 'closed';

export default function Notepad() {
  useDocumentMeta({
    title: 'Notepad — Mark Scicluna',
    description: 'Live notepad utility.',
    path: '/notepad',
    noindex: true,
  });

  const [messages, setMessages] = useState<IncomingEnvelope[]>([]);
  const [status, setStatus] = useState<Status>('connecting');

  useEffect(() => {
    let socket: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let backoffMs = INITIAL_BACKOFF_MS;
    let closedByEffect = false;

    function connect() {
      setStatus('connecting');
      socket = new WebSocket(WS_URL);

      socket.onopen = () => {
        backoffMs = INITIAL_BACKOFF_MS;
        setStatus('open');
      };

      socket.onmessage = event => {
        try {
          const envelope = JSON.parse(event.data) as IncomingEnvelope;
          if (envelope.type !== 'message') return;
          setMessages(prev => [envelope, ...prev].slice(0, MAX_MESSAGES));
        } catch {
          // Ignore frames that aren't valid JSON envelopes.
        }
      };

      socket.onclose = () => {
        setStatus('closed');
        if (closedByEffect) return;
        reconnectTimer = setTimeout(connect, backoffMs);
        backoffMs = Math.min(backoffMs * 2, MAX_BACKOFF_MS);
      };
    }

    connect();

    return () => {
      closedByEffect = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      socket?.close();
    };
  }, []);

  return (
    <div className="pf-page np-page">
      <nav className="pf-nav">
        <Link to="/" className="pf-nav-back">← mscicluna.com</Link>
        <span className="pf-nav-title">Websocket Notepad</span>
      </nav>

      <div className="np-toolbar">
        <span className={`np-status np-status-${status}`}>{status}</span>
        <span className="np-count">{messages.length}</span>
        <button
          type="button"
          className="np-clear"
          disabled={messages.length === 0}
          onClick={() => setMessages([])}
        >
          Clear
        </button>
      </div>

      {messages.length === 0 ? (
        <div className="np-empty">No messages yet.</div>
      ) : (
        <div className="np-rows">
          {messages.map(m => (
            <div key={m.id} className="np-row">
              <span className="np-time">{new Date(m.timestamp).toLocaleString()}</span>
              <span className="np-text">{m.text}</span>
              <button
                type="button"
                className="np-delete"
                aria-label="Delete message"
                onClick={() => setMessages(prev => prev.filter(msg => msg.id !== m.id))}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

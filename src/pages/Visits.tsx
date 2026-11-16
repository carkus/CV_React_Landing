import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDocumentMeta } from '../seo';

const PORTFOLIO_API_BASE = import.meta.env.DEV ? 'http://localhost:5131' : 'https://api.carkus.com';
const VISITS_URL = `${PORTFOLIO_API_BASE}/v1/portfolio/visits`;
// Kept for the browser session only, so the key isn't left on the device.
const KEY_STORAGE = 'carkus_visits_key';

type Visit = { time: string; ip: string; path: string | null; userAgent: string | null; referrer: string | null };
type VisitsResponse = { count: number; retentionDays: number; loggedVisits: number; uniqueIps: number; visits: Visit[] };

function readKey(): string {
  try { return sessionStorage.getItem(KEY_STORAGE) ?? ''; } catch { return ''; }
}
function writeKey(key: string | null) {
  try {
    if (key) sessionStorage.setItem(KEY_STORAGE, key);
    else sessionStorage.removeItem(KEY_STORAGE);
  } catch { /* storage blocked — the key just isn't remembered */ }
}

type FetchResult = { data?: VisitsResponse; error?: string; unauthorized?: boolean };

async function fetchVisits(apiKey: string): Promise<FetchResult> {
  try {
    const res = await fetch(VISITS_URL, { headers: { 'X-Api-Key': apiKey } });
    if (res.status === 401) return { error: 'Wrong key.', unauthorized: true };
    if (res.status === 404) return { error: 'Visit log is not enabled on the server.' };
    if (res.status === 429) return { error: 'Too many requests — wait a minute and retry.' };
    if (!res.ok) return { error: `Request failed (${res.status}).` };
    return { data: await res.json() };
  } catch {
    return { error: 'Could not reach the API.' };
  }
}

// Private page (not linked anywhere, noindex): total visit count plus the
// recent visit log from ChattyPrayers.Api, gated by the Portfolio:VisitsApiKey.
export default function Visits() {
  useDocumentMeta({
    title: 'Visits — Mark Scicluna',
    description: 'Visit log.',
    path: '/visits',
    noindex: true,
  });

  const [key, setKey] = useState(readKey);
  const [draft, setDraft] = useState('');
  const [data, setData] = useState<VisitsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Starts true when a key is already stored, since the effect below loads straight away.
  const [loading, setLoading] = useState(() => !!key);

  const apply = useCallback((r: FetchResult) => {
    if (r.unauthorized) { writeKey(null); setKey(''); }
    if (r.data) setData(r.data);
    setError(r.error ?? null);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!key) return;
    let live = true;
    fetchVisits(key).then(r => { if (live) apply(r); });
    return () => { live = false; };
  }, [key, apply]);

  const refresh = () => { setLoading(true); fetchVisits(key).then(apply); };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const k = draft.trim();
    if (!k) return;
    writeKey(k);
    setLoading(true);
    setKey(k);
    setDraft('');
  };

  const signOut = () => { writeKey(null); setKey(''); setData(null); };

  return (
    <div className="pf-page np-page">
      <nav className="pf-nav" aria-label="Page">
        <Link to="/" className="pf-nav-back">← mscicluna.com</Link>
        <span className="pf-nav-title">Visits</span>
      </nav>

      <main id="main" tabIndex={-1}>

      {!key ? (
        <form className="vs-login" onSubmit={submit}>
          <label htmlFor="vs-key">Access key</label>
          <input id="vs-key" type="password" autoComplete="current-password" value={draft} onChange={e => setDraft(e.target.value)} autoFocus />
          <button type="submit" className="np-clear">Open</button>
          {error && <p className="vs-error">{error}</p>}
        </form>
      ) : (
        <>
          <div className="np-toolbar">
            {data && (
              <>
                <span>Total <span className="vs-stat">{data.count.toLocaleString()}</span></span>
                <span>Last {data.retentionDays} days <span className="vs-stat">{data.loggedVisits.toLocaleString()}</span></span>
                <span>Unique IPs <span className="vs-stat">{data.uniqueIps.toLocaleString()}</span></span>
              </>
            )}
            <span className="vs-actions">
              <button type="button" className="np-clear" disabled={loading} onClick={refresh}>{loading ? 'Loading…' : 'Refresh'}</button>
              <button type="button" className="np-clear" onClick={signOut}>Lock</button>
            </span>
          </div>
          {error && <p className="vs-error vs-error--bar">{error}</p>}

          {data && (data.visits.length === 0 ? (
            <div className="np-empty">No visits logged yet.</div>
          ) : (
            <div className="vs-table-wrap">
              <table className="vs-table">
                <thead>
                  <tr><th>Time</th><th>IP</th><th>Page</th><th>Referrer</th><th>Browser</th></tr>
                </thead>
                <tbody>
                  {data.visits.map((v, i) => (
                    <tr key={`${v.time}-${i}`}>
                      <td className="np-time">{new Date(v.time).toLocaleString()}</td>
                      <td className="vs-ip">{v.ip}</td>
                      <td>{v.path ?? '—'}</td>
                      <td className="vs-wrap">{v.referrer ?? '—'}</td>
                      <td className="vs-wrap vs-ua">{v.userAgent ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </>
      )}
      </main>
    </div>
  );
}

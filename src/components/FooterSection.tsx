import { useEffect, useState } from 'react';

const PORTFOLIO_API_BASE = import.meta.env.DEV ? 'http://localhost:5131' : 'https://api.carkus.com';
const VISIT_URL = `${PORTFOLIO_API_BASE}/v1/portfolio/visit`;
const OWNER_FLAG = 'carkus_owner';

export default function FooterSection() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('owner') === '1') {
      localStorage.setItem(OWNER_FLAG, '1');
    }
    if (localStorage.getItem(OWNER_FLAG) === '1') return;
    if (import.meta.env.DEV) return;

    fetch(VISIT_URL, { method: 'POST' })
      .then(res => (res.ok ? res.json() : null))
      .then(data => data && setCount(data.count))
      .catch(() => {});
  }, []);

  return (
    <footer>
      <div className="footer-inner">
        <p>© 2026 Mark Scicluna · mscicluna.com</p>
        <p>Melbourne, Australia</p>
        {count !== null && <p className="footer-visitors">{count.toLocaleString()} visits</p>}
      </div>
    </footer>
  );
}

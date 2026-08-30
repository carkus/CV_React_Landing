import { useEffect } from 'react';

const SITE_URL = 'https://mscicluna.com';
const DEFAULT_IMAGE = `${SITE_URL}/android-chrome-512x512.png`;

interface DocumentMetaOptions {
  title: string;
  description: string;
  /** Route path, e.g. '/', '/profile' — combined with SITE_URL for canonical/og:url. */
  path: string;
  /** Absolute image URL for OG/Twitter cards; defaults to the site-wide headshot. */
  image?: string;
}

function upsertMeta(attrName: 'name' | 'property', attrValue: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attrName}="${attrValue}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

// index.html ships static title/description/canonical/OG/Twitter tags for the
// homepage (so the very first HTML response is already correct for crawlers
// that don't run JS). This hook overwrites those same tags per-route once the
// app mounts, so /profile and /smooth-software get their own accurate title,
// description, canonical, and social-card content instead of inheriting the
// homepage's — every route calls this, including Home, to keep one code path.
export function useDocumentMeta({ title, description, path, image = DEFAULT_IMAGE }: DocumentMetaOptions) {
  useEffect(() => {
    document.title = title;

    const url = path === '/' ? SITE_URL : `${SITE_URL}${path}`;

    upsertMeta('name', 'description', description);
    upsertLink('canonical', url);

    upsertMeta('property', 'og:type', path === '/' ? 'profile' : 'website');
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', url);
    upsertMeta('property', 'og:image', image);

    upsertMeta('name', 'twitter:card', 'summary');
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', image);
    // Deliberately no cleanup: React Router unmounts the outgoing page before
    // the incoming one's effect runs, so reverting here would only cause a
    // flash back to stale defaults — the next route's call overwrites everything.
  }, [title, description, path, image]);
}

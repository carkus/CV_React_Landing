import { useEffect, useState } from 'react';
import { SOCIALS } from '../data/socials';
import ExploreLink from './ExploreLink';

// Latest Instagram posts, read-only. /data/instagram.json is generated hourly
// on the server by scripts/instagram/instagram_sync.py (see its README) — it
// isn't bundled or in git, since Instagram's image URLs expire within days.
// Until that file exists (or if it fails to load) the section renders nothing.

interface InstagramPost {
  id: string;
  caption: string;
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  imageUrl: string;
  permalink: string;
  timestamp?: string;
}

interface InstagramFeed {
  username?: string;
  posts: InstagramPost[];
}

const PROFILE_URL = SOCIALS.find(s => s.label === 'Instagram')?.url;

export default function InstagramSection() {
  const [feed, setFeed] = useState<InstagramFeed | null>(null);

  useEffect(() => {
    fetch('/data/instagram.json')
      .then(r => (r.ok ? r.json() : null))
      .then((data: InstagramFeed | null) => { if (data?.posts?.length) setFeed(data); })
      // A missing file comes back as the SPA's index.html, which fails to parse — stay hidden.
      .catch(() => {});
  }, []);

  if (!feed) return null;

  return (
    <section id="instagram">
      <div className="section-inner">
        <div className="section-eyebrow reveal">Instagram</div>
        <h2 className="section-heading reveal reveal-delay-1">Latest posts</h2>
        <div className="ig-grid reveal reveal-delay-2">
          {feed.posts.map(p => (
            <a key={p.id} href={p.permalink} target="_blank" rel="noopener noreferrer" className="ig-post">
              <img src={p.imageUrl} alt={p.caption ? p.caption.slice(0, 120) : 'Instagram post'} loading="lazy" referrerPolicy="no-referrer" />
              {p.mediaType !== 'IMAGE' && (
                <span className="ig-post-kind" aria-hidden="true">{p.mediaType === 'VIDEO' ? '▶' : '❐'}</span>
              )}
            </a>
          ))}
        </div>
        {PROFILE_URL && (
          <div className="section-deep-link reveal reveal-delay-3">
            <ExploreLink href={PROFILE_URL} label={`Follow ${feed.username ? `@${feed.username}` : 'on Instagram'}`} />
          </div>
        )}
      </div>
    </section>
  );
}

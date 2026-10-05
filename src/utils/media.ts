// Gallery entries are plain strings in the data — a file name, a path, or a
// URL — and the viewer is picked from what the string looks like, so adding a
// video to a gallery is just adding its file name.
//
//   "zome_phone1.png"            → image, served from /img/
//   "demo.mp4" / "clip.MOV"      → video, served from /files/
//   "/img/x.png", "https://…"    → used as-is, viewer picked by extension
//   YouTube / Vimeo page URLs     → embedded player

export type GalleryMedia =
  | { kind: 'image'; src: string }
  | { kind: 'video'; src: string }
  | { kind: 'embed'; src: string };

const VIDEO_EXT = /\.(mp4|m4v|mov|webm|ogv|ogg)$/i;

/** Folder a bare file name (no slash) is served from, by media kind. */
const BARE_NAME_DIRS = { image: '/img/', video: '/files/' } as const;

function embedUrl(entry: string): string | undefined {
  let url: URL;
  try { url = new URL(entry); } catch { return undefined; }
  const host = url.hostname.replace(/^www\.|^m\./, '');

  if (host === 'youtu.be') return `https://www.youtube.com/embed/${url.pathname.slice(1)}`;
  if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
    const id = url.searchParams.get('v') ?? url.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/)?.[1];
    return id ? `https://www.youtube.com/embed/${id}` : undefined;
  }
  if (host === 'vimeo.com' || host === 'player.vimeo.com') {
    const id = url.pathname.match(/(\d+)/)?.[1];
    return id ? `https://player.vimeo.com/video/${id}` : undefined;
  }
  return undefined;
}

export function resolveMedia(entry: string): GalleryMedia {
  const embed = embedUrl(entry);
  if (embed) return { kind: 'embed', src: embed };

  // Ignore any ?query / #fragment when reading the extension.
  const path = entry.split(/[?#]/)[0];
  const kind = VIDEO_EXT.test(path) ? 'video' : 'image';
  const src = entry.includes('/') ? entry : BARE_NAME_DIRS[kind] + entry;
  return { kind, src };
}

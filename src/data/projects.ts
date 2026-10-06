import { useEffect, useState } from 'react';
import type { Badge, ProjectRef, WorkGroup, WorkItem } from '../types';
import bundledGroups from '../../public/data/workitems.json';

// workitems.json is the one source of project copy. The hero, the Work groups
// and any rail badge of type "project" all read it through here.
//
// Same loading pattern as rails.json (see BadgeRail.tsx): the file is bundled
// at build time for first paint and as the fetch-failure fallback, then
// re-fetched so re-deploying just the JSON updates the live site.
const FALLBACK = bundledGroups as WorkGroup[];

let groupsPromise: Promise<WorkGroup[]> | null = null;
function loadWorkGroups(): Promise<WorkGroup[]> {
  groupsPromise ??= fetch('/data/workitems.json')
    .then(r => (r.ok ? r.json() : []))
    .then(data => (Array.isArray(data) && data.length ? data : FALLBACK))
    .catch(() => FALLBACK);
  return groupsPromise;
}

/** Project groups — bundled copy first, workitems.json once loaded. */
export function useWorkGroups(): WorkGroup[] {
  const [groups, setGroups] = useState<WorkGroup[]>(FALLBACK);
  useEffect(() => {
    let cancelled = false;
    loadWorkGroups().then(g => { if (!cancelled) setGroups(g); });
    return () => { cancelled = true; };
  }, []);
  return groups;
}

/** A project as a rail badge: photo projects become `work` tiles, image-less
 *  ones plain `card`s linking to their first URL. `short` uses the summary. */
export function projectBadge(item: WorkItem, short = false): Badge {
  const text = (short && item.summary) || item.description;
  const openLinks = item.links.filter(l => !!l.url);
  if (!item.imageUrl) {
    return { type: 'card', id: item.id, title: item.title, text, tags: item.tags, href: openLinks.find(l => !l.inactive)?.url };
  }
  return {
    type: 'work',
    id: item.id,
    title: item.title,
    description: text,
    tags: item.tags,
    imageUrl: item.imageUrl,
    imageAlt: item.imageAlt,
    imageFrame: item.imageFrame,
    links: openLinks,
    slideshowImages: item.slideshowImages,
  };
}

/** Swaps each `project` reference for its project's badge, with the ref's own
 *  fields laid over the top. Unknown ids are dropped (and logged). */
export function resolveProjectRefs(badges: (Badge | ProjectRef)[], groups: WorkGroup[]): Badge[] {
  const byId = new Map(groups.flatMap(g => g.items).map(i => [i.id, i]));
  return badges.flatMap((b): Badge[] => {
    if (b.type !== 'project') return [b];
    const item = byId.get(b.ref);
    if (!item) {
      console.warn(`Rail badge references unknown project "${b.ref}"`);
      return [];
    }
    const base = projectBadge(item, true);
    return [{ ...base, ...b, type: base.type } as Badge];
  });
}

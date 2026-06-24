import { useEffect, useState } from 'react';
import type { WorkItem } from '../types';

const FALLBACK: WorkItem[] = [
  { title: 'ZOME — Cross-platform product suite', tags: ['Flutter', 'Swift', 'Kotlin', 'visionOS'], imageUrl: 'https://images.unsplash.com/photo-1759661990336-51bd4b951fea?w=900&q=80', imageAlt: 'ZOME platform', description: 'End-to-end product suite spanning iOS, Android, and Apple Vision Pro — built with Flutter and native platform SDKs.', featured: true, links: [{ label: 'App Store ↗', url: 'https://itunes.apple.com/us/app/zome/id1382123356?ls=1&mt=8' }, { label: 'Play Store ↗', url: 'https://play.google.com/store/apps/details?id=com.zomecorp.zome' }] },
  { title: 'Chatty Prayers', tags: ['Blazor', 'C#', 'AI'], imageUrl: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80', imageAlt: 'Chatty Prayers', description: 'AI-assisted prayer and devotional web app built with Blazor WebAssembly.', featured: false, links: [] },
  { title: 'Spatial UI Components', tags: ['visionOS', 'RealityKit'], imageUrl: 'https://images.unsplash.com/photo-1713445289643-fa1902dd9a03?w=600&q=80', imageAlt: 'visionOS spatial', description: 'A library of reusable spatial UI components for Apple Vision Pro using RealityKit and SwiftUI.', featured: false, links: [] },
  { title: 'PDF Form Builder', tags: ['Blazor', 'PDF Generation', 'AI'], imageUrl: 'https://images.unsplash.com/photo-1602407294553-6ac9170b3ed0?w=600&q=80', imageAlt: 'CV Builder', description: 'A browser-based drag-and-drop editor for building and exporting PDF forms, now featuring AI-powered form generation.', featured: true, links: [{ label: 'Open Editor ↗', url: 'https://editor.carkus.com/form-editor' }] },
  { title: 'Search in Robotic Task Planning', tags: ['Research', 'AI Planning'], imageUrl: 'https://images.unsplash.com/photo-1647427060118-4911c9821b82?w=600&q=80', imageAlt: 'Robotics research', description: 'Academic research into heuristic search algorithms applied to autonomous robotic task planning.', featured: false, links: [] },
];

type RowKind = 'wide-narrow' | 'narrow-wide' | 'three-equal';
interface Row { items: WorkItem[]; kind: RowKind; isFirst: boolean; }

function buildRows(items: WorkItem[]): Row[] {
  const rows: Row[] = [];
  const n = items.length;
  if (n === 0) return rows;

  const endOfPairs = n % 2 === 1 && n >= 3 ? n - 3 : n % 2 === 0 ? n : 0;
  let wideFirst = true;
  let isFirst   = true;

  for (let i = 0; i < endOfPairs; i += 2) {
    rows.push({ items: items.slice(i, i + 2), kind: wideFirst ? 'wide-narrow' : 'narrow-wide', isFirst });
    wideFirst = !wideFirst;
    isFirst   = false;
  }
  if (endOfPairs < n) {
    const rest = items.slice(endOfPairs);
    rows.push({ items: rest, kind: rest.length === 3 ? 'three-equal' : 'wide-narrow', isFirst });
  }
  return rows;
}

function itemClass(row: Row, idx: number): string {
  if (row.kind === 'three-equal') return 'work-item work-item-equal';
  if (row.kind === 'wide-narrow') return idx === 0 ? (row.isFirst ? 'work-item work-item-featured' : 'work-item work-item-wide') : 'work-item work-item-narrow';
  return idx === 0 ? 'work-item work-item-narrow' : 'work-item work-item-wide';
}

function rowClass(kind: RowKind): string {
  if (kind === 'wide-narrow') return 'work-row work-row-wn';
  if (kind === 'narrow-wide') return 'work-row work-row-nw';
  return 'work-row work-row-eq';
}

function WorkItemCard({ item, className }: { item: WorkItem; className: string }) {
  return (
    <div className={className}>
      <img src={item.imageUrl} alt={item.imageAlt} style={item.imagePosition ? { '--img-pos': item.imagePosition } as React.CSSProperties : undefined} />
      <div className="work-item-info">
        <p className="work-item-desc">{item.description}</p>
        <div className="work-item-title">{item.title}</div>
        <div className="work-item-tag">
          {item.tags.map(t => <span key={t} className="skill-box work-tag">{t}</span>)}
        </div>
      </div>
      {item.links.length > 0 && (
        <div className="work-item-links">
          {item.links.map(l => <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className="work-item-link">{l.label}</a>)}
        </div>
      )}
      {item.credit && (
        <a href={item.credit.url} target="_blank" rel="noopener noreferrer" className="work-item-credit">Image © {item.credit.name}</a>
      )}
    </div>
  );
}

export default function WorkSection() {
  const [items, setItems] = useState<WorkItem[]>(FALLBACK);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/carkus/carkus-data/main/workitems.json')
      .then(r => r.json())
      .then((data: WorkItem[]) => { if (data?.length) setItems(data); })
      .catch(() => {});
  }, []);

  const hasDataWidths = items.some(i => i.width !== undefined);

  return (
    <section id="work">
      <div className="section-inner">
        <div className="section-eyebrow reveal">Work</div>
        <h2 className="section-heading reveal reveal-delay-1">Selected projects</h2>
        <p className="section-sub reveal reveal-delay-2">A cross-section of what I've built — spanning spatial computing, mobile, AI, and web.</p>
        <div className="section-stack reveal reveal-delay-3">
          <span className="section-stack-label">This site was built with:</span>
          <span className="skill-box work-tag">React</span>
          <span className="skill-box work-tag">TypeScript</span>
          <span className="skill-box work-tag">Vite</span>
        </div>
        <div className="reveal reveal-delay-3">
          {hasDataWidths ? (
            <div className="work-grid-data">
              {items.map(item => (
                <WorkItemCard key={item.title} item={item} className={`work-item work-item-w${item.width ?? 33}`} />
              ))}
            </div>
          ) : (
            <div className="work-grid">
              {buildRows(items).map((row, ri) => (
                <div key={ri} className={rowClass(row.kind)}>
                  {row.items.map((item, ii) => (
                    <WorkItemCard key={item.title} item={item} className={itemClass(row, ii)} />
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

import type { Achievement } from '../types';

const ACHIEVEMENTS: Achievement[] = [
  {
    icon: '⬢',
    title: 'Mobile Apps, Shipped and Maintained',
    points: [
      'iOS and Android from one codebase, in production for years, not just launched and abandoned',
      'Regular App Store and Google Play releases',
      'Kept multiple apps stable and shipping side by side',
    ],
    tags: ['Swift', 'SwiftUI', 'Flutter', 'Kotlin'],
  },
  {
    icon: '◈',
    title: 'ZOME — Day One on Vision Pro',
    points: [
      'Built the UI and middleware across Flutter and visionOS',
      'One of the apps ready when Apple Vision Pro launched, and again for Samsung Galaxy XR',
      'Supported the phone app and the spatial version at the same time',
    ],
    tags: ['Flutter', 'visionOS', 'Middleware'],
  },
  {
    icon: '⊞',
    title: 'ZOME Atlas — A Geospatial Search Tool That Works',
    points: [
      'Built the map-based search in React, with Vue.js elsewhere on the platform',
      'Treated accessibility as a real requirement, not a checkbox',
      'Google Maps integration people actually rely on to find things',
    ],
    tags: ['React', 'Vue.js', 'Google Maps', 'Accessibility'],
  },
  {
    icon: '⇌',
    title: 'Seven Years, Same Small Team',
    points: [
      'Worked directly with the Managing Director and a handful of engineers, not a big process',
      'Turned rough design intent into working, maintainable software',
      'Adapted through platform changes, tooling changes, and shifting requirements without losing momentum',
    ],
    tags: ['Direct Collaboration', 'Long-term Ownership'],
  },
  {
    icon: '⟲',
    title: 'Fixing Real Performance Problems in visionOS',
    points: [
      'Refactored bulk data handling in SwiftUI when performance actually broke down under real data loads',
      'Worked through 3D interaction and spatial UI problems with no existing playbook to follow',
      'visionOS was brand new — there wasn’t much prior art to lean on',
    ],
    tags: ['visionOS', '3D Interaction', 'Performance'],
  },
  {
    icon: '⚙',
    title: 'Keeping Releases Boring',
    points: [
      'Contributed to CI/CD so releases weren’t a fire drill',
      'Owned the mobile build and release process end to end',
      'Chased down real platform-specific bugs across devices and OS versions',
    ],
    tags: ['CI/CD', 'Release Engineering', 'Stability'],
  },
];

export default function AchievementsSection() {
  return (
    <section id="achievements">
      <div className="section-inner">
        <div className="section-eyebrow reveal">Achievements</div>
        <h2 className="section-heading reveal reveal-delay-1">Real work I'm proud of</h2>
        <div className="info-card-grid reveal reveal-delay-2">
          {ACHIEVEMENTS.map(a => (
            <div key={a.title} className="info-card">
              <div className="info-card-main">
                <div className="info-card-icon">{a.icon}</div>
                <div className="info-card-body">
                  <div className="info-card-title">{a.title}</div>
                  <ul className="info-card-list">
                    {a.points.map(p => <li key={p}>{p}</li>)}
                  </ul>
                </div>
              </div>
              <div className="info-card-tags">
                {a.tags.map(t => <span key={t} className="skill-box etag">{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

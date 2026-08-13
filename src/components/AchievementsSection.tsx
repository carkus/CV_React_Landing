import type { Achievement } from '../types';

const ACHIEVEMENTS: Achievement[] = [
  {
    icon: '⬢',
    title: 'Cross-Platform Mobile Delivery',
    points: [
      'iOS & Android, shared codebase',
      'Regular App Store / Google Play releases',
      'Multiple production apps maintained',
    ],
    tags: ['Swift', 'SwiftUI', 'Flutter', 'Kotlin'],
  },
  {
    icon: '◈',
    title: 'ZOME Platform — UI & Middleware',
    points: [
      'Flutter + visionOS UI development',
      'Cross-platform middleware contributions',
      'Spatial & mobile app support',
    ],
    tags: ['Flutter', 'visionOS', 'Middleware'],
  },
  {
    icon: '⊞',
    title: 'Geospatial Web — ZOME Atlas',
    points: [
      'Responsive interfaces in React & Vue.js',
      'ZOME Atlas geospatial search app',
      'Google Maps integration, accessibility-first',
    ],
    tags: ['React', 'Vue.js', 'Google Maps', 'Accessibility'],
  },
  {
    icon: '⇌',
    title: 'Cross-Functional Collaboration',
    points: [
      'Worked closely with UI/UX, backend, product',
      'Wireframes → interactive interfaces',
      'Cross-browser compatibility',
    ],
    tags: ['UI/UX', 'Cross-browser'],
  },
  {
    icon: '⟲',
    title: 'Spatial Performance & Scale',
    points: [
      'visionOS interfaces, 3D interaction workflows',
      'SwiftUI bulk-data refactor for visionOS',
      'Performance & scalability under heavier loads',
    ],
    tags: ['visionOS', '3D Interaction', 'Performance', 'Scalability'],
  },
  {
    icon: '⚙',
    title: 'Release Engineering & Stability',
    points: [
      'CI/CD pipeline contributions',
      'Mobile build & release management',
      'Cross-device/platform stability fixes',
    ],
    tags: ['CI/CD', 'Release Engineering', 'Stability'],
  },
];

export default function AchievementsSection() {
  return (
    <section id="achievements">
      <div className="section-inner">
        <div className="section-eyebrow reveal">Achievements</div>
        <h2 className="section-heading reveal reveal-delay-1">Shipping, at scale</h2>
        <div className="achievements-grid reveal reveal-delay-2">
          {ACHIEVEMENTS.map(a => (
            <div key={a.title} className="achievement-card">
              <div className="achievement-main">
                <div className="achievement-icon">{a.icon}</div>
                <div className="achievement-body">
                  <div className="achievement-title">{a.title}</div>
                  <ul className="achievement-list">
                    {a.points.map(p => <li key={p}>{p}</li>)}
                  </ul>
                </div>
              </div>
              <div className="achievement-tags">
                {a.tags.map(t => <span key={t} className="skill-box etag">{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

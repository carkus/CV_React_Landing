import type { Achievement } from '../types';

const ACHIEVEMENTS: Achievement[] = [
  {
    icon: '⬢',
    title: 'Cross-Platform Mobile Delivery',
    points: ['Developed and maintained cross-platform mobile applications across iOS and Android, delivering features across multiple production apps with regular releases to the App Store and Google Play'],
    tags: ['Swift', 'SwiftUI', 'Flutter', 'Kotlin'],
  },
  {
    icon: '◈',
    title: 'ZOME Platform — UI & Middleware',
    points: ['Built UI and contributed to middleware for the ZOME platform across Flutter and visionOS, supporting both cross-platform mobile and spatial application experiences'],
    tags: ['Flutter', 'visionOS', 'Middleware'],
  },
  {
    icon: '⊞',
    title: 'Geospatial Web — ZOME Atlas',
    points: ['Designed and developed responsive, accessible web interfaces using React and Vue.js, including ZOME Atlas, a geospatial search application built with React and Google Maps integration'],
    tags: ['React', 'Vue.js', 'Google Maps', 'Accessibility'],
  },
  {
    icon: '⇌',
    title: 'Cross-Functional Collaboration',
    points: ['Collaborated closely with UI/UX designers, backend engineers, and product managers to translate wireframes and visual designs into interactive, cross-browser-compatible interfaces'],
    tags: ['UI/UX', 'Cross-browser'],
  },
  {
    icon: '⟲',
    title: 'Spatial Performance & Scale',
    points: ['Worked on spatial and immersive applications, including visionOS interfaces and 3D interaction workflows, and refactored bulk data handling in SwiftUI for visionOS to improve performance and scalability under heavier data loads'],
    tags: ['visionOS', '3D Interaction', 'Performance', 'Scalability'],
  },
  {
    icon: '⚙',
    title: 'Release Engineering & Stability',
    points: [
      'Contributed to CI/CD pipelines and mobile release processes to support reliable builds and deployments',
      'Resolved platform-specific issues across devices, frameworks, and operating systems to improve stability and performance',
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

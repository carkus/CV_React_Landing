export default function AboutSection() {
  return (
    <section id="about">
      <div className="section-inner">
        <div className="about-grid">
          <div className="about-image-stack reveal">
            <img className="about-img-main"
              src="https://images.unsplash.com/photo-1754548930550-be9fa88874f4?w=700&q=80"
              alt="Engineering workspace" />
            <div className="about-img-label">Melbourne, AU</div>
            <img className="about-img-accent"
              src="https://images.unsplash.com/photo-1687603921109-46401b201195?w=400&q=80"
              alt="Detail shot" />
          </div>
          <div>
            <div className="section-eyebrow reveal">About</div>
            <h2 className="section-heading reveal reveal-delay-1">
              Engineer by craft,<br /><em>builder by instinct</em>
            </h2>
            <div className="about-text reveal reveal-delay-2">
              <p>Over a decade shipping cross-platform software — Swift/SwiftUI, React/React Native, .NET — and now into AI development and integration via the Claude and Gemini APIs. Our skills gained through hard work now inform us in how and what we build.</p>
              <p>For 8 years I was a core engineer on ZOME at Rhizomenet — spanning native iOS, Android, Flutter, and visionOS. React has remained my consistent web toolkit.</p>
              <p>Recent tools I've built use AI for catering content to users' preferences, document analysis, and forms generation.</p>
              <p>I hold an MSc in Computer Science (Distinction) from RMIT, with my main research in robotics task-planning and search efficiency. I'm drawn most recently to AI-augmented interfaces and spatial computing experiences.</p>
            </div>
            <div className="about-stats reveal reveal-delay-3">
              <div className="stat-item"><div className="stat-number">10+</div><div className="stat-label">Years experience</div></div>
              <div className="stat-item"><div className="stat-number">5</div><div className="stat-label">Core platforms</div></div>
              <div className="stat-item"><div className="stat-number">MSc</div><div className="stat-label">Computer Science</div></div>
              <div className="stat-item"><div className="stat-number">8yr</div><div className="stat-label">At Rhizomenet</div></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
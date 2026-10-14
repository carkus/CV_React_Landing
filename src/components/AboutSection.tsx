import { useEffect, useState } from 'react';

// The main About image cross-fades through these (Unsplash photo ids — free
// to use and hotlink, no attribution needed). The first is what shows before
// the timer starts, and the only one shown with reduced motion.
const ABOUT_SLIDES = [
  { id: '1550751827-4bd374c3f58b', alt: 'Illuminated AI circuit die' },
  { id: '1555066931-4365d14bab8c', alt: 'Code in an editor on a laptop screen' },
  { id: '1558494949-ef010cbdcc31', alt: 'Cabled server racks' },
  { id: '1526374965328-7f61d4dc18c5', alt: 'Falling green characters on black' },
  { id: '1451187580459-43490279c0fa', alt: 'City lights across the Earth at night' },
  { id: '1677442136019-21780ecad995', alt: 'Abstract AI render' },
];
// The smaller accent image has its own set (so the two never match) and
// moves at half the main panel's pace.
const ACCENT_SLIDES = [
  { id: '1518770660439-4636190af475', alt: 'Circuit board macro detail' },
  { id: '1488590528505-98d2b5aba04b', alt: 'Code on a laptop screen' },
  { id: '1485827404703-89b55fcc595e', alt: 'Humanoid robot' },
  { id: '1504639725590-34d0984388bd', alt: 'Glasses in front of code on monitors' }
];
const SLIDE_DWELL_MS = 6000; // the fade itself is in index.css (.about-slide)
const unsplash = (id: string, w: number, h: number) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&q=80`;

export default function AboutSection() {
  // One clock for both: the main panel steps every tick, the accent every
  // second tick.
  const [tick, setTick] = useState(0);
  const slideIdx = tick % ABOUT_SLIDES.length;
  const accentIdx = Math.floor(tick / 2) % ACCENT_SLIDES.length;

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setTick(n => n + 1), SLIDE_DWELL_MS);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="about">
      <div className="section-inner">
        <div className="about-grid">
          <div className="about-image-stack reveal">
            <div className="about-img-main">
              {ABOUT_SLIDES.map((slide, i) => (
                <img key={slide.id}
                  className={`about-slide${i === slideIdx ? ' active' : ''}`}
                  src={unsplash(slide.id, 900, 1300)}
                  alt={i === slideIdx ? slide.alt : ''}
                  aria-hidden={i !== slideIdx} />
              ))}
            </div>
            <div className="about-img-label">Melbourne, AU</div>
            <div className="about-img-accent">
              {ACCENT_SLIDES.map((slide, i) => (
                <img key={slide.id}
                  className={`about-slide${i === accentIdx ? ' active' : ''}`}
                  src={unsplash(slide.id, 700, 560)}
                  alt={i === accentIdx ? slide.alt : ''}
                  aria-hidden={i !== accentIdx} />
              ))}
            </div>
          </div>
          <div>
            <div className="section-eyebrow reveal">About</div>
            <h2 className="section-heading reveal reveal-delay-1">
              Mobile, Web, AI<br /><em>One Engineer</em>
            </h2>
            <div className="about-text reveal reveal-delay-2">
              <p>Over 10 years experience in cross-platform mobile software in Swift/SwiftUI, Flutter, and React Native, alongside web development in React and Blazor/.NET. More recently, I've moved into AI development and integration, building on those platforms with the Claude and Gemini APIs.</p>
              <p>For 8 years I was a core engineer on ZOME at Rhizomenet — spanning native iOS, Android, cross-platform (Flutter), and visionOS. React has remained my consistent web toolkit.</p>
              <p>Building on my Master's research in automation, I've continued exploring the progress of AI and its emerging applications, implications, and opportunities. Recent tools I've built use AI for tailoring content to user preferences, document analysis, and forms generation, following best practices in prompt engineering, structured outputs, and agentic workflow design. </p>
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
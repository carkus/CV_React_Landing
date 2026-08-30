import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export default function Profile() {
  const [theoExpanded, setTheoExpanded] = useState(false);

  useDocumentMeta({
    title: 'Profile, References & Media — Mark Scicluna',
    description: 'Reference letters, press coverage, and video from Mark Scicluna’s career as a software engineer — cross-platform mobile, web, spatial computing, and AI systems work.',
    path: '/profile',
  });

  // The browser's native hash-scroll-on-load fires before this client-rendered
  // page has mounted its content, so a link like /profile#references lands at
  // the top instead of the target section. Scroll to it manually once mounted.
  useEffect(() => {
    if (!window.location.hash) return;
    const el = document.querySelector(window.location.hash);
    el?.scrollIntoView();
  }, []);

  return (
    <div className="pf-page">

      <nav className="pf-nav">
        <Link to="/" className="pf-nav-back">← {window.location.host}</Link>
        <span className="pf-nav-title">Profile &amp; References</span>
        <ThemeToggle />
      </nav>

      <header className="pf-header">
        <div className="pf-header-inner">
          <div className="pf-eyebrow">Mark Scicluna</div>
          <h1 className="pf-heading">Profile, References<br />&amp; Press</h1>
          <p className="pf-sub">Senior Software Engineer &nbsp;·&nbsp; Melbourne, AU &nbsp;·&nbsp; 10+ years shipping cross-platform software</p>
        </div>
      </header>

      <section className="pf-section">
        <div className="pf-section-inner">
          <div className="pf-section-label">About</div>
          <div className="pf-about-grid">
            <div className="pf-about-text">
              <p>Over a decade of shipping cross-platform software — my core focus is now in AI-assisted development and integration across Swift/SwiftUI, cross-platform mobile, .NET, and Kotlin, via the Claude and Gemini APIs — wiring intelligent behaviour into production mobile and web apps.</p>
              <p>For 8 years I was a core engineer on ZOME at Rhizomenet — spanning cross-platform, iOS, Android, and visionOS. Away from that, I've built web-based tools that use AI for catering content to users' preferences, document analysis, and forms generation.</p>
              <p>I hold an MSc in Computer Science (Distinction) from RMIT, with my main research in robotics task-planning and search efficiency. I'm drawn most recently to AI-augmented interfaces and spatial computing experiences.</p>
            </div>
            <div className="pf-stats">
              <div className="pf-stat"><div className="pf-stat-number">10+</div><div className="pf-stat-label">Years experience</div></div>
              <div className="pf-stat"><div className="pf-stat-number">5</div><div className="pf-stat-label">Core platforms</div></div>
              <div className="pf-stat"><div className="pf-stat-number">MSc</div><div className="pf-stat-label">Computer Science</div></div>
              <div className="pf-stat"><div className="pf-stat-number">8yr</div><div className="pf-stat-label">At Rhizomenet</div></div>
            </div>
          </div>
        </div>
      </section>

      <section id="references" className="pf-section pf-section--alt">
        <div className="pf-section-inner">
          <div className="pf-section-label">References</div>
          <div className="pf-refs">

            <div className="pf-ref">
              <div className={`pf-ref-body${theoExpanded ? '' : ' pf-ref-collapsed'}`}>
                <p>To Whom It May Concern,</p>
                <p>I am pleased to provide this reference for Mark Scicluna who has worked at Rhizomenet Pty. Ltd. for the past seven years as a Senior Software Developer (UI and middleware). I am the Managing Director of the company, and I worked closely with Mark throughout his engagement over the course of seven years. Mark consistently delivered high quality work, typically in small teams, on site or abroad, while maintaining strong momentum and reliability.</p>
                <p>With Mark's contribution, we successfully shipped ZOME across iOS, Android, VisionOS (Apple Vision Pro), and Android XR. We were a day-one launch partner for Apple Vision Pro, and achieved day-one availability on Samsung Galaxy XR. Mark played a meaningful role in helping us meet the engineering demands of these launches across multiple ecosystems, under tight deadlines and pressure, while ensuring quality, consistency, and reliable delivery.</p>
                <p>Mark has been particularly strong at taking product design intent and translating it into robust, maintainable implementation. He adapted designs and user flows across multiple generations of the product and helped ensure consistency and performance across four platforms while handling the practical realities of platform differences, software development tool changes and evolving requirements.</p>
                <p>On a personal level, Mark is approachable, thoughtful, and easy to work with. He communicates clearly and can explain technical ideas in plain English, which is invaluable when aligning with non-technical shareholders and our clients.</p>
                <p>I can confidently endorse Mark's capabilities and character. I would happily work with Mark again, and I strongly recommend him for senior development roles. He would be an asset to any team looking for someone who can execute reliably, adapt across platforms, and contribute positively to team culture.</p>
                <p>If you would like any additional information, please feel free to contact me directly via my email and phone number below.</p>
                <p className="pf-ref-sign">With my kind regards,<br />Theodore Wohng</p>
              </div>
              <button className="pf-ref-toggle" onClick={() => setTheoExpanded(e => !e)}>
                {theoExpanded ? 'Show less ↑' : 'Read full reference ↓'}
              </button>
              <div className="pf-ref-meta">
                <strong>Theodore Wohng</strong>
                <span>Managing Director — Rhizomenet Pty. Ltd.</span>
                <div className="pf-ref-contacts">
                  <a href="tel:+61432655110">+61 (0)432 655 110</a>
                  <a href="mailto:theodorewohng@gmail.com">theodorewohng@gmail.com</a>
                  <a href="mailto:zome@zome.app">zome@zome.app</a>
                </div>
              </div>
            </div>

            <div className="pf-ref">
              <div className="pf-ref-body">
                <p>I have worked alongside Mark for 7 years. During this time I have witnessed him negotiate highly complex creative problems and translate them into eloquent software outcomes in the mobile and AR space. I have participated with Mark in multiple meetings and he always brings a lateral, professional and passionate perspective to problem solving and making complex ideas deliverable.</p>
              </div>
              <div className="pf-ref-meta">
                <strong>Lou Weis</strong>
                <span>Creative Director — Broached Commissions</span>
                <div className="pf-ref-contacts">
                  <a href="tel:+61406500031">+61 (0)406 500 031</a>
                  <a href="mailto:lou@broachedcommissions.com">lou@broachedcommissions.com</a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="pf-section">
        <div className="pf-section-inner">
          <div className="pf-section-label">Press &amp; Media</div>

          <div className="pf-store-badges">
            <a href="https://itunes.apple.com/us/app/zome/id1382123356?ls=1&mt=8" target="_blank" rel="noopener noreferrer">
              <img src="https://developer.apple.com/app-store/marketing/guidelines/images/badge-download-on-the-app-store.svg" alt="Download on the App Store" className="pf-store-badge" />
            </a>
            <a href="https://play.google.com/store/apps/details?id=com.zomecorp.zome" target="_blank" rel="noopener noreferrer">
              <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Get it on Google Play" className="pf-store-badge pf-store-badge--play" />
            </a>
          </div>

          <div className="pf-videos">
            <div className="pf-video-item">
              <div className="pf-video-label">ZOME × Hussein Chalayan — Spatial Wearable Interface</div>
              <div className="pf-video-embed">
                <iframe src="https://www.youtube.com/embed/foyUkCuoIAg" title="ZOME x Chalayan" allowFullScreen loading="lazy" />
              </div>
            </div>
            <div className="pf-video-item">
              <div className="pf-video-label">ZOME — New Spatial Wearable Interface</div>
              <div className="pf-video-embed">
                <iframe src="https://www.youtube.com/embed/cG7LTHyOaSM" title="ZOME — New Spatial Wearable Interface" allowFullScreen loading="lazy" />
              </div>
            </div>
            <div className="pf-video-item pf-video-item--wide">
              <div className="pf-video-label">ZOME — visionOS UI</div>
              <div className="pf-video-embed">
                <video controls preload="metadata">
                  <source src="/files/zome_visionos_wearable_ui.MOV#t=0.001" type="video/mp4" />
                </video>
              </div>
            </div>
          </div>

          <div className="pf-press">
            <div>
              <div className="pf-press-group-title">Spatial Wearable Interface</div>
              <a className="pf-press-link" href="https://www.fashiondive.com/press-release/20250701-zome-and-hussein-chalayan-launch-the-worlds-first-fully-functional-spatial-1/" target="_blank" rel="noopener noreferrer">World's First Spatial Wearable Interface — Fashion Dive</a>
              <a className="pf-press-link" href="https://www.cbs42.com/business/press-releases/ein-presswire/827212174/zome-and-hussein-chalayan-launch-the-worlds-first-fully-functional-spatial-wearable-interface/" target="_blank" rel="noopener noreferrer">World's First Spatial Wearable Interface — CBS</a>
              <a className="pf-press-link" href="https://ww.fashionnetwork.com/news/Zome-launches-hussein-chalayan-designed-spatial-wearable-interface-for-apple-vision-pro,1831280.html" target="_blank" rel="noopener noreferrer">Spatial Wearable Interface Launch — Fashion Network</a>
              <a className="pf-press-link" href="https://www.abc4.com/business/press-releases/ein-presswire/869748360/zome-brings-spatial-messaging-to-the-body-and-expands-the-worlds-first-spatial-wearable-interface/" target="_blank" rel="noopener noreferrer">Spatial Wearable Interface Expansion — ABC4</a>
            </div>
            <div>
              <div className="pf-press-group-title">Hussein Chalayan &amp; Android XR</div>
              <a className="pf-press-link" href="https://ww.fashionnetwork.com/news/Hussein-chalayan-is-creative-director-of-new-ar-social-platform-zome,1699684.html" target="_blank" rel="noopener noreferrer">Hussein Chalayan as Creative Director — Fashion Network</a>
              <a className="pf-press-link" href="https://www.abc4.com/business/press-releases/ein-presswire/858559260/zome-launches-android-xr-app-becoming-the-first-spatial-messenger-across-ios-android-apple-vision-pro-and-android-xr/" target="_blank" rel="noopener noreferrer">Android XR Launch — ABC4</a>
              <a className="pf-press-link" href="https://www.technologynewsuk.com/article/899074900-zome-launches-new-chat-feature-bringing-live-conversation-into-its-spatial-messaging-platform" target="_blank" rel="noopener noreferrer">New Chat Feature — Technology News UK</a>
            </div>
          </div>
        </div>
      </section>

      <div className="pf-footer">
        <Link to="/" className="pf-footer-back">← Back to mscicluna.com</Link>
      </div>

    </div>
  );
}

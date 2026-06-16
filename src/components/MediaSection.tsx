export default function MediaSection() {
  return (
    <section id="media">
      <div className="section-inner">
        <div className="section-eyebrow reveal">Media</div>
        <h2 className="section-heading reveal reveal-delay-1">Press &amp; Media</h2>
        <p className="section-sub reveal reveal-delay-2">ZOME in the wild — spatial computing on the world stage.</p>

        <div className="media-store-badges reveal reveal-delay-3">
          <a href="https://itunes.apple.com/us/app/zome/id1382123356?ls=1&mt=8" target="_blank" rel="noopener noreferrer">
            <img src="https://developer.apple.com/app-store/marketing/guidelines/images/badge-download-on-the-app-store.svg" alt="Download on the App Store" className="store-badge" />
          </a>
          <a href="https://play.google.com/store/apps/details?id=com.zomecorp.zome" target="_blank" rel="noopener noreferrer">
            <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Get it on Google Play" className="store-badge store-badge--play" />
          </a>
        </div>

        <div className="media-videos-grid reveal reveal-delay-3">
          <div className="media-video-item">
            <div className="media-video-label">ZOME × Hussein Chalayan — Spatial Wearable Interface</div>
            <div className="media-video-embed">
              <iframe src="https://www.youtube.com/embed/foyUkCuoIAg" title="ZOME x Chalayan — Spatial Wearable Interface" allowFullScreen loading="lazy" />
            </div>
          </div>
          <div className="media-video-item">
            <div className="media-video-label">ZOME — New Spatial Wearable Interface</div>
            <div className="media-video-embed">
              <iframe src="https://www.youtube.com/embed/cG7LTHyOaSM" title="ZOME — New Spatial Wearable Interface" allowFullScreen loading="lazy" />
            </div>
          </div>
        </div>

        <div className="media-press reveal">
          <div>
            <div className="media-press-group-title">Spatial Wearable Interface</div>
            <a className="media-press-link" href="https://www.fashiondive.com/press-release/20250701-zome-and-hussein-chalayan-launch-the-worlds-first-fully-functional-spatial-1/" target="_blank" rel="noopener noreferrer">World's First Spatial Wearable Interface — Fashion Dive</a>
            <a className="media-press-link" href="https://www.cbs42.com/business/press-releases/ein-presswire/827212174/zome-and-hussein-chalayan-launch-the-worlds-first-fully-functional-spatial-wearable-interface/" target="_blank" rel="noopener noreferrer">World's First Spatial Wearable Interface — CBS</a>
            <a className="media-press-link" href="https://www.abc4.com/business/press-releases/ein-presswire/869748360/zome-brings-spatial-messaging-to-the-body-and-expands-the-worlds-first-spatial-wearable-interface/" target="_blank" rel="noopener noreferrer">Spatial Wearable Interface Expansion — ABC4</a>
          </div>
          <div>
            <div className="media-press-group-title">Hussein Chalayan &amp; Android XR</div>
            <a className="media-press-link" href="https://www.fashionnetwork.com/news/Hussein-chalayan-is-creative-director-of-new-ar-social-platform-zome,1699684.html" target="_blank" rel="noopener noreferrer">Hussein Chalayan as Creative Director — Fashion Network</a>
            <a className="media-press-link" href="https://www.abc4.com/business/press-releases/ein-presswire/858559260/zome-launches-android-xr-app-becoming-the-first-spatial-messenger-across-ios-android-apple-vision-pro-and-android-xr/" target="_blank" rel="noopener noreferrer">Android XR Launch — ABC4</a>
          </div>
        </div>
      </div>
    </section>
  );
}

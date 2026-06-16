import { useState } from 'react';

export default function ReferencesSection() {
  const [theoExpanded, setTheoExpanded] = useState(false);

  return (
    <section id="references">
      <div className="section-inner">
        <div className="section-eyebrow reveal">References</div>
        <h2 className="section-heading reveal reveal-delay-1">What collaborators say</h2>
        <p className="section-sub reveal reveal-delay-2">First-hand accounts from the people I've built with.</p>
        <div className="testimonials-grid reveal reveal-delay-3">

          <div className="testimonial-card">
            <div className="testimonial-quote">&ldquo;</div>
            <div className={`testimonial-body${theoExpanded ? '' : ' testimonial-collapsed'}`}>
              <p>I am pleased to provide this reference for Mark Scicluna who has worked at Rhizomenet Pty. Ltd. for the past seven years as a Senior Software Developer (UI and middleware). I am the Managing Director of the company, and I worked closely with Mark throughout his engagement over the course of seven years. Mark consistently delivered high quality work, typically in small teams, on site or abroad, while maintaining strong momentum and reliability.</p>
              <p>With Mark's contribution, we successfully shipped ZOME across iOS, Android, VisionOS (Apple Vision Pro), and Android XR. We were a day-one launch partner for Apple Vision Pro, and achieved day-one availability on Samsung Galaxy XR. Mark played a meaningful role in helping us meet the engineering demands of these launches across multiple ecosystems, under tight deadlines and pressure, while ensuring quality, consistency, and reliable delivery.</p>
              <p>Mark has been particularly strong at taking product design intent and translating it into robust, maintainable implementation. He adapted designs and user flows across multiple generations of the product and helped ensure consistency and performance across four platforms while handling the practical realities of platform differences, software development tool changes and evolving requirements.</p>
              <p>On a personal level, Mark is approachable, thoughtful, and easy to work with. He communicates clearly and can explain technical ideas in plain English, which is invaluable when aligning with non-technical shareholders and our clients.</p>
              <p>I can confidently endorse Mark's capabilities and character. I would happily work with Mark again, and I strongly recommend him for senior development roles. He would be an asset to any team looking for someone who can execute reliably, adapt across platforms, and contribute positively to team culture.</p>
            </div>
            <button className="testimonial-toggle" onClick={() => setTheoExpanded(e => !e)}>
              {theoExpanded ? 'Show less ↑' : 'Read full reference ↓'}
            </button>
            <div className="testimonial-meta">
              <strong className="testimonial-name">Theodore Wohng</strong>
              <span className="testimonial-role">Managing Director — Rhizomenet Pty. Ltd.</span>
              <div className="testimonial-contact">
                <a href="tel:+61432655110">+61 (0)432 655 110</a>
                <a href="mailto:theodorewohng@gmail.com">theodorewohng@gmail.com</a>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-quote">&ldquo;</div>
            <div className="testimonial-body">
              <p>I have worked alongside Mark for 7 years. During this time I have witnessed him negotiate highly complex creative problems and translate them into eloquent software outcomes in the mobile and AR space. I have participated with Mark in multiple meetings and he always brings a lateral, professional and passionate perspective to problem solving and making complex ideas deliverable.</p>
            </div>
            <div className="testimonial-meta">
              <strong className="testimonial-name">Lou Weis</strong>
              <span className="testimonial-role">Creative Director — Broached Commissions</span>
              <div className="testimonial-contact">
                <a href="tel:+61406500031">+61 (0)406 500 031</a>
                <a href="mailto:lou@broachedcommissions.com">lou@broachedcommissions.com</a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

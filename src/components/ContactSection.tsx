export default function ContactSection() {
  return (
    <section id="contact">
      <div className="contact-inner">
        <div className="section-eyebrow" style={{ justifyContent: 'center' }}>Contact</div>
        <h2 className="contact-heading">Let's build<br /><em>something together</em></h2>
        <p className="contact-sub">Open to mobile, web, and spatial computing roles.<br />Available for contract and full-time.<br />Based in Melbourne, open to remote.</p>
        <a href="mailto:dicarkus@hotmail.com" className="contact-email">Email me (dicarkus@hotmail.com)</a>
        <div className="social-links">
          <a href="https://github.com/carkus" target="_blank" rel="noopener noreferrer" className="social-link">GitHub ↗</a>
          <a href="https://www.linkedin.com/in/mark-scicluna-b907809/" target="_blank" rel="noopener noreferrer" className="social-link">LinkedIn ↗</a>
          <a href="/app/" target="_blank" rel="noopener noreferrer" className="social-link">CV Site ↗</a>
        </div>
      </div>
    </section>
  );
}

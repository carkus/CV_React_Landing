import { SOCIALS } from '../data/socials';

export default function SocialLinks() {
  return (
    <>
      {SOCIALS.map(s => (
        <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" className="social-link">{s.label} ↗</a>
      ))}
    </>
  );
}

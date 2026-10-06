import { SOCIALS } from '../data/socials';

// arrow={false} drops the trailing ↗ (the hero shows the links bare).
export default function SocialLinks({ arrow = true }: { arrow?: boolean }) {
  return (
    <>
      {SOCIALS.map(s => (
        <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" className="social-link">{s.label}{arrow && ' ↗'}</a>
      ))}
    </>
  );
}

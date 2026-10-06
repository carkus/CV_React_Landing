// Social profiles shown in the hero and contact sections. Add a platform here
// and it appears in both. Also mirror the URL in index.html's JSON-LD
// "sameAs" list so search engines link the profile to this site.
export interface Social { label: string; url: string; }

export const SOCIALS: Social[] = [
  { label: 'GitHub', url: 'https://github.com/carkus' },
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/mark-scicluna-b907809/' },
  { label: 'Instagram', url: 'https://www.instagram.com/markanthonyscicluna/' },
];

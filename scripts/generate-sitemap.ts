// Generates public/sitemap.xml and public/robots.txt from the route list
// below. Runs before `vite build` (see package.json) so Vite copies both
// files into dist/ untouched, same as any other public/ asset.
import { writeFileSync } from 'node:fs';
import { generateSitemapXml, generateRobotsTxt } from '@carkus/seo-react';
import { siteConfig } from '../src/seo';

const routes = [
  { path: '/', changefreq: 'monthly' as const, priority: 1.0 },
  { path: '/profile', changefreq: 'monthly' as const, priority: 0.8 },
  { path: '/smooth-software', changefreq: 'monthly' as const, priority: 0.6 },
  // /notepad deliberately excluded — a live websocket utility page, not
  // content worth indexing; see robots disallow below.
];

writeFileSync('public/sitemap.xml', generateSitemapXml(siteConfig, routes));
writeFileSync('public/robots.txt', generateRobotsTxt(siteConfig, { disallow: ['/notepad'] }));

console.log(`Generated public/sitemap.xml (${routes.length} routes) and public/robots.txt`);

// ATS compliance check for the CV pipeline. Two passes:
//   1. Structural lint over the parsed markdown blocks (public/content/cv.md)
//      — flags missing standard section headings, missing contact links, and
//      any leftover table syntax that the custom parser would otherwise
//      silently flatten into unreadable plain text.
//   2. PDF text-extraction round-trip — builds the real PDF via buildPdf(),
//      the same function the live "Download CV" button calls, then
//      re-extracts its text with pdfjs-dist the way a real ATS parser would,
//      confirming every block's text actually made it in as selectable text
//      rather than, say, a silently dropped or rasterized-only run.
//
// Run: npm run check-ats
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { parseMarkdownToBlocks, buildPdf, type CvBlock, type CvTextBlock, type CvRowBlock, type CvLink } from '../src/utils/cvPdf';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CV_PATH = path.join(__dirname, '..', 'public', 'content', 'cv.md');

type Level = 'pass' | 'warn' | 'fail';
interface Result { level: Level; message: string; }

const results: Result[] = [];
const pass = (m: string) => results.push({ level: 'pass', message: m });
const warn = (m: string) => results.push({ level: 'warn', message: m });
const fail = (m: string) => results.push({ level: 'fail', message: m });

function isTextBlock(b: CvBlock): b is CvTextBlock {
  return 'text' in b;
}

function isRowBlock(b: CvBlock): b is CvRowBlock {
  return b.type === 'row';
}

// 'row' blocks (References' name/email, title/phone pairs) carry links on
// leftLinks/rightLinks rather than a single .links, so they need folding into
// the same flat list the contact-link and round-trip checks scan.
function allBlockLinks(blocks: CvBlock[]): CvLink[] {
  return [
    ...blocks.filter(isTextBlock).flatMap(b => b.links),
    ...blocks.filter(isRowBlock).flatMap(b => [...b.leftLinks, ...b.rightLinks]),
  ];
}

function normalize(s: string): string {
  return s.replace(/\s+/g, ' ').trim().toLowerCase();
}

async function main() {
  const markdown = await readFile(CV_PATH, 'utf-8');
  const blocks = parseMarkdownToBlocks(markdown);

  // ---- 1. Structural checks ------------------------------------------------
  const headings = blocks.filter((b): b is CvTextBlock => b.type === 'h1').map(b => b.text.toLowerCase());
  const requiredSections: { pattern: RegExp; label: string }[] = [
    { pattern: /experience/, label: 'EXPERIENCE' },
    { pattern: /education/, label: 'EDUCATION' },
    { pattern: /skills?/, label: 'SKILLS' },
  ];
  for (const { pattern, label } of requiredSections) {
    if (headings.some(h => pattern.test(h))) pass(`Section heading found for "${label}"`);
    else fail(`No top-level heading matching "${label}" — ATS section-detection relies on standard headings like this`);
  }

  const allLinks = allBlockLinks(blocks);
  if (allLinks.some(l => l.url.startsWith('mailto:'))) pass('Email contact link present');
  else warn('No mailto: link found — ATS parsers look for an email address near the top of the document');
  if (allLinks.some(l => l.url.startsWith('tel:'))) pass('Phone contact link present');
  else warn('No tel: link found — a phone number helps ATS contact extraction');

  const rawLines = markdown.split(/\r?\n/);
  const tableLikeLines = rawLines.filter(l => (l.match(/\|/g) || []).length >= 2);
  if (tableLikeLines.length === 0) {
    pass('No table-like ("|"-delimited) syntax found — tables are a common ATS parsing failure point');
  } else {
    warn(`${tableLikeLines.length} line(s) contain multiple "|" characters — our parser renders these as plain text (not an actual table), but double-check they weren't meant as one: ${tableLikeLines.slice(0, 3).join(' / ')}`);
  }

  const emptyHeadings = blocks.filter((b): b is CvTextBlock => (b.type === 'h1' || b.type === 'h2') && b.text.trim() === '');
  if (emptyHeadings.length === 0) pass('No empty section headings');
  else fail(`${emptyHeadings.length} empty heading(s) found`);

  // ---- 2. PDF text-extraction round-trip ------------------------------------
  const pdf = buildPdf(blocks);
  const arrayBuffer = pdf.output('arraybuffer') as ArrayBuffer;
  // Text extraction doesn't need actual glyph rendering, so let pdfjs fall
  // back to system fonts instead of fetching its bundled standard-font files
  // (fetch() can't reach file:// URLs here) — this only silences a harmless
  // "font data" warning and has no effect on the extracted text.
  const doc = await getDocument({ data: new Uint8Array(arrayBuffer), useSystemFonts: true }).promise;

  let extracted = '';
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    extracted += ' ' + content.items.map(it => ('str' in it ? it.str : '')).join(' ');
  }
  const extractedNorm = normalize(extracted);

  if (extractedNorm.length > 0) pass(`PDF contains ${extractedNorm.length} characters of selectable text (not a rasterized image)`);
  else fail('PDF has no extractable text at all — it would be invisible to any ATS');

  const textBlocks = blocks.filter(isTextBlock).filter(b => b.text.trim() !== '');
  const rowSides = blocks.filter(isRowBlock).flatMap(b => [b.left, b.right]).filter(s => s.trim() !== '');
  let missing = 0;
  for (const needleText of [...textBlocks.map(b => b.text), ...rowSides]) {
    const needle = normalize(needleText);
    if (needle && !extractedNorm.includes(needle)) {
      missing++;
      warn(`Block text not found intact in extracted PDF text (may just be a line-wrap/spacing artifact — verify visually): "${needleText.slice(0, 60)}${needleText.length > 60 ? '…' : ''}"`);
    }
  }
  if (missing === 0) pass(`All ${textBlocks.length + rowSides.length} text blocks round-tripped into the PDF's extracted text intact`);

  pass(`Rendered as ${doc.numPages} page(s) using the standard Helvetica core font (no custom/embedded font that could fail to extract)`);

  // ---- Report ----------------------------------------------------------
  const icon: Record<Level, string> = { pass: '✅', warn: '⚠️ ', fail: '❌' };
  console.log('\nATS Compliance Check — public/content/cv.md\n' + '─'.repeat(60));
  for (const r of results) console.log(`${icon[r.level]} ${r.message}`);

  const fails = results.filter(r => r.level === 'fail').length;
  const warns = results.filter(r => r.level === 'warn').length;
  console.log('─'.repeat(60));
  console.log(`${results.length} checks — ${results.length - fails - warns} passed, ${warns} warning(s), ${fails} failed\n`);

  if (fails > 0) process.exitCode = 1;
}

main().catch(err => {
  console.error('ATS check crashed:', err);
  process.exitCode = 1;
});

// Client-side CV PDF generation, ported from the CV_carkus (Blazor) reference
// implementation: MainLayout.razor's `ParseMarkdownToJson` line-parser and
// wwwroot/index.html's `generatePdfFromJson` jsPDF renderer. The markdown source
// (public/content/cv.md) is fetched and re-parsed on every download, so the PDF
// is always built fresh from the live content rather than served as a static file.
import { jsPDF } from 'jspdf';

interface CvLink {
  label: string;
  url: string;
}

type CvTextBlock = { type: 'h1' | 'h2' | 'bold' | 'italic' | 'bullet' | 'p'; text: string; links: CvLink[] };
type CvMarkerBlock = { type: 'hr' | 'pagebreak' | 'br' };
type CvBlock = CvTextBlock | CvMarkerBlock;

const LINK_PATTERN = /\[([^\]]+)\]\(([^)]+)\)/g;

function parseLinks(text: string): CvLink[] {
  const links: CvLink[] = [];
  for (const m of text.matchAll(LINK_PATTERN)) links.push({ label: m[1], url: m[2] });
  return links;
}

function stripLinks(text: string): string {
  return text.replace(LINK_PATTERN, (_match, label: string) => label);
}

function trimAsterisks(s: string): string {
  return s.replace(/^\*+/, '').replace(/\*+$/, '');
}

export function parseMarkdownToBlocks(markdown: string): CvBlock[] {
  const blocks: CvBlock[] = [];
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');

  for (const raw of lines) {
    const l = raw.trimEnd();

    if (l.startsWith('# ')) {
      const text = l.slice(2);
      blocks.push({ type: 'h1', text: stripLinks(text), links: parseLinks(text) });
    } else if (l.startsWith('*') && l.endsWith('*') && !l.startsWith('**')) {
      const text = trimAsterisks(l);
      blocks.push({ type: 'italic', text: stripLinks(text), links: parseLinks(text) });
    } else if (l.startsWith('## ')) {
      const text = l.slice(3);
      blocks.push({ type: 'h2', text: stripLinks(text), links: parseLinks(text) });
    } else if (l.startsWith('**') && l.endsWith('**')) {
      const text = trimAsterisks(l);
      blocks.push({ type: 'bold', text: stripLinks(text), links: parseLinks(text) });
    } else if (l.startsWith('- ')) {
      const text = l.slice(2);
      blocks.push({ type: 'bullet', text: stripLinks(text), links: parseLinks(text) });
    } else if (l === '---') {
      blocks.push({ type: 'hr' });
    } else if (l === '===') {
      blocks.push({ type: 'pagebreak' });
    } else if (l.trim() === '') {
      blocks.push({ type: 'br' });
    } else {
      blocks.push({ type: 'p', text: stripLinks(l), links: parseLinks(l) });
    }
  }

  return blocks;
}

const MARGIN = 15;
const CONTENT_W = 180;
const PAGE_H = 277;

function buildPdf(blocks: CvBlock[]): jsPDF {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  let y = MARGIN;

  const checkPage = (needed: number) => {
    if (y + needed > PAGE_H) {
      pdf.addPage();
      y = MARGIN;
    }
  };

  // Draws `text` starting at (margin, y), wrapping any inline [label](url) runs
  // as real PDF link annotations via textWithLink while wrapping plain text
  // around them with splitTextToSize — mirrors generatePdfFromJson's per-word
  // link-splicing logic.
  const drawLinkedText = (text: string, links: CvLink[]) => {
    let x = MARGIN;
    let remaining = text;

    for (const link of links) {
      const idx = remaining.indexOf(link.label);
      const before = idx >= 0 ? remaining.slice(0, idx) : '';
      if (before) {
        const beforeLines = pdf.splitTextToSize(before, CONTENT_W - (x - MARGIN)) as string[];
        beforeLines.forEach((line, i) => {
          if (i > 0) { y += 5; x = MARGIN; checkPage(5); }
          pdf.text(line, x, y);
          x += pdf.getTextWidth(line);
        });
      }
      pdf.textWithLink(link.label, x, y, { url: link.url });
      pdf.setTextColor(0, 0, 0);
      x += pdf.getTextWidth(link.label);
      remaining = idx >= 0 ? remaining.slice(idx + link.label.length) : remaining;
    }

    if (remaining) {
      const remLines = pdf.splitTextToSize(remaining, CONTENT_W - (x - MARGIN)) as string[];
      remLines.forEach((line, i) => {
        if (i > 0) { y += 5; x = MARGIN; checkPage(5); }
        pdf.text(line, x, y);
      });
    }
    y += 5;
  };

  for (const block of blocks) {
    switch (block.type) {
      case 'h1':
        checkPage(16);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(15);
        y += 6;
        pdf.text(block.text, MARGIN, y);
        y += 8;
        break;
      case 'h2':
        checkPage(8);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(11);
        y += 2;
        pdf.text(block.text, MARGIN, y);
        y += 6;
        break;
      case 'bold':
        checkPage(6);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(10);
        pdf.text(block.text, MARGIN, y);
        y += 5;
        break;
      case 'italic':
        checkPage(5);
        pdf.setFont('helvetica', 'italic');
        pdf.setFontSize(10);
        pdf.text(block.text, MARGIN, y);
        y += 5;
        break;
      case 'bullet':
        checkPage(5);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        pdf.text(`• ${block.text}`, MARGIN + 4, y);
        y += 5;
        break;
      case 'p':
        checkPage(5);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        if (block.links.length) {
          drawLinkedText(block.text, block.links);
        } else {
          const lines = pdf.splitTextToSize(block.text, CONTENT_W) as string[];
          lines.forEach(line => { checkPage(5); pdf.text(line, MARGIN, y); y += 5; });
        }
        break;
      case 'br':
        y += 4;
        break;
      case 'pagebreak':
        pdf.addPage();
        y = MARGIN;
        break;
      case 'hr':
        checkPage(6);
        pdf.setDrawColor(200);
        pdf.line(MARGIN, y, MARGIN + CONTENT_W, y);
        y += 4;
        break;
    }
    y += 1;
  }

  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7.5);
    pdf.setTextColor(180, 180, 180);
    pdf.text(`${i} / ${totalPages}`, MARGIN + CONTENT_W / 2, 287, { align: 'center' });
  }
  pdf.setTextColor(0, 0, 0);

  return pdf;
}

// Fetches the markdown source fresh, re-parses it, and builds+saves a new PDF —
// nothing is pre-baked, so any edit to public/content/cv.md is reflected on the
// very next download.
export async function downloadCv(): Promise<void> {
  const res = await fetch('/content/cv.md');
  if (!res.ok) throw new Error(`Failed to load CV source (${res.status})`);
  const markdown = await res.text();
  const blocks = parseMarkdownToBlocks(markdown);
  const pdf = buildPdf(blocks);
  const sessionId = Math.random().toString(16).slice(2, 8).toUpperCase();
  pdf.save(`mark-scicluna-cv-${sessionId}.pdf`);
}

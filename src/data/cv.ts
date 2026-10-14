import type { MouseEvent } from 'react';

// The CV download, shared by NavBar and HeroSection.
//
// Each click renders a fresh PDF from JobFit (GET /api/cv/download, which uses the
// profile pinned by PORTFOLIO_CV_PROFILE_ID on the JobFit server). If JobFit errors,
// is unreachable or takes too long, the static copy in public/files/ is served
// instead. The client-side generator in utils/cvPdf.ts is kept but unused.
export const CV_JOBFIT_URL = 'https://jobfit.carkus.com/api/cv/download';
/** Fallback, and the link's real href (so middle-click / no-JS still get a CV).
 *  Update this whenever a fresher static CV is dropped into public/files/. */
export const CV_PDF_PATH = '/files/mark-scicluna-cv.pdf';
const CV_FILENAME = 'mark-scicluna-cv.pdf';
const JOBFIT_TIMEOUT_MS = 10000;

/** onClick for a CV link whose href is CV_PDF_PATH: tries JobFit first, and
 *  only lets the static file through if that fails. */
export function downloadCv(e: MouseEvent<HTMLAnchorElement>): void {
  // Leave modified clicks (new tab, save link…) to the browser and the static href.
  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  void fetchJobFitCv().then(blob => {
    if (blob) saveBlob(blob);
    else saveUrl(CV_PDF_PATH);
  });
}

async function fetchJobFitCv(): Promise<Blob | null> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), JOBFIT_TIMEOUT_MS);
  try {
    const res = await fetch(CV_JOBFIT_URL, { signal: ctrl.signal });
    // A failed render comes back as a JSON error body, not a PDF.
    if (!res.ok || !res.headers.get('content-type')?.includes('application/pdf')) return null;
    return await res.blob();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function saveBlob(blob: Blob): void {
  const url = URL.createObjectURL(blob);
  saveUrl(url);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function saveUrl(href: string): void {
  const a = document.createElement('a');
  a.href = href;
  a.download = CV_FILENAME;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

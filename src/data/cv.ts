// Single source for the CV download link used by both NavBar and HeroSection.
// Back to a static pre-baked PDF — JobFit's own CV generator (GET
// /api/cv/download) now requires a profileId it has no default for, so the
// public download link 500'd. The client-side generator in utils/cvPdf.ts is
// kept for when that's revived. Update this path whenever a fresher CV is
// dropped into public/files/.
export const CV_PDF_PATH = '/files/mark-scicluna-cv.pdf';

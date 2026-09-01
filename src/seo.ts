import { createDocumentMetaHook } from '@carkus/seo-react';
import type { SiteConfig } from '@carkus/seo-react';

export const siteConfig: SiteConfig = {
  siteUrl: 'https://mscicluna.com',
  defaultImage: 'https://mscicluna.com/android-chrome-512x512.png',
  siteName: 'Mark Scicluna',
};

/**
 * Bound to this site's config — every page imports this instead of the
 * package directly. See @carkus/seo-react's README for why this is a
 * DOM-upsert hook rather than react-helmet-async.
 */
export const useDocumentMeta = createDocumentMetaHook(siteConfig);

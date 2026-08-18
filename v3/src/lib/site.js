// Site-wide constants and URL helpers shared by layouts, components, pages.

export const SITE_ORIGIN = 'https://chriscart.land'
export const SITE_TITLE = 'Christopher Cartland'
export const SITE_DESCRIPTION =
  'Software Engineer specializing in Android, Mobile, Embedded, and Serverless technologies'

// Prefix an internal path with the deploy base ('/v3/' today, '/' at
// cutover). Accepts a slug without a leading slash: withBase('projects').
export function withBase(path = '') {
  return import.meta.env.BASE_URL + path.replace(/^\//, '')
}

// Canonical URLs intentionally point at the root-level path for each page,
// not the /v3/ copy: the root site is the live canonical version while v3
// is staged, and after cutover these URLs become self-referential.
export function canonicalFor(slug = '') {
  return `${SITE_ORIGIN}/${slug}`
}

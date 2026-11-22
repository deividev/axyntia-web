export const SITEMAP_PATHS = ['/', '/aviso-legal', '/privacidad'] as const;

export function absoluteUrl(siteUrl: string, path: string): string {
  return `${siteUrl.replace(/\/+$/, '')}${path}`;
}

export function buildOrganizationJsonLd(s: {
  companyName: string;
  siteUrl: string;
  contactEmail: string;
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'ProfessionalService'],
    name: s.companyName,
    url: absoluteUrl(s.siteUrl, '/'),
    email: s.contactEmail,
    areaServed: 'ES',
    knowsLanguage: 'es',
  };
}

/** JSON para incrustar en un <script>: escapa `<` para que no cierre la etiqueta. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export function buildSitemapXml(siteUrl: string, paths: readonly string[]): string {
  const urls = paths.map((p) => `<url><loc>${absoluteUrl(siteUrl, p)}</loc></url>`).join('');
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>\n`;
}

export function buildRobotsTxt(siteUrl: string): string {
  return `User-agent: *\nAllow: /\nSitemap: ${absoluteUrl(siteUrl, '/sitemap.xml')}\n`;
}

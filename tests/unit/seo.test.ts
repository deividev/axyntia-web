import { describe, expect, it } from 'vitest';
import {
  absoluteUrl,
  buildOrganizationJsonLd,
  buildRobotsTxt,
  buildSitemapXml,
  serializeJsonLd,
  SITEMAP_PATHS,
} from '../../src/lib/seo';

describe('seo', () => {
  it('absoluteUrl no duplica la barra final', () => {
    expect(absoluteUrl('https://a.example/', '/x')).toBe('https://a.example/x');
    expect(absoluteUrl('https://a.example', '/x')).toBe('https://a.example/x');
  });

  it('JSON-LD tiene el tipo esperado y escapa <', () => {
    const ld = buildOrganizationJsonLd({
      companyName: 'A</script>',
      siteUrl: 'https://a.example',
      contactEmail: 'h@a.example',
    });
    expect(ld['@type']).toContain('Organization');
    const s = serializeJsonLd(ld);
    expect(s).not.toContain('<');
    expect(JSON.parse(s).name).toBe('A</script>');
  });

  it('sitemap y robots con y sin barra final', () => {
    for (const site of ['https://a.example', 'https://a.example/']) {
      const xml = buildSitemapXml(site, SITEMAP_PATHS);
      expect(xml.startsWith('<?xml')).toBe(true);
      expect(xml).toContain('<loc>https://a.example/aviso-legal</loc>');
      expect(xml).not.toContain('//aviso-legal');
      expect(buildRobotsTxt(site)).toContain('Sitemap: https://a.example/sitemap.xml\n');
    }
    expect(buildSitemapXml('https://a.example', SITEMAP_PATHS).match(/<loc>/g)).toHaveLength(3);
  });
});

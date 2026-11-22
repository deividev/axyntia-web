import type { APIRoute } from 'astro';
import { site } from '../config/site';
import { buildSitemapXml, SITEMAP_PATHS } from '../lib/seo';

export const GET: APIRoute = () =>
  new Response(buildSitemapXml(site.siteUrl, SITEMAP_PATHS), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });

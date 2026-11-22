import type { APIRoute } from 'astro';
import { site } from '../config/site';
import { buildRobotsTxt } from '../lib/seo';

export const GET: APIRoute = () =>
  new Response(buildRobotsTxt(site.siteUrl), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });

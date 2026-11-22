import { defineConfig, passthroughImageService } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { site } from './src/config/site';

// Sitio estático. El servicio de imágenes «passthrough» no transforma imágenes, así que no se usa
// sharp y onlyBuiltDependencies sigue vacío.
export default defineConfig({
  output: 'static',
  site: site.siteUrl,
  image: { service: passthroughImageService() },
  vite: { plugins: [tailwindcss()] },
});

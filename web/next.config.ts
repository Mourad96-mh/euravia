import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // A plain file host serves the site: no Node server, so no middleware, rewrites or
  // redirects. The root redirect and www → apex live in the generated .htaccess.
  output: 'export',
  turbopack: {
    // Otherwise Turbopack walks up to C:\Users\MOURAD, finds a stray package-lock.json and
    // takes the home directory as the workspace root.
    root: process.cwd(),
  },
  trailingSlash: true,
  images: {
    // The export has no image optimiser; photos are pre-sized by scripts/fetch-photos.mjs.
    unoptimized: true,
  },
  /*
   * Development only. Every route lives under a locale and the real root is the language
   * picker that scripts/finalize-export.mjs writes after the build, so `next dev` would
   * answer 404 at "/". Guarded on NODE_ENV so no build ever emits the rule (Vercel would
   * otherwise turn it into an edge redirect and skip the picker).
   */
  async redirects() {
    if (process.env.NODE_ENV !== 'development') return [];
    return [{ source: '/', destination: '/en', permanent: false }];
  },
};

export default nextConfig;

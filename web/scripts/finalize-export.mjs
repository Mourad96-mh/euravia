/**
 * Post-build step: turns `out/` into something a static host can serve.
 *
 *   out/index.html   language picker for the bare domain (remembered choice, then the
 *                    browser's language, then English)
 *   out/.htaccess    https + www → apex, "/" → the picker, 404 page, caching
 *   out/sitemap.xml  every page with its hreflang alternates
 *   out/robots.txt
 *
 * The sitemap is read back from the built HTML — each page's own
 * <link rel="alternate" hreflang> tags — so it can never list a page that was not built,
 * and it can never disagree with the hreflang the pages declare.
 */
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'out');
const SITE = 'https://euraviafoods.com';
const LOCALES = ['en', 'fr', 'nl'];
const DEFAULT = 'en';

if (!existsSync(OUT)) {
  console.error('out/ not found: run the build first.');
  process.exit(1);
}

function pages(dir, base = '') {
  const found = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (!statSync(full).isDirectory() || entry.startsWith('_') || entry.startsWith('.')) continue;
    const rel = base ? `${base}/${entry}` : entry;
    if (existsSync(join(full, 'index.html'))) found.push(rel);
    found.push(...pages(full, rel));
  }
  return found;
}

const built = pages(OUT).filter((p) => LOCALES.includes(p.split('/')[0]));

/* ---------------------------------------------------------------- sitemap */

const alternatesOf = (html) =>
  [...html.matchAll(/<link rel="alternate" hrefLang="([^"]+)" href="([^"]+)"/gi)].map((m) => ({
    lang: m[1],
    href: m[2],
  }));

const noindex = (html) => /<meta name="robots" content="[^"]*noindex/i.test(html);

const entries = [];
for (const path of built) {
  const html = readFileSync(join(OUT, path, 'index.html'), 'utf8');
  if (noindex(html)) continue;
  const loc = `${SITE}/${path}/`;
  const links = alternatesOf(html)
    .map((a) => `    <xhtml:link rel="alternate" hreflang="${a.lang}" href="${a.href}"/>`)
    .join('\n');
  const depth = path.split('/').length;
  const priority = depth === 1 ? '1.0' : depth === 2 ? '0.8' : '0.6';
  entries.push(`  <url>\n    <loc>${loc}</loc>\n${links}\n    <priority>${priority}</priority>\n  </url>`);
}

writeFileSync(
  join(OUT, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>
`
);

writeFileSync(join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${SITE}/sitemap.xml\n`);

/* ------------------------------------------------------- language picker */

writeFileSync(
  join(OUT, 'index.html'),
  `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Euravia — Fresh &amp; frozen produce from Morocco</title>
<meta name="description" content="Euravia sources, packs and supplies premium fresh and IQF frozen fruit and vegetables from Morocco and the Mediterranean.">
<link rel="canonical" href="${SITE}/${DEFAULT}/">
${LOCALES.map((l) => `<link rel="alternate" hreflang="${l}" href="${SITE}/${l}/">`).join('\n')}
<link rel="alternate" hreflang="x-default" href="${SITE}/">
<link rel="icon" href="/favicon.svg">
<script>
(function () {
  var locales = ${JSON.stringify(LOCALES)};
  var pick = null;
  try { pick = localStorage.getItem('euravia:lang'); } catch (e) {}
  if (locales.indexOf(pick) < 0) {
    var langs = navigator.languages || [navigator.language || ''];
    for (var i = 0; i < langs.length && !pick; i++) {
      var code = String(langs[i]).slice(0, 2).toLowerCase();
      if (locales.indexOf(code) >= 0) pick = code;
    }
  }
  location.replace('/' + (pick || '${DEFAULT}') + '/');
})();
</script>
<style>
body{margin:0;min-height:100vh;display:grid;place-items:center;font-family:system-ui,sans-serif;background:#0f3a21;color:#fff}
nav{display:flex;gap:1rem}a{color:#fff;font-weight:600;padding:.75rem 1.25rem;border:1px solid rgba(255,255,255,.6);border-radius:4px;text-decoration:none}
</style>
</head>
<body>
<nav aria-label="Language">
<a href="/en/" hreflang="en">English</a>
<a href="/fr/" hreflang="fr">Français</a>
<a href="/nl/" hreflang="nl">Nederlands</a>
</nav>
</body>
</html>
`
);

/* ---------------------------------------------------------------- 404 page */

/*
 * The locale layout is the root layout, so Next's own 404 renders with no header, no
 * styles and no language. This one is self-contained and speaks all three.
 */
writeFileSync(
  join(OUT, '404.html'),
  `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Page not found — Euravia</title>
<link rel="icon" href="/favicon.svg">
<style>
body{margin:0;min-height:100vh;display:grid;place-items:center;padding:2rem;box-sizing:border-box;font-family:system-ui,-apple-system,'Segoe UI',sans-serif;background:#0f3a21;color:#fff;text-align:center}
.sun{width:64px;height:64px;margin:0 auto 1.5rem;border-radius:50%;background:#e9792b}
h1{margin:0 0 .5rem;font-size:clamp(1.8rem,5vw,2.6rem)}p{margin:.25rem 0;color:rgba(255,255,255,.82)}
nav{display:flex;flex-wrap:wrap;justify-content:center;gap:.75rem;margin-top:2rem}
a{color:#13201a;background:#e9792b;font-weight:600;padding:.75rem 1.25rem;border-radius:4px;text-decoration:none}
a+a{background:transparent;color:#fff;border:1px solid rgba(255,255,255,.6)}
</style>
</head>
<body>
<main>
<div class="sun" aria-hidden="true"></div>
<h1>Page not found</h1>
<p>This page does not exist or has moved.</p>
<p lang="fr">Cette page n'existe pas ou a été déplacée.</p>
<p lang="nl">Deze pagina bestaat niet of is verplaatst.</p>
<nav>
<a href="/en/" hreflang="en">Home</a>
<a href="/fr/" hreflang="fr">Accueil</a>
<a href="/nl/" hreflang="nl">Home (NL)</a>
</nav>
</main>
</body>
</html>
`
);

/* ------------------------------------------------------------- .htaccess */

writeFileSync(
  join(OUT, '.htaccess'),
  `# Generated by scripts/finalize-export.mjs — do not edit by hand.
Options -Indexes
DirectoryIndex index.html
ErrorDocument 404 /404.html

<IfModule mod_rewrite.c>
  RewriteEngine On
  # https, and www → the bare domain
  RewriteCond %{HTTPS} !=on [OR]
  RewriteCond %{HTTP_HOST} ^www\\. [NC]
  RewriteRule ^ https://euraviafoods.com%{REQUEST_URI} [L,R=301]
  # A page asked for without its trailing slash
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME}/index.html -f
  RewriteRule ^(.*[^/])$ /$1/ [L,R=301]
</IfModule>

<IfModule mod_headers.c>
  Header always set X-Content-Type-Options "nosniff"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set X-Frame-Options "SAMEORIGIN"
  <FilesMatch "\\.(webp|jpg|png|svg|mp4|woff2)$">
    Header set Cache-Control "public, max-age=2592000"
  </FilesMatch>
  <FilesMatch "\\.(js|css)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>
  <FilesMatch "\\.html$">
    Header set Cache-Control "public, max-age=0, must-revalidate"
  </FilesMatch>
</IfModule>

<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript application/json image/svg+xml application/xml text/plain
</IfModule>
`
);

console.log(`finalize: ${built.length} pages, ${entries.length} in sitemap.xml, + index.html, .htaccess, robots.txt`);

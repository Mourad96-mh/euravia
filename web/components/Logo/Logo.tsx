/**
 * Stand-in wordmark until the client sends a logo (docs/01-discovery.md, G1): a sun over a
 * leaf — Moroccan sun, fresh produce — and the name. Inline SVG at currentColor, so the
 * header can turn it white over the hero without a second file; the sun keeps its orange.
 *
 * Replacing it with the real logo is this one file.
 */
export default function Logo({ className, title = 'Euravia' }: { className?: string; title?: string }) {
  return (
    <svg className={className} viewBox="0 0 208 48" role="img" aria-label={title}>
      <title>{title}</title>
      {/* The sun */}
      <circle cx="24" cy="17" r="9" fill="var(--sun)" />
      {/* The leaf, rising across it */}
      <path
        d="M8 41c0-13 9.5-22 26-22 0 14.5-9.5 22-21 22H8Z"
        fill="currentColor"
      />
      <path d="M11 39c6-6.5 11.5-10.5 18-13.5" stroke="var(--logo-vein, #fff)" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <text
        x="46"
        y="30"
        fill="currentColor"
        fontFamily="var(--font-sans), system-ui, sans-serif"
        fontSize="24"
        fontWeight="700"
        letterSpacing="2.5"
      >
        EURAVIA
      </text>
      <text
        x="47"
        y="43"
        fill="currentColor"
        fontFamily="var(--font-sans), system-ui, sans-serif"
        fontSize="8.6"
        fontWeight="600"
        letterSpacing="1.2"
        opacity="0.72"
        /* Pinned to the width of EURAVIA above: left free, the spacing ran past the
           208-unit viewBox and the tagline was cut to "FRESH · FROZEN · F". */
        textLength="123"
        lengthAdjust="spacingAndGlyphs"
      >
        FRESH · FROZEN · FOODS
      </text>
    </svg>
  );
}

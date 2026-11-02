/* The page's icons: pixel arrows for the buttons, an asterisk for the notes,
   thin line glyphs for the platform grid, and the usual small ones. */

const line = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

/** An arrow drawn in square pixels, as the reference's buttons carry. */
export function PixelArrow() {
  return (
    <svg viewBox="0 0 14 12" aria-hidden="true" focusable="false" fill="currentColor" shapeRendering="crispEdges">
      <path d="M8 0h2v2H8zM10 2h2v2h-2zM0 5h12v2H0zM12 4h2v4h-2zM10 8h2v2h-2zM8 10h2v2H8z" />
    </svg>
  );
}

/** A chevron in square pixels, for the button's square. */
export function PixelChevron() {
  return (
    <svg viewBox="0 0 8 12" aria-hidden="true" focusable="false" fill="currentColor" shapeRendering="crispEdges">
      <path d="M0 0h2v2H0zM2 2h2v2H2zM4 4h2v2H4zM6 5h2v2H6zM4 6h2v2H4zM2 8h2v2H2zM0 10h2v2H0z" />
    </svg>
  );
}

export function PixelUp() {
  return (
    <svg viewBox="0 0 12 8" aria-hidden="true" focusable="false" fill="currentColor" shapeRendering="crispEdges">
      <path d="M5 0h2v2H5zM3 2h2v2H3zM7 2h2v2H7zM1 4h2v2H1zM9 4h2v2H9zM0 6h1v2H0zM11 6h1v2h-1z" />
    </svg>
  );
}

/** The note asterisk. */
export function Asterisk() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor">
      <path d="M10.6 2h2.8l-.3 7.4 6.3-4 1.4 2.4-6.6 3.4 6.6 3.4-1.4 2.4-6.3-4 .3 7.4h-2.8l.3-7.4-6.3 4-1.4-2.4 6.6-3.4-6.6-3.4 1.4-2.4 6.3 4z" />
    </svg>
  );
}

/** The logo's spark: thin rays round a point. */
export function Spark() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        const r = i % 2 ? 11 : 15;
        return <path key={i} d={`M16 16L${(16 + Math.cos(a) * r).toFixed(2)} ${(16 + Math.sin(a) * r).toFixed(2)}`} />;
      })}
    </svg>
  );
}

export function Plus() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false" {...line} strokeWidth={2}>
      <path d="M8 3v10M3 8h10" />
    </svg>
  );
}

export function Close() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false" {...line} strokeWidth={1.8}>
      <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" />
    </svg>
  );
}

export function Check() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false" {...line} strokeWidth={1.8}>
      <path d="M3.5 8.5 6.5 11.5 12.5 4.5" />
    </svg>
  );
}

export function ArrowRight() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false" {...line} strokeWidth={1.8}>
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

export function Telegram() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d="M14.6 2.2 1.5 7.3c-.6.2-.6 1 0 1.2l3.2 1.1 1.3 4c.2.5.8.6 1.1.2l1.8-1.9 3.3 2.4c.4.3 1 .1 1.1-.4L15.5 3c.1-.6-.4-1-.9-.8zM6.2 9.4l5.6-4.3-4.4 5.1-.3 2.1z" fill="currentColor" />
    </svg>
  );
}

export function XLogo() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d="M9.3 6.9 14.1 1.5h-1.2L8.8 6.2 5.5 1.5H1.6l5 7.2-5 5.8h1.2l4.4-5 3.5 5h3.9zM7.8 8.6l-.5-.7-4-5.6h1.7l3.3 4.6.5.7 4.2 5.9h-1.7z" fill="currentColor" />
    </svg>
  );
}

export function Gift() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false" {...line}>
      <path d="M2.5 6h11v2.5h-11zM3.5 8.5v5h9v-5M8 6v7.5" />
      <path d="M8 6C6.5 6 5 5.3 5 4.2 5 3.3 5.8 2.8 6.5 3 7.5 3.3 8 4.6 8 6c0-1.4.5-2.7 1.5-3 .7-.2 1.5.3 1.5 1.2C11 5.3 9.5 6 8 6z" />
    </svg>
  );
}

/* Each desk's glyph, for the market cards. */
export const DESK_GLYPHS: Record<string, React.ReactNode> = {
  crypto: <svg viewBox="0 0 24 24" {...line}><path d="M8 5h6a3 3 0 0 1 0 6H8zM8 11h7a3 3 0 0 1 0 6H8zM8 5v12M6 5h2M6 17h2M10 3v2M13 3v2M10 17v2M13 17v2" /></svg>,
  politics: <svg viewBox="0 0 24 24" {...line}><path d="M4 13h16v7H4zM7 13l-1-4h12l-1 4M9 7l2 2 4-5" /></svg>,
  economy: <svg viewBox="0 0 24 24" {...line}><path d="M3 9l9-5 9 5M5 9v8M9.5 9v8M14.5 9v8M19 9v8M3 19h18" /></svg>,
};

/* The platform grid's faint glyphs, in place of the reference's chess men. */
const glyph = { ...line, strokeWidth: 1.2 };
export const GLYPHS = [
  // gavel
  <svg key="g" viewBox="0 0 24 24" {...glyph}><path d="M13 4l7 7M10 7l7 7M11.5 5.5l-4 4 7 7 4-4M9 11l-6 6 2 2 6-6" /></svg>,
  // ballot
  <svg key="b" viewBox="0 0 24 24" {...glyph}><path d="M4 13h16v7H4zM7 13l-1-4h12l-1 4M9 7l2 2 4-5" /></svg>,
  // coin
  <svg key="c" viewBox="0 0 24 24" {...glyph}><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="5" /></svg>,
  // vault
  <svg key="v" viewBox="0 0 24 24" {...glyph}><rect x="4" y="4" width="16" height="16" rx="2" /><circle cx="12" cy="12" r="3.5" /><path d="M12 8.5V6M12 18v-2.5" /></svg>,
  // key
  <svg key="k" viewBox="0 0 24 24" {...glyph}><circle cx="8" cy="15" r="4" /><path d="M11 12l8-8M16 7l2 2M14 9l2 2" /></svg>,
  // chart
  <svg key="h" viewBox="0 0 24 24" {...glyph}><path d="M4 19h16M7 16V11M12 16V7M17 16v-4" /></svg>,
];

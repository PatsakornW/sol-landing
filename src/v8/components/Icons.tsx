/* The page's small icons, drawn on a 16-unit grid in currentColor. */

const line = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

export function ArrowRight() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false" {...line}>
      <path d="M3.5 8h9M8.5 4l4 4-4 4" />
    </svg>
  );
}

export function ChevronDown() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false" {...line}>
      <path d="M4.5 6.5 8 10l3.5-3.5" />
    </svg>
  );
}

export function Close() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false" {...line}>
      <path d="M3 3l10 10M13 3 3 13" />
    </svg>
  );
}

export function Check() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false" {...line}>
      <path d="M3.5 8.5 6.5 11.5 12.5 4.5" />
    </svg>
  );
}

/* Telegram's paper plane, filled. */
export function Telegram() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d="M14.6 2.2 1.5 7.3c-.6.2-.6 1 0 1.2l3.2 1.1 1.3 4c.2.5.8.6 1.1.2l1.8-1.9 3.3 2.4c.4.3 1 .1 1.1-.4L15.5 3c.1-.6-.4-1-.9-.8zM6.2 9.4l5.6-4.3-4.4 5.1-.3 2.1z" fill="currentColor" />
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

export function Wallet() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false" {...line}>
      <path d="M2.5 4.5h10a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1z" />
      <path d="M2.5 4.5 10.5 2v2.5M10.5 9h3" />
    </svg>
  );
}

/* The three desks the cards carry. */
export function Bitcoin() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false" {...line}>
      <path d="M5.5 3.5h4a2 2 0 0 1 0 4h-4zM5.5 7.5h4.5a2 2 0 0 1 0 4H5.5zM5.5 3.5v8M4 3.5h1.5M4 11.5h1.5M7 2v1.5M9 2v1.5M7 11.5V13M9 11.5V13" />
    </svg>
  );
}

export function Ballot() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false" {...line}>
      <path d="M2.5 9.5h11v4h-11zM5 9.5 4 6.5h8l-1 3M6 4.5l1.5 1.5 3-3.5" />
    </svg>
  );
}

export function Ball() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false" {...line}>
      <circle cx="8" cy="8" r="5.8" />
      <path d="M8 5.2 10.6 7l-1 3H6.4l-1-3zM8 2.2v3M10.6 7l2.9-1M9.6 10l1.7 2.6M6.4 10l-1.7 2.6M5.4 7 2.5 6" />
    </svg>
  );
}

/* The three questions on the isometric cards. */
export function Burst() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        const c = Math.cos(a);
        const s = Math.sin(a);
        return <path key={i} d={`M${(12 + c * 5).toFixed(2)} ${(12 + s * 5).toFixed(2)}L${(12 + c * 10).toFixed(2)} ${(12 + s * 10).toFixed(2)}`} />;
      })}
    </svg>
  );
}

export function Tiles() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor">
      <rect x="3" y="3" width="7.5" height="7.5" rx="2" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="2" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="2" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2" />
    </svg>
  );
}

export function Sparkle() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor">
      <path d="M10 3c.6 4.2 2.4 6.4 7 7-4.6.6-6.4 2.8-7 7-.6-4.2-2.4-6.4-7-7 4.6-.6 6.4-2.8 7-7z" />
      <path d="M18.5 2.5c.3 1.6.9 2.2 2.5 2.5-1.6.3-2.2.9-2.5 2.5-.3-1.6-.9-2.2-2.5-2.5 1.6-.3 2.2-.9 2.5-2.5zM18 15c.3 1.7 1 2.4 2.7 2.7-1.7.3-2.4 1-2.7 2.7-.3-1.7-1-2.4-2.7-2.7 1.7-.3 2.4-1 2.7-2.7z" />
    </svg>
  );
}

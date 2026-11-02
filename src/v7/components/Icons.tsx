/* The page's small line icons, drawn on a 16-unit grid in currentColor. */

const line = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

export function ArrowRight() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false" {...line}>
      <path d="M3.5 8h9M8.5 4l4 4-4 4" />
    </svg>
  );
}

export function ArrowDown() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false" {...line}>
      <path d="M8 3.5v9M4 8.5l4 4 4-4" />
    </svg>
  );
}

export function ArrowUp() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false" {...line}>
      <path d="M8 12.5v-9M4 7.5l4-4 4 4" />
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

/* Telegram's paper plane, simplified to the page's line style. */
export function Telegram() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false" {...line}>
      <path d="M14 2.5 1.8 7.3l4.4 1.6 1.6 4.6 2.3-3 3.3 2.5z" />
      <path d="m6.2 8.9 4.9-3.6" />
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

export function Play() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d="M4.5 3.2v9.6L12.5 8z" fill="currentColor" />
    </svg>
  );
}

export function Pause() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d="M4.5 3h2.2v10H4.5zM9.3 3h2.2v10H9.3z" fill="currentColor" />
    </svg>
  );
}

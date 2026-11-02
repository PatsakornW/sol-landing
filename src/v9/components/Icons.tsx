/* The page's small icons, drawn on a 16-unit grid in currentColor. */

const line = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

export function ArrowRight() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false" {...line}>
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

export function ArrowDown() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false" {...line}>
      <path d="M8 3v10M4 9l4 4 4-4" />
    </svg>
  );
}

export function Close() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false" {...line}>
      <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" />
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

export function Plus() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false" {...line}>
      <path d="M8 3v10M3 8h10" />
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
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false" {...line} strokeWidth={1.5}>
      <path d="M2.5 6h11v2.5h-11zM3.5 8.5v5h9v-5M8 6v7.5" />
      <path d="M8 6C6.5 6 5 5.3 5 4.2 5 3.3 5.8 2.8 6.5 3 7.5 3.3 8 4.6 8 6c0-1.4.5-2.7 1.5-3 .7-.2 1.5.3 1.5 1.2C11 5.3 9.5 6 8 6z" />
    </svg>
  );
}

'use client';

import { useEffect } from 'react';

/** Replaces the root layout when a fatal error escapes the tree below it. */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          fontFamily: 'system-ui, sans-serif',
          background: '#0a0a0b',
          color: '#f4f4f5',
          padding: 24,
          textAlign: 'center',
        }}
      >
        <div>
          <h1 style={{ margin: '0 0 12px', fontSize: 28 }}>Something went wrong</h1>
          <p style={{ margin: '0 0 24px', color: '#a1a1aa' }}>
            An unexpected error occurred. Try again.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              border: '1px solid rgba(255,255,255,0.14)',
              background: '#fff',
              color: '#18181b',
              borderRadius: 3,
              padding: '10px 16px',
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}

import Link from 'next/link';
import { AppConfig } from '@/configs/configs';
import { LOCALE } from '@/i18n/messages';

/**
 * The last-resort 404, with its own document.
 *
 * This site has several root layouts — one per design revision — so nothing
 * above them renders `<html>`. A route that matches none of their trees has no
 * layout to fall back into, which is what this file is: a whole page, styled
 * inline, owing nothing to the design system.
 */
export default function RootNotFound() {
  return (
    <html lang={LOCALE} data-theme="dark">
      <body>
        <main
          style={{
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
            <p
              style={{
                margin: 0,
                fontSize: 14,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              404
            </p>
            <h1 style={{ margin: '12px 0', fontSize: 32 }}>Page not found</h1>
            <p style={{ margin: '0 0 24px', color: '#a1a1aa' }}>
              This route does not exist on {AppConfig.name}.
            </p>
            <Link href="/" style={{ color: '#5b91ff' }}>
              Back home
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}

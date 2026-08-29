import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import * as stylex from '@stylexjs/stylex';

import '@/styles/globals.css';

import { AppConfig } from '@/configs/configs';
import { Providers } from '@/components/providers';
import { revisionBody } from '@/styles/revision-body.styles';
import { VersionToggle } from '@/v3/components/VersionToggle';
import { LOCALE, translatorFor } from '@/v3/i18n/messages';
import { v3Dark, v3Shape, v3Type } from '@/v3/styles/theme';

/* One face for the whole revision. */
const inter = localFont({
  src: '../../../../public/fonts/inter-latin-opsz-normal.woff2',
  weight: '100 900',
  style: 'normal',
  variable: '--font-inter',
  display: 'swap',
  preload: false,
});

export function generateMetadata(): Metadata {
  const t = translatorFor();
  const title = t('meta.title');
  const description = t('meta.description');

  return {
    metadataBase: new URL(AppConfig.baseUrl),
    title: { default: title, template: `%s | ${AppConfig.name}` },
    description,
    applicationName: AppConfig.name,
    icons: { icon: '/favicon.svg', apple: '/apple-touch-icon.png' },
    // A design revision, not a second public site — keep it out of the index.
    robots: { index: false, follow: false },
    openGraph: {
      type: 'website',
      siteName: AppConfig.name,
      locale: LOCALE,
      title,
      description,
      images: [{ url: '/apple-touch-icon.png', width: 180, height: 180, alt: AppConfig.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/apple-touch-icon.png'],
    },
  };
}

/* Dark only, so there is nothing for the browser to pick between. */
export const viewport: Viewport = {
  themeColor: '#07090d',
  colorScheme: 'dark',
  viewportFit: 'cover',
};

/**
 * Root layout for revision 6 — the short cut of the parallax page.
 *
 * `<html>` carries the type and shape themes and the one palette this
 * revision has. There is no boot script and no toggle: with a single palette
 * there is nothing to restore before first paint and nothing to switch.
 */
export default function V3Layout({ children }: { children: React.ReactNode }) {
  const themed = stylex.props(v3Type, v3Shape, v3Dark);

  return (
    <html lang={LOCALE} className={`${themed.className ?? ''} ${inter.variable}`} data-theme="dark">
      <body {...stylex.props(revisionBody.body)}>
        <Providers>
          <main>{children}</main>
          {/* Fixed corner overlay — last in the DOM so it lands at the end of
              the tab order. */}
          <VersionToggle />
        </Providers>
      </body>
    </html>
  );
}

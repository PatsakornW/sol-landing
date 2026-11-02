import type { Metadata, Viewport } from 'next';
import { Geist } from 'next/font/google';
import * as stylex from '@stylexjs/stylex';

import '@/styles/globals.css';

import { AppConfig, asset } from '@/configs/configs';
import { Providers } from '@/components/providers';
import { VersionSwitch } from '@/components/landing/VersionSwitch';
import { media } from '../../../styles/breakpoints.stylex';
import { font } from '../../../styles/tokens.stylex';
import { LOCALE, translatorFor } from '@/v3/i18n/messages';
import { V3 } from '../../../v3/styles/eclipse.stylex';
import { v3Dark, v3Shape, v3Type } from '@/v3/styles/theme';

/* One modern grotesk, Geist: set tight and heavy for what is said and plain
   for what is explained. It is variable, and `next/font` self-hosts it at
   build time. */
const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
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
    icons: { icon: asset('/favicon.svg'), apple: asset('/apple-touch-icon.png') },
    // A design revision, not a second public site — keep it out of the index.
    robots: { index: false, follow: false },
    openGraph: {
      type: 'website',
      siteName: AppConfig.name,
      locale: LOCALE,
      title,
      description,
      images: [{ url: asset('/apple-touch-icon.png'), width: 180, height: 180, alt: AppConfig.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [asset('/apple-touch-icon.png')],
    },
  };
}

/* Dark only, so there is nothing for the browser to pick between. */
export const viewport: Viewport = {
  themeColor: '#030309',
  colorScheme: 'dark',
  viewportFit: 'cover',
};

const grain = stylex.keyframes({
  '0%': { transform: 'translate(0, 0)' },
  '20%': { transform: 'translate(-3%, 2%)' },
  '40%': { transform: 'translate(2%, -4%)' },
  '60%': { transform: 'translate(-4%, -1%)' },
  '80%': { transform: 'translate(3%, 3%)' },
  '100%': { transform: 'translate(0, 0)' },
});

const styles = stylex.create({
  body: {
    fontFamily: font.sans,
    fontSize: 17,
    letterSpacing: 0,
    lineHeight: 1.6,
    backgroundColor: V3.void,
    color: V3.star,
    WebkitFontSmoothing: 'antialiased',
    textRendering: 'optimizeLegibility',
  },
  main: {
    overflowX: 'clip',
  },
  /* Film grain over everything: a fixed sheet of noise, twice the viewport so
     it can jitter without showing an edge. It never takes the pointer. */
  grain: {
    position: 'fixed',
    inset: '-50%',
    zIndex: 90,
    pointerEvents: 'none',
    opacity: 0.035,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
    animationName: { default: grain, [media.reduce]: 'none' },
    animationDuration: '1.2s',
    animationTimingFunction: 'steps(6)',
    animationIterationCount: 'infinite',
  },
});

/**
 * Root layout for revision 3 — the eclipse.
 *
 * `<html>` carries the type and shape themes and the one palette this
 * revision has. There is no boot script: with a single palette there is
 * nothing to restore before first paint.
 */
export default function V3Layout({ children }: { children: React.ReactNode }) {
  const t = translatorFor();
  const themed = stylex.props(v3Type, v3Shape, v3Dark);

  return (
    <html
      lang={LOCALE}
      className={`${themed.className ?? ''} ${geist.variable}`}
      data-theme="dark"
    >
      <body {...stylex.props(styles.body)}>
        <Providers>
          <main {...stylex.props(styles.main)}>{children}</main>
          <div {...stylex.props(styles.grain)} aria-hidden />
          {/* Fixed corner overlay — last in the DOM so it lands at the end of
              the tab order. */}
          <VersionSwitch current="eclipse" label={t('v3.toggle')} />
        </Providers>
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from 'next';
import { Anton, Barlow_Condensed, Changa_One } from 'next/font/google';
import * as stylex from '@stylexjs/stylex';

import '@/styles/globals.css';
import '@/v6/styles/v6.css';

import { AppConfig, asset } from '@/configs/configs';
import { VersionSwitch } from '@/components/landing/VersionSwitch';
import { font } from '../../../styles/tokens.stylex';
import { Footer } from '@/v6/components/Footer';
import { Nav } from '@/v6/components/Nav';
import { Smooth } from '@/v6/components/Smooth';
import { LOCALE, translations, translatorFor } from '@/v6/i18n/messages';
import { C } from '../../../v6/styles/candy.stylex';
import { v7Dark, v7Shape, v7Type } from '@/v6/styles/theme';

/* Three faces, self-hosted by `next/font`: the poster face, the condensed
   grotesk the page speaks in, and the tall face on the ribbon. */
const changa = Changa_One({ weight: '400', subsets: ['latin'], variable: '--font-changa', display: 'swap' });
const barlow = Barlow_Condensed({ weight: ['500', '600', '700'], subsets: ['latin'], variable: '--font-barlow', display: 'swap' });
const anton = Anton({ weight: '400', subsets: ['latin'], variable: '--font-anton', display: 'swap' });

export function generateMetadata(): Metadata {
  const t = translatorFor();
  const title = t('v6.meta.title');
  const description = t('v6.meta.description');
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
    twitter: { card: 'summary_large_image', title, description, images: [asset('/apple-touch-icon.png')] },
  };
}

export const viewport: Viewport = {
  themeColor: '#16171C',
  colorScheme: 'dark',
  viewportFit: 'cover',
};

const styles = stylex.create({
  body: {
    fontFamily: font.sans,
    fontSize: 17,
    lineHeight: 1.4,
    backgroundColor: C.base,
    color: C.type,
    WebkitFontSmoothing: 'antialiased',
    textRendering: 'optimizeLegibility',
  },
  main: { position: 'relative' },
});

// Marks the document as scripted before first paint, so the entrances the
// scroll scripts own start hidden; without scripts everything stays visible.
const bootScript = `document.documentElement.classList.add('js');`;

/**
 * Root layout for revision 7 — the candy shelf. Lenis drives the scroll, the
 * bar floats over everything, and the corner switch sits last in the order.
 */
export default function V7Layout({ children }: { children: React.ReactNode }) {
  const t = translations();
  const homeHref = '/v6/';
  const themed = stylex.props(v7Type, v7Shape, v7Dark);
  const items = [
    { href: '#feature', label: t('nav.features') },
    { href: '#how-it-works', label: t('nav.howItWorks') },
    { href: '#markets', label: t('nav.markets') },
    { href: '#faq', label: t('nav.faq') },
    { href: `mailto:${AppConfig.email}`, label: t('nav.contact') },
  ];

  return (
    <html lang={LOCALE} className={`${themed.className ?? ''} ${changa.variable} ${barlow.variable} ${anton.variable}`} data-theme="dark" data-scroll-behavior="smooth">
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body {...stylex.props(styles.body)}>
        <Smooth />
        <Nav homeHref={homeHref} labels={{ primary: t('nav.menu'), menu: t('nav.menu'), close: t('nav.close'), join: t('nav.waitlist'), app: t('nav.app'), items }} />
        <main {...stylex.props(styles.main)}>{children}</main>
        <Footer
          homeHref={homeHref}
          labels={{
            shout: t('hero.title'),
            tagline: t('footer.tagline'),
            explore: t('footer.explore'),
            follow: t('footer.follow'),
            copyright: t('footer.copyright'),
            disclaimer: t('footer.disclaimer'),
            app: t('nav.app'),
            items,
          }}
        />
        {/* Fixed corner overlay — last in the DOM so it lands at the end of
            the tab order. */}
        <VersionSwitch current="v6" label={t('switch')} />
      </body>
    </html>
  );
}

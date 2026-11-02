import type { Metadata, Viewport } from 'next';

/* The shared stylesheet first, for the StyleX rules the corner switch is made
   of; then V5's own, which restates the page frame and wins where they meet. */
import '@/styles/globals.css';
import '@/v5/styles/main.scss';
import '@fontsource/geist-mono/latin-400.css';
import '@fontsource/geist-mono/latin-500.css';

import { AppConfig, asset } from '@/configs/configs';
import { Providers } from '@/components/providers';
import { VersionSwitch } from '@/components/landing/VersionSwitch';
import { LandingFooter } from '@/v5/components/landing/LandingFooter';
import { SiteNav } from '@/v5/components/site/SiteNav';
import { LOCALE, translatorFor } from '@/v5/i18n/messages';

export function generateMetadata(): Metadata {
  const t = translatorFor();
  const title = t('v5.meta.title');
  const description = t('v5.meta.description');

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

export const viewport: Viewport = {
  themeColor: '#0f1013',
  colorScheme: 'dark',
};

// Marks the document as scripted before first paint. Scroll reveals hide their
// content only under `.js` (see components/_site.scss), so a visitor or crawler
// without JavaScript still gets every section visible in the server HTML.
const bootScript = `document.documentElement.classList.add('js');`;

/**
 * Root layout for revision 6 — the sols_market landing page.
 *
 * This revision keeps the source app's stylesheet (SCSS, one global sheet)
 * rather than restating it in StyleX, so the page is the one that shipped. It
 * reads none of the shared tokens: its palette, faces and frame come from its
 * own `styles/`.
 */
export default function V6Layout({ children }: { children: React.ReactNode }) {
  const homeHref = '/v5/';

  return (
    // `data-scroll-behavior="smooth"` is what asks Next.js 16 to neutralise the
    // `scroll-behavior: smooth` this page sets on `html` while it navigates.
    <html lang={LOCALE} data-scroll-behavior="smooth" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <link
          rel="preload"
          href={asset('/fonts/inter-latin-opsz-normal.woff2')}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <Providers>
          <div className="site">
            <SiteNav homeHref={homeHref} />
            <main>{children}</main>
            <LandingFooter homeHref={homeHref} />
          </div>
          {/* Fixed corner overlay — last in the DOM so it lands at the end of
              the tab order. */}
          <VersionSwitch current="v5" label={t6Switch()} />
        </Providers>
      </body>
    </html>
  );
}

function t6Switch() {
  return translatorFor()('v5.switch');
}

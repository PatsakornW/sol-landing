import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

/* The shared sheet first, for the StyleX rules the corner switch is made of;
   then V8's own, which restates the page and wins where they meet. */
import '@/styles/globals.css';
import '@/v8/styles/v8.css';

import { AppConfig, asset } from '@/configs/configs';
import { VersionSwitch } from '@/components/landing/VersionSwitch';
import { BRAND, MARK_DATA_URL } from '@/v8/brand';
import { LOCALE, t8 } from '@/v8/i18n/messages';
import { STAGE_QUERY } from '@/v8/lib/motion';

/* A neo-grotesk for every line on the page, self-hosted by next/font. */
const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-v8',
  display: 'swap',
});

/* Stage or stack, decided before first paint so the pinned scenes never
   flash stacked (or the other way round). The page re-checks on resize. */
const STAGE_SCRIPT = `try{if(matchMedia(${JSON.stringify(STAGE_QUERY)}).matches)document.documentElement.classList.add('is-stage')}catch(e){}`;

export function generateMetadata(): Metadata {
  const title = `${BRAND} — ${t8('meta.tagline')}`;
  const description = t8('meta.description');
  return {
    metadataBase: new URL(AppConfig.baseUrl),
    title,
    description,
    applicationName: BRAND,
    icons: { icon: MARK_DATA_URL, apple: asset('/apple-touch-icon.png') },
    // A design revision, not a second public site — keep it out of the index.
    robots: { index: false, follow: false },
    openGraph: { type: 'website', siteName: BRAND, locale: LOCALE, title, description },
  };
}

export const viewport: Viewport = {
  themeColor: '#000000',
  colorScheme: 'dark',
};

/** Root layout for revision 8 — the glass stage. */
export default function V8Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={LOCALE} className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: STAGE_SCRIPT }} />
      </head>
      <body>
        {children}
        {/* Fixed corner overlay — last in the DOM so it lands at the end of
            the tab order. */}
        <VersionSwitch current="v8" label={t8('switch')} />
      </body>
    </html>
  );
}

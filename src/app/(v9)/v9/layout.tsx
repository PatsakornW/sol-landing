import type { Metadata, Viewport } from 'next';
import { Anton, Nunito } from 'next/font/google';

/* The shared sheet first, for the StyleX rules the corner switch is made of;
   then V9's own, which restates the page and wins where they meet. */
import '@/styles/globals.css';
import '@/v9/styles/v9.css';

import { AppConfig, asset } from '@/configs/configs';
import { VersionSwitch } from '@/components/landing/VersionSwitch';
import { BRAND, MARK_DATA_URL } from '@/v9/brand';
import { LOCALE, t9 } from '@/v9/i18n/messages';

/* A tall condensed poster face for the lines, and a round sans for the rest. */
const anton = Anton({ subsets: ['latin'], weight: '400', variable: '--font-v9-display', display: 'swap' });
const nunito = Nunito({ subsets: ['latin'], weight: ['500', '700', '800', '900'], style: ['normal', 'italic'], variable: '--font-v9', display: 'swap' });

/* With motion allowed the stage pins and plays; decided before first paint. */
const MOTION_SCRIPT = `try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('is-motion')}catch(e){}`;

export function generateMetadata(): Metadata {
  const title = `${BRAND} — ${t9('meta.tagline')}`;
  const description = t9('meta.description');
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
  themeColor: '#14151D',
  colorScheme: 'dark',
};

/** Root layout for revision 9 — the zoom. */
export default function V9Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={LOCALE} className={`${anton.variable} ${nunito.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: MOTION_SCRIPT }} />
      </head>
      <body>
        {children}
        {/* Fixed corner overlay — last in the DOM so it lands at the end of
            the tab order. */}
        <VersionSwitch current="v9" label={t9('switch')} />
      </body>
    </html>
  );
}

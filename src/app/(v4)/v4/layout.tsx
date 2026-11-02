import type { Metadata, Viewport } from 'next';
import { Instrument_Serif, Manrope } from 'next/font/google';

/* The shared sheet first, for the StyleX rules the corner switch is made of;
   then V4's own, which restates the page and wins where they meet. */
import '@/styles/globals.css';
import '@/v4/styles/v4.css';

import { AppConfig, asset } from '@/configs/configs';
import { VersionSwitch } from '@/components/landing/VersionSwitch';
import { BRAND, MARK_DATA_URL } from '@/v4/brand';
import { LOCALE, t4 } from '@/v4/i18n/messages';

/* A tall serif for the headlines, a clean grotesk for the rest. */
const serif = Instrument_Serif({ subsets: ['latin'], weight: '400', variable: '--font-v4-serif', display: 'swap' });
const manrope = Manrope({ subsets: ['latin'], weight: ['400', '500', '600', '800'], variable: '--font-v4', display: 'swap' });

export function generateMetadata(): Metadata {
  const title = `${BRAND} — ${t4('meta.tagline')}`;
  const description = t4('meta.description');
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
  themeColor: '#151515',
  colorScheme: 'dark',
};

/** Root layout for revision 4 — the black vault. */
export default function V4Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={LOCALE} className={`${serif.variable} ${manrope.variable}`}>
      <body>
        {children}
        {/* Fixed corner overlay — last in the DOM so it lands at the end of
            the tab order. */}
        <VersionSwitch current="v4" label={t4('switch')} />
      </body>
    </html>
  );
}

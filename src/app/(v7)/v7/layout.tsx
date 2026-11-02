import type { Metadata, Viewport } from 'next';
import { Figtree } from 'next/font/google';

/* The shared sheet first, for the StyleX rules the corner switch is made of;
   then V7's own, which restates the page and wins where they meet. */
import '@/styles/globals.css';
import '@/v7/styles/v7.css';

import { AppConfig, asset } from '@/configs/configs';
import { VersionSwitch } from '@/components/landing/VersionSwitch';
import { BRAND, MARK_DATA_URL } from '@/v7/brand';
import { LOCALE, t7 } from '@/v7/i18n/messages';

/* A geometric sans for every line on the page, self-hosted by next/font. */
const figtree = Figtree({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-figtree-v7',
  display: 'swap',
});

export function generateMetadata(): Metadata {
  const title = `${BRAND} — ${t7('meta.tagline')}`;
  const description = t7('meta.description');
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
  themeColor: '#FFFFFF',
  colorScheme: 'light',
};

/** Root layout for revision 9 — the card stack. */
export default function V9Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={LOCALE} className={figtree.variable}>
      <body>
        {children}
        {/* Fixed corner overlay — last in the DOM so it lands at the end of
            the tab order. */}
        <VersionSwitch current="v7" label={t7('switch')} />
      </body>
    </html>
  );
}

'use client';

import { useEffect } from 'react';
import { translatorFor } from '@/v5/i18n/messages';

/**
 * V5 error boundary.
 *
 * In the page's own classes rather than the shared `StatusPage`: that one is
 * StyleX on the shared tokens, which this revision's document never binds.
 */
export default function V6Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = translatorFor();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="sec">
      <header className="sec__head">
        <h1 className="sec__title">{t('error.title')}</h1>
        <p className="sec__lead">{t('error.body')}</p>
        <div className="sec__action">
          <button type="button" className="btn btn--primary" onClick={reset}>
            {t('error.retry')}
          </button>
        </div>
      </header>
    </section>
  );
}

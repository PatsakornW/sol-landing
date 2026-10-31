'use client';

import { useEffect } from 'react';
import { translatorFor } from '@/v2/i18n/messages';
import { StatusPage, StatusRetry } from '@/components/landing/StatusPage';

/** V2 error boundary. */
export default function V2Error({
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
    <StatusPage
      title={t('error.title')}
      body={t('error.body')}
      action={<StatusRetry onClick={reset}>{t('error.retry')}</StatusRetry>}
    />
  );
}

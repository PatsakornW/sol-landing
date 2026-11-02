'use client';

import { useEffect } from 'react';
import { translatorFor } from '@/v6/i18n/messages';
import { StatusPage, StatusRetry } from '@/components/landing/StatusPage';

/** V6 error boundary. */
export default function V7Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = translatorFor();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return <StatusPage title={t('error.title')} body={t('error.body')} action={<StatusRetry onClick={reset}>{t('error.retry')}</StatusRetry>} />;
}

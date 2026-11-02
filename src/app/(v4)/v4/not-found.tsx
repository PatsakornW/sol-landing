import { StatusHome, StatusPage } from '@/components/landing/StatusPage';
import { translatorFor } from '@/v4/i18n/messages';

/** The 404 inside the V4 tree. */
export default function V4NotFound() {
  const t = translatorFor();

  return (
    <StatusPage
      eyebrow="404"
      title={t('notFound.title')}
      body={t('notFound.body')}
      action={<StatusHome href="/v4">{t('notFound.home')}</StatusHome>}
    />
  );
}

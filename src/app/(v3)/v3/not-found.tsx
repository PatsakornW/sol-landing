import { StatusHome, StatusPage } from '@/components/landing/StatusPage';
import { translatorFor } from '@/v3/i18n/messages';

/** The 404 inside the V3 tree. */
export default function V3NotFound() {
  const t = translatorFor();

  return (
    <StatusPage
      eyebrow="404"
      title={t('notFound.title')}
      body={t('notFound.body')}
      action={<StatusHome href="/v3">{t('notFound.home')}</StatusHome>}
    />
  );
}

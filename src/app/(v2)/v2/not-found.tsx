import { StatusHome, StatusPage } from '@/components/landing/StatusPage';
import { translatorFor } from '@/v2/i18n/messages';

/** The 404 inside the V2 tree. */
export default function V2NotFound() {
  const t = translatorFor();

  return (
    <StatusPage
      eyebrow="404"
      title={t('notFound.title')}
      body={t('notFound.body')}
      action={<StatusHome href="/v2">{t('notFound.home')}</StatusHome>}
    />
  );
}

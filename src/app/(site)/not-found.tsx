import { StatusHome, StatusPage } from '@/components/landing/StatusPage';
import { translatorFor } from '@/v2/i18n/messages';

/** The 404 inside the site tree. */
export default function SiteNotFound() {
  const t = translatorFor();

  return (
    <StatusPage
      eyebrow="404"
      title={t('notFound.title')}
      body={t('notFound.body')}
      action={<StatusHome href="/">{t('notFound.home')}</StatusHome>}
    />
  );
}

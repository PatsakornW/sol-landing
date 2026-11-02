import { StatusHome, StatusPage } from '@/components/landing/StatusPage';
import { translatorFor } from '@/v9/i18n/messages';

/** The 404 inside the V9 tree. */
export default function V9NotFound() {
  const t = translatorFor();

  return <StatusPage eyebrow="404" title={t('notFound.title')} body={t('notFound.body')} action={<StatusHome href="/v9">{t('notFound.home')}</StatusHome>} />;
}

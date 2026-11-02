import { StatusHome, StatusPage } from '@/components/landing/StatusPage';
import { translatorFor } from '@/v7/i18n/messages';

/** The 404 inside the V7 tree. */
export default function V9NotFound() {
  const t = translatorFor();

  return <StatusPage eyebrow="404" title={t('notFound.title')} body={t('notFound.body')} action={<StatusHome href="/v7">{t('notFound.home')}</StatusHome>} />;
}

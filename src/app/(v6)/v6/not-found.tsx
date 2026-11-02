import { StatusHome, StatusPage } from '@/components/landing/StatusPage';
import { translatorFor } from '@/v6/i18n/messages';

/** The 404 inside the V6 tree. */
export default function V7NotFound() {
  const t = translatorFor();

  return <StatusPage eyebrow="404" title={t('notFound.title')} body={t('notFound.body')} action={<StatusHome href="/v6">{t('notFound.home')}</StatusHome>} />;
}

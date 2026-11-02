import { StatusHome, StatusPage } from '@/components/landing/StatusPage';
import { translatorFor } from '@/v8/i18n/messages';

/** The 404 inside the V8 tree. */
export default function V8NotFound() {
  const t = translatorFor();

  return <StatusPage eyebrow="404" title={t('notFound.title')} body={t('notFound.body')} action={<StatusHome href="/v8">{t('notFound.home')}</StatusHome>} />;
}

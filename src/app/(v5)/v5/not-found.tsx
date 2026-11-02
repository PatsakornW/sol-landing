import { translatorFor } from '@/v5/i18n/messages';

/** The 404 inside the V5 tree, in the page's own classes. */
export default function V6NotFound() {
  const t = translatorFor();

  return (
    <section className="sec">
      <header className="sec__head">
        <p className="sec__eyebrow">404</p>
        <h1 className="sec__title">{t('notFound.title')}</h1>
        <p className="sec__lead">{t('notFound.body')}</p>
        <div className="sec__action">
          <a href="/v5/" className="btn btn--primary">
            {t('notFound.home')}
          </a>
        </div>
      </header>
    </section>
  );
}

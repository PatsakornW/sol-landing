import { BRAND, BrandMark } from '../brand';
import { t8 } from '../i18n/messages';

/**
 * The footer, open onto the page's own field so the light runs on without a
 * seam: the name set huge in a grey gradient at the right, and one line under
 * it — the tagline, the mark and the copyright — with the risk line last.
 */
export function Footer() {
  return (
    <footer className="foot" id="v8-foot">
      <p className="foot__word" aria-hidden="true">
        {BRAND}
      </p>
      <div className="foot__row">
        <p className="foot__tag">{t8('footer.tagline')}</p>
        <span className="foot__mark" aria-hidden="true">
          <BrandMark />
        </span>
        <p className="foot__end">
          <span className="foot__copy">{t8('footer.copyright')}</span>
        </p>
      </div>
      <p className="foot__fine">{t8('footer.disclaimer')}</p>
    </footer>
  );
}

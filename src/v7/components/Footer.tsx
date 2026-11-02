import { AppConfig } from '@/configs/configs';
import { BrandMark } from '../brand';
import { t7 } from '../i18n/messages';
import { DESKS } from '../lib/content';
import { ArrowUp } from './Icons';

/** The black footer: big links, the desks, the rest of the page, and the address. */
export function Footer({ onJoin }: { onJoin: () => void }) {
  return (
    <footer className="foot" data-nav="dark">
      <BrandMark className="foot__mark" />
      <div className="foot__grid">
        <nav className="foot__big" aria-label={t7('footer.explore')}>
          <a href="#top">{t7('footer.home')}</a>
          <a href="#markets">{t7('footer.markets')}</a>
        </nav>
        <div className="foot__col">
          <h3>{t7('footer.markets')}</h3>
          <ul>
            {DESKS.map((k) => (
              <li key={k}>
                <a href="#markets">{t7(`categories.${k}.name`)}</a>
              </li>
            ))}
          </ul>
        </div>
        <div className="foot__col">
          <h3>{t7('footer.more')}</h3>
          <ul>
            <li>
              <a href="#platform">{t7('footer.platform')}</a>
            </li>
            <li>
              <a href="#how">{t7('footer.how')}</a>
            </li>
            <li>
              <a href="#faq">{t7('nav.faq')}</a>
            </li>
            <li>
              <button type="button" onClick={onJoin}>
                {t7('nav.waitlist')}
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div className="foot__mail">
        <p>{t7('footer.emailUs')}</p>
        <a href={`mailto:${AppConfig.email}`}>{AppConfig.email}</a>
      </div>
      <div className="foot__base">
        <a className="foot__top" href="#top">
          <i>
            <ArrowUp />
          </i>
          {t7('footer.top')}
        </a>
        <div className="foot__legal">
          <p>{t7('footer.disclaimer')}</p>
          <p>{t7('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
}

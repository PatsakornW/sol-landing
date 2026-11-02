import { AppConfig, asset } from '@/configs/configs';
import { BRAND } from '../brand';
import { t4 } from '../i18n/messages';
import { Btn } from './Btn';
import { PixelArrow, PixelUp, Spark, XLogo } from './Icons';
import { LINKS, type LinkKey } from './Nav';

/**
 * The footer: a dark card under a marquee of the name in 3D — a pixel arrow
 * and the spark between each pass — then the contact address, the sections,
 * the waitlist, X and the way back up, with the risk line last.
 */
export function Footer({ onGo, onJoin }: { onGo: (key: LinkKey) => void; onJoin: () => void }) {
  const pass = (
    <span className="marquee__pass" aria-hidden="true">
      <span className="marquee__arrow">
        <PixelArrow />
      </span>
      <span className="marquee__spark">
        <Spark />
      </span>
      <img src={asset('/v4/word.webp')} alt="" />
    </span>
  );
  return (
    <footer className="foot" id="v4-contact">
      <div className="foot__card">
        <div className="marquee">
          <div className="marquee__track">
            {pass}
            {pass}
            {pass}
          </div>
          <span className="sr-only">{BRAND}</span>
        </div>
        <div className="foot__grid">
          <div className="foot__contact">
            <p className="foot__label">{t4('footer.contact')}</p>
            <a href={`mailto:${t4('footer.email')}`}>{t4('footer.email')}</a>
          </div>
          <ul className="foot__links">
            {LINKS.map((k) => (
              <li key={k}>
                <button type="button" onClick={() => onGo(k)}>
                  {t4(`nav.links.${k}`)}
                </button>
              </li>
            ))}
          </ul>
          <Btn className="foot__join" onClick={onJoin} dialog>
            {t4('footer.join')}
          </Btn>
          <div className="foot__socials">
            <a href={AppConfig.social.x.url} target="_blank" rel="noopener noreferrer" aria-label="X">
              <XLogo />
            </a>
          </div>
          <button type="button" className="foot__top" onClick={() => onGo('main')} aria-label={t4('footer.top')}>
            <PixelUp />
          </button>
        </div>
        <div className="foot__bar">
          <p>{t4('footer.copyright')}</p>
          <p>{t4('footer.disclaimer')}</p>
        </div>
      </div>
    </footer>
  );
}

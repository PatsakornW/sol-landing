import { BrandMark, BrandWordmark } from '@/v5/components/brand/BrandMark';
import { AppConfig } from '@/configs/configs';
import { translations } from '@/v5/i18n/messages';
import { HugeiconsIcon, TwitterIcon, DiscordIcon, InstagramIcon } from '@/v5/lib/icons';

// Where each explore link goes in the trading app.
const EXPLORE_LINKS = [
  { key: 'markets', path: '/' },
  { key: 'live', path: '/live' },
  { key: 'news', path: '/news' },
] as const;

const SOCIALS = [
  { key: 'x', label: AppConfig.social.x.label, href: AppConfig.social.x.url, icon: TwitterIcon },
  {
    key: 'discord',
    label: AppConfig.social.discord.label,
    href: AppConfig.social.discord.url,
    icon: DiscordIcon,
  },
  {
    key: 'instagram',
    label: AppConfig.social.instagram.label,
    href: AppConfig.social.instagram.url,
    icon: InstagramIcon,
  },
] as const;

/**
 * Marketing footer — brand + explore links + follow-us socials + contact, on
 * the page's split grid (`.foot` in _site.scss).
 *
 * The source app carried a referral code into every app link; this site has
 * no referral capture, so the links are the plain app URLs.
 */
export function LandingFooter({ homeHref }: { homeHref: string }) {
  const t = translations();

  return (
    <footer className="foot">
      <div className="foot__inner">
        <div>
          <a href={homeHref} className="foot__brand-link">
            <BrandMark size={24} />
            <BrandWordmark />
          </a>
          <p className="foot__tagline">{t('footer.tagline')}</p>
        </div>

        <div className="foot__links">
          <nav className="foot__col" aria-label={t('footer.explore')}>
            <span className="foot__col-title">{t('footer.explore')}</span>
            {EXPLORE_LINKS.map((link) => (
              <a key={link.key} href={`${AppConfig.appUrl}${link.path}`} className="foot__link">
                {t(`nav.${link.key}`)}
              </a>
            ))}
            <a href={`mailto:${AppConfig.email}`} className="foot__link">
              {t('nav.contact')}
            </a>
          </nav>

          <div className="foot__col">
            <span className="foot__col-title">{t('footer.follow')}</span>
            <div className="foot__socials">
              {SOCIALS.map((social) => (
                <a
                  key={social.key}
                  href={social.href}
                  className="foot__social"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                >
                  <HugeiconsIcon icon={social.icon} size={18} strokeWidth={1.8} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="foot__bottom">
        <span>{t('footer.copyright')}</span>
        <span>{t('footer.disclaimer')}</span>
      </div>
    </footer>
  );
}

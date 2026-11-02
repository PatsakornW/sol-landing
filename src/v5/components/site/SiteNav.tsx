'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, m as motion } from 'motion/react';
import { BrandMark, BrandWordmark } from '@/v5/components/brand/BrandMark';
import { AppConfig } from '@/configs/configs';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import { translations } from '@/v5/i18n/messages';
import { HugeiconsIcon, ArrowRightIcon, MenuIcon, XIcon } from '@/v5/lib/icons';

// How it works + FAQ are sections on the page; Contact is an email.
const MENU = [
  { key: 'howItWorks', href: '#how-it-works' },
  { key: 'faq', href: '#faq' },
  { key: 'contact', href: `mailto:${AppConfig.email}` },
] as const;

// A dead band rather than one threshold: a single cut-off sits where a wheel
// notch lands repeatedly, and the header would flicker between states.
const NAV_ENTER_AT = 48;
const NAV_EXIT_AT = 16;

/**
 * The header and its phone drawer.
 *
 * The source app put a language switch in the capsule of links; this site is
 * English only, so the capsule holds the links alone.
 */
export function SiteNav({ homeHref }: { homeHref: string }) {
  const t = translations();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  useEscapeKey(closeMenu, menuOpen);

  useEffect(() => {
    const onScroll = () =>
      setScrolled((prev) => window.scrollY > (prev ? NAV_EXIT_AT : NAV_ENTER_AT));
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock background scroll while the drawer is open.
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  return (
    <>
      <header className={`nav${scrolled ? ' is-scrolled' : ''}`}>
        <div className="nav__inner">
          <a href={homeHref} className="nav__brand">
            {/* The page's opening flies its mark into this one. */}
            <BrandMark size={26} data-opening-target="" />
            <BrandWordmark className="nav__wordmark" />
          </a>
          <div className="nav__menu">
            <nav className="nav__links" aria-label={t('nav.menu')}>
              {MENU.map((item) => (
                <a key={item.key} href={item.href} className="nav__link">
                  {t(`nav.${item.key}`)}
                </a>
              ))}
            </nav>
          </div>
          <div className="nav__actions">
            <a href="#join" className="btn btn--primary btn--sm">
              {t('nav.waitlist')}
            </a>
            <button
              type="button"
              className="nav__burger"
              onClick={() => setMenuOpen(true)}
              aria-label={t('nav.menu')}
              aria-expanded={menuOpen}
            >
              <HugeiconsIcon icon={MenuIcon} size={20} strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="drawer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeMenu}
          >
            <motion.aside
              className="drawer__panel"
              role="dialog"
              aria-modal="true"
              aria-label={t('nav.menu')}
              initial={{ y: -16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -8, opacity: 0 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="drawer__head">
                <span className="nav__brand">
                  <BrandMark size={26} />
                  <BrandWordmark className="nav__wordmark" />
                </span>
                <button
                  type="button"
                  className="nav__burger"
                  onClick={closeMenu}
                  aria-label={t('nav.close')}
                >
                  <HugeiconsIcon icon={XIcon} size={20} strokeWidth={1.8} />
                </button>
              </div>
              <nav className="drawer__links" aria-label={t('nav.menu')}>
                {MENU.map((item) => (
                  <a key={item.key} href={item.href} className="drawer__link" onClick={closeMenu}>
                    {t(`nav.${item.key}`)}
                  </a>
                ))}
              </nav>
              <div className="drawer__foot">
                <a href="#join" className="btn btn--primary btn--lg" onClick={closeMenu}>
                  {t('nav.waitlist')}
                  <HugeiconsIcon icon={ArrowRightIcon} size={18} strokeWidth={2} />
                </a>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

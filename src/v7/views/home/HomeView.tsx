'use client';

import { useCallback, useEffect, useState } from 'react';
import { Duo } from '../../components/Duo';
import { Faq } from '../../components/Faq';
import { Film } from '../../components/Film';
import { Footer } from '../../components/Footer';
import { Hero } from '../../components/Hero';
import { Impact } from '../../components/Impact';
import { JoinDialog } from '../../components/JoinDialog';
import { Loader } from '../../components/Loader';
import { Journey } from '../../components/Journey';
import { Markets } from '../../components/Markets';
import { Menu } from '../../components/Menu';
import { Nav } from '../../components/Nav';
import { Outro } from '../../components/Outro';
import { scrollToTarget, Smooth } from '../../components/Smooth';
import { Talk } from '../../components/Talk';
import type { Desk } from '../../lib/content';
import { ScrollTrigger } from '../../lib/motion';

/**
 * Revision 9 — the card stack, carrying the sols_market landing page's words.
 *
 * A white page of rounded full-screen cards and blocks: a disc still life, a
 * close-up that holds while its line rolls through what has a price, the
 * waitlist card sliding over it, a
 * picture that shrinks into the platform block, four figures that roll in a
 * pill, two statements with discs falling between them, the desks as a big
 * list, the questions, and a closing card before the black footer. The menu and the waitlist
 * open as white sheets over the page. A curtain with the mark in 3D holds until
 * the hero's scene has drawn, then lifts and the hero comes in.
 */
export function HomeView() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const [picked, setPicked] = useState<Desk[]>([]);
  const [heroReady, setHeroReady] = useState(false);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const closeJoin = useCallback(() => setJoinOpen(false), []);
  const heroDrawn = useCallback(() => setHeroReady(true), []);
  // The curtain is lifting: the hero's headline and scene come in.
  const reveal = useCallback(() => {
    document.documentElement.classList.add('is-ready');
    ScrollTrigger.refresh();
  }, []);

  // Lines and blocks marked `.rv` rise in as they enter.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: '0px 0px -12% 0px' },
    );
    document.querySelectorAll('.rv').forEach((el) => io.observe(el));
    // Whatever happens to the hero's scene, the curtain does not wait forever.
    const giveUp = window.setTimeout(() => setHeroReady(true), 7000);
    // Late images and fonts move the pins; measure again once they settle.
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 900);
    return () => {
      io.disconnect();
      window.clearTimeout(t);
      window.clearTimeout(giveUp);
    };
  }, []);

  return (
    <>
      <Smooth />
      <Loader ready={heroReady} onDone={reveal} />
      <Nav onMenu={() => setMenuOpen(true)} onJoin={() => setJoinOpen(true)} />
      <main>
        <Hero onReady={heroDrawn} />
        <div className="pair">
          <Film />
          <div className="pair__hold" aria-hidden="true" />
          <Talk
            picked={picked}
            onToggle={(d) => setPicked((p) => (p.includes(d) ? p.filter((x) => x !== d) : [...p, d]))}
            onJoin={() => setJoinOpen(true)}
          />
        </div>
        <Journey />
        <Impact />
        <Duo />
        <Markets
          onPick={(d) => {
            setPicked((p) => (p.includes(d) ? p : [...p, d]));
            setJoinOpen(true);
          }}
        />
        <Faq />
        <Outro onJoin={() => setJoinOpen(true)} />
      </main>
      <Footer onJoin={() => setJoinOpen(true)} />
      <Menu
        open={menuOpen}
        onClose={closeMenu}
        onGo={(hash) => {
          closeMenu();
          scrollToTarget(hash);
        }}
        onJoin={() => {
          closeMenu();
          setJoinOpen(true);
        }}
      />
      <JoinDialog open={joinOpen} picked={picked} onClose={closeJoin} />
    </>
  );
}

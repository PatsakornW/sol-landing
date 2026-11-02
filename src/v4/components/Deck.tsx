'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * A deck's slider below 1024px: which card is in view, and a way to move to
 * one. On a wide screen the deck doesn't scroll, so this stays on the first.
 */
export function useDeck() {
  const ref = useRef<HTMLOListElement>(null);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const list = ref.current;
    if (!list) return;
    const onScroll = () => {
      const cards = [...list.children] as HTMLElement[];
      const at = list.scrollLeft + parseFloat(getComputedStyle(list).paddingLeft);
      const gaps = cards.map((card) => Math.abs(card.offsetLeft - at));
      const near = gaps.indexOf(Math.min(...gaps));
      // At the far end the last card can't reach the start, so it takes the dot there.
      setSlide(list.scrollLeft >= list.scrollWidth - list.clientWidth - 2 ? cards.length - 1 : near);
    };
    list.addEventListener('scroll', onScroll, { passive: true });
    return () => list.removeEventListener('scroll', onScroll);
  }, []);

  const toSlide = useCallback((i: number) => {
    const list = ref.current;
    const card = list?.children[i] as HTMLElement | undefined;
    if (list && card) list.scrollTo({ left: card.offsetLeft - parseFloat(getComputedStyle(list).paddingLeft), behavior: 'smooth' });
  }, []);

  return { ref, slide, toSlide };
}

/** The dots under a deck's slider; each one moves the slider to its card. */
export function DeckDots({ count, slide, onPick, label }: { count: number; slide: number; onPick: (i: number) => void; label: (i: number) => string }) {
  return (
    <div className="deck__dots">
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          className={i === slide ? 'is-on' : undefined}
          onClick={() => onPick(i)}
          aria-label={label(i)}
          aria-current={i === slide || undefined}
        />
      ))}
    </div>
  );
}

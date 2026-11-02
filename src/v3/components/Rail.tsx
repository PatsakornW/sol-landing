'use client';

import { useEffect, useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { media } from '../../styles/breakpoints.stylex';
import { bp, V3 } from '../styles/eclipse.stylex';
import { useReady } from './Ready';

const styles = stylex.create({
  rail: {
    position: 'fixed',
    right: 20,
    top: '50%',
    translate: '0 -50%',
    zIndex: 55,
    display: { default: 'flex', [bp.max1180]: 'none' },
    flexDirection: 'column',
    gap: 6,
    opacity: { default: 0, [media.noScript]: 1, [media.reduce]: 1 },
    transitionProperty: 'opacity',
    transitionDuration: { default: '1s', [media.reduce]: '1ms' },
    transitionDelay: { default: '2.8s', [media.reduce]: '0s' },
  },
  railOn: {
    opacity: 1,
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 12,
    paddingBlock: 5,
    paddingInline: 0,
    textDecorationLine: 'none',
    fontSize: 12.5,
    color: V3.dust,
    outlineWidth: { default: null, ':focus-visible': 2 },
    outlineStyle: { default: null, ':focus-visible': 'solid' },
    outlineColor: { default: null, ':focus-visible': V3.corona },
    outlineOffset: { default: null, ':focus-visible': 3 },
    borderRadius: 6,
  },
  /* The names only show while the pointer is over the rail, or while one of
     the links has the keyboard. */
  label: {
    opacity: 0,
    translate: '8px 0',
    transitionProperty: 'opacity, translate',
    transitionDuration: '0.35s',
    transitionTimingFunction: `ease, ${V3.ease}`,
    whiteSpace: 'nowrap',
    paddingBlock: 3,
    paddingInline: 9,
    borderRadius: V3.pill,
    backgroundColor: 'rgba(3, 3, 9, 0.7)',
  },
  labelOn: {
    opacity: 1,
    translate: '0 0',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: '50%',
    backgroundColor: 'rgba(239, 237, 250, 0.28)',
    transitionProperty: 'background-color, box-shadow, scale',
    transitionDuration: '0.4s',
  },
  dotOn: {
    backgroundColor: V3.corona,
    boxShadow: '0 0 14px 3px rgba(255, 214, 160, 0.7)',
    scale: 1.35,
  },
});

export type RailItem = { id: string; label: string };

/**
 * One dot per section, down the right edge; the lit one is where the reader
 * is. The names appear when the rail is hovered or focused.
 */
export function Rail({ label, items }: { label: string; items: readonly RailItem[] }) {
  const ready = useReady();
  const [active, setActive] = useState<string | null>(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((node): node is HTMLElement => node !== null);
    if (sections.length === 0 || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav
      {...stylex.props(styles.rail, ready && styles.railOn)}
      aria-label={label}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          {...stylex.props(styles.link)}
          onFocus={() => setFocused(item.id)}
          onBlur={() => setFocused((current) => (current === item.id ? null : current))}
          aria-current={active === item.id ? 'location' : undefined}
        >
          <span {...stylex.props(styles.label, (hovered || focused === item.id) && styles.labelOn)}>
            {item.label}
          </span>
          <i {...stylex.props(styles.dot, active === item.id && styles.dotOn)} />
        </a>
      ))}
    </nav>
  );
}

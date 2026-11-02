'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

/**
 * Fades its content up once it scrolls into view.
 *
 * The hidden state is CSS-only and applies under `html.js` (set by the layout's
 * boot script), so the server HTML always renders the content visible: without
 * JavaScript nothing is hidden, and a framer-motion `initial` would have written
 * `opacity: 0` into the prerendered markup instead. Reduced motion is handled in
 * the stylesheet.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = 'div',
}: {
  children: ReactNode;
  className?: string;
  /** Stagger offset in milliseconds. */
  delay?: number;
  as?: 'div' | 'li' | 'header';
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -12% 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const style = delay ? ({ '--reveal-delay': `${delay}ms` } as CSSProperties) : undefined;

  return (
    <Tag ref={ref as never} className={className} data-reveal={shown ? 'in' : ''} style={style}>
      {children}
    </Tag>
  );
}

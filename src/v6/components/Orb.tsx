'use client';

import { useEffect, useRef, useState, type MutableRefObject } from 'react';
import * as stylex from '@stylexjs/stylex';
import { icon } from '../lib/assets';
import { mountMark, type MarkHandle } from '../lib/mark3d';

const styles = stylex.create({
  host: { position: 'relative', width: '100%', height: '100%' },
  live: { position: 'absolute', inset: 0 },
  still: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    transitionProperty: 'opacity',
    transitionDuration: '0.4s',
  },
  gone: { opacity: 0 },
});

/**
 * The brand mark as a live 3D object. Until `three` is up — and wherever WebGL
 * is not — the rendered still of the same pair holds the box. `progress`, if
 * given, is written by a parent each frame to turn the mark with the scroll.
 */
export function Orb({ progress, spin = 0, idle = true, jelly = false, style }: { progress?: MutableRefObject<number>; spin?: number; idle?: boolean; jelly?: boolean; style?: stylex.StyleXStyles }) {
  const host = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let handle: MarkHandle | null = null;
    let disposed = false;
    let raf = 0;
    mountMark(el, { spin, idle, jelly })
      .then((h) => {
        if (disposed) {
          h.dispose();
          return;
        }
        handle = h;
        setLive(true);
        if (progress) {
          const sync = () => {
            raf = requestAnimationFrame(sync);
            h.setProgress(progress.current);
          };
          sync();
        }
      })
      .catch(() => {});
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      handle?.dispose();
    };
  }, [progress, spin, idle, jelly]);

  return (
    <div {...stylex.props(styles.host, style)}>
      <img src={icon('sun')} alt="" {...stylex.props(styles.still, live && styles.gone)} />
      <div ref={host} {...stylex.props(styles.live)} />
    </div>
  );
}

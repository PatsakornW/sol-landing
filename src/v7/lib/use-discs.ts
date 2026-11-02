'use client';

import { useEffect, useRef, type RefObject } from 'react';
import { mountDiscs, type DiscPreset, type DiscStage } from './discs';

/**
 * Mounts a disc scene on a canvas for the component's lifetime. A `lazy` scene
 * waits until its canvas comes within a screen of the viewport, so only the
 * hero's is built while the page loads. `onReady` fires once the first frame
 * is drawn — or once it is clear none will be.
 */
export function useDiscs(canvas: RefObject<HTMLCanvasElement | null>, preset: DiscPreset, opts: { lazy?: boolean; onReady?: () => void } = {}) {
  const stage = useRef<DiscStage | null>(null);
  const ready = useRef(opts.onReady);
  ready.current = opts.onReady;
  const lazy = opts.lazy ?? false;

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    let dead = false;
    const mount = () => {
      mountDiscs(el, preset)
        .then((s) => {
          if (dead) s.dispose();
          else stage.current = s;
        })
        .catch(() => {
          // No WebGL: the card keeps its CSS gradient.
        })
        .finally(() => {
          if (!dead) ready.current?.();
        });
    };
    let io: IntersectionObserver | null = null;
    if (lazy) {
      io = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return;
          io?.disconnect();
          mount();
        },
        { rootMargin: '100% 0px' },
      );
      io.observe(el);
    } else {
      mount();
    }
    return () => {
      dead = true;
      io?.disconnect();
      stage.current?.dispose();
      stage.current = null;
    };
  }, [canvas, preset, lazy]);
  return stage;
}

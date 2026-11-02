'use client';

import { useEffect, useRef } from 'react';
import { startField, type FieldState } from '../lib/field';
import { reducedMotion } from '../lib/motion';

/** A canvas the field draws on; it keeps a CSS gradient until WebGL is up. */
export function Field({ state, className }: { state: FieldState; className: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    return startField(el, state, reducedMotion()) ?? undefined;
  }, [state]);

  return <canvas ref={canvas} className={className} aria-hidden="true" />;
}

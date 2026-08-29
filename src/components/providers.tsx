'use client';

import { LazyMotion, MotionConfig } from 'motion/react';
import { hugeicon } from '@/lib/hugeicon';
import { IconProvider, type IconComponent, type IconName } from '@/lib/icon-context';
import { ArrowRightIcon, ChevronDownIcon, CheckIcon, MailIcon, XIcon } from '@/lib/icons';

/* Features load in their own chunk. The hero does not animate on first paint,
   so the Motion runtime stays off the critical path. `domMax` covers the FAQ
   accordion's height tween; `domAnimation` would drop it. */
const loadMotionFeatures = () => import('motion/react').then((mod) => mod.domMax);

/* @fluid ships Lucide as its default icon set. The landing page speaks
   Hugeicons, so the slots its components actually render are registered here. */
const icons: Partial<Record<IconName, IconComponent>> = {
  'chevron-right': hugeicon(ArrowRightIcon),
  'chevron-down': hugeicon(ChevronDownIcon),
  check: hugeicon(CheckIcon),
  mail: hugeicon(MailIcon),
  x: hugeicon(XIcon),
};

/**
 * Client boundary for the design system: reduced-motion preference and the icon
 * swap.
 *
 * Two providers used to sit here and no longer need to. `ShapeProvider` held the
 * corner scale in React state and wrote it to the document as a custom property;
 * it is `styles/shape.stylex.ts` now — variables with a theme, which is what it
 * was emulating. `SurfaceProvider` published an elevation level that nothing
 * ever read.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={loadMotionFeatures} strict>
      <MotionConfig reducedMotion="user">
        <IconProvider icons={icons}>{children}</IconProvider>
      </MotionConfig>
    </LazyMotion>
  );
}

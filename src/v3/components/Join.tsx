'use client';

import { useCallback, useRef, type ReactNode } from 'react';
import * as stylex from '@stylexjs/stylex';
import { asset } from '@/configs/configs';
import { font } from '../../styles/tokens.stylex';
import { clamp01, useScrollFrame } from '../hooks/use-scroll-frame';
import { V3 } from '../styles/eclipse.stylex';
import { shared } from '../styles/shared.styles';
import { DemoForm, type FormLabels } from './DemoForm';

/* The horizon's height above the section's bottom, and the photo's width. The
   sun in the photo sits 34.9% of its width below its top edge. */
const HORIZON = 'min(20vh, 200px)';
const PHOTO = 'max(100vw, 980px)';

const styles = stylex.create({
  join: {
    position: 'relative',
    minHeight: 'max(122svh, 1000px)',
    display: 'grid',
    alignItems: 'start',
    isolation: 'isolate',
    overflow: 'clip',
    paddingTop: 'clamp(120px, 16vh, 180px)',
  },
  dawn: {
    position: 'absolute',
    inset: 0,
    zIndex: -1,
    pointerEvents: 'none',
  },
  photo: {
    position: 'absolute',
    left: '50%',
    top: `calc(100% - ${HORIZON} - ${PHOTO} * 0.349)`,
    width: PHOTO,
    maxWidth: 'none',
    height: 'auto',
    translate: '-50% 0',
    transformOrigin: '50% 62%',
    maskImage: 'linear-gradient(to bottom, transparent, #000 30%)',
    WebkitMaskImage: 'linear-gradient(to bottom, transparent, #000 30%)',
  },
  fade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 'min(14vh, 140px)',
    backgroundImage: 'linear-gradient(transparent, #020206)',
  },
  /* The sun clears the horizon over the last stretch of the page's scroll. */
  sun: {
    position: 'absolute',
    left: '50%',
    bottom: HORIZON,
    width: 760,
    height: 760,
    translate: '-50% 50%',
    mixBlendMode: 'screen',
    backgroundImage:
      'radial-gradient(circle, rgba(255, 250, 240, 0.95) 0 1%, rgba(255, 214, 160, 0.55) 4%, rgba(255, 170, 110, 0.2) 12%, rgba(220, 116, 236, 0.09) 26%, transparent 52%)',
  },
  inner: {
    textAlign: 'center',
  },
  title: {
    margin: 0,
    fontFamily: font.display,
    fontWeight: 600,
    fontSize: 'clamp(50px, 8.6vw, 148px)',
    lineHeight: 0.94,
    letterSpacing: '-0.045em',
    textWrap: 'balance',
  },
  titleEm: {
    fontStyle: 'normal',
    fontWeight: 300,
  },
  sub: {
    marginInline: 'auto',
    maxWidth: '52ch',
  },
  card: {
    width: 'min(560px, 100%)',
    marginTop: 'clamp(40px, 5vw, 64px)',
    marginInline: 'auto',
    padding: 'clamp(20px, 2.6vw, 30px)',
    borderRadius: 24,
    textAlign: 'left',
    backgroundColor: 'rgba(10, 10, 29, 0.55)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: V3.line2,
    backdropFilter: 'blur(18px)',
    WebkitBackdropFilter: 'blur(18px)',
  },
  cardTitle: {
    margin: 0,
    fontSize: 16,
    fontWeight: 600,
  },
  cardBody: {
    margin: 0,
    marginTop: 2,
    color: V3.dust,
    fontSize: 15,
  },
});

export type JoinLabels = {
  titleA: string;
  titleB: string;
  sub: string;
  cardTitle: string;
  cardBody: string;
  submit: string;
  note: ReactNode;
  form: FormLabels;
};

/**
 * The close: a dawn, and the one email the page promises.
 *
 * The sun rises as the reader reaches the end of the page; the photo lifts a
 * little with it. Both are written to from the frame loop and hold still for
 * a reader who asked for less motion.
 */
export function Join({ labels }: { labels: JoinLabels }) {
  const joinRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLImageElement>(null);
  const sunRef = useRef<HTMLDivElement>(null);

  const onFrame = useCallback((reduce: boolean) => {
    const join = joinRef.current;
    if (!join || reduce) return;
    const bottom = join.getBoundingClientRect().bottom;
    const vh = window.innerHeight;
    const jp = clamp01((1.2 * vh - bottom) / (0.38 * vh));
    const lift = ((1 - jp) * 90).toFixed(2);
    if (photoRef.current) {
      photoRef.current.style.transform = `translateY(${lift}px) scale(${(1.06 - jp * 0.06).toFixed(4)})`;
    }
    if (sunRef.current) {
      sunRef.current.style.transform = `translateY(${lift}px)`;
      sunRef.current.style.opacity = (0.15 + jp * 0.85).toFixed(3);
    }
  }, []);
  useScrollFrame(onFrame);

  return (
    <section
      ref={joinRef}
      id="join"
      {...stylex.props(styles.join, shared.section)}
      aria-labelledby="join-title"
    >
      <div {...stylex.props(styles.dawn)} aria-hidden="true">
        <img
          ref={photoRef}
          {...stylex.props(styles.photo)}
          src={asset('/v3/dawn-horizon.webp')}
          alt=""
          width={2400}
          height={1357}
          loading="lazy"
          decoding="async"
        />
        <div {...stylex.props(styles.fade)} />
        <div ref={sunRef} {...stylex.props(styles.sun)} />
      </div>
      <div {...stylex.props(shared.wrap, styles.inner)}>
        <h2 id="join-title" {...stylex.props(styles.title)}>
          {labels.titleA}
          <br />
          <em {...stylex.props(styles.titleEm)}>{labels.titleB}</em>
        </h2>
        <p {...stylex.props(shared.sub, styles.sub)}>{labels.sub}</p>
        <div {...stylex.props(styles.card)}>
          <h3 {...stylex.props(styles.cardTitle)}>{labels.cardTitle}</h3>
          <p {...stylex.props(styles.cardBody)}>{labels.cardBody}</p>
          <DemoForm labels={labels.form} submit={labels.submit} arrow note={labels.note} />
        </div>
      </div>
    </section>
  );
}

import type { ReactNode } from 'react';
import { Reveal } from '@/v5/components/landing/Reveal';
import { SplitWords } from '@/v5/components/landing/SplitWords';

/**
 * Every section's header, in the claim cards' type: a small spaced label, a
 * tight title whose words rise one after another, a one-line lead, and an
 * optional action. The parts arrive in that order when the header scrolls in
 * (`.sec__head` in _site.scss); without JavaScript they render in place.
 */
export function SectionHead({
  eyebrow,
  title,
  lead,
  id,
  level = 2,
  align = 'start',
  children,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  /** For `aria-labelledby` on the section. */
  id?: string;
  /** 1 on a page whose header is the page's title (Contact). */
  level?: 1 | 2;
  align?: 'start' | 'center';
  children?: ReactNode;
}) {
  const Title = level === 1 ? 'h1' : 'h2';
  const className = ['sec__head', align === 'center' ? 'sec__head--center' : '']
    .filter(Boolean)
    .join(' ');

  return (
    <Reveal as="header" className={className}>
      <p className="sec__eyebrow">{eyebrow}</p>
      <Title className="sec__title" id={id}>
        <SplitWords text={title} />
      </Title>
      {lead ? <p className="sec__lead">{lead}</p> : null}
      {children ? <div className="sec__action">{children}</div> : null}
    </Reveal>
  );
}

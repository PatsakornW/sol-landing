import type { ReactNode } from 'react';
import { PixelChevron } from './Icons';

/**
 * The page's button, as the reference's: a dark bar with a bright square at
 * its left holding a pixel chevron, and the label in the accent. A link when
 * given `href`.
 */
export function Btn({ children, onClick, href, className = '', dialog }: { children: ReactNode; onClick?: () => void; href?: string; className?: string; dialog?: boolean }) {
  const inner = (
    <>
      <span className="btn__key" aria-hidden="true">
        <PixelChevron />
      </span>
      <span className="btn__label">{children}</span>
    </>
  );
  if (href) {
    return (
      <a className={`btn ${className}`} href={href} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  }
  return (
    <button type="button" className={`btn ${className}`} onClick={onClick} aria-haspopup={dialog ? 'dialog' : undefined}>
      {inner}
    </button>
  );
}

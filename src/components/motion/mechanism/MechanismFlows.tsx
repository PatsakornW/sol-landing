'use client';

import Google from '@thesvg/react/google';
import Solana from '@thesvg/react/solana';
import Usdc from '@thesvg/react/usdc';
import type { CSSProperties, ReactNode } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';

import {
  BG,
  BORDER,
  clamp,
  ease,
  FONT,
  NO,
  R_CARD,
  R_CHIP,
  R_CTRL,
  SURFACE,
  SURFACE_CARD,
  TEXT,
  TEXT_MUTED,
  TEXT_SECONDARY,
  text,
  YES,
} from '@/components/motion/app-tokens';
import { asset } from '@/configs/configs';
import { CONNECT, REDEEM, TRADE, WALLET } from '@/components/motion/sample-data';
import { PlateDitherField, PRINT_PAPER } from '@/components/motion/PlateDither';
import { FLOW_WIDTH } from './flow-timing.stylex';

/**
 * The three mechanism clips: the panels a user actually meets in `apps/web` —
 * `WalletConnectModal`, `QuickTradePanel`, `RedeemPanel` — at the size and
 * proportion they have on the desktop app, standing in the plate and cropped by
 * its bottom edge.
 *
 * Colours and radii come from `motion/app-tokens.ts` and the settled figures
 * from `motion/sample-data.ts`, both shared with the plain-CSS stand-in and the
 * home clip, so the marketing promise and the product read as the same object —
 * and so no replica can drift on its own. The panel is
 * taller than the canvas on purpose: clipping it keeps the UI at its real
 * proportions instead of shrinking a whole screen into a thumbnail.
 */

/** This clip's only token of its own — the wallet's brand purple. */
const PHANTOM = '#ab9ff2';

const PANEL_W = 322;

const tile = (extra?: CSSProperties): CSSProperties => ({
  background: SURFACE_CARD,
  border: `1px solid ${BORDER}`,
  borderRadius: R_CTRL,
  ...extra,
});

function DitherGround(spec: { ink: string; accent: string; originX: number; originY: number }) {
  return (
    <AbsoluteFill style={{ backgroundColor: PRINT_PAPER }}>
      <PlateDitherField {...spec} />
    </AbsoluteFill>
  );
}

/**
 * The app panel. Rises once on entry and then holds — after that the movement
 * that matters is inside it. The ground is an Atkinson print of the plate
 * colour, on the same cream stock as the hero articles.
 */
function Panel({
  frame,
  title,
  dither,
  children,
}: {
  frame: number;
  title: string;
  dither: {
    ink: string;
    accent: string;
    originX: number;
    originY: number;
  };
  children: ReactNode;
}) {
  const t = interpolate(frame, [0, 24], [0, 1], ease);

  return (
    <AbsoluteFill style={{ fontFamily: FONT, letterSpacing: '-0.01em' }}>
      <DitherGround {...dither} />
      <div
        style={{
          position: 'absolute',
          left: (FLOW_WIDTH - PANEL_W) / 2,
          // No height: the content sets it, and it runs past the canvas.
          top: 34,
          width: PANEL_W,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          padding: 16,
          background: BG,
          border: `1px solid ${BORDER}`,
          borderRadius: R_CARD,
          boxShadow: '0 26px 52px -20px rgba(24, 24, 27, 0.5)',
          opacity: t,
          transform: `translate3d(0, ${(1 - t) * 22}px, 0)`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={text(13, TEXT, 600)}>{title}</span>
          <span style={text(13, TEXT_MUTED)}>×</span>
        </div>
        {children}
      </div>
    </AbsoluteFill>
  );
}

/* ── 01 · Connect ─────────────────────────────────────────────────────────── */

/** `WalletConnectModal`: social row, email row, wallet list, session. */
export function ConnectFlow() {
  const frame = useCurrentFrame();

  // Phantom is picked at 54 and the session lands at 76 — the gap between is
  // the wallet's own approval prompt, which is the honest beat.
  const pick = interpolate(frame, [54, 66], [0, 1], ease);
  const connected = interpolate(frame, [76, 96], [0, 1], ease);

  return (
    <Panel
      frame={frame}
      title="Connect wallet"
      dither={{ ink: '#23409C', accent: '#4B87FF', originX: 0.9, originY: 0.2 }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          height: 38,
          borderRadius: R_CTRL,
          background: '#fff',
          ...text(12, '#18181b', 600),
        }}
      >
        <Google width={14} height={14} />
        Continue with Google
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
        <span style={{ flex: 1, height: 1, background: BORDER }} />
        <span style={text(10, TEXT_MUTED)}>or</span>
        <span style={{ flex: 1, height: 1, background: BORDER }} />
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <div
          style={tile({
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            height: 36,
            padding: '0 12px',
            background: SURFACE,
            ...text(11, TEXT_MUTED),
          })}
        >
          you@email.com
        </div>
        <div
          style={{
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: R_CTRL,
            background: '#3a3a3a',
            ...text(12, TEXT),
          }}
        >
          →
        </div>
      </div>

      {/* One branded wallet, matching the app: `WalletConnectModal` renders a
          single `wallet-icon-btn` for the native Phantom connection, and the
          icon here is the app's own `/phantom-icon.png`. */}
      <div
        style={tile({
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          height: 44,
          padding: '0 12px',
          borderColor: pick > 0.5 ? PHANTOM : BORDER,
        })}
      >
        <img src={asset('/phantom-icon.png')} alt="" width={18} height={18} style={{ borderRadius: 4 }} />
        <span style={text(12, pick > 0.5 ? TEXT : TEXT_SECONDARY, 600)}>{CONNECT.provider}</span>
        <span style={{ ...text(10, TEXT_MUTED), marginLeft: 'auto' }}>{CONNECT.kind}</span>
      </div>

      <div
        style={tile({
          display: 'flex',
          alignItems: 'center',
          gap: 9,
          height: 40,
          padding: '0 12px',
          background: 'rgba(61, 187, 120, 0.1)',
          borderColor: `rgba(61, 187, 120, ${0.5 * connected})`,
          opacity: connected,
          transform: `translateY(${(1 - connected) * 8}px)`,
        })}
      >
        <span style={{ width: 7, height: 7, borderRadius: 99, background: YES }} />
        <span style={text(12, TEXT, 600)}>{WALLET}</span>
        <span style={{ ...text(11, YES, 600), marginLeft: 'auto' }}>{CONNECT.status}</span>
      </div>
    </Panel>
  );
}

/* ── 02 · Pick an outcome ─────────────────────────────────────────────────── */

/** `QuickTradePanel`: outcome pills, amount, submit. */
export function OutcomeFlow() {
  const frame = useCurrentFrame();

  // Prices drift before the pick and freeze on it — a book that kept moving
  // after the user committed would misdescribe what the app does.
  const drift = interpolate(frame, [16, 50], [0, 1], clamp);
  const yesPct = Math.round(interpolate(drift, [0, 1], [58, TRADE.yesPct], clamp));
  const pick = interpolate(frame, [54, 68], [0, 1], ease);
  const typed = interpolate(frame, [74, 96], [0, 25], ease);

  return (
    <Panel
      frame={frame}
      title="Trade"
      dither={{ ink: '#C45A22', accent: '#FF6B2B', originX: 0.9, originY: 0.55 }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={text(10, TEXT_MUTED)}>{TRADE.closesIn}</span>
        <span style={{ ...text(13, TEXT, 600), lineHeight: 1.35 }}>{TRADE.question}</span>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        {[
          { side: 'Yes', color: YES, pct: yesPct, active: pick },
          { side: 'No', color: NO, pct: 100 - yesPct, active: 0 },
        ].map((pill) => (
          <div
            key={pill.side}
            style={tile({
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              padding: '11px 12px',
              background:
                pill.active > 0 ? `rgba(61, 187, 120, ${0.16 * pill.active})` : SURFACE_CARD,
              borderColor: pill.active > 0.5 ? pill.color : BORDER,
            })}
          >
            <span style={text(11, pill.color, 600)}>{pill.side}</span>
            <span style={{ ...text(24, TEXT, 600), fontVariantNumeric: 'tabular-nums' }}>
              {pill.pct}%
            </span>
            <span style={text(10, TEXT_MUTED)}>{pill.pct}¢ per share</span>
          </div>
        ))}
      </div>

      <div
        style={tile({
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 44,
          padding: '0 12px',
          background: SURFACE,
        })}
      >
        <span
          style={{
            ...text(18, typed > 0 ? TEXT : TEXT_MUTED, 600),
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          ${typed.toFixed(2)}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5, ...text(10, TEXT_MUTED) }}>
          <Usdc width={13} height={13} />
          USDC
        </span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={text(10, TEXT_MUTED)}>Shares</span>
        <span style={{ ...text(10, TEXT_SECONDARY), fontVariantNumeric: 'tabular-nums' }}>
          {typed > 0 ? (typed / (yesPct / 100)).toFixed(1) : '—'}
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 42,
          borderRadius: R_CTRL,
          background: pick > 0.5 ? YES : '#3a3a3a',
          ...text(12, pick > 0.5 ? '#0d2318' : TEXT_MUTED, 600),
        }}
      >
        {pick > 0.5 ? TRADE.cta : 'Select an outcome'}
      </div>
    </Panel>
  );
}

/* ── 03 · Redeem ──────────────────────────────────────────────────────────── */

/** `RedeemPanel`: resolved header, payout hero, settle, redeem. */
export function RedeemFlow() {
  const frame = useCurrentFrame();

  const settle = interpolate(frame, [26, 64], [0, 1], ease);
  const done = interpolate(frame, [78, 98], [0, 1], ease);

  return (
    <Panel
      frame={frame}
      title="Redeem shares"
      dither={{ ink: '#B02F86', accent: '#FF45D0', originX: 0.9, originY: 0.55 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span
          style={{
            padding: '4px 8px',
            borderRadius: R_CHIP,
            background: 'rgba(61, 187, 120, 0.16)',
            ...text(9, YES, 600),
            letterSpacing: '0.08em',
          }}
        >
          {REDEEM.badge.toUpperCase()}
        </span>
        <span style={text(11, TEXT_SECONDARY)}>Yes won</span>
      </div>

      <div style={tile({ display: 'flex', flexDirection: 'column', gap: 9, padding: 14 })}>
        <span style={text(10, TEXT_MUTED)}>{REDEEM.label}</span>
        <span
          style={{
            ...text(32, TEXT, 600),
            letterSpacing: '-0.03em',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {REDEEM.amount}{' '}
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              ...text(12, TEXT_MUTED),
            }}
          >
            <Usdc width={14} height={14} />
            USDC
          </span>
        </span>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={text(10, TEXT_MUTED)}>40.32 Yes shares</span>
          <span style={text(10, TEXT_SECONDARY)}>1:1 redemption</span>
        </div>
        {/* Settlement is a real on-chain batch, so the bar is the real wait,
            not a decorative loader. */}
        <div style={{ height: 4, background: BORDER, borderRadius: 99, overflow: 'hidden' }}>
          <div style={{ width: `${settle * 100}%`, height: '100%', background: YES }} />
        </div>
      </div>

      <div style={{ position: 'relative', height: 42 }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: R_CTRL,
            background: YES,
            opacity: 1 - done,
            ...text(12, '#0d2318', 600),
          }}
        >
          Redeem {REDEEM.amount}
        </div>
        <div
          style={tile({
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            background: 'rgba(61, 187, 120, 0.12)',
            borderColor: `rgba(61, 187, 120, ${0.5 * done})`,
            opacity: done,
            ...text(12, YES, 600),
          })}
        >
          ✓ In your wallet
        </div>
      </div>

      <span style={{ display: 'flex', alignItems: 'center', gap: 6, ...text(10, TEXT_MUTED) }}>
        Settled on-chain
        <Solana variant="mono" width={11} height={11} />
        Solana
      </span>
    </Panel>
  );
}

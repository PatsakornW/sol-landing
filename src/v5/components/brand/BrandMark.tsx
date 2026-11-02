import { useId, type HTMLAttributes, type SVGProps } from 'react';

type BrandMarkProps = Omit<SVGProps<SVGSVGElement>, 'children' | 'height' | 'width'> & {
  size?: number;
};

// The mark's geometry in its 64×64 viewBox: two r=19 orbs whose centres sit 18
// units apart, the striped purple one behind the solid blue one.
const ORB_R = 19;
const ORB_CY = 32;
const ORB = {
  back: { cx: 23, fill: '#DC74EC' },
  front: { cx: 41, fill: '#1E69F6' },
} as const;

/** The orbs' fills: the landing sun sets through the purple into the blue. */
export const BRAND_FILLS = { back: ORB.back.fill, front: ORB.front.fill } as const;

/** One orb's diameter as a share of the mark's square box. */
export const BRAND_ORB_SHARE = (ORB_R * 2) / 64;

/** Gaps pitched about cy=32 — slightly inset from poles, thinner cuts. */
const PURPLE_GAP_YS = [18, 25, 32, 39, 46] as const;
const PURPLE_GAP_HEIGHT = 2.25;

function PurpleStripeMask({ id }: { id: string }) {
  const { cx } = ORB.back;
  return (
    <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="64" height="64">
      <circle cx={cx} cy={ORB_CY} r={ORB_R} fill="#fff" />
      {PURPLE_GAP_YS.map((y) => (
        <rect
          key={y}
          x={cx - ORB_R}
          y={y}
          width={ORB_R * 2}
          height={PURPLE_GAP_HEIGHT}
          fill="#000"
        />
      ))}
    </mask>
  );
}

/**
 * One orb of the mark on its own, its viewBox framed to the circle, so a
 * composition can move the two apart. The home page's opening splits one disc
 * into the mark this way (components/landing/OpeningStage.tsx).
 */
export function BrandOrb({ side, className }: { side: keyof typeof ORB; className?: string }) {
  const uid = useId().replace(/:/g, '');
  const maskId = `sm-orb-mask-${uid}`;
  const { cx, fill } = ORB[side];

  return (
    <svg
      className={className}
      viewBox={`${cx - ORB_R} ${ORB_CY - ORB_R} ${ORB_R * 2} ${ORB_R * 2}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      {side === 'back' && (
        <defs>
          <PurpleStripeMask id={maskId} />
        </defs>
      )}
      <circle
        cx={cx}
        cy={ORB_CY}
        r={ORB_R}
        fill={fill}
        mask={side === 'back' ? `url(#${maskId})` : undefined}
      />
    </svg>
  );
}

/** SolsMarket mark — striped purple orb behind a solid blue orb. Decorative. */
export function BrandMark({ size = 32, ...props }: BrandMarkProps) {
  const uid = useId().replace(/:/g, '');
  const maskId = `sm-purple-mask-${uid}`;

  return (
    <svg
      {...props}
      viewBox="0 0 64 64"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <PurpleStripeMask id={maskId} />
      </defs>
      <circle
        cx={ORB.back.cx}
        cy={ORB_CY}
        r={ORB_R}
        fill={ORB.back.fill}
        mask={`url(#${maskId})`}
      />
      <circle cx={ORB.front.cx} cy={ORB_CY} r={ORB_R} fill={ORB.front.fill} />
    </svg>
  );
}

export function BrandWordmark(props: HTMLAttributes<HTMLSpanElement>) {
  return <span {...props}>solsmarket</span>;
}

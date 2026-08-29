'use client';

import { ClipPlate } from '@/components/motion/ClipPlate';
import { FLOW_DURATION, FLOW_FPS, FLOW_HEIGHT, FLOW_WIDTH } from './flow-timing.stylex';
import { mechanismCrop, mechanismPlate, STEP_CROP } from './mechanism-plate.styles';
import { ConnectFlow, OutcomeFlow, RedeemFlow } from './MechanismFlows';

/**
 * `MechanismCard` only reaches this module through a lazy import. Keeping the
 * flows here rather than in the card is the whole point: a static import of
 * `MechanismFlows` would pull `remotion` into the page bundle even on phones,
 * where no plate is rendered.
 */

/** Positional: step N of the copy gets clip N, 1-based at the call site. */
const FLOWS = [ConnectFlow, OutcomeFlow, RedeemFlow] as const;

export interface MechanismPlateProps {
  /** 1-based step number: picks the clip. */
  index: number;
  /** Driven by the card, so the timing hook stays out of the lazy chunk. */
  frame: number;
}

export default function MechanismPlate({ index, frame }: MechanismPlateProps) {
  const flow = FLOWS[index - 1] ?? ConnectFlow;
  const crop = STEP_CROP[index] ?? STEP_CROP[0];

  return (
    <ClipPlate
      component={flow}
      frame={frame}
      durationInFrames={FLOW_DURATION}
      fps={FLOW_FPS}
      compositionWidth={FLOW_WIDTH}
      compositionHeight={FLOW_HEIGHT}
      frameStyle={mechanismPlate.frame}
      screenStyle={[
        mechanismPlate.screen,
        mechanismCrop.crop,
        mechanismCrop.step(crop.scale, crop.origin),
      ]}
    />
  );
}

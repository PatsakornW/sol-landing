/**
 * The highlighted word in a scene's line: a chunky extruded word that every
 * few seconds flips over into a pill button and back, the two sharing one slot
 * in the line. The pill opens the scene's sheet; while the word shows, the pill
 * is out of reach.
 */
export function Swap({ word, pill, tone, onPill }: { word: string; pill: string; tone: 'blue' | 'pink' | 'cream'; onPill: () => void }) {
  return (
    <span className={`swap swap--${tone}`}>
      <span className="swap__word">{word}</span>
      <button type="button" className="swap__pill" onClick={onPill}>
        {pill}
      </button>
    </span>
  );
}

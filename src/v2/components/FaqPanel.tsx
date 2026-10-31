import * as stylex from '@stylexjs/stylex';
import {
  AccordionContent,
  AccordionGroup,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { media } from '../../styles/breakpoints.stylex';
import { color } from '../../styles/tokens.stylex';
import { GLASS } from '../styles/glass.stylex';

const styles = stylex.create({
  /* The kit accordion on the page's own glass — it reads `shape.bgRadius`, so
     it arrives at this corner scale without an edit of its own. */
  panel: {
    maxWidth: 820,
    marginInline: 'auto',
    padding: { default: 8, [media.sm]: 12 },
    borderRadius: GLASS.panel,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: color.border,
    backgroundColor: `color-mix(in srgb, ${color.card} 55%, transparent)`,
    backdropFilter: GLASS.blur,
    WebkitBackdropFilter: GLASS.blur,
    overflow: 'hidden',
    minWidth: 0,
  },
  /* The kit's group paints its own plate and a hairline ring. Inside this
     panel both are one layer too many — the panel already is the plate, and
     the ring reads as a box drawn inside a box. */
  flatGroup: {
    backgroundColor: 'transparent',
    boxShadow: 'none',
  },
  note: {
    margin: 0,
    marginTop: 18,
    maxWidth: 820,
    marginInline: 'auto',
    fontSize: 12.5,
    lineHeight: 1.6,
    textAlign: 'center',
    color: color.mutedFg,
  },
});

export type FaqRow = { id: string; title: string; description: string };

/** Good to know. */
export function FaqPanel({ items, note }: { items: readonly FaqRow[]; note: string }) {
  const first = items[0]?.id;
  return (
    <div>
      <div {...stylex.props(styles.panel)}>
        <AccordionGroup type="single" defaultValue={first} style={styles.flatGroup}>
          {items.map((faq, index) => (
            <AccordionItem key={faq.id} value={faq.id} index={index}>
              <AccordionTrigger>{faq.title}</AccordionTrigger>
              <AccordionContent>{faq.description}</AccordionContent>
            </AccordionItem>
          ))}
        </AccordionGroup>
      </div>
      <p {...stylex.props(styles.note)}>{note}</p>
    </div>
  );
}

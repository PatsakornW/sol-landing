import * as stylex from '@stylexjs/stylex';
import { media } from '../../styles/breakpoints.stylex';
import { color } from '../../styles/tokens.stylex';
import { GLASS } from '../styles/glass.stylex';

const styles = stylex.create({
  /* Notes, not cards. The band they belong to is pointing at the app behind
     the page, so they stay light enough that the room reads through them: no
     border on any side, just frosted glass and the type. */
  notes: {
    display: 'grid',
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      [media.sm]: 'repeat(3, minmax(0, 1fr))',
    },
    gap: { default: 14, [media.sm]: 20 },
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  note: {
    display: 'grid',
    alignContent: 'start',
    gap: 10,
    paddingBlock: { default: 16, [media.sm]: 20 },
    paddingInline: { default: 18, [media.sm]: 22 },
    borderRadius: GLASS.inner,
    backgroundColor: `color-mix(in srgb, ${color.card} 40%, transparent)`,
    backdropFilter: GLASS.blur,
    WebkitBackdropFilter: GLASS.blur,
    minWidth: 0,
  },
  noteTerm: {
    margin: 0,
    fontSize: 16.5,
    fontWeight: 650,
    letterSpacing: '-0.02em',
    color: color.fg,
  },
  noteDesc: {
    margin: 0,
    fontSize: 14.5,
    lineHeight: 1.6,
    color: color.mutedFg,
    textWrap: 'pretty',
  },
});

export type Note = { key: string; term: string; desc: string };

/**
 * Three annotations on the app behind the page.
 *
 * The revision's backdrop is the product itself, held still behind the page,
 * so this band does what a caption does: names the three things already on
 * screen instead of showing a fourth picture of them.
 */
export function NoteRow({ notes }: { notes: readonly Note[] }) {
  return (
    <ul {...stylex.props(styles.notes)}>
      {notes.map((note) => (
        <li key={note.key} {...stylex.props(styles.note)}>
          <h3 {...stylex.props(styles.noteTerm)}>{note.term}</h3>
          <p {...stylex.props(styles.noteDesc)}>{note.desc}</p>
        </li>
      ))}
    </ul>
  );
}

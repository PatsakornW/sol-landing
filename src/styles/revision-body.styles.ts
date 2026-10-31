import * as stylex from '@stylexjs/stylex';
import { color, font } from './tokens.stylex';

/**
 * The `<body>` rule every design revision after V1 carries.
 *
 * `globals.css` binds the document body to the shipped page's monospaced
 * register through `--font-geist-mono`. A revision that does not load that face
 * leaves the custom property undefined, which makes the whole declaration
 * invalid at computed-value time — the body then falls back to the UA serif,
 * which is how a page ends up set in Times New Roman without a single rule
 * saying so. Binding the tokens here puts each revision on its own faces and
 * its own ground instead.
 */
export const revisionBody = stylex.create({
  body: {
    fontFamily: font.sans,
    fontSize: 15,
    letterSpacing: 0,
    lineHeight: 1.6,
    backgroundColor: color.surface3,
    color: color.fg,
  },
});

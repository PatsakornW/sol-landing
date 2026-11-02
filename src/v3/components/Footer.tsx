import * as stylex from '@stylexjs/stylex';
import { AppConfig } from '@/configs/configs';
import { V3 } from '../styles/eclipse.stylex';
import { shared } from '../styles/shared.styles';
import { Brand } from './Brand';

const styles = stylex.create({
  foot: {
    position: 'relative',
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: V3.line,
    backgroundColor: 'rgba(1, 1, 4, 0.85)',
  },
  inner: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    rowGap: 20,
    columnGap: 40,
    paddingBlock: 34,
  },
  links: {
    display: 'flex',
    flexWrap: 'wrap',
    rowGap: 6,
    columnGap: 26,
  },
  link: {
    textDecorationLine: 'none',
    color: { default: V3.dust, ':hover': V3.star },
    fontSize: 15,
  },
  legal: {
    margin: 0,
    width: '100%',
    fontSize: 13,
    color: V3.faint,
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: V3.line,
    paddingTop: 22,
  },
});

export type FooterLabels = {
  app: string;
  docs: string;
  contact: string;
  copyright: string;
  disclaimer: string;
};

/** The brand, three links, and the legal line. */
export function Footer({ homeHref, labels }: { homeHref: string; labels: FooterLabels }) {
  return (
    <footer {...stylex.props(styles.foot)}>
      <div {...stylex.props(shared.wrap, styles.inner)}>
        <Brand href={homeHref} />
        <div {...stylex.props(styles.links)}>
          <a {...stylex.props(styles.link)} href={AppConfig.appUrl}>
            {labels.app}
          </a>
          <a {...stylex.props(styles.link)} href={AppConfig.docsUrl} target="_blank" rel="noopener">
            {labels.docs}
          </a>
          <a {...stylex.props(styles.link)} href={`mailto:${AppConfig.email}`}>
            {labels.contact}
          </a>
        </div>
        <p {...stylex.props(styles.legal)}>
          {labels.copyright} · {labels.disclaimer}
        </p>
      </div>
    </footer>
  );
}

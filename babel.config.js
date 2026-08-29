import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dev = process.env.NODE_ENV !== 'production';

const babelConfig = {
  presets: ['next/babel'],
  plugins: [
    [
      '@stylexjs/babel-plugin',
      {
        dev,
        runtimeInjection: false,
        enableInlinedConditionalMerge: true,
        treeshakeCompensation: true,
        /* In dev StyleX stamps every styled element with `data-style-src`, the
           file the rule came from. Its default value is an OS path, and on
           Windows the backslashes come back escaped in the server-rendered HTML
           and unescaped on the client — a hydration mismatch on every single
           styled node, reported against whichever component React reaches
           first. Emitting a POSIX path keeps the debugging aid and removes the
           only character that differs. */
        debugFilePath: (absolutePath) =>
          path.relative(__dirname, absolutePath).split(path.sep).join('/'),
        aliases: {
          '@/*': [path.join(__dirname, 'src/*')],
        },
        unstable_moduleResolution: {
          type: 'commonJS',
          rootDir: __dirname,
        },
      },
    ],
  ],
};

export default babelConfig;

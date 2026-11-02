# V4 icon renderer

The 3D pieces in `public/v4/` are built from three.js primitives in
`index.html` (one entry per icon in `ICONS`, the coins in `COINS`, the words
through `words()`) and exported as transparent WebP.

To re-render after editing a shape:

```sh
npx serve tools/v4-icons -l 4174
"C:/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --remote-debugging-port=9333 --user-data-dir=/tmp/v4-chrome about:blank
node tools/v4-icons/render.mjs 9333 http://localhost:4174 public/v4 /tmp/v4-png 1024 coin sphere star capsule gavel ballot c-sol c-yes c-no c-usdc c-btc c-q n62@2000x900 word@2600x460
```

A name may carry its own frame (`word@2600x460`); the rest render square at
the size given. The page loads three.js, its Helvetiker font and Manrope from
CDNs, so it needs the network once. The hero coin in `src/v4/lib/coin.ts` is
the same piece, live.

# V6 icon renderer

The 3D pieces in `public/v6/` are built from three.js primitives in
`index.html` (one entry per icon in `ICONS`) and exported as transparent WebP.

To re-render after editing a shape:

```sh
npx serve tools/v6-icons -l 4174
"C:/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --remote-debugging-port=9333 --user-data-dir=/tmp/v6-chrome about:blank
node tools/v6-icons/render.mjs 9333 http://localhost:4174 public/v6 /tmp/v6-png 1024 yes no usdc sol btc question up bolt vault key gavel ballot ball tag bank barrel gold chip bell clapper sun
```

The page loads three.js from jsDelivr and Changa One from Google Fonts, so it
needs the network once. Each render is 1024px square; the PNG copy is only
for review.

// V4: renders each icon in headless Chrome and writes a transparent WebP (plus a PNG preview).
import { writeFileSync, mkdirSync } from 'node:fs';
const [, , PORT, BASE, OUT_WEBP, OUT_PNG, SIZE, ...NAMES] = process.argv;
// A name may carry its own frame: `word@2400x420`.
mkdirSync(OUT_WEBP, { recursive: true });
mkdirSync(OUT_PNG, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const target = await (await fetch(`http://localhost:${PORT}/json/new?about:blank`, { method: 'PUT' })).json();
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0; const pending = new Map(); const errors = [];
ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } else if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.exception?.description ?? m.params.exceptionDetails.text); };
const send = (method, params = {}) => new Promise((resolve) => { const n = ++id; pending.set(n, resolve); ws.send(JSON.stringify({ id: n, method, params })); });
const evaluate = async (expression) => (await send('Runtime.evaluate', { expression, returnByValue: true })).result?.result?.value;
await send('Runtime.enable'); await send('Page.enable');
for (const spec of NAMES) {
  const [name, frame] = spec.split('@');
  const [w, h] = frame ? frame.split('x').map(Number) : [+SIZE, +SIZE];
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: `${BASE}/?icon=${name}&w=${w}&h=${h}` });
  let out = null;
  for (let i = 0; i < 60; i++) { await sleep(250); out = await evaluate('window.__out || null'); if (out) break; }
  if (!out || out.startsWith('error')) { console.log(name, 'FAILED', out, errors.slice(-2)); continue; }
  writeFileSync(`${OUT_WEBP}/${name}.webp`, Buffer.from(out.split(',')[1], 'base64'));
  const png = await evaluate('window.__png');
  writeFileSync(`${OUT_PNG}/${name}.png`, Buffer.from(png.split(',')[1], 'base64'));
  console.log(name, 'ok', Math.round(out.length * 0.75 / 1024) + 'KB');
}
ws.close();

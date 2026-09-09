const { test } = require("node:test");
const assert = require("node:assert/strict");
const { resolve } = require("node:path");
const vm = require("node:vm");

test("portable HTML embeds all assets and executes code only after the document", async () => {
  const { bundleHTML } = await import("../scripts/standalone.mjs");
  const html = await bundleHTML(resolve(__dirname, ".."));
  assert.doesNotMatch(html, /(?:src|href)="(?:assets\/|js\/|styles\.css)/);
  assert.doesNotMatch(html, /url\(["']?assets\//);
  assert.match(html, /data:font\/ttf;base64,/);
  assert.match(html, /data:image\/png;base64,/);
  assert.match(html, /id="bundled-licenses"/);
  assert.match(html, /SIL OPEN FONT LICENSE/);
  assert.match(html, /GNU GENERAL PUBLIC LICENSE/);
  const scripts = [
    ...html.matchAll(/<script data-bundled="game">([\s\S]*?)<\/script>/g),
  ];
  assert.equal(scripts.length, 1);
  assert.ok(scripts[0].index > html.indexOf('id="board"'));
  assert.ok(scripts[0].index > html.indexOf('id="info-dialog"'));
  new vm.Script(scripts[0][1]);
  assert.ok(
    html.indexOf("/* js/art.js */") < html.indexOf("/* js/render.js */"),
  );
  assert.ok(
    Buffer.byteLength(html) < 1500000,
    "Portable edition stays below 1.5 MB",
  );
});

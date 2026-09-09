import { mkdir, cp, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
const root = resolve(import.meta.dirname, ".."),
  dist = resolve(root, "dist");
await mkdir(dist, { recursive: true });
// Explicit public allowlist: no reference documents or legacy arcade assets are shipped.
for (const path of ["index.html", "styles.css", "js", "assets", "LICENSE"])
  await cp(resolve(root, path), resolve(dist, path), { recursive: true });
const html = await readFile(resolve(dist, "index.html"), "utf8");
for (const match of html.matchAll(
  /(?:src|href)="((?:assets\/|js\/|styles\.css)[^"]*)"/g,
))
  await readFile(resolve(dist, match[1]));
await writeFile(resolve(dist, ".nojekyll"), "");
await mkdir(resolve(dist, "docs"), { recursive: true });
for (const file of ["CREDITS.md", "CONTENT-SOURCES.md"]) {
  await cp(resolve(root, "docs", file), resolve(dist, "docs", file));
}
await writeFile(
  resolve(dist, "START-HERE.txt"),
  "Accelevation Time\n\nExtract this folder, then double-click index.html to play.\nKeep assets, js, and styles.css alongside it. No server or installation is needed.\n\nMove: arrows or WASD. Climb: up/down at a ladder; release between floors.\nQuality pulse: Space. Pause/resume: P or Escape.\nTouch controls appear on phones and tablets.\n\nProduct guide and credits are available inside the game.\nSource: https://github.com/bullockjjb/burgertime\nCode license: see LICENSE. Font license: assets/fonts/OFL.txt.\nAsset credits: docs/CREDITS.md.\n",
);
console.log(
  "Built offline-ready browser game in dist/ (no runtime dependencies).",
);

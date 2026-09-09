import { mkdir, cp, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { bundleHTML } from "./standalone.mjs";
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
for (const file of ["CREDITS.md", "CONTENT-SOURCES.md", "SHAREPOINT.md"]) {
  await cp(resolve(root, "docs", file), resolve(dist, "docs", file));
}
const standalone = await bundleHTML(root);
await writeFile(resolve(dist, "Accelevation-Time.html"), standalone);
await writeFile(
  resolve(dist, "START-HERE.txt"),
  "Accelevation Time v1.1\n\nOpen Accelevation-Time.html in Edge or Chrome to play.\nThat one file contains the entire game and can be copied or shared by itself.\nNo server, installation, or internet connection is needed.\n\nFor SharePoint, upload that file and ask testers to download it before opening.\nFor instant browser play, add a SharePoint link to:\nhttps://bullockjjb.github.io/burgertime/\nSee docs/SHAREPOINT.md for office playtest instructions.\n\nThe web edition also works by opening index.html with assets, js, and styles.css alongside it.\n\nMove: arrows or WASD. Climb: up/down at a ladder; release between floors.\nQuality pulse: Space. Pause/resume: P or Escape.\nTouch controls appear on phones and tablets.\n\nProduct guide and credits are available inside the game.\nSource: https://github.com/bullockjjb/burgertime\nCode license: see LICENSE. Font license: assets/fonts/OFL.txt.\nAsset credits: docs/CREDITS.md. Licenses are also embedded in the single HTML.\n",
);
console.log(
  `Built web edition and single-file Accelevation-Time.html (${Math.round(Buffer.byteLength(standalone) / 1024)} KB) in dist/.`,
);

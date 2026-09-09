import { readFile } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";

const mime = {
  ".png": "image/png",
  ".ttf": "font/ttf",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".svg": "image/svg+xml",
};
const escapeHTML = (s) =>
  s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

/** Build one portable document: assets, typography, code, and licenses included. */
export async function bundleHTML(root) {
  root = resolve(root);
  const read = async (path) => {
    const target = resolve(root, path);
    if (!target.startsWith(root + sep))
      throw Error("Asset outside game folder: " + path);
    return readFile(target);
  };
  const dataURI = async (path) =>
    `data:${mime[extname(path)] || "application/octet-stream"};base64,${(await read(path)).toString("base64")}`;
  let html = (await read("index.html")).toString("utf8");
  let css = (await read("styles.css")).toString("utf8");
  for (const match of [
    ...css.matchAll(/url\(\s*(['"]?)(assets\/[^'"\)]+)\1\s*\)/g),
  ]) {
    css = css.replace(match[0], `url("${await dataURI(match[2])}")`);
  }
  html = html.replace(
    /<link\s+rel="stylesheet"\s+href="styles\.css"\s*\/?>/,
    () => `<style data-bundled="styles">\n${css}\n</style>`,
  );
  const scripts = [];
  for (const match of [
    ...html.matchAll(/<script\s+defer\s+src="(js\/[^"]+)"\s*>\s*<\/script>/g),
  ]) {
    scripts.push(
      `/* ${match[1]} */\n${(await read(match[1])).toString("utf8")}`,
    );
    html = html.replace(match[0], "");
  }
  if (scripts.length !== 5)
    throw Error("Expected catalog, engine, art, renderer, and app scripts");
  for (const match of [...html.matchAll(/(?:src|href)="(assets\/[^"]+)"/g)])
    html = html.replaceAll(`"${match[1]}"`, `"${await dataURI(match[1])}"`);
  html = html.replace('href="./"', 'href="#game"');
  const notices = await Promise.all(
    ["LICENSE", "assets/fonts/OFL.txt", "docs/CREDITS.md"].map(
      async (path) => `${path}\n\n${(await read(path)).toString("utf8")}`,
    ),
  );
  // Inline scripts deliberately go after the document, not in a defer tag in
  // the head: browsers do not defer inline classic scripts.
  const script = scripts.join("\n\n").replace(/<\/script/gi, "<\\/script");
  html = html.replace(
    "</body>",
    () =>
      `<template id="bundled-licenses"><pre>${escapeHTML(notices.join("\n\n"))}</pre></template>\n<script data-bundled="game">\n${script}\n</script>\n</body>`,
  );
  if (
    /(?:src|href)="(?:assets\/|js\/|styles\.css)/.test(html) ||
    /url\(["']?assets\//.test(html)
  )
    throw Error("Unbundled resource remains");
  return html;
}

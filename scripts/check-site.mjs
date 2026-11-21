import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = new URL('../dist/', import.meta.url);
const sourceBase = 'https://nokroni.github.io/probably-stolen-doctor-wiki/';
const base = new URL(sourceBase);
const pages = ['', 'start/first-shift/', 'start/bedside/', 'start/practice/', 'reference/items/', 'reference/procedures/'];
const files = (folder) => readdirSync(folder, { recursive: true, withFileTypes: true })
  .filter((entry) => entry.isFile())
  .map((entry) => join(entry.parentPath, entry.name));

function pathFor(url) {
  assert(url.pathname.startsWith(base.pathname), `Link escapes the Pages base: ${url}`);
  const path = decodeURIComponent(url.pathname.slice(base.pathname.length));
  const target = new URL(path, dist);
  if (existsSync(target) && statSync(target).isFile()) return target;
  return new URL(`${path.replace(/\/$/, '')}${path ? '/' : ''}index.html`, dist);
}

const spoilers = /CHASE IT DOWN|Sentinel Collapse|Silva|S-17|Serpico|Eleanor|席尔瓦|希尔瓦|哨兵崩溃|赛尔皮科|埃莉诺/i;
for (const lang of ['', 'zh-cn/']) {
  for (const route of pages) {
    const url = new URL(lang + route, base);
    const rendered = readFileSync(pathFor(url), 'utf8');
    assert.match(rendered, lang ? /<html[^>]+lang="zh-CN"/i : /<html[^>]+lang="en"/i, `Page language ${url}`);
    const searchable = rendered.replace(/<details\b[^>]*\bdata-pagefind-ignore\b[^>]*>[\s\S]*?<\/details>/g, '');
    assert.doesNotMatch(searchable, spoilers, `Campaign text in ${url}`);
    const alternate = new URL((lang ? '' : 'zh-cn/') + route, base).pathname;
    assert(rendered.includes(`<option value="${alternate}"`), `Missing language switch target on ${url}`);
  }
}

const outputPath = fileURLToPath(dist);
for (const file of files(outputPath).filter((path) => path.endsWith('.html') && !path.endsWith('404.html'))) {
  const route = relative(outputPath, file).split(sep).join('/').replace(/index\.html$/, '');
  const page = new URL(route, base);
  const html = readFileSync(file, 'utf8');
  for (const [, link] of html.matchAll(/<(?:a|link|img|script)\b[^>]*?\b(?:href|src)="([^"]+)"/g)) {
    const url = new URL(link.replaceAll('&amp;', '&'), page);
    if (url.origin !== base.origin) continue;
    assert(existsSync(pathFor(url)), `Broken local link on ${page}: ${link}`);
  }
}

assert(existsSync(new URL('pagefind/pagefind.js', dist)), 'Search index was not generated');
console.log(`Verified ${pages.length * 2} bilingual wiki pages, same-site links, search output and spoiler scan.`);

import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import itemCategories from '../src/item-categories.json' with { type: 'json' };

const dist = new URL('../dist/', import.meta.url);
const base = new URL('https://nokroni.github.io/probably-stolen-doctor-wiki/');
const files = (folder) => readdirSync(folder, { recursive: true, withFileTypes: true })
  .filter((entry) => entry.isFile())
  .map((entry) => join(entry.parentPath, entry.name));

const docs = fileURLToPath(new URL('../src/content/docs/', import.meta.url));
const articles = files(docs).filter((file) => /\.mdx?$/.test(file));
const authored = articles.map((file) => relative(docs, file).split(sep).join('/'));
const toRoute = (file) => /(?:^|\/)index\.mdx?$/.test(file) ? file.replace(/index\.mdx?$/, '') : file.replace(/\.mdx?$/, '/');
const pages = authored.filter((file) => !file.startsWith('zh-cn/')).map(toRoute).sort();
const translated = authored.filter((file) => file.startsWith('zh-cn/')).map((file) => toRoute(file.slice(6))).sort();
assert.deepEqual(pages, translated, 'Every English article needs a matching Simplified Chinese route');

function pathFor(url) {
  assert(url.pathname.startsWith(base.pathname), `Link escapes the Pages base: ${url}`);
  const path = decodeURIComponent(url.pathname.slice(base.pathname.length));
  const target = new URL(path, dist);
  if (existsSync(target) && statSync(target).isFile()) return target;
  return new URL(`${path.replace(/\/$/, '')}${path ? '/' : ''}index.html`, dist);
}

const spoilers = /CHASE IT DOWN|Silva|S-17|Serpico|Eleanor|Luo Ming|The Freight Worker and His Sister|One Name Missing|One Ride Approved|席尔瓦|希尔瓦|赛尔皮科|埃莉诺|罗明/i;
const diagnosisName = /Sentinel Collapse|哨兵崩溃|哨兵病/i;
const diagnosisDetails = /<details\b(?=[^>]*\bid="specialist-diagnosis-name")(?=[^>]*\bdata-pagefind-ignore\b)[^>]*>[\s\S]*?<\/details>/g;
const notices = [
  ['LICENSE.txt', 'LICENSE'],
  ['LICENSE-CC-BY-SA-4.0.txt', 'LICENSE-CC-BY-SA-4.0.txt'],
  ['ASSET-NOTICES.txt', 'ASSET-NOTICES.md'],
  ['THIRD-PARTY-NOTICES.txt', 'public/THIRD-PARTY-NOTICES.txt'],
];
for (const [published, source] of notices) {
  assert.deepEqual(readFileSync(new URL(published, dist)), readFileSync(new URL(`../${source}`, import.meta.url)),
    `Published notice differs from ${source}`);
}

const itemPages = itemCategories.flatMap(({ items }) => items);
assert.equal(new Set(itemPages).size, itemPages.length, 'An item family belongs to only one category');
assert.deepEqual(pages.filter((route) => /^reference\/items\/[^/]+\/$/.test(route)).sort(),
  itemCategories.flatMap(({ slug, items }) => [slug, ...items]).map((slug) => `reference/items/${slug}/`).sort(),
  'Every item page belongs to the item catalog');

for (const lang of ['', 'zh-cn/']) {
  const licensing = new URL(`${lang}licensing/`, base);
  const licensingHtml = readFileSync(pathFor(licensing), 'utf8');
  const noticePrefix = lang ? '../../' : '../';
  for (const [published] of notices) {
    assert(licensingHtml.includes(`href="${noticePrefix}${published}"`), `${licensing} must link to ${published}`);
  }

  const index = new URL(`${lang}reference/items/`, base);
  const indexHtml = readFileSync(pathFor(index), 'utf8');
  for (const { slug, items } of itemCategories) {
    assert(indexHtml.includes(`href="./${slug}/"`), `Item index must link to ${slug} in ${lang || 'en'}`);
    const category = new URL(`${slug}/`, index);
    const html = readFileSync(pathFor(category), 'utf8');
    for (const item of items) {
      assert(html.includes(`href="../${item}/"`), `${category} must list ${item}`);
    }
  }
  for (const route of pages) {
    const url = new URL(lang + route, base);
    const rendered = readFileSync(pathFor(url), 'utf8');
    assert.match(rendered, lang ? /<html[^>]+lang="zh-CN"/i : /<html[^>]+lang="en"/i, `Page language ${url}`);
    assert.doesNotMatch(rendered, spoilers, `Campaign text in ${url}`);
    const details = [...rendered.matchAll(diagnosisDetails)];
    if (route === 'reference/conditions/recovery-specialist/') {
      assert.equal(details.length, 1, `Missing opt-in specialist diagnosis on ${url}`);
      assert.match(details[0][0], lang ? /<p>哨兵病<\/p>/ : /<p>Sentinel Collapse<\/p>/, `Diagnosis name differs on ${url}`);
    } else {
      assert.equal(details.length, 0, `Unexpected specialist diagnosis section on ${url}`);
    }
    assert.doesNotMatch(rendered.replace(diagnosisDetails, ''), diagnosisName, `Diagnosis revealed on ${url}`);
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
    const target = pathFor(url);
    assert(existsSync(target), `Broken local link on ${page}: ${link}`);
    if (url.hash && target.pathname.endsWith('.html')) {
      const id = decodeURIComponent(url.hash.slice(1));
      const linked = target.href === pathFor(page).href ? html : readFileSync(target, 'utf8');
      assert(linked.includes(` id="${id}"`), `Missing page section on ${page}: ${link}`);
    }
  }
}

assert(existsSync(new URL('pagefind/pagefind.js', dist)), 'Search index was not generated');
const snapshots = files(fileURLToPath(new URL('../src/assets/captures/', import.meta.url)));
const citedCaptures = new Set(articles.flatMap((file) => [...readFileSync(file, 'utf8')
  .matchAll(/<WikiShot name="([^"]+)"/g)].map(([, name]) => name)));
for (const file of snapshots) {
  const name = /([^\\/]+)\.webp$/.exec(file)?.[1];
  assert(name && citedCaptures.has(name), `Unused screenshot: ${file}`);
}
console.log(`Verified ${pages.length * 2} bilingual pages, ${itemPages.length} item families per language, ${snapshots.length} game captures, published notices, same-site links, search output and spoiler scan.`);

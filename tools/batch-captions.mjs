/*
 * instaloader output -> reviewable caption batches for parsing.
 *
 * Usage:  node tools/batch-captions.mjs
 *
 * Reads every post JSON under tools/instaloader-out/, skips the shortcodes
 * already listed in tools/imported.txt, and writes tools/captions/batch-NN.md
 * with 50 posts each. Re-runnable: after another instaloader pass, running it
 * again emits only the batches for posts that are new.
 *
 * ponytail: no CSV, no schema validation, no CLI flags. It reads a directory
 * and writes markdown. If the format needs changing, change it.
 */

import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';

const ROOT = join(import.meta.dirname, 'instaloader-out');
const OUT = join(import.meta.dirname, 'captions');
const LEDGER = join(import.meta.dirname, 'imported.txt');
const PER_BATCH = 50;

// git does not track empty directories, so these are absent on a fresh clone.
mkdirSync(OUT, { recursive: true });

// Every *.json under ROOT, at any depth. instaloader's directory name depends
// on --dirname-pattern (and on Windows it mangles the ':' in ':saved'), so
// walk rather than assume.
function walk(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name);
    if (e.isDirectory()) return walk(p);
    // iterator-*.json is instaloader's resume state, not a post.
    return e.name.endsWith('.json') && !e.name.startsWith('iterator') ? [p] : [];
  });
}

/*
 * The caption has lived at three different paths across instaloader/Instagram
 * versions, and a post with no caption at all is normal. Falling back to the
 * sibling .txt that instaloader writes covers whatever shape this dump is in.
 */
function captionOf(node, jsonPath) {
  const text =
    node?.edge_media_to_caption?.edges?.[0]?.node?.text ??
    node?.iphone_struct?.caption?.text ??
    node?.caption;
  if (typeof text === 'string' && text.trim()) return text.trim();

  const txt = join(dirname(jsonPath), basename(jsonPath, '.json') + '.txt');
  return existsSync(txt) ? readFileSync(txt, 'utf8').trim() : '';
}

const done = new Set(
  existsSync(LEDGER)
    ? readFileSync(LEDGER, 'utf8').split('\n').map((l) => l.trim()).filter(Boolean)
    : []
);

const posts = [];
const seen = new Set();
for (const path of walk(ROOT)) {
  let node;
  try {
    node = JSON.parse(readFileSync(path, 'utf8')).node;
  } catch {
    continue; // not a post dump
  }
  const shortcode = node?.shortcode;
  if (!shortcode || done.has(shortcode) || seen.has(shortcode)) continue;

  const caption = captionOf(node, path);
  if (!caption) continue; // nothing to parse; an image-only post is not a recipe

  seen.add(shortcode);
  posts.push({ shortcode, caption });
}

// Stable order so re-running after a partial import produces the same batches.
posts.sort((a, b) => a.shortcode.localeCompare(b.shortcode));

for (let i = 0; i < posts.length; i += PER_BATCH) {
  const n = String(i / PER_BATCH + 1).padStart(2, '0');
  const body = posts
    .slice(i, i + PER_BATCH)
    .map(
      (p) =>
        `## ${p.shortcode}\nhttps://www.instagram.com/p/${p.shortcode}/\n\n${p.caption}\n`
    )
    .join('\n---\n\n');
  writeFileSync(join(OUT, `batch-${n}.md`), body + '\n');
}

const batches = Math.ceil(posts.length / PER_BATCH);
console.log(
  `${posts.length} unparsed posts -> ${batches} batch file(s) in tools/captions/` +
    (done.size ? ` (${done.size} already imported)` : '')
);

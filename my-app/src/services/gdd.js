/*
 * Game Design Documents — live fetch from the public GitHub repo.
 * --------------------------------------------------------------------------
 * The repo is public, so we read it live at page load: always current, no
 * build step, no cron, no periodic "import". The contents API gives the file
 * list (1 request); raw.githubusercontent.com serves the markdown (served by a
 * CDN, does NOT count against the API's 60 req/hr unauthenticated limit).
 *
 * ponytail: live fetch instead of a scheduled import job. If GitHub rate limits
 * become a problem for a busy portfolio, cache the list in sessionStorage.
 */

const OWNER = 'NicholasTillo';
const REPO = 'GameDesignDocuments';
const BRANCH = 'main';

// Files that are repo scaffolding, not design docs to showcase.
const HIDDEN = new Set(['README.md', 'GDD_Outline.md']);

// "MinecraftVoxel.md" -> "Minecraft Voxel"
function titleFromFilename(name) {
  return name
    .replace(/\.md$/i, '')
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .trim();
}

// List the .md design docs in the repo, newest-looking order preserved.
export async function listGddDocs({ signal } = {}) {
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/?ref=${BRANCH}`;
  const res = await fetch(url, { signal, headers: { Accept: 'application/vnd.github+json' } });
  if (res.status === 403) {
    throw new Error("GitHub's hourly rate limit was hit. Please try again in a little while.");
  }
  if (!res.ok) {
    throw new Error(`Could not load the document list (GitHub returned ${res.status}).`);
  }
  const entries = await res.json();
  return entries
    .filter((e) => e.type === 'file' && /\.md$/i.test(e.name) && !HIDDEN.has(e.name))
    .map((e) => ({ file: e.name, title: titleFromFilename(e.name) }))
    .sort((a, b) => a.title.localeCompare(b.title));
}

// Fetch one document's raw markdown text.
export async function fetchGddDoc(file, { signal } = {}) {
  const url = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${encodeURIComponent(file)}`;
  const res = await fetch(url, { signal });
  if (!res.ok) {
    throw new Error(`Could not load "${file}" (${res.status}).`);
  }
  return res.text();
}

export const GDD_REPO_URL = `https://github.com/${OWNER}/${REPO}`;

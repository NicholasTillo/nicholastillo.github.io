/*
 * GDD feedback — per-section comments stored in a Google Form + Sheet.
 * --------------------------------------------------------------------------
 * The site has no backend, so:
 *   - Write: POST to the Google Form's formResponse endpoint (mode 'no-cors',
 *     response is opaque, so the UI appends the comment optimistically).
 *   - Read: the linked Sheet's gviz JSON endpoint (CORS-open for public sheets).
 * Sheet columns (Form order): A timestamp, B doc, C section, D name, E comment,
 * F approved (added by hand; type "y" to publish a comment).
 *
 * ponytail: Google Forms/Sheets instead of a database. If either endpoint ever
 * breaks, swap this file for Giscus (drops anonymous posting).
 */

// From the Google Form / Sheet (see GDD_FEEDBACK_PLAN.md).
const SHEET_ID = '1W5s4cAsaK--LJqt_F27MC6pbAe813BCWoU6JbUVmp1g';
const FORM_ACTION =
  'https://docs.google.com/forms/d/e/1FAIpQLSf21LzcwY-R7YqhGkC3tlYawQBRlymGktJRlZy53hJLDZrhOw/formResponse';
const ENTRY = {
  doc: 'entry.845066741',
  section: 'entry.1464780929',
  name: 'entry.1947937781',
  comment: 'entry.1683946651',
};
const REQUIRE_APPROVAL = true;

export const FEEDBACK_ENABLED = Boolean(SHEET_ID && FORM_ACTION);
export const NEEDS_APPROVAL = REQUIRE_APPROVAL;

const MAX_NAME = 40;
const MAX_COMMENT = 2000;

// gviz dates look like "Date(2026,8,16,14,3,5)" (month is 0-based).
function parseGvizDate(v) {
  const m = /^Date\((\d+),(\d+),(\d+)(?:,(\d+),(\d+),(\d+))?\)$/.exec(v || '');
  return m ? new Date(m[1], m[2], m[3], m[4] || 0, m[5] || 0, m[6] || 0) : null;
}

const cell = (row, i) => (row.c[i] && row.c[i].v != null ? String(row.c[i].v) : '');

// All visible comments, oldest first (sheet rows are already chronological).
export async function fetchFeedback({ signal } = {}) {
  if (!FEEDBACK_ENABLED) return [];
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&headers=1`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`Could not load feedback (${res.status}).`);
  const text = await res.text();
  // Strip the "/*O_o*/ google.visualization.Query.setResponse(...);" wrapper.
  const json = JSON.parse(text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1));
  return json.table.rows
    .filter((r) => r && r.c)
    .map((r) => ({
      at: parseGvizDate(cell(r, 0)),
      doc: cell(r, 1),
      section: cell(r, 2),
      name: cell(r, 3),
      comment: cell(r, 4),
      approved: cell(r, 5).trim().toLowerCase() === 'y',
    }))
    .filter((c) => c.comment && (!REQUIRE_APPROVAL || c.approved));
}

// Submit one comment. Returns the cleaned row for optimistic display.
export async function postFeedback({ doc, section, name, comment }) {
  const clean = {
    doc,
    section,
    name: (name || '').trim().slice(0, MAX_NAME),
    comment: (comment || '').trim().slice(0, MAX_COMMENT),
  };
  if (!clean.comment) throw new Error('Comment is empty.');
  const body = new FormData();
  for (const key of Object.keys(ENTRY)) body.append(ENTRY[key], clean[key]);
  // Opaque response: a network failure throws, anything else counts as sent.
  await fetch(FORM_ACTION, { method: 'POST', mode: 'no-cors', body });
  return { ...clean, at: new Date(), approved: !REQUIRE_APPROVAL };
}

export const LIMITS = { name: MAX_NAME, comment: MAX_COMMENT };

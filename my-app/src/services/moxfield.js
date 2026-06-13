/*
 * Moxfield deck service
 * --------------------------------------------------------------------------
 * Fetches a public Moxfield decklist and normalises it into a flat card list
 * that the scoring engine understands.
 *
 * Reality check: this site is a static GitHub Pages build with no backend, and
 * Moxfield's public API (api2.moxfield.com) does not send permissive CORS
 * headers, so a direct browser fetch is usually blocked. We therefore degrade
 * gracefully through three strategies, in order:
 *
 *   1. Direct fetch of the Moxfield API (works behind a proxy/extension, or if
 *      CORS is ever permitted).
 *   2. An optional, configurable CORS proxy (see MOXFIELD_PROXY). Off by
 *      default so we never silently route a user's traffic through a third
 *      party. Set it to your own proxy for a production deployment.
 *   3. Manual paste fallback handled by the UI via parseDecklistText().
 *
 * The normalised shape returned by fetchMoxfieldDeck / parseDecklistText is:
 *   {
 *     name: string,
 *     source: 'moxfield' | 'manual',
 *     url: string | null,
 *     cards: Array<{ name, quantity, board, card }>
 *   }
 * where `card` carries whatever attributes we know (manaValue, typeLine,
 * colors, oracleText). For manually pasted lists `card` is null.
 */

// Base of the public Moxfield API. v3 is current; we fall back to v2 shapes
// defensively when parsing in case the response format shifts.
const MOXFIELD_API_BASE = 'https://api2.moxfield.com/v3/decks/all/';

// Optional CORS proxy. Leave empty to disable. When set, the deck request is
// issued as `${MOXFIELD_PROXY}${encodeURIComponent(apiUrl)}` which matches the
// common "?url=" style proxy convention. Point this at infrastructure you
// control before relying on it in production.
const MOXFIELD_PROXY = '';

// Boards we score. Sideboard/maybeboard are excluded so the score reflects the
// deck as it is actually played.
const SCORING_BOARDS = ['mainboard', 'commanders', 'companions'];

/**
 * Extract the public deck id from a Moxfield URL or accept a raw id.
 * Accepts: https://www.moxfield.com/decks/<id>, with or without protocol,
 * trailing slashes, query strings, or a bare id pasted on its own.
 * @returns {string|null} the deck id, or null if nothing usable was found.
 */
export function parseMoxfieldDeckId(input) {
  if (!input || typeof input !== 'string') return null;
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Full or partial URL containing /decks/<id>.
  const urlMatch = trimmed.match(/moxfield\.com\/decks\/([A-Za-z0-9_-]+)/i);
  if (urlMatch) return urlMatch[1];

  // A bare id: Moxfield public ids are URL-safe tokens with no slashes/spaces.
  if (/^[A-Za-z0-9_-]+$/.test(trimmed)) return trimmed;

  return null;
}

/**
 * Pull whichever card-attribute fields exist off a Moxfield card payload so the
 * heuristic scorer has something to work with regardless of API version.
 */
function normaliseCardAttributes(rawCard) {
  if (!rawCard || typeof rawCard !== 'object') return null;
  const manaValue = rawCard.cmc ?? rawCard.mana_value ?? rawCard.manaValue ?? null;
  return {
    name: rawCard.name || '',
    manaValue: typeof manaValue === 'number' ? manaValue : null,
    typeLine: rawCard.type_line || rawCard.type || '',
    colors: Array.isArray(rawCard.colors) ? rawCard.colors : [],
    oracleText: rawCard.oracle_text || rawCard.text || '',
  };
}

/**
 * Turn a Moxfield deck payload (v3 `boards` map, or legacy v2 board objects)
 * into our flat normalised card list.
 */
function normaliseMoxfieldDeck(payload, url) {
  const cards = [];

  const collectBoard = (boardName, boardCards) => {
    if (!boardCards || typeof boardCards !== 'object') return;
    for (const entry of Object.values(boardCards)) {
      if (!entry) continue;
      const quantity = entry.quantity ?? entry.count ?? 1;
      const rawCard = entry.card || entry;
      const name = (rawCard && rawCard.name) || entry.name;
      if (!name) continue;
      cards.push({
        name,
        quantity,
        board: boardName,
        card: normaliseCardAttributes(rawCard),
      });
    }
  };

  if (payload && payload.boards && typeof payload.boards === 'object') {
    // v3 shape: { boards: { mainboard: { cards: {...} }, ... } }
    for (const boardName of SCORING_BOARDS) {
      const board = payload.boards[boardName];
      if (board && board.cards) collectBoard(boardName, board.cards);
    }
  } else if (payload) {
    // Legacy v2 shape: top-level board objects.
    for (const boardName of SCORING_BOARDS) {
      if (payload[boardName]) collectBoard(boardName, payload[boardName]);
    }
  }

  return {
    name: (payload && payload.name) || 'Untitled deck',
    source: 'moxfield',
    url: url || null,
    cards,
  };
}

/**
 * Fetch and normalise a public Moxfield deck.
 * @param {string} deckId - public deck id (use parseMoxfieldDeckId first).
 * @param {object} [opts]
 * @param {string} [opts.proxy] - override the configured CORS proxy.
 * @param {AbortSignal} [opts.signal] - abort signal for cancellation.
 * @returns {Promise<object>} normalised deck.
 * @throws {Error} with a user-facing message on failure.
 */
export async function fetchMoxfieldDeck(deckId, opts = {}) {
  if (!deckId) throw new Error('No Moxfield deck id was provided.');

  const apiUrl = `${MOXFIELD_API_BASE}${encodeURIComponent(deckId)}`;
  const proxy = opts.proxy ?? MOXFIELD_PROXY;
  const requestUrl = proxy ? `${proxy}${encodeURIComponent(apiUrl)}` : apiUrl;
  const deckUrl = `https://www.moxfield.com/decks/${deckId}`;

  let response;
  try {
    response = await fetch(requestUrl, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: opts.signal,
    });
  } catch (err) {
    if (err && err.name === 'AbortError') throw err;
    // Almost always a CORS/network failure on the static-site path.
    throw new Error(
      'Could not reach Moxfield from the browser (this is usually a CORS ' +
        'restriction). Paste the decklist below instead, or configure a proxy.'
    );
  }

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('That deck was not found. Is the link public and correct?');
    }
    throw new Error(`Moxfield returned an error (HTTP ${response.status}).`);
  }

  let payload;
  try {
    payload = await response.json();
  } catch (err) {
    throw new Error('Moxfield returned a response we could not read.');
  }

  const deck = normaliseMoxfieldDeck(payload, deckUrl);
  if (!deck.cards.length) {
    throw new Error('That deck appears to be empty or could not be parsed.');
  }
  return deck;
}

/**
 * Parse a plain-text decklist (the manual fallback). Handles the common
 * exported formats, e.g.:
 *   "1 Llanowar Elves"
 *   "2x Brainstorm"
 *   "3 Forest (M21) 280"   -> set/collector suffixes are stripped
 * Lines that are blank, comments (// or #), or board headers ("Sideboard")
 * are ignored. Quantities default to 1 when omitted.
 * @returns {object} normalised deck with source 'manual'.
 */
export function parseDecklistText(text, deckName = 'Pasted decklist') {
  const cards = [];
  if (!text || typeof text !== 'string') {
    return { name: deckName, source: 'manual', url: null, cards };
  }

  const headerWords = /^(deck|sideboard|maybeboard|commander|companion|tokens?)\b/i;

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;
    if (line.startsWith('//') || line.startsWith('#')) continue;
    if (headerWords.test(line) && !/^\d/.test(line)) continue;

    // "<qty> <name>" or "<qty>x <name>"; qty optional.
    const match = line.match(/^(?:(\d+)\s*[xX]?\s+)?(.+?)\s*$/);
    if (!match) continue;

    const quantity = match[1] ? parseInt(match[1], 10) : 1;
    let name = match[2];

    // Strip trailing set code / collector number, e.g. "(M21) 280".
    name = name.replace(/\s*\([^)]*\)\s*[\dA-Za-z-]*\s*$/, '').trim();
    if (!name) continue;

    cards.push({ name, quantity, board: 'mainboard', card: null });
  }

  return { name: deckName, source: 'manual', url: null, cards };
}

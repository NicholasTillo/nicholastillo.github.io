/*
 * Building the swipe deck: pair proteins with sides, then interleave the
 * three card kinds so the queue is mostly familiar with suggestions folded in
 * at a predictable rate.
 *
 * Pure functions, no I/O — `rand` is injected everywhere so the tests are
 * deterministic and this file never touches React.
 */

// The share of the finished deck each kind should take.
//
// `buildQueue` anchors deck size on the `old` pool (total = olds.length /
// DECK_MIX.old), so these shares set both the ratio AND how long a session is.
// With the handful of family recipes as `old`, this gives a ~32-card deck of
// which ~19 are drawn fresh from the imported Instagram recipes each time.
// This is the one tuning knob — if a session feels too long or too unfamiliar,
// it is the only line to change.
export const DECK_MIX = { old: 0.25, combo: 0.15, new: 0.6 };

function shuffle(arr, rand) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/*
 * Random protein + side pairings, shaped so they are structurally recipes:
 * the queue, the filter and the card need no combo branch at all. Only the
 * detail sheet reads `parts`.
 *
 * The ingredient union is what makes a combo drop out of the queue when
 * EITHER half is ruled out, for free.
 *
 * ponytail: shuffles the whole cross product rather than cycling two lists.
 * Cycling with one index regenerates the same pair as soon as it wraps, and
 * both lists are small enough (a handful each) that the full product is
 * cheaper than any scheme for avoiding that.
 */
export function makeCombos(proteins, sides, count, rand = Math.random) {
  if (!proteins.length || !sides.length || count <= 0) return [];

  const pairs = [];
  for (const protein of proteins) for (const side of sides) pairs.push([protein, side]);

  const out = [];
  for (const [protein, side] of shuffle(pairs, rand).slice(0, count)) {
    out.push({
      id: `combo:${protein.id}+${side.id}`,
      name: `${protein.name} + ${side.name}`,
      kind: 'combo',
      ingredients: [...protein.ingredients, ...side.ingredients],
      ingredientLines: [...protein.ingredientLines, ...side.ingredientLines],
      steps: [],
      imageUrl: protein.imageUrl ?? null,
      sourceUrl: null,
      parts: [protein, side],
    });
  }
  return out;
}

// How many cards of a kind the deck wants, given the old-recipe anchor.
// Floored at 1 so a small pool still shows up at all; clamped to what exists.
const want = (total, share, available) =>
  available === 0 ? 0 : Math.max(1, Math.min(available, Math.round(total * share)));

/*
 * One queue from the three pools.
 *
 * Anchors on the old recipes (they're the 70%) and works out how many of the
 * others fit around them, rather than letting a big pile of candidates drown
 * the deck.
 *
 * Non-old cards go at evenly spaced slots — the k-th of n at
 * ((k + 0.5) * total / n) — so they're spread rather than clumped. The +0.5
 * offset means the deck never opens or closes on an unfamiliar card.
 */
export function buildQueue({ old = [], combos = [], fresh = [] }, { rand = Math.random } = {}) {
  const olds = shuffle(old, rand);

  // No familiar recipes to anchor on: the ratio is meaningless, so just show
  // everything there is. Must come before the maths below, which would
  // otherwise discard most of it.
  if (!olds.length) return [...shuffle(combos, rand), ...shuffle(fresh, rand)];

  const total = Math.round(olds.length / DECK_MIX.old);
  const pickedCombos = shuffle(combos, rand).slice(0, want(total, DECK_MIX.combo, combos.length));
  const pickedFresh = shuffle(fresh, rand).slice(0, want(total, DECK_MIX.new, fresh.length));

  const size = olds.length + pickedCombos.length + pickedFresh.length;

  // slot index -> the card claiming it. Later claims nudge forward to the next
  // free slot rather than overwriting.
  const claims = new Map();
  const claim = (cards) => {
    cards.forEach((card, k) => {
      let at = Math.min(size - 1, Math.round(((k + 0.5) * size) / cards.length));
      while (claims.has(at)) at = (at + 1) % size;
      claims.set(at, card);
    });
  };
  claim(pickedCombos);
  claim(pickedFresh);

  const out = [];
  let oi = 0;
  for (let i = 0; i < size; i++) {
    if (claims.has(i)) out.push(claims.get(i));
    else if (oi < olds.length) out.push(olds[oi++]);
  }
  // Belt and braces: never silently drop a card.
  while (oi < olds.length) out.push(olds[oi++]);
  return out;
}

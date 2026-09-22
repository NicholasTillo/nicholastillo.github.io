import { buildQueue, makeCombos, DECK_MIX } from './recipeQueue';

// A fixed "random" so shuffles are deterministic and nothing flakes.
const fixedRand = () => 0.5;

const card = (id, kind) => ({ id, name: `#${id}`, kind, ingredients: [], ingredientLines: [] });
const olds = (n) => Array.from({ length: n }, (_, i) => card(`o${i}`, 'old'));
const news = (n) => Array.from({ length: n }, (_, i) => card(`n${i}`, 'new'));
const half = (n, p) => Array.from({ length: n }, (_, i) => ({
  id: `${p}${i}`, name: `${p}${i}`, ingredients: [`ing-${p}${i}`], ingredientLines: [], imageUrl: null,
}));

describe('makeCombos', () => {
  test('pairs a protein with a side and unions their ingredients', () => {
    const [c] = makeCombos(half(1, 'p'), half(1, 's'), 1, fixedRand);
    expect(c.kind).toBe('combo');
    expect(c.name).toBe('p0 + s0');
    expect(c.ingredients).toEqual(['ing-p0', 'ing-s0']);
    expect(c.parts).toHaveLength(2);
  });

  // The bug this guards: cycling two lists with one index regenerates the
  // same pair as soon as it wraps.
  test('never repeats a pairing, even past the length of either list', () => {
    const combos = makeCombos(half(4, 'p'), half(4, 's'), 16, fixedRand);
    expect(combos).toHaveLength(16);
    expect(new Set(combos.map((c) => c.id)).size).toBe(16);
  });

  test('caps at the number of distinct pairings available', () => {
    expect(makeCombos(half(2, 'p'), half(3, 's'), 99, fixedRand)).toHaveLength(6);
  });

  test('returns nothing when either half is empty', () => {
    expect(makeCombos([], half(3, 's'), 5, fixedRand)).toEqual([]);
    expect(makeCombos(half(3, 'p'), [], 5, fixedRand)).toEqual([]);
    expect(makeCombos(half(3, 'p'), half(3, 's'), 0, fixedRand)).toEqual([]);
  });
});

describe('buildQueue', () => {
  // Pools are deliberately larger than any share needs: `want()` clamps to what
  // is available, so a thin pool would silently cap the ratio under test.
  test('hits roughly the DECK_MIX ratios', () => {
    const q = buildQueue(
      { old: olds(70), combos: makeCombos(half(15, 'p'), half(15, 's'), 200, fixedRand), fresh: news(200) },
      { rand: fixedRand }
    );
    const share = (k) => q.filter((c) => c.kind === k).length / q.length;
    expect(share('old')).toBeCloseTo(DECK_MIX.old, 1);
    expect(share('combo')).toBeCloseTo(DECK_MIX.combo, 1);
    expect(share('new')).toBeCloseTo(DECK_MIX.new, 1);
  });

  test('every card appears exactly once — none dropped, none duplicated', () => {
    const q = buildQueue(
      { old: olds(20), combos: makeCombos(half(4, 'p'), half(4, 's'), 6, fixedRand), fresh: news(5) },
      { rand: fixedRand }
    );
    expect(new Set(q.map((c) => c.id)).size).toBe(q.length);
    expect(q.filter((c) => c.kind === 'old')).toHaveLength(20);
  });

  test('opens on a familiar recipe and never clumps two unfamiliar cards', () => {
    const q = buildQueue(
      { old: olds(70), combos: makeCombos(half(6, 'p'), half(6, 's'), 20, fixedRand), fresh: news(10) },
      { rand: fixedRand }
    );
    expect(q[0].kind).toBe('old');
    for (let i = 1; i < q.length; i++) {
      expect(q[i].kind === 'old' || q[i - 1].kind === 'old').toBe(true);
    }
  });

  test('degrades to whatever pools exist', () => {
    expect(buildQueue({ old: olds(5) }, { rand: fixedRand })).toHaveLength(5);

    // No old recipes: show everything, do not apply the ratio.
    const allNew = buildQueue({ old: [], fresh: news(9) }, { rand: fixedRand });
    expect(allNew).toHaveLength(9);

    expect(buildQueue({}, { rand: fixedRand })).toEqual([]);
  });

  test('a short pool still gets at least one slot', () => {
    const q = buildQueue({ old: olds(100), fresh: news(1) }, { rand: fixedRand });
    expect(q.filter((c) => c.kind === 'new')).toHaveLength(1);
  });
});

import { isBlocked, covered, norm, substituteGroups, ingredientChoices } from './ingredientSubs';

// Uses the real substituteGroups: if you edit them, this test tells you what changed.
const out = (...names) => new Set(names.map(norm));
const card = (...ingredients) => ({ ingredients });

test('nothing is blocked when she has ruled nothing out', () => {
  expect(isBlocked(card('Chicken', 'Rice'), new Set())).toBe(false);
});

test('ruling out an ingredient blocks the cards that need it', () => {
  expect(isBlocked(card('Salmon', 'Lemon'), out('Salmon'))).toBe(true);
  expect(isBlocked(card('Salmon', 'Lemon'), out('Beef'))).toBe(false);
});

// Salmon deliberately: an ingredient with no substitute group, so the only
// thing under test is the norm() comparison.
test('matching ignores case and padding', () => {
  expect(isBlocked(card('  SALMON '), out('salmon'))).toBe(true);
  expect(isBlocked(card('Salmon'), out('  sAlMoN  '))).toBe(true);
});

test('a substitute keeps an ingredient covered', () => {
  const [a, b] = substituteGroups[0]; // e.g. Ground beef / Ground turkey
  expect(covered(a, out(a))).toBe(true);        // b is still available
  expect(isBlocked(card(a), out(a))).toBe(false);
});

test('only ruling out the whole group actually blocks', () => {
  const group = substituteGroups[0];
  expect(isBlocked(card(group[0]), out(...group))).toBe(true);
});

test('a combo is blocked when either half is — via its unioned ingredients', () => {
  // Mushrooms deliberately: a side ingredient with no substitute group.
  const combo = card('Chicken', 'Tofu', 'Mushrooms'); // protein group + a side
  expect(isBlocked(combo, out('Mushrooms'))).toBe(true);
  expect(isBlocked(combo, out('Chicken'))).toBe(false); // Tofu still covers it
  expect(isBlocked(combo, out('Chicken', 'Tofu'))).toBe(true);
});

test('ingredientChoices de-dupes across cards and sorts A-Z', () => {
  const choices = ingredientChoices([card('Rice', 'Chicken'), card('chicken', 'Apple')]);
  expect(choices).toEqual(['Apple', 'Chicken', 'Rice']);
});

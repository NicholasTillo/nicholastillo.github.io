/*
 * Ingredient substitution rules — static facts about the kitchen, not about
 * recipes. Recipes live in Supabase (see services/recipes.js); these six
 * groups stay in code because they never change and a second request to
 * fetch them would buy nothing.
 *
 * Maintenance note: group names are matched against recipe ingredients after
 * norm(), so they must match the spelling used in the database.
 */

// Ingredients that can stand in for each other. Every item in a group is
// treated as interchangeable, so having any one of them covers the others.
//
// Names must match tools/ingredients.txt, the controlled vocabulary the
// Instagram import writes into `ingredients` — a group naming something that
// column never contains does nothing at all.
//
// Erring towards generous is right here: a wrong group shows her one card she
// cannot cook, while a missing group hides a dinner she could have made.
//
// ponytail: still a guess at this kitchen — edit to match what the family
// actually swaps. Not every ingredient needs a group; most have none.
// Salmon and Potatoes are deliberately group-less: the tests use them as
// controls for the no-substitute path, and neither had an honest stand-in
// anyway (canned tuna is not a salmon fillet; sweet potato is not mash).
export const substituteGroups = [
  ['Ground beef', 'Ground turkey', 'Ground chicken', 'Ground pork'],
  ['Chicken', 'Tofu'],
  ['Beef', 'Steak'],
  ['Bacon', 'Ham'],
  ['Rice', 'Quinoa', 'Couscous'],
  ['Pasta', 'Noodles'],
  ['Tortillas', 'Taco shells'],
  ['Cheese', 'Mozzarella', 'Parmesan'],
  ['Cream', 'Coconut milk'],
  ['Beans', 'Chickpeas', 'Lentils'],
  ['Broccoli', 'Cauliflower', 'Green beans'],
  ['Spinach', 'Lettuce'],
  ['Lemon', 'Lime'],
];

export const norm = (s) => s.trim().toLowerCase();

// norm(ingredient) -> Set of interchangeable norm(ingredient)s.
// ponytail: static data, so build it once at module load instead of per-render.
export const subMap = (() => {
  const m = new Map();
  for (const group of substituteGroups) {
    const keys = group.map(norm);
    for (const k of keys) {
      const set = m.get(k) || new Set();
      keys.forEach((other) => other !== k && set.add(other));
      m.set(k, set);
    }
  }
  return m;
})();

// An ingredient is on hand unless she's marked it out AND marked out
// everything that could stand in for it.
export const covered = (ing, lacking) => {
  const k = norm(ing);
  if (!lacking.has(k)) return true;
  for (const s of subMap.get(k) || []) if (!lacking.has(s)) return true;
  return false;
};

// Should this card drop out of the queue? `lacking` is a Set of normed names.
// Combo cards carry the union of both halves' ingredients, so a combo is
// blocked when either half is — no combo-aware code needed here.
export const isBlocked = (card, lacking) =>
  lacking.size > 0 && card.ingredients.some((i) => !covered(i, lacking));

// Every ingredient across the given cards, de-duped, in display form, A-Z.
// Feeds the filter chips.
export function ingredientChoices(cards) {
  const seen = new Map(); // norm -> display
  for (const c of cards) {
    for (const i of c.ingredients) {
      const k = norm(i);
      if (!seen.has(k)) seen.set(k, i.trim());
    }
  }
  return [...seen.values()].sort((a, b) => a.localeCompare(b));
}

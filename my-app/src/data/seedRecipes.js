/*
 * Built-in recipe list. Two jobs:
 *   1. Lets the deck run before the Supabase project exists.
 *   2. Ships permanently as the offline fallback — if the database is paused,
 *      unreachable or empty, services/recipes.js resolves these instead of
 *      failing, so the page is never dead.
 *
 * Already in the normalized (camelCase) shape, so it can stand in for a
 * fetched row without any conversion.
 *
 * ponytail: placeholder content — replace with the real family recipes.
 * Once Supabase is live, keep this file small; it only has to be good enough
 * to answer "what's for dinner" when the network isn't.
 */

const r = (id, name, kind, ingredients, ingredientLines, steps) => ({
  id,
  name,
  kind,
  ingredients,
  ingredientLines: ingredientLines || ingredients,
  steps,
  imageUrl: null,
  sourceUrl: null,
});

export const seedRecipes = [
  r(1, 'Tacos', 'old',
    ['Ground beef', 'Tortillas', 'Cheese', 'Lettuce'],
    ['1 lb ground beef', '8 small tortillas', '1 cup shredded cheese', 'Half a head of lettuce, shredded'],
    ['Brown the beef over medium-high heat, breaking it up as it cooks.',
     'Stir in the taco seasoning and a splash of water; simmer until thickened.',
     'Warm the tortillas in a dry pan, 20 seconds a side.',
     'Build each taco: beef, cheese, lettuce.']),

  r(2, 'Spaghetti', 'old',
    ['Pasta', 'Tomato sauce', 'Ground beef', 'Parmesan'],
    ['400 g spaghetti', '1 jar tomato sauce', '1 lb ground beef', 'Parmesan to finish'],
    ['Salt the pasta water heavily and bring it to a boil.',
     'Brown the beef, then pour in the sauce and simmer while the pasta cooks.',
     'Cook the spaghetti one minute short of the box time.',
     'Toss the pasta through the sauce with a splash of pasta water. Grate parmesan over.']),

  r(3, 'Shepherd’s Pie', 'old',
    ['Ground beef', 'Potatoes', 'Peas', 'Carrots'],
    ['1 lb ground beef', '6 potatoes', '1 cup frozen peas', '2 carrots, diced'],
    ['Boil the potatoes until a knife slides through; mash with butter.',
     'Brown the beef with the carrots, then stir in the peas.',
     'Spread the mince in a baking dish and top with the mash, forking the surface.',
     'Bake at 200°C for 25 minutes, until the peaks brown.']),

  r(4, 'Butter Chicken', 'old',
    ['Chicken', 'Cream', 'Tomato', 'Rice'],
    ['4 chicken thighs, cubed', '1 cup cream', '1 can crushed tomato', '2 cups rice'],
    ['Sear the chicken in batches; set aside.',
     'Soften the onion and spices, add the tomato, simmer 10 minutes.',
     'Return the chicken, stir in the cream, simmer until it coats a spoon.',
     'Serve over rice.']),

  r(5, 'Homemade Pizza', 'old',
    ['Dough', 'Tomato sauce', 'Mozzarella'],
    ['1 ball pizza dough', 'Half a cup tomato sauce', '200 g mozzarella'],
    ['Heat the oven as high as it goes with a tray inside.',
     'Stretch the dough thin; it should be translucent in the middle.',
     'Sauce thinly, then tear the mozzarella over.',
     'Bake 8–10 minutes until the crust is blistered.']),

  r(6, 'Chicken Curry', 'old',
    ['Chicken', 'Curry paste', 'Coconut milk', 'Rice'],
    ['4 chicken thighs', '2 tbsp curry paste', '1 can coconut milk', '2 cups rice'],
    ['Fry the curry paste in a little oil until it smells fragrant.',
     'Add the chicken and turn it through the paste.',
     'Pour in the coconut milk and simmer 20 minutes.',
     'Serve over rice.']),

  r(7, 'Stir Fry', 'old',
    ['Rice', 'Chicken', 'Mixed veggies', 'Soy sauce'],
    ['2 cups rice', '2 chicken breasts, sliced', '1 bag mixed veggies', '3 tbsp soy sauce'],
    ['Get the pan hotter than feels sensible.',
     'Sear the chicken in one layer; do not stir for the first minute.',
     'Add the vegetables and keep everything moving.',
     'Splash in the soy sauce at the very end so it steams rather than burns.']),

  r(8, 'Grilled Salmon', 'old',
    ['Salmon', 'Lemon', 'Potatoes'],
    ['4 salmon fillets', '1 lemon', '6 baby potatoes per person'],
    ['Boil the potatoes, then crush them lightly and crisp in a hot pan.',
     'Dry the salmon skin thoroughly and salt it.',
     'Skin-side down in a hot pan for 4 minutes, then 1 minute on the flesh.',
     'Squeeze the lemon over everything.']),

  r(20, 'Lemon Orzo with Feta', 'new',
    ['Pasta', 'Lemon', 'Cheese'],
    ['300 g orzo', '1 lemon', '150 g feta'],
    ['Cook the orzo in salted water until just tender.',
     'Off the heat, stir through lemon zest, juice and olive oil.',
     'Crumble the feta over and fold once — it should stay in pieces.']),

  r(21, 'Black Bean Tacos', 'new',
    ['Tortillas', 'Tomato', 'Cheese'],
    ['8 tortillas', '1 can black beans', '2 tomatoes', '1 cup cheese'],
    ['Fry the drained beans with cumin until they start to catch.',
     'Mash about half of them so the filling holds together.',
     'Warm the tortillas and fill; top with chopped tomato and cheese.']),

  r(22, 'Coconut Chickpea Stew', 'new',
    ['Coconut milk', 'Tomato', 'Rice'],
    ['1 can chickpeas', '1 can coconut milk', '1 can tomato', '2 cups rice'],
    ['Soften onion and garlic, add curry powder and cook it out.',
     'Add the chickpeas, tomato and coconut milk.',
     'Simmer 25 minutes until it thickens. Serve over rice.']),

  r(23, 'Sheet Pan Sausage and Peppers', 'new',
    ['Potatoes', 'Mixed veggies'],
    ['6 sausages', '4 potatoes, cubed', '2 peppers, sliced'],
    ['Heat the oven to 220°C.',
     'Toss everything with oil, salt and dried oregano on one tray.',
     'Roast 35 minutes, turning once, until the edges char.']),
];

export const seedProteins = [
  r(101, 'Roast chicken thighs', null, ['Chicken'],
    ['6 bone-in chicken thighs'],
    ['Dry the skin and salt generously.',
     'Skin-side up at 220°C for 35 minutes, no turning.']),
  r(102, 'Pan-seared salmon', null, ['Salmon'],
    ['4 salmon fillets'],
    ['Dry the skin thoroughly and salt it.',
     'Skin-side down in a hot pan 4 minutes, 1 minute on the flesh.']),
  r(103, 'Garlic butter shrimp', null, ['Shrimp'],
    ['500 g shrimp', '3 cloves garlic', '2 tbsp butter'],
    ['Melt the butter, add the garlic, wait until it smells sweet.',
     'Add the shrimp; they are done the moment they curl.']),
  r(104, 'Crispy tofu', null, ['Tofu'],
    ['1 block firm tofu', '2 tbsp cornstarch'],
    ['Press the tofu 20 minutes, then cube and toss in cornstarch.',
     'Shallow fry until each face is golden.']),
  r(105, 'Pork chops', null, ['Pork'],
    ['4 bone-in pork chops'],
    ['Salt an hour ahead if you can.',
     'Hard sear both sides, then rest 5 minutes before slicing.']),
  r(106, 'Beef meatballs', null, ['Ground beef'],
    ['1 lb ground beef', '1 egg', 'Half a cup breadcrumbs'],
    ['Mix gently — overworking makes them bouncy.',
     'Roll golf-ball sized, brown all over, finish in the oven 10 minutes.']),
];

export const seedSides = [
  r(201, 'Garlic rice', null, ['Rice'],
    ['2 cups rice', '3 cloves garlic'],
    ['Fry the garlic in butter until barely golden.',
     'Stir through freshly cooked rice.']),
  r(202, 'Roasted broccoli', null, ['Broccoli'],
    ['2 heads broccoli'],
    ['Toss with oil and salt.',
     '220°C for 20 minutes — the charred bits are the point.']),
  r(203, 'Mashed potatoes', null, ['Potatoes'],
    ['6 potatoes', '100 g butter'],
    ['Boil until a knife slides through with no resistance.',
     'Mash with warm butter; cold butter makes them gluey.']),
  r(204, 'Simple green salad', null, ['Lettuce', 'Lemon'],
    ['1 head lettuce', '1 lemon'],
    ['Dress with lemon, olive oil and salt just before serving.']),
  r(205, 'Buttered noodles', null, ['Pasta', 'Parmesan'],
    ['300 g egg noodles', '50 g butter', 'Parmesan'],
    ['Cook the noodles, drain, toss with butter and a little pasta water.',
     'Grate parmesan over off the heat.']),
  r(206, 'Honey glazed carrots', null, ['Carrots'],
    ['6 carrots', '2 tbsp honey'],
    ['Roast the carrots 20 minutes.',
     'Brush with honey and give them 5 minutes more.']),
];

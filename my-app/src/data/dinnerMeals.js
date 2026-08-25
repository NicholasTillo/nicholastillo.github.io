// The dinner options shown on the wheel. Edit this list freely.
// Each meal: a name + a few key ingredients (the things to check the pantry for).
// ponytail: placeholder starter list — replace with the real family meals.
export const meals = [
  { name: 'Tacos', ingredients: ['Tortillas', 'Ground beef', 'Cheese', 'Lettuce'] },
  { name: 'Spaghetti', ingredients: ['Pasta', 'Tomato sauce', 'Ground beef', 'Parmesan'] },
  { name: 'Stir Fry', ingredients: ['Rice', 'Chicken', 'Mixed veggies', 'Soy sauce'] },
  { name: 'Butter Chicken', ingredients: ['Chicken', 'Cream', 'Tomato', 'Rice'] },
  { name: 'Homemade Pizza', ingredients: ['Dough', 'Tomato sauce', 'Mozzarella'] },
  { name: 'Grilled Salmon', ingredients: ['Salmon', 'Lemon', 'Potatoes'] },
  { name: 'Shepherd’s Pie', ingredients: ['Ground beef', 'Potatoes', 'Peas', 'Carrots'] },
  { name: 'Chicken Curry', ingredients: ['Chicken', 'Curry paste', 'Coconut milk', 'Rice'] },
];

// Ingredients that can stand in for each other. Every item in a group is
// treated as interchangeable, so having any one of them covers the others.
// ponytail: placeholder groups — edit to match what your family actually swaps.
export const substituteGroups = [
  ['Ground beef', 'Ground turkey', 'Ground chicken'],
  ['Chicken', 'Tofu'],
  ['Rice', 'Quinoa'],
  ['Tortillas', 'Taco shells'],
  ['Cheese', 'Mozzarella', 'Parmesan'],
  ['Cream', 'Coconut milk'],
];

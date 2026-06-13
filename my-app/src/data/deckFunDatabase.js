/*
 * Deck "fun" scoring data (two-axis)
 * --------------------------------------------------------------------------
 * The Deck Checker plots a deck on a 2-D grid and asks "what animal is it most
 * like?". The two axes are:
 *
 *   X = Fun to PLAY        (0 = a chore to pilot, 100 = a blast to pilot)
 *   Y = Fun to play AGAINST(0 = miserable to sit across from, 100 = a joy to face)
 *
 * Each region of the grid maps to an animal (see `animals` + animalFor() in
 * deckScore.js). All of this is a creative, fully tunable call — edit freely.
 *
 * Two inputs feed the scorer (src/services/deckScore.js):
 *   - `cardScores`: explicit per-card overrides, keyed by NORMALISED name,
 *     value [funToPlay, funToPlayAgainst]. Always wins over the heuristic.
 *   - `heuristicConfig`: weights for the fallback heuristic used when a card
 *     is not in `cardScores` but we have its attributes from Moxfield.
 */

/**
 * Canonical card-name normaliser. Shared by the database and the scorer so a
 * lookup always matches how keys are written here: strip diacritics, lowercase,
 * collapse any run of non-alphanumerics to a single space, trim.
 * @param {string} name
 * @returns {string}
 */
export function normalizeCardName(name) {
  if (!name || typeof name !== 'string') return '';
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip combining diacritics (e.g. Lim-Dûl)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

/**
 * Explicit overrides. Keys MUST already be in normalised form. Each value is
 * [funToPlay, funToPlayAgainst], both 0..100. Deliberately small but
 * recognisable; expand by hand over time.
 */
export const cardScores = {
  // Fun to slam, miserable to face (high play / low against) — "Shark" corner
  'sol ring': [72, 22],
  'mana crypt': [70, 18],
  'cyclonic rift': [82, 14],
  'expropriate': [78, 8],
  'craterhoof behemoth': [85, 28],
  'rhystic study': [62, 12],
  'smothering tithe': [58, 15],
  'consecrated sphinx': [70, 20],
  'blightsteel colossus': [80, 18],
  'armageddon': [62, 6],

  // Clean and interactive — fun both ways (high play / high against) — "Frog"
  'lightning bolt': [68, 58],
  'swords to plowshares': [60, 56],
  'beast within': [62, 60],
  'serra angel': [56, 64],
  'llanowar elves': [44, 60],
  'birds of paradise': [44, 62],

  // Dull to pilot but fair to face (low play / high against) — "Sloth"
  'grizzly bears': [38, 62],
  'walking ballista': [46, 58],

  // A drag for everyone (low play / low against) — "Worm"
  'winter orb': [34, 8],
  'static orb': [30, 8],
  'propaganda': [42, 34],
  'sensei s divining top': [44, 32],

  // Cerebral and balanced (near centre) — "Octopus"
  'counterspell': [52, 40],
  'brainstorm': [60, 46],
  'snapcaster mage': [62, 48],
  'tarmogoyf': [52, 56],
};

/**
 * Animals by grid region. Tunable copy + emoji. Resolved by animalFor() in
 * deckScore.js.
 *   frog    = high play / high against (top-right)
 *   shark   = high play / low  against (bottom-right)
 *   sloth   = low  play / high against (top-left)
 *   worm    = low  play / low  against (bottom-left)
 *   octopus = near the centre of both axes
 */
export const animals = {
  frog: { key: 'frog', emoji: '🐸', name: 'Frog', blurb: 'A joy on both sides of the table — bouncy, fair, and fun.' },
  shark: { key: 'shark', emoji: '🦈', name: 'Shark', blurb: 'A blast to pilot; everyone else is chum.' },
  sloth: { key: 'sloth', emoji: '🦥', name: 'Sloth', blurb: 'A slog to play, but a relaxing matchup to face.' },
  worm: { key: 'worm', emoji: '🪱', name: 'Worm', blurb: 'Low to the ground and grindy — nobody is really having fun.' },
  octopus: { key: 'octopus', emoji: '🐙', name: 'Octopus', blurb: 'Clever and balanced — fair fun all around.' },
};

/** Half-width of the central "Octopus" zone, in score points on each axis. */
export const animalCenterRadius = 12;

/**
 * Tunable weights for the attribute-based fallback heuristic. Values are in
 * "score points" and the result is clamped to `clamp`.
 */
export const heuristicConfig = {
  base: 50,

  // Fun to play AGAINST — oppressive text subtracts, fair bodies add.
  counterPenalty: 18, // "counter target ..."
  landDestructionPenalty: 28, // blowing up / locking lands
  extraTurnPenalty: 24, // taking extra turns
  discardPenalty: 16, // making opponents discard
  skipPenalty: 16, // "skip your/their ... step"
  cantPenalty: 8, // "can't" lockout text
  fairCreaturePlayAgainstBonus: 8, // a vanilla-ish body is fair to face

  // Fun to PLAY — splashy/flexible adds, purely reactive subtracts.
  drawBonus: 8, // drawing cards feels good
  extraTurnFunBonus: 10, // taking extra turns is fun for you
  modalBonus: 6, // flexible / modal cards
  splashyMv: 6, // mana value at/above which a card counts as a "splashy" payoff
  splashyBonus: 10,
  reactivePenalty: 6, // a bare counterspell is less fun to durdle with

  clamp: [0, 100],
};

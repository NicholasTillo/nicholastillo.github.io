/*
 * Deck scoring engine (two-axis)
 * --------------------------------------------------------------------------
 * Turns a normalised deck (from src/services/moxfield.js) into a point on the
 * "fun to play" x "fun to play against" grid, the matching animal, a
 * confidence figure, and a small breakdown.
 *
 *   funToPlay        : 0..100 (X axis)
 *   funToPlayAgainst : 0..100 (Y axis)
 *   confidence       : 0..1   (quantity-weighted share of cards we had data for)
 *   animal           : the animal for that region (see deckFunDatabase.animals)
 *   breakdown        : { mostFunToPlay, saltiest } arrays of notable cards
 *
 * Per card the two scores are resolved in priority order:
 *   1. explicit override in cardScores (always wins)
 *   2. attribute heuristic, when Moxfield gave us card attributes
 *   3. neutral [base, base] with no confidence (e.g. a bare pasted name)
 */

import {
  cardScores,
  heuristicConfig,
  animals,
  animalCenterRadius,
  normalizeCardName,
} from '../data/deckFunDatabase';

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/**
 * Attribute-based fallback scores for a single card.
 * @returns {[number, number]} [funToPlay, funToPlayAgainst]
 */
function heuristicScores(attrs, cfg) {
  const type = (attrs.typeLine || '').toLowerCase();
  const text = (attrs.oracleText || '').toLowerCase();
  const mv = typeof attrs.manaValue === 'number' ? attrs.manaValue : 3;

  // Lands are axis-neutral so they don't drag the averages around.
  if (type.includes('land')) return [cfg.base, cfg.base];

  // --- Fun to play AGAINST ---
  let against = cfg.base;
  if (/counter target/.test(text)) against -= cfg.counterPenalty;
  if (/destroy (target|all|each)[^.]*land|sacrifices? a land/.test(text)) against -= cfg.landDestructionPenalty;
  if (/extra turn/.test(text)) against -= cfg.extraTurnPenalty;
  if (/(each|target) opponent[^.]*discard|each player discards/.test(text)) against -= cfg.discardPenalty;
  if (/skip (your|the|their) /.test(text)) against -= cfg.skipPenalty;
  if (/\bcan't\b/.test(text)) against -= cfg.cantPenalty;
  if (type.includes('creature') && against === cfg.base) against += cfg.fairCreaturePlayAgainstBonus;

  // --- Fun to PLAY ---
  let play = cfg.base;
  if (/draw (a card|two cards|three cards|cards|x cards)/.test(text)) play += cfg.drawBonus;
  if (/extra turn/.test(text)) play += cfg.extraTurnFunBonus;
  if (/choose (one|two|three)|\bmodal\b/.test(text)) play += cfg.modalBonus;
  if (mv >= cfg.splashyMv) play += cfg.splashyBonus;
  if (/counter target/.test(text) && type.includes('instant')) play -= cfg.reactivePenalty;

  return [
    clamp(play, cfg.clamp[0], cfg.clamp[1]),
    clamp(against, cfg.clamp[0], cfg.clamp[1]),
  ];
}

/**
 * Resolve a single deck entry to [funToPlay, funToPlayAgainst] and whether we
 * actually had data for it.
 * @returns {{ play: number, against: number, known: boolean }}
 */
function scoreCard(entry) {
  const key = normalizeCardName(entry.name);

  if (Object.prototype.hasOwnProperty.call(cardScores, key)) {
    const [play, against] = cardScores[key];
    return { play, against, known: true };
  }
  if (entry.card) {
    const [play, against] = heuristicScores(entry.card, heuristicConfig);
    return { play, against, known: true };
  }
  return { play: heuristicConfig.base, against: heuristicConfig.base, known: false };
}

/**
 * Map a grid position to its animal. 4 quadrants split at the midpoint, with a
 * central "octopus" zone of half-width animalCenterRadius.
 * @returns {object} an entry from `animals`
 */
export function animalFor(funToPlay, funToPlayAgainst) {
  const x = funToPlay;
  const y = funToPlayAgainst;
  if (Math.abs(x - 50) <= animalCenterRadius && Math.abs(y - 50) <= animalCenterRadius) {
    return animals.octopus;
  }
  if (x >= 50 && y >= 50) return animals.frog;
  if (x >= 50 && y < 50) return animals.shark;
  if (x < 50 && y >= 50) return animals.sloth;
  return animals.worm;
}

/**
 * Score a whole deck.
 * @param {object} deck - normalised deck with a `cards` array.
 * @returns {{ funToPlay: number|null, funToPlayAgainst: number|null,
 *   confidence: number, totalCards: number, animal: object|null, breakdown: object }}
 */
export function scoreDeck(deck) {
  const empty = {
    funToPlay: null,
    funToPlayAgainst: null,
    confidence: 0,
    totalCards: 0,
    animal: null,
    breakdown: { mostFunToPlay: [], saltiest: [] },
  };
  if (!deck || !Array.isArray(deck.cards) || deck.cards.length === 0) {
    return empty;
  }

  let sumPlay = 0;
  let sumAgainst = 0;
  let totalWeight = 0;
  let knownWeight = 0;
  const scored = [];

  for (const entry of deck.cards) {
    const quantity = Number.isFinite(entry.quantity) && entry.quantity > 0 ? entry.quantity : 1;
    const { play, against, known } = scoreCard(entry);

    sumPlay += play * quantity;
    sumAgainst += against * quantity;
    totalWeight += quantity;
    if (known) knownWeight += quantity;

    scored.push({ name: entry.name, quantity, funToPlay: play, funToPlayAgainst: against, known });
  }

  if (totalWeight === 0) return empty;

  const funToPlay = clamp(sumPlay / totalWeight, 0, 100);
  const funToPlayAgainst = clamp(sumAgainst / totalWeight, 0, 100);

  // Breakdown: only surface cards we actually had data for.
  const knownCards = scored.filter((c) => c.known);
  const mostFunToPlay = [...knownCards]
    .sort((a, b) => b.funToPlay - a.funToPlay)
    .filter((c) => c.funToPlay > 50)
    .slice(0, 5);
  const saltiest = [...knownCards]
    .sort((a, b) => a.funToPlayAgainst - b.funToPlayAgainst)
    .filter((c) => c.funToPlayAgainst < 50)
    .slice(0, 5);

  return {
    funToPlay,
    funToPlayAgainst,
    confidence: knownWeight / totalWeight,
    totalCards: totalWeight,
    animal: animalFor(funToPlay, funToPlayAgainst),
    breakdown: { mostFunToPlay, saltiest },
  };
}

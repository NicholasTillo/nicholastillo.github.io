import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Dinner from './dinner';

// Pin the data. This is a test of the UI, so it must not depend on the network
// or on whatever happens to be in the database today.
jest.mock('../services/recipes', () => {
  const seed = jest.requireActual('../data/seedRecipes');
  return {
    fetchDinnerData: () =>
      Promise.resolve({
        recipes: seed.seedRecipes,
        proteins: seed.seedProteins,
        sides: seed.seedSides,
        source: 'seed',
      }),
  };
});

/*
 * Smoke only: that the page mounts, deals a card, and that the buttons and the
 * filter are wired to the queue. The gesture itself is deliberately untested —
 * simulating pointer capture under jsdom is more code than the gesture and
 * would only prove jsdom's simulation works.
 */

const firstCardName = () => document.querySelector('.rcCard--at0 .rcCardName')?.textContent;

test('deals a card from the seed list', async () => {
  render(<Dinner />);
  await waitFor(() => expect(firstCardName()).toBeTruthy());
  expect(screen.getByText(/the recipe box is offline/i)).toBeInTheDocument();
});

test('passing advances to a different card', async () => {
  render(<Dinner />);
  await waitFor(() => expect(firstCardName()).toBeTruthy());
  const first = firstCardName();

  fireEvent.click(screen.getByRole('button', { name: /not tonight/i }));
  await waitFor(() => expect(firstCardName()).not.toBe(first));
});

test('right swipe opens the recipe sheet, and it closes again', async () => {
  render(<Dinner />);
  await waitFor(() => expect(firstCardName()).toBeTruthy());

  fireEvent.click(screen.getByRole('button', { name: /show me the recipe/i }));
  const sheet = await screen.findByRole('dialog');
  expect(sheet).toHaveTextContent(/You'll need/i);

  // Two controls share this label by design (the ✕ and the wide button).
  fireEvent.click(screen.getAllByRole('button', { name: /back to the deck/i })[1]);
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
});

test('ruling out an ingredient shrinks the queue', async () => {
  render(<Dinner />);
  await waitFor(() => expect(firstCardName()).toBeTruthy());

  const countLeft = () => Number(/(\d+) left/.exec(document.body.textContent)?.[1]);
  const before = countLeft();

  // Potatoes have no stand-in, so one tap is enough to block their recipes.
  fireEvent.click(screen.getByRole('button', { name: /^Potatoes$/ }));

  await waitFor(() => expect(countLeft()).toBeLessThan(before));
});

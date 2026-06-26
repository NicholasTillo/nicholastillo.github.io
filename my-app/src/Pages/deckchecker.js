import React, { useState } from 'react';
import './basepages.css';
import './deckchecker.css';

import DeckQuadrant from '../components/DeckQuadrant';
import { parseDecklistText } from '../services/moxfield';
import { scoreDeck } from '../services/deckScore';

/*
 * MTG Deck Checker
 * --------------------------------------------------------------------------
 * Scores a pasted decklist on two axes (fun to play x fun to play against) and
 * plots it on the DeckQuadrant grid to answer "what animal is it most like?".
 * Paste-only: one card per line.
 */
export default function DeckChecker() {
  const [manualText, setManualText] = useState('');
  const [status, setStatus] = useState('idle'); // idle | success | error
  const [error, setError] = useState('');
  const [deck, setDeck] = useState(null);
  const [result, setResult] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const pastedDeck = parseDecklistText(manualText);
    if (!pastedDeck.cards.length) {
      setStatus('error');
      setError('No cards found in the list. Use one card per line, e.g. "1 Llanowar Elves".');
      return;
    }
    setDeck(pastedDeck);
    setResult(scoreDeck(pastedDeck));
    setStatus('success');
    setError('');
  };

  const hasResult = status === 'success' && result && deck;
  const lowConfidence = hasResult && result.confidence < 0.5;

  return (
    <div className="mainBody deckChecker">
      <h1 className="PageTitle">MTG Deck Checker</h1>
      <p className="dcIntro">
        Paste your decklist to find out: <strong>what animal is it most like?</strong>{' '}
        Decks are plotted by how fun they are to play and to play against.
      </p>

      <DeckQuadrant
        funToPlay={result ? result.funToPlay : null}
        funToPlayAgainst={result ? result.funToPlayAgainst : null}
        animal={hasResult ? result.animal : null}
        confidence={result ? result.confidence : 0}
      />

      <form className="dcForm dcForm--paste" onSubmit={handleSubmit}>
        <p className="dcManualHint">
          One card per line, e.g. <code>1 Llanowar Elves</code>.
        </p>
        <textarea
          className="dcTextarea"
          value={manualText}
          onChange={(e) => setManualText(e.target.value)}
          placeholder={'1 Llanowar Elves\n2 Brainstorm\n1 Counterspell'}
          rows={10}
          aria-label="Paste a decklist"
          spellCheck="false"
        />
        <button type="submit" className="dcButton">
          Check deck
        </button>
      </form>

      {status === 'error' && (
        <p className="dcError" role="alert">
          {error}
        </p>
      )}

      {hasResult && (
        <div className="dcResults">
          <h2 className="dcDeckName">{deck.name}</h2>
          <p className="dcMeta">{result.totalCards} cards scored</p>

          {lowConfidence && (
            <p className="dcMeta dcMeta--warn">
              Heads up: we only recognised a minority of these cards, so this
              placement is a rough guess. Add cards to the database to sharpen it.
            </p>
          )}

          <div className="dcBreakdown">
            <div className="dcColumn">
              <h3>Most fun to play</h3>
              {result.breakdown.mostFunToPlay.length ? (
                <ul>
                  {result.breakdown.mostFunToPlay.map((c) => (
                    <li key={`play-${c.name}`}>
                      <span className="dcCardName">{c.name}</span>
                      <span className="dcCardScore">{Math.round(c.funToPlay)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="dcEmpty">Nothing especially fun to pilot.</p>
              )}
            </div>
            <div className="dcColumn">
              <h3>Saltiest to face</h3>
              {result.breakdown.saltiest.length ? (
                <ul>
                  {result.breakdown.saltiest.map((c) => (
                    <li key={`salt-${c.name}`}>
                      <span className="dcCardName">{c.name}</span>
                      <span className="dcCardScore">{Math.round(c.funToPlayAgainst)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="dcEmpty">Nothing especially salty.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

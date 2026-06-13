import React, { useEffect, useRef, useState } from 'react';
import './basepages.css';
import './deckchecker.css';

import DeckQuadrant from '../components/DeckQuadrant';
import {
  parseMoxfieldDeckId,
  fetchMoxfieldDeck,
  parseDecklistText,
} from '../services/moxfield';
import { scoreDeck } from '../services/deckScore';

/*
 * Deck Checker
 * --------------------------------------------------------------------------
 * Reads a public Moxfield decklist, scores it on two axes (fun to play x fun to
 * play against), and plots it on the DeckQuadrant grid to answer "what animal
 * is it most like?". Because this is a static, backend-less site and Moxfield's
 * API is typically CORS-blocked in the browser, a manual paste fallback is
 * always available and is revealed automatically when a fetch fails.
 */
export default function DeckChecker() {
  const [linkValue, setLinkValue] = useState('');
  const [manualText, setManualText] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [error, setError] = useState('');
  const [deck, setDeck] = useState(null);
  const [result, setResult] = useState(null);
  const [showManual, setShowManual] = useState(false);

  const abortRef = useRef(null);

  // Cancel any in-flight fetch if the user navigates away.
  useEffect(() => {
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  const applyDeck = (fetchedDeck) => {
    setDeck(fetchedDeck);
    setResult(scoreDeck(fetchedDeck));
    setStatus('success');
    setError('');
  };

  const handleLinkSubmit = async (event) => {
    event.preventDefault();
    const deckId = parseMoxfieldDeckId(linkValue);
    if (!deckId) {
      setStatus('error');
      setError('That does not look like a Moxfield deck link. Paste a link like https://www.moxfield.com/decks/...');
      setShowManual(true);
      return;
    }

    // Replace any previous request.
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setStatus('loading');
    setError('');
    try {
      const fetchedDeck = await fetchMoxfieldDeck(deckId, { signal: controller.signal });
      applyDeck(fetchedDeck);
    } catch (err) {
      if (err && err.name === 'AbortError') return; // superseded or unmounted
      setStatus('error');
      setError(err.message || 'Something went wrong fetching that deck.');
      setShowManual(true);
    }
  };

  const handleManualSubmit = (event) => {
    event.preventDefault();
    const pastedDeck = parseDecklistText(manualText);
    if (!pastedDeck.cards.length) {
      setStatus('error');
      setError('No cards found in the pasted list. Use one card per line, e.g. "1 Llanowar Elves".');
      return;
    }
    applyDeck(pastedDeck);
  };

  const hasResult = status === 'success' && result && deck;
  const lowConfidence = hasResult && result.confidence < 0.5;

  return (
    <div className="mainBody deckChecker">
      <h1 className="PageTitle">Deck Checker</h1>
      <p className="dcIntro">
        Paste a public Moxfield deck link to find out: <strong>what animal is it
        most like?</strong> Decks are plotted by how fun they are to play and to
        play against.
      </p>

      <DeckQuadrant
        funToPlay={result ? result.funToPlay : null}
        funToPlayAgainst={result ? result.funToPlayAgainst : null}
        animal={hasResult ? result.animal : null}
        confidence={result ? result.confidence : 0}
      />

      <form className="dcForm" onSubmit={handleLinkSubmit}>
        <input
          type="text"
          className="dcInput"
          value={linkValue}
          onChange={(e) => setLinkValue(e.target.value)}
          placeholder="https://www.moxfield.com/decks/..."
          aria-label="Moxfield deck link"
          autoComplete="off"
          spellCheck="false"
        />
        <button type="submit" className="dcButton" disabled={status === 'loading'}>
          {status === 'loading' ? 'Checking…' : 'Check deck'}
        </button>
      </form>

      {status === 'error' && (
        <p className="dcError" role="alert">
          {error}
        </p>
      )}

      {hasResult && (
        <div className="dcResults">
          <h2 className="dcDeckName">
            {deck.url ? (
              <a href={deck.url} target="_blank" rel="noopener noreferrer">
                {deck.name}
              </a>
            ) : (
              deck.name
            )}
          </h2>
          <p className="dcMeta">
            {result.totalCards} cards scored
            {deck.source === 'manual' ? ' · pasted list' : ' · from Moxfield'}
          </p>

          {lowConfidence && (
            <p className="dcMeta dcMeta--warn">
              Heads up: we only recognised a minority of these cards, so this
              placement is a rough guess. Add cards to the database to sharpen it.
            </p>
          )}

          <div className="dcBreakdown">
            <div className="dcColumn">
              <h3>🎉 Most fun to play</h3>
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
              <h3>🧂 Saltiest to face</h3>
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

      <div className="seperator" />

      <details className="dcManual" open={showManual}>
        <summary>Or paste a decklist instead</summary>
        <p className="dcManualHint">
          One card per line, e.g. <code>1 Llanowar Elves</code>. Handy when the
          Moxfield fetch is blocked by your browser.
        </p>
        <form onSubmit={handleManualSubmit}>
          <textarea
            className="dcTextarea"
            value={manualText}
            onChange={(e) => setManualText(e.target.value)}
            placeholder={'1 Llanowar Elves\n2 Brainstorm\n1 Counterspell'}
            rows={8}
            aria-label="Paste a decklist"
            spellCheck="false"
          />
          <button type="submit" className="dcButton">
            Score pasted list
          </button>
        </form>
      </details>
    </div>
  );
}

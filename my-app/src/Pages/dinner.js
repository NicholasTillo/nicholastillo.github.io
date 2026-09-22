import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './basepages.css';
import './dinner.css';

import { fetchDinnerData } from '../services/recipes';
import { buildQueue, makeCombos, DECK_MIX } from '../services/recipeQueue';
import { isBlocked, norm, subMap, covered, substituteGroups } from '../data/ingredientSubs';

/*
 * "What's For Dinner Tomorrow" — a deck of recipe cards. Swipe left to pass,
 * right to read the recipe. The deck mixes family recipes with randomly
 * paired protein+side combos and the occasional new suggestion.
 *
 * Nothing is remembered between sessions: every visit reshuffles. The filter
 * ("what are you out of?") is session-only too, and drops matching cards from
 * the rest of the queue as soon as it's tapped.
 */

const FLY_MS = 280;
const STACK = 3; // cards rendered at once; the two behind are decoration
const reducedMotion = () =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

const KIND_LABEL = { old: 'A family recipe', new: 'Something new', combo: 'Mix and match' };

export default function Dinner() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'error'
  const [cursor, setCursor] = useState(0);
  const [lacking, setLacking] = useState(() => new Set()); // normed, session only
  const [flying, setFlying] = useState(null); // 'left' | 'right'
  const [openCard, setOpenCard] = useState(null);
  const [reshuffle, setReshuffle] = useState(0);

  const cardRef = useRef(null);
  const deckRef = useRef(null);
  const sheetRef = useRef(null);
  const flyTimer = useRef(null);
  const drag = useRef({ id: null, x0: 0, y0: 0, t0: 0, axis: null });

  useEffect(() => {
    const ctrl = new AbortController();
    fetchDinnerData({ signal: ctrl.signal })
      .then((d) => {
        setData(d);
        setStatus('ready');
      })
      .catch((e) => {
        if (e.name !== 'AbortError') setStatus('error');
      });
    return () => ctrl.abort();
  }, []);

  // Built once per load. Never rebuilt on filter change — that would reshuffle
  // the deck and resurrect cards she already passed.
  const queue = useMemo(() => {
    if (!data) return [];
    const old = data.recipes.filter((r) => r.kind === 'old');
    const fresh = data.recipes.filter((r) => r.kind === 'new');
    // Enough pairings to cover the combo share, with headroom for the cap.
    const comboTarget = Math.ceil((old.length / DECK_MIX.old) * DECK_MIX.combo) + 2;
    const combos = makeCombos(data.proteins, data.sides, comboTarget);
    return buildQueue({ old, combos, fresh });
  }, [data, reshuffle]); // eslint-disable-line react-hooks/exhaustive-deps

  // Scanning from the cursor is what makes "only the remaining queue" fall out
  // for free: everything already swiped is behind it and unreachable.
  const { stack, topIndex, remaining } = useMemo(() => {
    const s = [];
    let first = -1;
    let count = 0;
    for (let i = cursor; i < queue.length; i++) {
      if (isBlocked(queue[i], lacking)) continue;
      count += 1;
      if (first === -1) first = i;
      if (s.length < STACK) s.push(queue[i]);
    }
    return { stack: s, topIndex: first, remaining: count };
  }, [queue, cursor, lacking]);

  const top = stack[0] || null;

  // norm -> display form, for the filter chips.
  const displayMap = useMemo(() => {
    const m = new Map();
    // Seed with the substitute names first: a stand-in may appear in no recipe
    // at all, but the hint below still has to print it properly rather than
    // falling back to the lowercased key.
    for (const group of substituteGroups) {
      for (const name of group) {
        const k = norm(name);
        if (!m.has(k)) m.set(k, name.trim());
      }
    }
    for (const c of queue) {
      for (const ing of c.ingredients) {
        const k = norm(ing);
        if (!m.has(k)) m.set(k, ing.trim());
      }
    }
    return m;
  }, [queue]);

  // Chips for what's still ahead, plus anything already ruled out so she can
  // always undo it.
  const chips = useMemo(() => {
    const live = new Set();
    for (let i = cursor; i < queue.length; i++) {
      for (const ing of queue[i].ingredients) live.add(norm(ing));
    }
    return [...displayMap.entries()]
      .filter(([k]) => live.has(k) || lacking.has(k))
      .map(([key, label]) => ({ key, label }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [queue, cursor, lacking, displayMap]);

  // Ruling out "Ground beef" doesn't drop a beef recipe while "Ground turkey"
  // is still available — correct, but surprising. Say so out loud.
  const stillCovering = useMemo(() => {
    const out = new Set();
    for (const k of lacking) {
      for (const s of subMap.get(k) || []) if (!lacking.has(s)) out.add(s);
    }
    return [...out].map((k) => displayMap.get(k) || k).sort((a, b) => a.localeCompare(b));
  }, [lacking, displayMap]);

  const resetCard = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;
    el.classList.remove('isDragging');
    el.style.transform = '';
    el.style.setProperty('--rc-swipe', '0');
  }, []);

  /*
   * The one commit path — gesture, buttons and keys all land here.
   *
   * ponytail: a timer, not transitionend. transitionend silently never fires
   * if the node is removed or the transition is cancelled, and a permanently
   * stuck deck is a far worse bug than a few ms of timing drift.
   */
  const commit = useCallback(
    (dir) => {
      if (flying || !top) return;
      setFlying(dir);
      if (dir === 'right') setOpenCard(top);
      const index = topIndex;
      flyTimer.current = setTimeout(
        () => {
          setCursor(index + 1);
          setFlying(null);
        },
        reducedMotion() ? 0 : FLY_MS
      );
    },
    [flying, top, topIndex]
  );

  useEffect(() => () => clearTimeout(flyTimer.current), []);

  const onPointerDown = (e) => {
    if (flying || !top) return;
    const el = cardRef.current;
    if (!el) return;
    el.setPointerCapture?.(e.pointerId);
    drag.current = { id: e.pointerId, x0: e.clientX, y0: e.clientY, t0: performance.now(), axis: null };
    el.classList.add('isDragging');
  };

  const onPointerMove = (e) => {
    const d = drag.current;
    if (d.id !== e.pointerId) return;
    const dx = e.clientX - d.x0;
    const dy = e.clientY - d.y0;

    // Axis lock: past 8px, decide once whether this is a swipe or a scroll.
    if (!d.axis) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      d.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      if (d.axis === 'y') {
        cardRef.current?.releasePointerCapture?.(e.pointerId);
        d.id = null;
        resetCard();
        return;
      }
    }

    // Written straight to the node: a drag causes zero React renders.
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = `translate3d(${dx}px, ${dy * 0.15}px, 0) rotate(${dx * 0.06}deg)`;
    el.style.setProperty('--rc-swipe', String(Math.max(-1, Math.min(1, dx / 120))));
  };

  const onPointerUp = (e) => {
    const d = drag.current;
    if (d.id !== e.pointerId) return;
    d.id = null;
    const dx = e.clientX - d.x0;
    const width = cardRef.current?.offsetWidth || 320;
    const past = Math.abs(dx) > Math.min(120, width * 0.28);
    const flick = Math.abs(dx) > 40 && performance.now() - d.t0 < 250;
    resetCard();
    if (d.axis === 'x' && (past || flick)) commit(dx > 0 ? 'right' : 'left');
  };

  // The browser fires this when it claims the gesture as a scroll — snap back,
  // never commit.
  const onPointerCancel = () => {
    drag.current.id = null;
    resetCard();
  };

  const onKeyDown = (e) => {
    if (openCard) return;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      commit('left');
    } else if (e.key === 'ArrowRight' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      commit('right');
    }
  };

  const toggleChip = (key) =>
    setLacking((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const closeSheet = useCallback(() => {
    setOpenCard(null);
    deckRef.current?.focus();
  }, []);

  // Focus the sheet on open, lock the page behind it, Escape to close.
  useEffect(() => {
    if (!openCard) return undefined;
    sheetRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onEsc = (e) => e.key === 'Escape' && closeSheet();
    document.addEventListener('keydown', onEsc);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onEsc);
    };
  }, [openCard, closeSheet]);

  const startOver = () => {
    setCursor(0);
    setReshuffle((n) => n + 1);
  };

  return (
    <div className="mainBody dinnerPage">
      <h1 className="PageTitle">What's For Dinner Tomorrow?</h1>
      <p className="dinnerIntro">
        Swipe right for the recipe, left to pass. Out of something? Say so below and it'll stop
        suggesting it.
      </p>

      {status === 'error' && (
        <p className="rcNotice" role="alert">
          The recipe box couldn't be reached and there's nothing saved to fall back on.
        </p>
      )}
      {status === 'ready' && data?.source === 'seed' && (
        <p className="rcNotice">Showing the built-in list — the recipe box is offline.</p>
      )}

      <div
        className="rcDeck"
        ref={deckRef}
        tabIndex={0}
        role="group"
        aria-label="Dinner suggestions"
        onKeyDown={onKeyDown}
      >
        {status === 'loading' && <div className="rcCard rcCard--skeleton" aria-hidden="true" />}

        {status !== 'loading' &&
          stack.map((card, i) => (
            <article
              key={card.id}
              ref={i === 0 ? cardRef : null}
              className={`rcCard rcCard--at${i}${i === 0 && flying ? ` isFlying-${flying}` : ''}`}
              style={{ zIndex: STACK - i }}
              onPointerDown={i === 0 ? onPointerDown : undefined}
              onPointerMove={i === 0 ? onPointerMove : undefined}
              onPointerUp={i === 0 ? onPointerUp : undefined}
              onPointerCancel={i === 0 ? onPointerCancel : undefined}
              onLostPointerCapture={i === 0 ? onPointerCancel : undefined}
              aria-hidden={i > 0}
            >
              <span className="rcStamp rcStamp--nope" aria-hidden="true">Pass</span>
              <span className="rcStamp rcStamp--yep" aria-hidden="true">Recipe</span>
              {card.imageUrl && (
                <img className="rcCardImg" src={card.imageUrl} alt="" draggable={false} />
              )}
              <span className="rcKind">{KIND_LABEL[card.kind]}</span>
              <h2 className="rcCardName">{card.name}</h2>
              <p className="rcCardIngredients">{card.ingredients.join(' · ')}</p>
            </article>
          ))}

        {status === 'ready' && !top && (
          <div className="rcCard rcCard--empty">
            {lacking.size > 0 ? (
              <>
                <h2 className="rcCardName">Nothing left without those ingredients.</h2>
                <button type="button" className="rcBtn" onClick={() => setLacking(new Set())}>
                  Clear the filters
                </button>
              </>
            ) : (
              <>
                <h2 className="rcCardName">That's every recipe for tonight.</h2>
                <button type="button" className="rcBtn" onClick={startOver}>
                  Start over
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <p className="rcLive" aria-live="polite">
        {top ? `${top.name} — ${KIND_LABEL[top.kind]}. ${remaining} left.` : ''}
      </p>

      <div className="rcControls">
        <button type="button" className="rcBtn rcBtn--pass" onClick={() => commit('left')} disabled={!top}>
          Not tonight
        </button>
        <button type="button" className="rcBtn rcBtn--yes" onClick={() => commit('right')} disabled={!top}>
          Show me the recipe
        </button>
      </div>

      <details className="rcFilter">
        <summary>
          What are you out of? <span className="rcCount">{remaining} left</span>
        </summary>
        <div className="rcChips">
          {chips.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              className="rcChip"
              aria-pressed={lacking.has(key)}
              onClick={() => toggleChip(key)}
            >
              {label}
            </button>
          ))}
        </div>
        {stillCovering.length > 0 && (
          <p className="rcSubsHint">
            Still counting on <strong>{stillCovering.join(', ')}</strong> as a stand-in — tap those
            too if you're out of them.
          </p>
        )}
        {lacking.size > 0 && (
          <button type="button" className="rcBtn rcBtn--small" onClick={() => setLacking(new Set())}>
            Clear
          </button>
        )}
      </details>

      {openCard && (
        <div className="rcSheetWrap" onClick={closeSheet}>
          <div
            className="rcSheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="rcSheetTitle"
            tabIndex={-1}
            ref={sheetRef}
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" className="rcSheetClose" onClick={closeSheet} aria-label="Back to the deck">
              ✕
            </button>
            <span className="rcKind">{KIND_LABEL[openCard.kind]}</span>
            <h2 className="rcSheetTitle" id="rcSheetTitle">{openCard.name}</h2>

            <h3>You'll need</h3>
            <ul className="rcList">
              {openCard.ingredientLines.map((line, i) => (
                <li key={i} className={covered(openCard.ingredients[i] || line, lacking) ? '' : 'isShort'}>
                  {line}
                </li>
              ))}
            </ul>

            {/* The only place anything branches on a combo. */}
            {openCard.parts ? (
              openCard.parts.map((part) => (
                <section key={part.id} className="rcPart">
                  <h3>{part.name}</h3>
                  <ol className="rcSteps">
                    {part.steps.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ol>
                </section>
              ))
            ) : (
              <>
                <h3>Method</h3>
                <ol className="rcSteps">
                  {openCard.steps.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ol>
              </>
            )}

            {openCard.sourceUrl && (
              <p>
                <a href={openCard.sourceUrl} target="_blank" rel="noreferrer">
                  Where this came from
                </a>
              </p>
            )}

            <button type="button" className="rcBtn rcBtn--wide" onClick={closeSheet}>
              Back to the deck
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

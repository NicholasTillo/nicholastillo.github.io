import React, { useEffect, useMemo, useRef, useState } from 'react';
import './basepages.css';
import './dinner.css';

import { meals, substituteGroups } from '../data/dinnerMeals';

const FRIDGE_KEY = 'dinnerFridge';
const norm = (s) => s.trim().toLowerCase();

/*
 * "What's For Dinner Tomorrow" — a scrollable wheel of meals on the left.
 * Whichever meal is in the center is highlighted, and its ingredients show on
 * the right so you can tell at a glance if you have them.
 *
 * "My Fridge" lets you tick what you have; it's saved in the browser
 * (localStorage) so it sticks between visits. An ingredient counts as "on hand"
 * if you have it OR have a listed substitute for it (see substituteGroups).
 * "Almost" lists dinners you're a single ingredient away from making.
 */
export default function Dinner() {
  const [selected, setSelected] = useState(0);
  const [onlyMakeable, setOnlyMakeable] = useState(false);
  // ponytail: localStorage is the native "no backend" store — a static site's
  // honest answer to "remember what's in the fridge". Lazy-read once on mount.
  const [fridge, setFridge] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(FRIDGE_KEY));
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });

  const wheelRef = useRef(null);
  const itemRefs = useRef([]);

  useEffect(() => {
    localStorage.setItem(FRIDGE_KEY, JSON.stringify(fridge));
  }, [fridge]);

  // norm(ingredient) -> Set of interchangeable norm(ingredient)s.
  const subMap = useMemo(() => {
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
  }, []);

  // norm -> display form, covering every meal ingredient and substitute.
  const displayMap = useMemo(() => {
    const d = new Map();
    const add = (s) => {
      const k = norm(s);
      if (!d.has(k)) d.set(k, s.trim());
    };
    meals.forEach((m) => m.ingredients.forEach(add));
    substituteGroups.forEach((g) => g.forEach(add));
    return d;
  }, []);

  const displayOf = (k) => displayMap.get(k) || k;

  // Everything you can tick in the fridge (ingredients + their substitutes).
  const allIngredients = useMemo(
    () => [...displayMap.values()].sort((a, b) => a.localeCompare(b)),
    [displayMap]
  );

  const haveDirect = (ing) => fridge.includes(norm(ing));
  const possibleSubs = (ing) => [...(subMap.get(norm(ing)) || [])].map(displayOf);
  const substituteInFridge = (ing) => {
    for (const s of subMap.get(norm(ing)) || []) {
      if (fridge.includes(s)) return displayOf(s);
    }
    return null;
  };

  // How an ingredient is covered: you have it, a substitute covers it, or it's missing.
  const satisfaction = (ing) => {
    if (haveDirect(ing)) return { status: 'have' };
    const via = substituteInFridge(ing);
    if (via) return { status: 'sub', via };
    return { status: 'missing', options: possibleSubs(ing) };
  };

  const missingOf = (m) => m.ingredients.filter((i) => satisfaction(i).status === 'missing');
  const isMakeable = (m) => missingOf(m).length === 0;

  const makeableCount = useMemo(
    () => meals.filter(isMakeable).length,
    [fridge] // eslint-disable-line react-hooks/exhaustive-deps
  );

  // Dinners you're exactly one ingredient short of.
  const almostMeals = useMemo(
    () =>
      meals
        .map((m) => ({ meal: m, missing: missingOf(m) }))
        .filter((x) => x.missing.length === 1)
        .map((x) => ({
          meal: x.meal,
          need: x.missing[0].trim(),
          options: possibleSubs(x.missing[0]),
        })),
    [fridge] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const visibleMeals = useMemo(
    () => (onlyMakeable ? meals.filter(isMakeable) : meals),
    [onlyMakeable, fridge] // eslint-disable-line react-hooks/exhaustive-deps
  );

  // When the visible list changes, jump back to the top so the highlight and
  // scroll position stay in sync with what's actually shown.
  useEffect(() => {
    setSelected(0);
    wheelRef.current?.scrollTo(0, 0);
  }, [onlyMakeable, fridge]);

  // Highlight whichever meal is passing through the center of the wheel.
  // ponytail: collapse the observer root to a thin center band via negative
  // top/bottom rootMargin — the item intersecting that band is the selected one.
  useEffect(() => {
    const wheel = wheelRef.current;
    if (!wheel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setSelected(Number(entry.target.dataset.index));
        }
      },
      { root: wheel, rootMargin: '-49% 0px -49% 0px', threshold: 0 }
    );
    itemRefs.current.slice(0, visibleMeals.length).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [visibleMeals]);

  const centerItem = (i) => {
    itemRefs.current[i]?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  };

  const toggleIngredient = (ing) => {
    const k = norm(ing);
    setFridge((f) => (f.includes(k) ? f.filter((x) => x !== k) : [...f, k]));
  };

  const current = visibleMeals[selected] || visibleMeals[0] || null;

  return (
    <div className="mainBody dinnerPage">
      <h1 className="PageTitle">What's For Dinner Tomorrow?</h1>
      <p className="dinnerIntro">Give the wheel a spin. Whatever lands in the middle is dinner — check its ingredients on the right.</p>

      <div className="dinnerLayout">
        <div className="wheel" ref={wheelRef} tabIndex={0} aria-label="Dinner options">
          <div className="wheelSpacer" aria-hidden="true" />
          {visibleMeals.map((meal, i) => (
            <button
              key={meal.name}
              type="button"
              data-index={i}
              ref={(el) => (itemRefs.current[i] = el)}
              className={`wheelItem${i === selected ? ' is-selected' : ''}`}
              onClick={() => centerItem(i)}
              aria-current={i === selected}
            >
              {meal.name}
            </button>
          ))}
          <div className="wheelSpacer" aria-hidden="true" />
        </div>

        <div className="details" aria-live="polite">
          {current ? (
            <>
              <h2 className="detailsName">{current.name}</h2>
              <p className="detailsIngredients">
                {current.ingredients.map((ing, i) => {
                  const s = satisfaction(ing);
                  return (
                    <React.Fragment key={ing}>
                      {i > 0 && <span className="dot"> · </span>}
                      {s.status === 'have' && <span className="haveIt">{ing}</span>}
                      {s.status === 'sub' && (
                        <span className="subIt">{ing} <em>→ using {s.via}</em></span>
                      )}
                      {s.status === 'missing' && (
                        <span className="needIt">
                          {ing}
                          {s.options.length > 0 && (
                            <em className="needSub"> (or {s.options.join(', ')})</em>
                          )}
                        </span>
                      )}
                    </React.Fragment>
                  );
                })}
              </p>
              {missingOf(current).length > 0 && (
                <p className="detailsHint">Still need the <strong>bold</strong> items.</p>
              )}
            </>
          ) : (
            <p className="detailsEmpty">Nothing you can make yet — tick a few more things in the fridge below.</p>
          )}
        </div>
      </div>

      {almostMeals.length > 0 && (
        <section className="almost">
          <h2 className="almostTitle">Almost — missing just one thing</h2>
          <ul className="almostList">
            {almostMeals.map((a) => (
              <li key={a.meal.name}>
                <strong>{a.meal.name}</strong> — need {a.need}
                {a.options.length > 0 && (
                  <span className="almostSub"> (or {a.options.join(', ')})</span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="seperator" />

      <section className="fridge">
        <h2 className="fridgeTitle">My Fridge</h2>
        <p className="fridgeIntro">
          Tick what you have. You can make <strong>{makeableCount}</strong> of {meals.length} dinners right now.
        </p>
        <label className="makeableToggle">
          <input
            type="checkbox"
            checked={onlyMakeable}
            onChange={(e) => setOnlyMakeable(e.target.checked)}
          />
          Only show meals I can make
        </label>
        <div className="fridgeList">
          {allIngredients.map((ing) => (
            <label key={ing} className="fridgeItem">
              <input type="checkbox" checked={haveDirect(ing)} onChange={() => toggleIngredient(ing)} />
              {ing}
            </label>
          ))}
        </div>
      </section>
    </div>
  );
}

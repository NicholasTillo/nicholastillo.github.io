import React from 'react';
import './DeckQuadrant.css';

/*
 * DeckQuadrant
 * --------------------------------------------------------------------------
 * The page centrepiece: a 2-axis grid answering "what animal is it most like?".
 *   X axis = Fun to play          (left = low, right = high)
 *   Y axis = Fun to play against  (bottom = low, top = high)
 * A marker is plotted at (funToPlay, funToPlayAgainst); the matching animal is
 * named below. Each quadrant is labelled with its animal as a guide.
 *
 * Props:
 *   funToPlay        number|null  0..100, or null for the idle/unscored state
 *   funToPlayAgainst number|null  0..100
 *   animal           object|null  { emoji, name, blurb } for the plotted region
 *   confidence       number       0..1
 *
 * Purely presentational. Accessible: the grid is an img with a descriptive
 * aria-label, emoji carry aria-labels, and the marker slide is disabled under
 * prefers-reduced-motion (see DeckQuadrant.css).
 */
export default function DeckQuadrant({ funToPlay = null, funToPlayAgainst = null, animal = null, confidence = 0 }) {
  const hasScore =
    typeof funToPlay === 'number' && !Number.isNaN(funToPlay) &&
    typeof funToPlayAgainst === 'number' && !Number.isNaN(funToPlayAgainst);

  const x = hasScore ? Math.min(100, Math.max(0, funToPlay)) : 50;
  const y = hasScore ? Math.min(100, Math.max(0, funToPlayAgainst)) : 50;

  const gridLabel = hasScore
    ? `Plotted at fun to play ${Math.round(x)} of 100 and fun to play against ${Math.round(y)} of 100${animal ? `; most like a ${animal.name}` : ''}.`
    : 'No deck checked yet — fun to play runs left to right, fun to play against runs bottom to top.';

  return (
    <figure className="dqWrap">
      <figcaption className="dqHeading">What animal is it most like?</figcaption>

      <div className="dqPlot">
        <span className="dqAxisLabel dqAxisLabel--y">Fun to play against →</span>

        <div className="dqGrid" role="img" aria-label={gridLabel}>
          {/* Faint per-quadrant animal guides */}
          <span className="dqQuad dqQuad--tl">Sloth</span>
          <span className="dqQuad dqQuad--tr">Frog</span>
          <span className="dqQuad dqQuad--bl">Worm</span>
          <span className="dqQuad dqQuad--br">Shark</span>
          <span className="dqQuad dqQuad--center">Octopus</span>

          {/* Midpoint crosshair */}
          <span className="dqCrosshair dqCrosshair--v" aria-hidden="true" />
          <span className="dqCrosshair dqCrosshair--h" aria-hidden="true" />

          {/* Plotted marker (bottom% so Y grows upward) */}
          <span
            className={`dqMarker${hasScore ? ' is-active' : ''}`}
            style={{ left: `${x}%`, bottom: `${y}%` }}
            aria-hidden="true"
          >
            <span className="dqMarkerDot" />
          </span>
        </div>

        <span className="dqAxisLabel dqAxisLabel--x">Fun to play →</span>
      </div>

      <div className="dqReadout" aria-live="polite">
        {hasScore && animal ? (
          <>
            <span className="dqAnimal">
              {animal.name}
            </span>
            <span className="dqBlurb">{animal.blurb}</span>
            <span className="dqStats">
              Fun to play {Math.round(x)} · Fun to play against {Math.round(y)} · Confidence {Math.round(confidence * 100)}%
            </span>
          </>
        ) : (
          <span className="dqHint">Check a deck to see what animal it is most like.</span>
        )}
      </div>
    </figure>
  );
}

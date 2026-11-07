import { useState } from 'react';
import { Link } from 'react-router-dom';

import './FlipCard.css';

// Hover and keyboard focus flip it in CSS; the button and `flipped` cover touch screens.
export default function FlipCard({ project }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className={`flipCard ${flipped ? 'flipped' : ''}`}>
      <div className="flipInner">
        <button type="button" className="flipFace flipFront" aria-expanded={flipped} onClick={() => setFlipped(true)}>
          <img src={project.images[0]} alt="" />
          <span>{project.title}</span>
        </button>
        <div className="flipFace flipBack" onClick={() => setFlipped(false)}>
          <ul>
            {project.keywords.map((word) => <li key={word}>{word}</li>)}
          </ul>
          <Link reloadDocument className="projectButton" to={project.href || `/projects/${project.slug}`}>
            {project.href ? 'See The Models' : 'Read More'}
          </Link>
        </div>
      </div>
    </div>
  );
}

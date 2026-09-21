import React, { useState } from 'react';
import './GddSectionComments.css';
import { postFeedback, NEEDS_APPROVAL, LIMITS } from '../services/gddFeedback';

/*
 * Comment toggle + thread + form for one GDD section (an h2).
 * `comments` is already filtered to this doc + section.
 */
export default function GddSectionComments({ doc, section, comments, onPosted }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [error, setError] = useState('');

  const panelId = `gddc-${doc}-${section}`.replace(/[^A-Za-z0-9_-]/g, '-');

  async function submit(e) {
    e.preventDefault();
    setStatus('sending');
    try {
      const row = await postFeedback({ doc, section, name, comment: text });
      if (!NEEDS_APPROVAL) onPosted(row);
      setText('');
      setStatus('sent');
    } catch (err) {
      setError(err.message || 'Could not send your comment.');
      setStatus('error');
    }
  }

  return (
    <>
      <button
        type="button"
        className="gddcToggle"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
      >
        <span aria-hidden="true">💬</span>{' '}
        {comments.length > 0 ? comments.length : ''}
        <span className="gddcSr">
          {` ${comments.length} comment${comments.length === 1 ? '' : 's'} on ${section}`}
        </span>
      </button>

      {open && (
        <div className="gddcPanel" id={panelId}>
          {comments.length === 0 && <p className="gddcEmpty">No feedback on this section yet.</p>}
          <ul className="gddcList">
            {comments.map((c, i) => (
              <li key={i} className="gddcItem">
                <span className="gddcMeta">
                  <strong>{c.name || 'Anonymous'}</strong>
                  {c.at && ` · ${c.at.toLocaleDateString()}`}
                </span>
                <span className="gddcText">{c.comment}</span>
              </li>
            ))}
          </ul>

          <form className="gddcForm" onSubmit={submit}>
            <input
              type="text"
              placeholder="Name (optional)"
              aria-label="Name (optional)"
              maxLength={LIMITS.name}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <textarea
              placeholder={`Feedback on “${section}”`}
              aria-label={`Feedback on ${section}`}
              maxLength={LIMITS.comment}
              rows={3}
              required
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                if (status !== 'sending') setStatus('idle');
              }}
            />
            <button type="submit" disabled={status === 'sending' || !text.trim()}>
              {status === 'sending' ? 'Posting…' : 'Post'}
            </button>
            <span className="gddcStatus" role="status">
              {status === 'sent' &&
                (NEEDS_APPROVAL
                  ? 'Thanks! Your comment will appear once approved.'
                  : 'Posted. It may take a minute to appear for others.')}
              {status === 'error' && <span className="gddcError">{error}</span>}
            </span>
          </form>
        </div>
      )}
    </>
  );
}

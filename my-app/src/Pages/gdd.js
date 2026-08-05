import React, { useState, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './basepages.css';
import './gdd.css';

import { listGddDocs, fetchGddDoc, GDD_REPO_URL } from '../services/gdd';

const RAW_BASE = 'https://raw.githubusercontent.com/NicholasTillo/GameDesignDocuments/main/';

// Resolve relative image/link paths in the markdown against the repo's raw base
// so screenshots committed alongside the .md actually load on the site.
function resolveUrl(url) {
  if (!url) return url;
  if (/^(https?:|data:|mailto:|#)/i.test(url)) return url;
  return RAW_BASE + url.replace(/^\.?\//, '');
}

/*
 * Game Design Documents viewer.
 * Lists the .md docs from the public GitHub repo and renders the selected one.
 * Content is fetched live, so the site always reflects the latest repo state.
 */
export default function Gdd() {
  const [docs, setDocs] = useState([]);
  const [active, setActive] = useState(null); // { file, title }
  const [markdown, setMarkdown] = useState('');
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [docStatus, setDocStatus] = useState('idle'); // idle | loading | ready | error
  const [error, setError] = useState('');

  // Load the document list once.
  useEffect(() => {
    const ctrl = new AbortController();
    listGddDocs({ signal: ctrl.signal })
      .then((list) => {
        setDocs(list);
        setStatus('ready');
        if (list.length) setActive(list[0]);
      })
      .catch((e) => {
        if (e.name === 'AbortError') return;
        setError(e.message);
        setStatus('error');
      });
    return () => ctrl.abort();
  }, []);

  // Load the active document's markdown whenever the selection changes.
  useEffect(() => {
    if (!active) return;
    const ctrl = new AbortController();
    setDocStatus('loading');
    setMarkdown('');
    fetchGddDoc(active.file, { signal: ctrl.signal })
      .then((text) => {
        setMarkdown(text);
        setDocStatus('ready');
      })
      .catch((e) => {
        if (e.name === 'AbortError') return;
        setError(e.message);
        setDocStatus('error');
      });
    return () => ctrl.abort();
  }, [active]);

  const select = useCallback((doc) => setActive(doc), []);

  return (
    <div className="mainBody gddPage">
      <h1 className="PageTitle">Game Design Documents</h1>
      <p className="gddIntro">
        A living library of my game design work, pulled straight from{' '}
        <a href={GDD_REPO_URL} target="_blank" rel="noreferrer">its GitHub repo</a>.
        Pick a document to read it.
      </p>

      {status === 'loading' && <p className="gddNote">Loading documents…</p>}
      {status === 'error' && <p className="gddNote gddNote--error" role="alert">{error}</p>}

      {status === 'ready' && (
        <div className="gddLayout">
          <nav className="gddList" aria-label="Design documents">
            {docs.map((d) => (
              <button
                key={d.file}
                className={`gddListItem${active && active.file === d.file ? ' is-active' : ''}`}
                onClick={() => select(d)}
              >
                {d.title}
              </button>
            ))}
          </nav>

          <article className="gddDoc">
            {docStatus === 'loading' && <p className="gddNote">Loading “{active && active.title}”…</p>}
            {docStatus === 'error' && <p className="gddNote gddNote--error" role="alert">{error}</p>}
            {docStatus === 'ready' && (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                urlTransform={resolveUrl}
              >
                {markdown}
              </ReactMarkdown>
            )}
          </article>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect, useCallback, useContext, createContext } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './basepages.css';
import './gdd.css';

import { listGddDocs, fetchGddDoc, GDD_REPO_URL } from '../services/gdd';
import { fetchFeedback, FEEDBACK_ENABLED } from '../services/gddFeedback';
import GddSectionComments from '../components/GddSectionComments';

const RAW_BASE = 'https://raw.githubusercontent.com/NicholasTillo/GameDesignDocuments/main/';

// Resolve relative image/link paths in the markdown against the repo's raw base
// so screenshots committed alongside the .md actually load on the site.
function resolveUrl(url) {
  if (!url) return url;
  if (/^(https?:|data:|mailto:|#)/i.test(url)) return url;
  return RAW_BASE + url.replace(/^\.?\//, '');
}

// Plain text of a markdown AST node ("**Game** Overview" -> "Game Overview").
function nodeText(node) {
  if (!node) return '';
  if (node.type === 'text') return node.value;
  return (node.children || []).map(nodeText).join('');
}

// Shared with SectionHeading so the markdown `components` map stays stable
// (a new h2 component per render would remount headings and close open panels).
const FeedbackContext = createContext(null);

function SectionHeading({ node, children }) {
  const fb = useContext(FeedbackContext);
  const section = nodeText(node).trim();
  if (!fb || !section) return <h2>{children}</h2>;
  const comments = fb.feedback.filter((c) => c.doc === fb.doc && c.section === section);
  return (
    <div className="gddSectionHead">
      <h2>{children}</h2>
      <GddSectionComments doc={fb.doc} section={section} comments={comments} onPosted={fb.onPosted} />
    </div>
  );
}

const MARKDOWN_COMPONENTS = FEEDBACK_ENABLED ? { h2: SectionHeading } : undefined;

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
  const [feedback, setFeedback] = useState([]);

  // Load feedback once. Failure is non-fatal: docs still render without it.
  useEffect(() => {
    const ctrl = new AbortController();
    fetchFeedback({ signal: ctrl.signal })
      .then(setFeedback)
      .catch((e) => {
        if (e.name !== 'AbortError') console.warn('GDD feedback unavailable:', e);
      });
    return () => ctrl.abort();
  }, []);

  const onPosted = useCallback((row) => setFeedback((f) => [...f, row]), []);

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
              <FeedbackContext.Provider value={{ doc: active.file, feedback, onPosted }}>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  urlTransform={resolveUrl}
                  components={MARKDOWN_COMPONENTS}
                >
                  {markdown}
                </ReactMarkdown>
              </FeedbackContext.Provider>
            )}
          </article>
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from 'react';

// Fixed label set and order for every project's stat block; Role always leads.
const STAT_ORDER = ['Role', 'Team', 'Stack', 'Focus', 'Context'];

export function StatBlock({ stats }) {
  return (
    <dl className="statBlock">
      {STAT_ORDER.filter((label) => stats[label]).map((label) => (
        <div key={label}><dt>{label}</dt><dd>{stats[label]}</dd></div>
      ))}
    </dl>
  );
}

// `lead` shows the first image large with the rest as thumbnails. Portrait grids stay as they are.
export function ImageGrid({ project, lead }) {
  const [activeSrc, setActiveSrc] = useState(null);

  useEffect(() => {
    document.body.style.overflow = activeSrc ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [activeSrc]);

  return (
    <>
      <div className={`projectImageGrid ${project.imageClass || (lead ? 'leadGrid' : '')}`}>
        {project.images.map((src, idx) => (
          <button key={src} type="button" className="projectImageSlot" onClick={() => setActiveSrc(src)}>
            <img src={src} alt={`${project.title} screenshot ${idx + 1}`} />
          </button>
        ))}
      </div>
      {activeSrc && (
        <div className="projectLightboxOverlay" onClick={() => setActiveSrc(null)}>
          <img src={activeSrc} className="projectLightboxImage" alt="enlarged project" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </>
  );
}

export function ItchEmbed({ title, embed }) {
  return (
    <iframe
      title={title}
      frameBorder="0"
      src={`https://itch.io/embed/${embed.id}?linkback=true&bg_color=9bc7ec&fg_color=222222&link_color=fa5c5c&border_color=404d7f`}
      width="552"
      height="167"
      style={{ maxWidth: '100%', display: 'block', margin: '0 auto' }}
    >
      <a href={embed.url}>{embed.label}</a>
    </iframe>
  );
}

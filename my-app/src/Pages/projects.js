import { useEffect } from "react";
import { Link } from "react-router-dom";

import './basepages.css'
import "./projects.css"
import FlipCard from "../components/FlipCard";
import { ImageGrid, ItchEmbed, StatBlock } from "../components/ProjectMedia";
import { categories, currentlyWorkingOn, projects } from "../data/projects";

// HashRouter owns the first '#', so header links look like #/projects#game-design
function scrollToHeader() {
    const parts = window.location.hash.split('#');
    if (parts.length < 3) return;
    const el = document.getElementById(parts[parts.length - 1]);
    if (!el) return;
    const section = el.closest('details');
    if (section) section.open = true;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function FeaturedProject({ project }) {
    return (
        <>
            <div id={`project-${project.slug}`}>
                <h3> {project.title} </h3>
                <StatBlock stats={project.stats} />
                <p> {project.summary} </p>
                <ImageGrid project={project} lead />
                {project.embed && <ItchEmbed title={project.title} embed={project.embed} />}
                <Link reloadDocument className="projectButton" to={`/projects/${project.slug}`}> Read More </Link>
            </div>
            <div className="seperator"> </div>
        </>
    );
}

export default function Projects() {
    useEffect(() => {
        window.addEventListener('hashchange', scrollToHeader);
        scrollToHeader();
        return () => window.removeEventListener('hashchange', scrollToHeader);
    }, []);

    return (
        <div className="mainBody">
            <div id="projectDescriptions">
                <dl className="statBlock currentlyWorking">
                    <div><dt>Currently Working On</dt><dd>{currentlyWorkingOn}</dd></div>
                </dl>
                {categories.map(({ id, title }) => {
                    const inCategory = projects.filter((p) => p.category === id);
                    return (
                        <details className="projectCategory" open key={id}>
                            <summary>
                                <h2 id={id}> {title} <a className="headerAnchor" href={`#/projects#${id}`} aria-label="Link to this section">#</a></h2>
                            </summary>
                            {inCategory.filter((p) => p.featured).map((p) => <FeaturedProject project={p} key={p.slug} />)}
                            <div className="flipGrid">
                                {inCategory.filter((p) => !p.featured).map((p) => <FlipCard project={p} key={p.slug} />)}
                            </div>
                        </details>
                    );
                })}
            </div>
        </div>
    );
}

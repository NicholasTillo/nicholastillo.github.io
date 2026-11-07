import { Link, useParams } from "react-router-dom";

import './basepages.css'
import "./projects.css"
import { ImageGrid, ItchEmbed, StatBlock } from "../components/ProjectMedia";
import { projects } from "../data/projects";

export default function ProjectDetail() {
    const { slug } = useParams();
    const project = projects.find((p) => p.slug === slug && p.text);
    const backLink = <Link reloadDocument className="projectButton" to="/projects"> Back To Projects </Link>;

    if (!project) {
        return (
            <div className="mainBody">
                <div id="projectDescriptions">
                    <h1 className="PageTitle">Project Not Found</h1>
                    {backLink}
                </div>
            </div>
        );
    }

    return (
        <div className="mainBody">
            <div id="projectDescriptions">
                {backLink}
                <h1 className="PageTitle">{project.title}</h1>
                <StatBlock stats={project.stats} />
                <p> {project.text} </p>
                {project.links && (
                    <div className="projectLinks">
                        {project.links.map(([label, href]) => (
                            <a className="projectButton" href={href} target="_blank" rel="noopener noreferrer" key={label}> {label} </a>
                        ))}
                    </div>
                )}
                <ImageGrid project={project} />
                {project.textAfter && <p> {project.textAfter} </p>}
                {project.embed && <ItchEmbed title={project.title} embed={project.embed} />}
            </div>
        </div>
    );
}

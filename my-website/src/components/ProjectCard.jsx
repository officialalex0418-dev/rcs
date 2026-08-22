import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import ProjectStatus from "./ProjectStatus";
import ProjectVisual from "./ProjectVisual";

export default function ProjectCard({ project, priority = false }) {
  return (
    <article className="project-card">
      <ProjectVisual title={project.title} compact={priority} />
      <div className="project-card__content">
        <div className="project-card__meta">
          <ProjectStatus status={project.status} label={project.statusLabel} />
          <span>{project.categories.join(" · ")}</span>
        </div>
        <h3>{project.title}</h3>
        <p>{project.shortDescription}</p>
        <Link className="text-link" to={`/projects/${project.slug}`}>
          View project <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

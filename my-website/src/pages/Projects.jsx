import { useState } from "react";
import { ArrowRight, SearchX } from "lucide-react";
import { Link } from "react-router-dom";
import CtaBand from "../components/CtaBand";
import ProjectCard from "../components/ProjectCard";
import SectionHeading from "../components/SectionHeading";
import Seo from "../components/Seo";
import { projectFilters, projects } from "../data/site";

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState("All");
  const filteredProjects = activeFilter === "All" ? projects : projects.filter((project) => project.categories.includes(activeFilter));
  const current = filteredProjects.filter((project) => !["upcoming", "planned", "concept"].includes(project.status));
  const upcoming = projects.filter((project) => ["upcoming", "planned", "concept"].includes(project.status));
  return <>
    <Seo title="Projects" description="Selected work, products, and digital experiences built by RCS." path="/projects" />
    <section className="page-hero"><div className="shell page-hero__inner"><p className="eyebrow">Projects</p><h1>Work designed to solve real problems.</h1><p>Selected work, products, and digital experiences built by RCS. Every project can be added from one central data source as its details are verified.</p></div></section>
    <section className="section"><div className="shell"><div className="filter-row" role="toolbar" aria-label="Filter projects by category">{projectFilters.map((filter) => <button key={filter} type="button" aria-pressed={activeFilter === filter} className={`filter-button ${activeFilter === filter ? "filter-button--active" : ""}`} onClick={() => setActiveFilter(filter)}>{filter}</button>)}</div>
      <SectionHeading eyebrow="Featured projects" title="Selected work" />
      {current.length ? <div className="project-grid">{current.map((project) => <ProjectCard key={project.id} project={project} />)}</div> : <div className="empty-state"><SearchX size={28} aria-hidden="true" /><h2>No verified projects in this category yet.</h2><p>Choose another category or return soon as RCS publishes more project information.</p><button type="button" className="text-link" onClick={() => setActiveFilter("All")}>Show all projects <ArrowRight size={16} aria-hidden="true" /></button></div>}
    </div></section>
    <section className="section section--quiet"><div className="shell"><SectionHeading eyebrow="What is next" title="Coming soon, when it is ready to share.">RCS is actively building new products and technology initiatives. Details, visual assets, and launch timing are intentionally published only after they are confirmed.</SectionHeading>{upcoming.length ? <div className="project-grid">{upcoming.map((project) => <ProjectCard key={project.id} project={project} />)}</div> : <div className="roadmap-empty"><span>Roadmap</span><p>New RCS initiatives will appear here with a clear project status and verified description.</p></div>}</div></section>
    <div className="shell"><CtaBand /></div>
  </>;
}

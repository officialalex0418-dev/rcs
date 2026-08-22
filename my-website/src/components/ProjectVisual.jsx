export default function ProjectVisual({ title, compact = false }) {
  return (
    <div className={`project-visual ${compact ? "project-visual--compact" : ""}`} role="img" aria-label={`Abstract product visual for ${title}; not a product screenshot`}>
      <div className="project-visual__topbar"><span /><span /><span /></div>
      <div className="project-visual__body">
        <aside><i /><i /><i /><i /></aside>
        <div className="project-visual__canvas">
          <div className="project-visual__greeting"><span /><b>{title}</b></div>
          <div className="project-visual__metrics"><i /><i /><i /></div>
          <div className="project-visual__chart"><span /><span /><span /><span /><span /><span /></div>
        </div>
      </div>
      <span className="project-visual__caption">Conceptual product visual</span>
    </div>
  );
}

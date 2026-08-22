const statusLabels = {
  live: "Live",
  completed: "Completed",
  "in-progress": "In development",
  upcoming: "Upcoming",
  planned: "Planned",
  concept: "Concept",
};

export default function ProjectStatus({ status, label }) {
  const text = label || statusLabels[status] || "Status pending";
  return (
    <span className={`status-pill status-pill--${status || "pending"}`}>
      <span aria-hidden="true" className="status-pill__dot" />
      {text}
    </span>
  );
}

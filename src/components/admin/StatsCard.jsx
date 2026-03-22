export default function StatsCard({ icon, title, value, increase }) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <div className="icon">{icon}</div>
        <span className="increase">{increase}</span>
      </div>
      <p>{title}</p>
      <h3>{value}</h3>
    </div>
  );
}
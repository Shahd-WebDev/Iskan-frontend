export default function ActivityItem({ icon, title, time, color }) {
  return (
    <div className="activity-item">
      <div className={`activity-icon ${color}`}>
        {icon}
      </div>
      <div className="activity-text">
        <p><b>{title}</b></p>
        <span>{time}</span>
      </div>
    </div>
  );
}
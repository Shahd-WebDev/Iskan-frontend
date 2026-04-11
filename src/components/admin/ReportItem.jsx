export default function ReportItem({ report }) {
  return (
    <div className="report-item">
      <div className="report-info">
        
        <img
          src={`https://i.pravatar.cc/150?img=${report.id}`}
          alt="user"
        />

        <div>
          <h5>{report.name}</h5>
          <p>{report.issue}</p>

          <span className={`priority ${report.priority.toLowerCase()}`}>
            {report.priority} Priority
          </span>
        </div>
      </div>

      <span className="time">{report.time}</span>
    </div>
  );
}
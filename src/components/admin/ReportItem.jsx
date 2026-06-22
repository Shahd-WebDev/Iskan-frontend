export default function ReportItem({ report }) {
  return (
    <div className="report-item">
      <div className="report-info">

        <div
          className="report-avatar"
          style={{
            backgroundColor: report.avatarColor,
          }}
        >
          {report.avatar}
        </div>

        <div>
          <h5>{report.name}</h5>

          <p>{report.issue}</p>

          <span
            className={`priority ${report.priority.toLowerCase()}`}
          >
            {report.priority} Priority
          </span>
        </div>

      </div>

      <span className="time">
        {report.time}
      </span>
    </div>
  );
}
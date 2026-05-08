import ReportItem from "../../../components/admin/ReportItem";
import "./Reports.css";

const reportsData = [
  { id: 1, name: "John Anderson", issue: "Fraudulent Property Listing", time: "2h ago", priority: "High" },
  { id: 2, name: "Michael Chen", issue: "Discriminatory Language in Listing", time: "3h ago", priority: "High" },
  { id: 3, name: "Emily Rodriguez", issue: "Incorrect Property Details", time: "20h ago", priority: "Medium" },
  { id: 4, name: "Robert Williams", issue: "Unresponsive Landlord", time: "22h ago", priority: "Low" },
  { id: 5, name: "James Wilson", issue: "Duplicate Listing", time: "Dec 2", priority: "Low" },
];

export default function Reports() {
  return (
    <div className="reports-page">
      <h2>Support & Complaints</h2>
      <p className="subtitle">Review and manage reported issues and complaints</p>
      <div className="reports-card">
        <h4 className="reports-section-title">Reported Issues ({reportsData.length})</h4>
        <div className="reports-list">
          {reportsData.map(report => (
            <ReportItem key={report.id} report={report} />
          ))}
        </div>
      </div>
    </div>
  );
}
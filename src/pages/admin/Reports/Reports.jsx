import PaginationControls from "../../../components/Pagination/Pagination";
import SkeletonCard from "../../../components/common/SkeletonCard";
import toast from "react-hot-toast";
import ReportItem from "../../../components/admin/ReportItem";
import "./Reports.css";
import { useEffect, useState } from "react";
import api from "../../../services/api";

export default function Reports() {

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] =
  useState(1);

  const [selectedReport, setSelectedReport] =
  useState(null);

const [totalPages, setTotalPages] =
  useState(1);

const pageSize = 10;

  useEffect(() => {
    async function fetchReports() {
      try {
        setLoading(true);

        const response = await api.get(
  "/Report/GetAll",
  {
    params: {
  PageIndex: pageIndex,
  PageSize: pageSize,
},
  }
);

console.log(response.data);
setTotalPages(
  Math.ceil(
    response.data.count / pageSize
  )
);
        

       const avatarColors = [
  "#4A90D9",
  "#5BA85B",
  "#E07B54",
  "#9B6BB5",
  "#D4A843",
  "#4AADAD",
  "#D9547A",
  "#6B8FD9",
];

const formattedReports =
  response.data.data.map((report, index) => {

    console.log("STATUS =", report.status);
    console.log("PRIORITY =", report.priority);


    

    return {
      id: report.id,
      name: report.studentName,
      issue: report.reason,
      time: report.timeAgo,
      priority: report.priority,
      status: report.status,
      propertyTitle: report.propertyTitle,

      avatar: report.studentName
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase(),

      avatarColor:
        avatarColors[index % avatarColors.length],
    };
  });
        setReports(formattedReports);

      }
       catch (error) {
  console.log(error);

  toast.error(
    "Failed to update report status"
  );
}

       finally {
        setLoading(false);
      }
    }

    fetchReports();
}, [pageIndex]);

const handleUpdateStatus = async (
  newStatus
) => {
  try {
    await api.patch(
      `/Report/UpdateStatus?id=${selectedReport.id}`,
      {
        status: newStatus,
      }
    );

    setReports((prev) =>
      prev.map((report) =>
        report.id === selectedReport.id
          ? {
              ...report,
              status: newStatus,
            }
          : report
      )
    );

    setSelectedReport((prev) => ({
      ...prev,
      status: newStatus,
    }));
    toast.success(
  `Report marked as ${newStatus}`
);
setSelectedReport(null);

  } catch (error) {
    console.log(error);
  }
};

if (loading) {
  return (
    <div className="skeleton-wrapper">
      {Array.from({ length: 5 }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}

  return (
    <div className="reports-page">
      <h2>Support & Complaints</h2>

      <p className="subtitle">
        Review and manage reported issues and complaints
      </p>

      <div className="reports-card">

        <h4 className="reports-section-title">
          Reported Issues ({reports.length})
        </h4>

        <div className="reports-list">

          {reports.map((report) => (
  <div
    key={report.id}
    onClick={() => setSelectedReport(report)}
    style={{ cursor: "pointer" }}
  >
    <ReportItem report={report} />
  </div>
))}

        </div>

      </div>
      <PaginationControls
  currentPage={pageIndex}
  totalPages={totalPages}
  onPageChange={setPageIndex}
  label={`Page ${pageIndex} of ${totalPages}`}
/>



{selectedReport && (
  <div
    className="report-modal-overlay"
    onClick={() => setSelectedReport(null)}
  >
    <div
      className="report-modal"
      onClick={(e) => e.stopPropagation()}
    >
<h3 className="modal-title">
  Complaint Details
</h3>
      <div className="report-badges">

  <span
    className={`priority-badge priority-${selectedReport.priority.toLowerCase()}`}
  >
    {selectedReport.priority}
  </span>

  <span
    className={`status-badge-modal status-${selectedReport.status.toLowerCase()}`}
  >
    {selectedReport.status}
  </span>

</div>

      <div className="report-detail">
        <strong>Student:</strong>
        <p>{selectedReport.name}</p>
      </div>

      <div className="report-detail">
        <strong>Property:</strong>
        <p>{selectedReport.propertyTitle}</p>
      </div>

      
      <div className="report-detail">
        <strong>Submitted:</strong>
        <p>{selectedReport.time}</p>
      </div>

      <div className="report-detail">
        <strong>Complaint:</strong>
        <p>{selectedReport.issue}</p>
      </div>

<div className="report-actions">

  {selectedReport.status !== "Reviewed" && (
  <button
    className="review-btn"
    onClick={() =>
      handleUpdateStatus("Reviewed")
    }
  >
    Mark as Reviewed
  </button>
)}

  {selectedReport.status !== "Rejected" && (
  <button
    className="reject-report-btn"
    onClick={() =>
      handleUpdateStatus("Rejected")
    }
  >
    Reject Report
  </button>
)}

</div>
      <button
        className="close-modal-btn"
        onClick={() => setSelectedReport(null)}
      >
        Close
      </button>
    </div>
  </div>
)}
    </div>
  );
}
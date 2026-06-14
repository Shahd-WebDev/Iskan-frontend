import PaginationControls from "../../../components/Pagination/Pagination";
import SkeletonCard from "../../../components/common/SkeletonCard";

import ReportItem from "../../../components/admin/ReportItem";
import "./Reports.css";
import { useEffect, useState } from "react";
import api from "../../../services/api";

export default function Reports() {

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] =
  useState(1);

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
  response.data.data.map((report, index) => ({
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
  }));
        setReports(formattedReports);

      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    fetchReports();
}, [pageIndex]);

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
            <ReportItem
              key={report.id}
              report={report}
            />
          ))}

        </div>

      </div>
      <PaginationControls
  currentPage={pageIndex}
  totalPages={totalPages}
  onPageChange={setPageIndex}
  label={`Page ${pageIndex} of ${totalPages}`}
/>
    </div>
  );
}
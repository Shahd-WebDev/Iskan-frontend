import SkeletonCard from "../../../components/common/SkeletonCard";
import { useEffect, useState, useMemo } from "react";
import { 
  getDashboardStats,
  getBookingTrends,
  getRecentActivity
} from "../../../services/adminDashboard";
import "./dashboard.css";
import StatsCard from "../../../components/admin/StatsCard";
import ActivityItem from "../../../components/admin/ActivityItem";
import BookingTrendsChart from "../../../components/admin/BookingTrendsChart";
import { Users, Home, DollarSign, CheckCircle, AlertCircle, UserPlus } from "lucide-react";
function Dashboard() {
   const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const sortedActivities = useMemo(() => {
  return [...activities].sort((a, b) => {
    
    if (a.createdAt && b.createdAt) {
      return (
        new Date(b.createdAt) -
        new Date(a.createdAt)
      );
    }

    const ageA = parseInt(a.timeAgo) || 9999;
    const ageB = parseInt(b.timeAgo) || 9999;

    return ageA - ageB;
  });
}, [activities]);
const [showAll, setShowAll] = useState(false);
const displayedActivities = showAll 
  ? sortedActivities 
  : sortedActivities.slice(0, 6);
  useEffect(() => {
    async function fetchData() {
      try {
        const [statsData, trendsData, activityData] = await Promise.all([
  getDashboardStats(),
  getBookingTrends(),
  getRecentActivity()
]);

        const formattedTrends = (trendsData || []).map(item => ({
  month: item.month,
  bookings: item.count
}));
        setStats(statsData);
        setChartData(formattedTrends);
setActivities(activityData || []);

console.log(activityData);

      } catch (error) {
console.log("Dashboard error:", error);
setError("Failed to load dashboard");      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // 🔥 دي اللي بترجع الشكل الحلو (icons + colors)
  const getActivityStyle = (type) => {
  const t = type?.toLowerCase();

  if (t?.includes("user")) {
    return { icon: <UserPlus size={18} />, color: "blue" };
  }

  if (t?.includes("property") && t?.includes("pending")) {
    return { icon: <AlertCircle size={18} />, color: "red" };
  }

  if (t?.includes("property")) {
    return { icon: <Home size={18} />, color: "blue" };
  }

  if (t?.includes("booking")) {
    return { icon: <CheckCircle size={18} />, color: "green" };
  }

  return { icon: <UserPlus size={18} />, color: "blue" };
};

if (loading) {
  return (
    <div className="listings-grid">
      {Array(6)
        .fill(0)
        .map((_, i) => (
          <SkeletonCard key={i} />
        ))}
    </div>
  );
}
if (error) return <p>{error}</p>;
  return (
    <div className="dashboard">
      <div className="dashboard-content">
        
        <h2 className="dashboard-title">Dashboard Overview</h2>
        <p className="dashboard-subtitle">
          Welcome back! Here's what's happening with your student housing platform today.
        </p>

        {/* Stats Cards */}
        <div className="stats-container">
          <StatsCard
            icon={<Users size={24} />}
            title="Total Users"
            value={stats?.totalUsers || 0}
            increase={`+${stats?.totalUsersGrowth || 0}%`}
          />
          <StatsCard
            icon={<Home size={24} />}
            title="Pending Properties"
            value={stats?.pendingProperties || 0}
            increase={`+${stats?.pendingPropertiesGrowth || 0}%`}
          />
          <StatsCard
            icon={<DollarSign size={24} />}
            title="Revenue"
            value={stats?.revenue || 0}
            increase={`+${stats?.revenueGrowth || 0}%`}
          />
        </div>

        {/* Chart */}
        <BookingTrendsChart 
          data={chartData} 
          title="Booking trends over the past 12 months" 
        />

        {/* Recent Activity */}
        <div className="activity-box">
          <p className="activity-title">Recent Activity</p>
          <p className="activity-sub">Latest updates from your platform</p>

          {displayedActivities.map((item, index) => {
  const style = getActivityStyle(item.type);

  return (
    <ActivityItem
      key={index}
      icon={style.icon}
      title={item.title}
      description={item.description}
      time={item.timeAgo}
      color={style.color}
    />
  );
})}

          <div className="view-all-activity">
            <button 
  className="view-all-link"
  onClick={() => setShowAll(!showAll)}
>
  {showAll ? "Show Less" : "View All Activity"}
</button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
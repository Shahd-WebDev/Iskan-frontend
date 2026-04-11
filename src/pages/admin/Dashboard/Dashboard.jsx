import "./dashboard.css";
import StatsCard from "../../../components/admin/StatsCard";
import ActivityItem from "../../../components/admin/ActivityItem";
import BookingTrendsChart from "../../../components/admin/BookingTrendsChart";
import { Users, Home, DollarSign, CheckCircle, AlertCircle, UserPlus } from "lucide-react";

function Dashboard() {
  // بيانات الـ Chart (هتتغير لما تربط بالباك إند)
  const chartData = [
    { month: "Jan", bookings: 45 },
    { month: "Feb", bookings: 52 },
    { month: "Mar", bookings: 48 },
    { month: "Apr", bookings: 67 },
    { month: "May", bookings: 72 },
    { month: "Jun", bookings: 80 },
    { month: "Jul", bookings: 95 },
    { month: "Aug", bookings: 90 },
    { month: "Sep", bookings: 78 },
    { month: "Oct", bookings: 85 },
    { month: "Nov", bookings: 93 },
    { month: "Dec", bookings: 100 },
  ];

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
            value="2,847"
            increase="+12.5%"
          />
          <StatsCard
            icon={<Home size={24} />}
            title="Pending Properties"
            value="47"
            increase="+8.2%"
          />
          <StatsCard
            icon={<DollarSign size={24} />}
            title="Revenue"
            value="£124,580"
            increase="+23.1%"
          />
        </div>

        {/* Booking Trends Chart - استخدام الكومبوننت المنفصل */}
        <BookingTrendsChart 
          data={chartData} 
          title="Booking trends over the past 12 months" 
        />

        {/* Recent Activity */}
        <div className="activity-box">
          <p className="activity-title">Recent Activity</p>
          <p className="activity-sub">Latest updates from your platform</p>

          <ActivityItem
            icon={<UserPlus size={18} />}
            title="New user registered"
            description="Sarah Johnson signed up"
            time="2 min ago"
            color="blue"
          />
          <ActivityItem
            icon={<Home size={18} />}
            title="New property listed"
            description="3-bed apartment in Manchester"
            time="15 min ago"
            color="blue"
          />
          <ActivityItem
            icon={<CheckCircle size={18} />}
            title="Booking confirmed"
            description="Edinburgh Student Flat"
            time="1 hour ago"
            color="green"
          />
          <ActivityItem
            icon={<AlertCircle size={18} />}
            title="Property pending review"
            description="Birmingham Studio needs approval"
            time="2 hours ago"
            color="red"
          />
          <ActivityItem
            icon={<UserPlus size={18} />}
            title="New user registered"
            description="Michael Chen signed up"
            time="3 hours ago"
            color="blue"
          />
          <ActivityItem
            icon={<CheckCircle size={18} />}
            title="Booking confirmed"
            description="London Shared Room"
            time="4 hours ago"
            color="green"
          />

          <div className="view-all-activity">
            <a href="#" className="view-all-link">View All Activity</a>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
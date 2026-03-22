import "./dashboard.css";
import StatsCard from "../../../components/admin/StatsCard";
import ActivityItem from "../../../components/admin/ActivityItem";
import { Users, Home, DollarSign, CheckCircle, AlertCircle } from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function Dashboard() {
  const data = [
    { month: "Jan", bookings: 30 },
    { month: "Feb", bookings: 45 },
    { month: "Mar", bookings: 60 },
    { month: "Apr", bookings: 40 },
    { month: "May", bookings: 80 },
    { month: "Jun", bookings: 65 },
    { month: "Jul", bookings: 90 },
    { month: "Aug", bookings: 75 },
    { month: "Sep", bookings: 85 },
    { month: "Oct", bookings: 70 },
    { month: "Nov", bookings: 95 },
    { month: "Dec", bookings: 110 }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-content">

        <h2 className="dashboard-title">Dashboard Overview</h2>
        <p className="dashboard-subtitle">
          Welcome back! Here's what's happening with your student housing platform today.
        </p>

        {/* stats */}
        <div className="stats-container">

          <StatsCard
            icon={<Users size={18} />}
            title="Total Users"
            value="2,847"
            increase="+12.5%"
          />

          <StatsCard
            icon={<Home size={18} />}
            title="Pending Properties"
            value="47"
            increase="+8.2%"
          />

          <StatsCard
            icon={<DollarSign size={18} />}
            title="Revenue"
            value="£124,580"
            increase="+23.1%"
          />

        </div>

        {/* chart */}
        <div className="chart-box">
          <p className="chart-title">Booking trends over the past 12 months</p>

          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="bookings"
                stroke="#0088FF"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* activity */}
        <div className="activity-box">

          <p className="activity-title">Recent Activity</p>
          <p className="activity-sub">Latest updates from your platform</p>

          <ActivityItem
            icon={<Users size={14} />}
            title="New user registered"
            time="2 min ago"
            color="blue"
          />

          <ActivityItem
            icon={<Home size={14} />}
            title="New property listed"
            time="15 min ago"
            color="blue"
          />

          <ActivityItem
            icon={<CheckCircle size={14} />}
            title="Booking confirmed"
            time="1 hour ago"
            color="green"
          />

          <ActivityItem
            icon={<AlertCircle size={14} />}
            title="Property pending review"
            time="2 hours ago"
            color="red"
          />

        </div>

      </div>
    </div>
  );
}

export default Dashboard;
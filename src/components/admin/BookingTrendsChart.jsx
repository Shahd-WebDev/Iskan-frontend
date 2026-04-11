import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const BookingTrendsChart = ({ 
  data = [], 
  title = "Booking trends over the past 12 months" 
}) => {

  const defaultData = [
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

  const chartData = data.length > 0 ? data : defaultData;

  return (
    <div className="chart-box">
      <p className="chart-title">{title}</p>

      <ResponsiveContainer width="100%" height={340}>
        <LineChart
          data={chartData}
          margin={{ top: 30, right: 40, left: 20, bottom: 25 }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#E5E7EB" 
          />

          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 12, fill: "#374151" }}
            tickLine={false}
            axisLine={{ stroke: '#111827', strokeWidth: 2 }}
          />

          <YAxis 
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
            tick={{ fontSize: 12, fill: "#374151" }}
            tickLine={false}
            axisLine={{ stroke: '#111827', strokeWidth: 2 }}
          />

          <Tooltip 
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #0088FF",
              borderRadius: "6px",
              padding: "8px 12px",
            }}
          />

          <Line
            type="natural"
            dataKey="bookings"
            stroke="#0088FF"
            strokeWidth={3.5}
            dot={{
              fill: "#ffffff",
              stroke: "#0088FF",
              strokeWidth: 2.5,
              r: 5.5,
            }}
            activeDot={{
              r: 7,
              fill: "#0088FF",
              stroke: "#ffffff",
              strokeWidth: 3,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BookingTrendsChart;
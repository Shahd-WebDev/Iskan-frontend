import React from 'react';
import { TrendingUp } from "lucide-react";   // ← أضيفي ده

const StatsCard = ({ icon, title, value, increase }) => {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <div className="icon">
          {icon}
        </div>
        
        {/* الجزء اللي فيه السهم + النسبة */}
        <div className="increase">
          <TrendingUp size={16} strokeWidth={3} />   {/* السهم الأخضر */}
          <span>{increase}</span>
        </div>
      </div>

      <p className="stat-card-title">{title}</p>
      <h3 className="stat-card-value">{value}</h3>
    </div>
  );
};

export default StatsCard;
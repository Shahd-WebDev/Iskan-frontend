// components/admin/ActivityItem.jsx
import React from 'react';

const ActivityItem = ({ icon, title, description, time, color }) => {
  return (
    <div className="activity-item">
      <div className={`activity-icon ${color}`}>
        {icon}
      </div>
      <div className="activity-text">
        <p className="title">{title}</p>
        {description && <p className="description">{description}</p>}
        <span className="time">{time}</span>
      </div>
    </div>
  );
};

export default ActivityItem;
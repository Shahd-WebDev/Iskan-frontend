import {
  Building2,
  Calendar,
  Star,
  AlertCircle,
  Plus,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  CalendarCheck
} from "lucide-react";
import "./DashboardContent.css";

export default function DashboardContent() {
  return (
    <div className="dashboard-content-wrapper">
      <div className="dc-header">
        <h1 className="dc-title">Welcome Back, John Smith!</h1>
        <p className="dc-subtitle">Here's what's happening with your properties today</p>
      </div>

      {/* Stats Cards */}
      <div className="dc-stats-grid">
        <div className="dc-stat-card">
          <div className="dc-stat-header">
            <div className="dc-stat-icon-wrapper blue-bg">
              <Building2 size={20} className="blue-icon" />
            </div>
            <span className="dc-stat-trend positive">↑ 12%</span>
          </div>
          <div className="dc-stat-body">
            <h3>12</h3>
            <p>Total Properties</p>
          </div>
        </div>

        <div className="dc-stat-card">
          <div className="dc-stat-header">
            <div className="dc-stat-icon-wrapper orange-bg">
              <Calendar size={20} className="orange-icon" />
            </div>
            <span className="dc-stat-badge alert">Action Required</span>
          </div>
          <div className="dc-stat-body">
            <h3>5</h3>
            <p>Active Bookings</p>
          </div>
        </div>

        <div className="dc-stat-card">
          <div className="dc-stat-header">
            <div className="dc-stat-icon-wrapper yellow-bg">
              <Star size={20} className="yellow-icon" />
            </div>
            <span className="dc-stat-trend positive">+0.2</span>
          </div>
          <div className="dc-stat-body">
            <h3>4.8</h3>
            <p>Average Rating</p>
          </div>
        </div>

        <div className="dc-stat-card">
          <div className="dc-stat-header">
            <div className="dc-stat-icon-wrapper purple-bg">
              <AlertCircle size={20} className="purple-icon" />
            </div>
          </div>
          <div className="dc-stat-body">
            <h3>3</h3>
            <p>Pending Actions</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dc-section-card">
        <h2 className="dc-section-title">Quick Actions</h2>
        <div className="dc-quick-actions">
          <button className="btn btn-primary">
            <Plus size={18} />
            <span>Add New Property</span>
          </button>
          <button className="btn btn-outline">
            <Calendar size={18} />
            <span>View All Bookings</span>
          </button>
          <button className="btn btn-outline">
            <MessageSquare size={18} />
            <span>Check Messages</span>
          </button>
        </div>
      </div>

      <div className="dc-bottom-grid">
        {/* Recent Activity & Notifications */}
        <div className="dc-section-card">
          <h2 className="dc-section-title">Recent Activity & Notifications</h2>
          <div className="dc-activity-list">
            
            <div className="dc-activity-item green-light-bg">
              <CheckCircle2 size={18} className="green-icon" />
              <div className="dc-activity-text">
                <p>Al verified property 'Elestad Apartment'</p>
                <span>2 hours ago</span>
              </div>
            </div>

            <div className="dc-activity-item blue-light-bg">
              <MessageSquare size={18} className="blue-icon" />
              <div className="dc-activity-text">
                <p>New message from Sarah Johnson</p>
                <span>5 hours ago</span>
              </div>
            </div>

            <div className="dc-activity-item yellow-light-bg">
              <AlertTriangle size={18} className="yellow-icon" />
              <div className="dc-activity-text">
                <p>Pending verification for 'Cozy Studio Room'</p>
                <span>1 day ago</span>
              </div>
            </div>

            <div className="dc-activity-item green-light-bg">
              <CalendarCheck size={18} className="green-icon" />
              <div className="dc-activity-text">
                <p>New booking request for 'Modern Downtown Apartment'</p>
                <span>2 days ago</span>
              </div>
            </div>

          </div>
        </div>

        {/* Recent Properties */}
        <div className="dc-section-card">
          <div className="dc-section-header">
            <h2 className="dc-section-title">Recent Properties</h2>
            <a href="#" className="dc-view-all">View All</a>
          </div>
          
          <div className="dc-properties-list">
            
            <div className="dc-property-item">
              <div className="dc-property-img"></div>
              <div className="dc-property-info">
                <h4>Cozy Studio Room</h4>
                <p>Santa Monica, CA</p>
              </div>
              <span className="dc-badge green">Verified</span>
            </div>

            <div className="dc-property-item">
              <div className="dc-property-img"></div>
              <div className="dc-property-info">
                <h4>Modern Downtown Apartment</h4>
                <p>Downtown, CA</p>
              </div>
              <span className="dc-badge blue">Apartment</span>
            </div>

            <div className="dc-property-item">
              <div className="dc-property-img"></div>
              <div className="dc-property-info">
                <h4>Luxury Beach House</h4>
                <p>Malibu, CA</p>
              </div>
              <span className="dc-badge yellow">Pending</span>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}

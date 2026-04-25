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
import { Link, useLocation } from "react-router-dom";
import styles from "./DashboardPage.module.css";

export default function DashboardPage() {
  const location = useLocation();
  return (
    <div className={styles["dashboard-content-wrapper"]}>
      <div className={styles["dc-header"]}>
        <h1 className={styles["dc-title"]}>Welcome Back, John Smith!</h1>
        <p className={styles["dc-subtitle"]}>Here's what's happening with your properties today</p>
      </div>

      {/* Stats Cards */}
      <div className={styles["dc-stats-grid"]}>
        <div className={styles["dc-stat-card"]}>
          <div className={styles["dc-stat-header"]}>
            <div className={`${styles["dc-stat-icon-wrapper"]} ${styles["blue-bg"]}`}>
              <Building2 size={20} className={styles["blue-icon"]} />
            </div>
            <span className={`${styles["dc-stat-trend"]} ${styles["positive"]}`}>↑ 12%</span>
          </div>
          <div className={styles["dc-stat-body"]}>
            <h3>12</h3>
            <p>Total Properties</p>
          </div>
        </div>

        <div className={styles["dc-stat-card"]}>
          <div className={styles["dc-stat-header"]}>
            <div className={`${styles["dc-stat-icon-wrapper"]} ${styles["orange-bg"]}`}>
              <Calendar size={20} className={styles["orange-icon"]} />
            </div>
            <span className={`${styles["dc-stat-badge"]} ${styles["alert"]}`}>Action Required</span>
          </div>
          <div className={styles["dc-stat-body"]}>
            <h3>5</h3>
            <p>Active Bookings</p>
          </div>
        </div>

        <div className={styles["dc-stat-card"]}>
          <div className={styles["dc-stat-header"]}>
            <div className={`${styles["dc-stat-icon-wrapper"]} ${styles["yellow-bg"]}`}>
              <Star size={20} className={styles["yellow-icon"]} />
            </div>
            <span className={`${styles["dc-stat-trend"]} ${styles["positive"]}`}>+0.2</span>
          </div>
          <div className={styles["dc-stat-body"]}>
            <h3>4.8</h3>
            <p>Average Rating</p>
          </div>
        </div>

        <div className={styles["dc-stat-card"]}>
          <div className={styles["dc-stat-header"]}>
            <div className={`${styles["dc-stat-icon-wrapper"]} ${styles["purple-bg"]}`}>
              <AlertCircle size={20} className={styles["purple-icon"]} />
            </div>
          </div>
          <div className={styles["dc-stat-body"]}>
            <h3>3</h3>
            <p>Pending Actions</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={styles["dc-section-card"]}>
        <h2 className={styles["dc-section-title"]}>Quick Actions</h2>
        <div className={styles["dc-quick-actions"]}>
          <Link 
            to="/owner-dashboard/add-property" 
            state={{ from: location.pathname }}
            style={{ textDecoration: 'none' }}
          >
            <button className={`${styles["btn"]} ${styles["btn-primary"]}`}>
              <Plus size={18} />
              <span>Add New Property</span>
            </button>
          </Link>
          <Link 
            to="/owner-dashboard/messages" 
            state={{ tab: "bookings" }}
            style={{ textDecoration: 'none' }}
          >
            <button className={`${styles["btn"]} ${styles["btn-outline"]}`}>
              <Calendar size={18} />
              <span>View All Bookings</span>
            </button>
          </Link>
          <Link 
            to="/owner-dashboard/messages" 
            state={{ tab: "messages" }}
            style={{ textDecoration: 'none' }}
          >
            <button className={`${styles["btn"]} ${styles["btn-outline"]}`}>
              <MessageSquare size={18} />
              <span>Check Messages</span>
            </button>
          </Link>
        </div>
      </div>

      <div className={styles["dc-bottom-grid"]}>
        {/* Recent Activity & Notifications */}
        <div className={styles["dc-section-card"]}>
          <h2 className={styles["dc-section-title"]}>Recent Activity & Notifications</h2>
          <div className={styles["dc-activity-list"]}>
            
            <div className={`${styles["dc-activity-item"]} ${styles["green-light-bg"]}`}>
              <CheckCircle2 size={18} className={styles["green-icon"]} />
              <div className={styles["dc-activity-text"]}>
                <p>Al verified property 'Elestad Apartment'</p>
                <span>2 hours ago</span>
              </div>
            </div>

            <div className={`${styles["dc-activity-item"]} ${styles["blue-light-bg"]}`}>
              <MessageSquare size={18} className={styles["blue-icon"]} />
              <div className={styles["dc-activity-text"]}>
                <p>New message from Sarah Johnson</p>
                <span>5 hours ago</span>
              </div>
            </div>

            <div className={`${styles["dc-activity-item"]} ${styles["yellow-light-bg"]}`}>
              <AlertTriangle size={18} className={styles["yellow-icon"]} />
              <div className={styles["dc-activity-text"]}>
                <p>Pending verification for 'Cozy Studio Room'</p>
                <span>1 day ago</span>
              </div>
            </div>

            <div className={`${styles["dc-activity-item"]} ${styles["green-light-bg"]}`}>
              <CalendarCheck size={18} className={styles["green-icon"]} />
              <div className={styles["dc-activity-text"]}>
                <p>New booking request for 'Modern Downtown Apartment'</p>
                <span>2 days ago</span>
              </div>
            </div>

          </div>
        </div>

        {/* Recent Properties */}
        <div className={styles["dc-section-card"]}>
          <div className={styles["dc-section-header"]}>
            <h2 className={styles["dc-section-title"]}>Recent Properties</h2>
            <a href="#" className={styles["dc-view-all"]}>View All</a>
          </div>
          
          <div className={styles["dc-properties-list"]}>
            
            <div className={styles["dc-property-item"]}>
              <div className={styles["dc-property-img"]}></div>
              <div className={styles["dc-property-info"]}>
                <h4>Cozy Studio Room</h4>
                <p>Santa Monica, CA</p>
              </div>
              <span className={`${styles["dc-badge"]} ${styles["green"]}`}>Verified</span>
            </div>

            <div className={styles["dc-property-item"]}>
              <div className={styles["dc-property-img"]}></div>
              <div className={styles["dc-property-info"]}>
                <h4>Modern Downtown Apartment</h4>
                <p>Downtown, CA</p>
              </div>
              <span className={`${styles["dc-badge"]} ${styles["blue"]}`}>Apartment</span>
            </div>

            <div className={styles["dc-property-item"]}>
              <div className={styles["dc-property-img"]}></div>
              <div className={styles["dc-property-info"]}>
                <h4>Luxury Beach House</h4>
                <p>Malibu, CA</p>
              </div>
              <span className={`${styles["dc-badge"]} ${styles["yellow"]}`}>Pending</span>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}

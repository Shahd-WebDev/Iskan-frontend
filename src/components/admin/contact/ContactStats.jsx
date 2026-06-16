import { Mail, CheckCircle, Clock3 } from "lucide-react";

export default function ContactStats({ stats }) {
  return (
    <div className="cm-stats">

      <div className="cm-stat-card">
        <div className="cm-stat-icon">
          <Mail size={22} />
        </div>

        <div>
          <p>Total Messages</p>
          <h3>{stats.totalMessages}</h3>
        </div>
      </div>

      <div className="cm-stat-card">
        <div className="cm-stat-icon cm-stat-success">
          <CheckCircle size={22} />
        </div>

        <div>
          <p>Replied</p>
          <h3>{stats.repliedMessages}</h3>
        </div>
      </div>

      <div className="cm-stat-card">
        <div className="cm-stat-icon cm-stat-warning">
          <Clock3 size={22} />
        </div>

        <div>
          <p>Unreplied</p>
          <h3>{stats.unrepliedMessages}</h3>
        </div>
      </div>

    </div>
  );
}
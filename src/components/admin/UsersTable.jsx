import { Ban, Trash2, ShieldCheck } from "lucide-react";

export default function UsersTable({
  users,
  openMenuId,
  setOpenMenuId,
  avatarColors,
  onBlock,     // 🔥 ضيفناهم
  onDelete
}) {
  return (
    <div className="users-list">
      {users.map((user, idx) => (
        <div className="user-row" key={user.id}>

          <div className="user-info">
            <div
              className="avatar"
              style={{ background: avatarColors[idx % avatarColors.length] }}
            >
              {user.avatar}
            </div>

            <span className="user-name">
              {user.name}

              {user.verified && (
                <ShieldCheck className="verified-icon" />
              )}
            </span>
          </div>

          <span className="col-university">{user.universityId}</span>
          <span className="col-email">{user.email}</span>

          <span className={`status ${user.status === "Active" ? "active" : "banned"}`}>
            {user.status}
          </span>

          <div className="actions-cell">
            <button
              className="menu-btn"
              onClick={(e) => {
                e.stopPropagation();
                setOpenMenuId(openMenuId === user.id ? null : user.id);
              }}
            >
              ⋮
            </button>

            {openMenuId === user.id && (
              <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>

                {/* 🔥 BLOCK */}
                <button
                  className="dropdown-item block-item"
                  onClick={() => onBlock(user.id)}
                >
                  <Ban size={20} />
                  <span>Block Owner</span>
                </button>

                {/* 🔥 DELETE */}
                <button
                  className="dropdown-item delete-item"
                  onClick={() => onDelete(user.id)}
                >
                  <Trash2 size={20} />
                  <span>Delete Owner</span>
                </button>

              </div>
            )}
          </div>

        </div>
      ))}
    </div>
  );
}
import "./Users.css";
import { useState, useEffect } from "react";
import UsersTable from "../../../components/admin/UsersTable";

const initialUsers = [
  { id: 1, name: "Sarah Johnson", email: "sarah.johnson@university.edu", universityId: "UNI-2024-001", status: "Active", verified: false, avatar: "SJ" },
  { id: 2, name: "Michael Chen", email: "michael.chen@university.edu", universityId: "UNI-2024-002", status: "Active", verified: true, avatar: "MC" },
  { id: 3, name: "Emily Rodriguez", email: "emily.rodriguez@university.edu", universityId: "UNI-2024-003", status: "Active", verified: false, avatar: "ER" },
  { id: 4, name: "David Martinez", email: "david.martinez@university.edu", universityId: "UNI-2024-004", status: "Banned", verified: false, avatar: "DM" },
  { id: 5, name: "Jessica Thompson", email: "jessica.thompson@university.edu", universityId: "UNI-2024-005", status: "Active", verified: true, avatar: "JT" },
  { id: 6, name: "Robert Williams", email: "robert.williams@university.edu", universityId: "UNI-2024-006", status: "Active", verified: false, avatar: "RW" },
  { id: 7, name: "Amanda Lee", email: "amanda.lee@university.edu", universityId: "UNI-2024-007", status: "Active", verified: false, avatar: "AL" },
  { id: 8, name: "James Wilson", email: "james.wilson@university.edu", universityId: "UNI-2024-008", status: "Active", verified: true, avatar: "JW" },
];

const avatarColors = [
  "#4A90D9", "#5BA85B", "#E07B54", "#9B6BB5",
  "#D4A843", "#4AADAD", "#D9547A", "#6B8FD9",
];

export default function Users() {
  const [search, setSearch] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);

  // 🔥 بدل usersData → state
  const [users, setUsers] = useState(initialUsers);

  // 🔥 filter على state
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const closeMenu = () => setOpenMenuId(null);
    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, []);

  // 🔥 BLOCK FUNCTION
  const handleBlock = (id) => {
    setUsers(prev =>
      prev.map(user =>
        user.id === id
          ? { ...user, status: "Banned" }
          : user
      )
    );
    setOpenMenuId(null);
  };

  // 🔥 DELETE FUNCTION
  const handleDelete = (id) => {
    setUsers(prev => prev.filter(user => user.id !== id));
    setOpenMenuId(null);
  };

  return (
    <div className="users-page">

      <div className="page-title">
        <h2>User Management</h2>
        <p>Manage students and landlord accounts</p>
      </div>

      <div className="users-card">

        <div className="table-header-bar">

          <div className="users-search-wrapper">
            <svg className="users-search-icon" viewBox="0 0 20 20" fill="none">
              <circle cx="8.5" cy="8.5" r="5.5" stroke="#9ca3af" strokeWidth="1.6" />
              <path d="M13 13l3 3" stroke="#9ca3af" strokeWidth="1.6" strokeLinecap="round" />
            </svg>

            <input
              type="text"
              placeholder="Search for a name"
              className="users-search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="header-cols">
            <span>University ID</span>
            <span>Email</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

        </div>

        <UsersTable
          users={filteredUsers}
          openMenuId={openMenuId}
          setOpenMenuId={setOpenMenuId}
          avatarColors={avatarColors}
          onBlock={handleBlock}     // 🔥
          onDelete={handleDelete}   // 🔥
        />

      </div>
    </div>
  );
}
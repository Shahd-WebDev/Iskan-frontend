import "./Users.css";
import { useState, useEffect } from "react";
import UsersTable from "../../../components/admin/UsersTable";
import axios from "axios";

const avatarColors = [
  "#4A90D9", "#5BA85B", "#E07B54", "#9B6BB5",
  "#D4A843", "#4AADAD", "#D9547A", "#6B8FD9",
];

export default function Users() {
  const [search, setSearch] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // ✅ GET USERS
  const getUsers = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "https://isskan-1.runasp.net/api/AdminUser/GetAll",
        {
          params: {
            PageIndex: 1,
            PageSize: 20,
            search: search,
          },

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // ✅ Transform API data
      const formattedUsers = response.data.data.map((user) => ({
        id: user.id,
        name: user.fullName,
        email: user.email,
        status: user.status,
        ID: user.ID,

        // optional
        verified: user.status === "Active",

        avatar: user.fullName
          ?.split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase(),
      }));

      setUsers(formattedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ first load + search
  useEffect(() => {
    getUsers();
  }, [search]);

  useEffect(() => {
    const closeMenu = () => setOpenMenuId(null);

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, []);

  
  // ✅ block
 const handleBlock = async (id) => {
  try {

    await axios.patch(
      `https://isskan-1.runasp.net/api/AdminUser/Block/${id}/block`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // ✅ update ui after success
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id
          ? { ...user, status: "Banned" }
          : user
      )
    );

    setOpenMenuId(null);

  } catch (error) {
    console.error("Block error:", error);
  }
};

//delete
const handleDelete = async (id) => {
  try {

    await axios.delete(
      `https://isskan-1.runasp.net/api/AdminUser/Delete/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // ✅ remove from ui after success
    setUsers((prev) =>
      prev.filter((user) => user.id !== id)
    );

    setOpenMenuId(null);

  } catch (error) {
    console.error("Delete error:", error);
  }
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

            <svg
              className="users-search-icon"
              viewBox="0 0 20 20"
              fill="none"
            >
              <circle
                cx="8.5"
                cy="8.5"
                r="5.5"
                stroke="#9ca3af"
                strokeWidth="1.6"
              />

              <path
                d="M13 13l3 3"
                stroke="#9ca3af"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
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
            <span>ID</span>
            <span>Email</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <UsersTable
            users={users}
            openMenuId={openMenuId}
            setOpenMenuId={setOpenMenuId}
            avatarColors={avatarColors}
            onBlock={handleBlock}
            onDelete={handleDelete}
          />
        )}

      </div>
    </div>
  );
}
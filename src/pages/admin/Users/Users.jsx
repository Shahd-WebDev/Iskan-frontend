import "./Users.css";
import { useState, useEffect } from "react";
import UsersTable from "../../../components/admin/UsersTable";
import api from "../../../services/api";
import SkeletonCard from "../../../components/common/SkeletonCard";
import PaginationControls from "../../../components/Pagination/Pagination";

const avatarColors = [
  "#4A90D9", "#5BA85B", "#E07B54", "#9B6BB5",
  "#D4A843", "#4AADAD", "#D9547A", "#6B8FD9",
];

export default function Users() {
  const [openMenuId, setOpenMenuId] = useState(null);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  // ✅ GET USERS
  const getUsers = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        "/AdminUser/GetAll",
        {
          params: {
            PageIndex: currentPage,

            PageSize: 7,
            search: search,
          },


        }
      );
      console.log(response.data);

      // ✅ Transform API data
      const formattedUsers = response.data.data.map((user) => ({
        id: user.id,
        name: user.fullName,
        email: user.email,
        role: user.role,
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
      setTotalPages(
        Math.ceil(response.data.count / 7)
      );
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ first load + search
  useEffect(() => {
    getUsers();
  }, [search, currentPage]);

  useEffect(() => {
    const closeMenu = () => setOpenMenuId(null);

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, []);
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);


  // ✅ block
  const handleBlock = async (id) => {
    try {

      await api.patch(`/AdminUser/Block/${id}/block`);

      // ✅ update ui after success
      setUsers((prev) =>
        prev.map((user) =>
          user.id === id
            ? {
              ...user,
              status:
                user.status === "Banned"
                  ? "Active"
                  : "Banned"
            }
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

      await api.delete(`/AdminUser/Delete/${id}`);

      if (users.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        getUsers();
      }

      setOpenMenuId(null);

    } catch (error) {
      console.error("Delete error:", error);
      console.log(error.response?.status);
      console.log(error.response?.data);
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
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <span>Role</span>
          <span>Email</span>
          <span>Status</span>
          <span>Actions</span>

        </div>

        {loading ? (
          <div className="skeleton-wrapper">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
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
      <div className="users-pagination">
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          label={`Page ${currentPage} of ${totalPages}`}
        />
      </div>
    </div>
  );
}
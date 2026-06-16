import "./ContactMessages.css";
import { useEffect, useState } from "react";
import api from "../../../services/api";
import PaginationControls from "../../../components/Pagination/Pagination";
import SkeletonCard from "../../../components/common/SkeletonCard";

import ContactStats from "../../../components/admin/contact/ContactStats";
import ContactFilters from "../../../components/admin/contact/ContactFilters";
import ContactTable from "../../../components/admin/contact/ContactTable";
import ContactModal from "../../../components/admin/contact/ContactModal";

export default function ContactMessages() {
  const [loading, setLoading] = useState(false);

  const [stats, setStats] = useState({
    totalMessages: 0,
    repliedMessages: 0,
    unrepliedMessages: 0,
  });

  const [messages, setMessages] = useState([]);

  const [selectedMessage, setSelectedMessage] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [activeTab, setActiveTab] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const PAGE_SIZE = 8;

  // ================= Stats =================

  const fetchStats = async () => {
    try {
      const response = await api.get("/admin/contact/stats");

      setStats(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // ================= Messages =================

  const fetchMessages = async () => {
    try {
      setLoading(true);

      let endpoint = "/admin/contact/messages";

      if (activeTab === "replied") {
        endpoint = "/admin/contact/messages/replied";
      }

      if (activeTab === "unreplied") {
        endpoint = "/admin/contact/messages/unreplied";
      }

      const response = await api.get(endpoint, {
        params: {
          PageIndex: currentPage,
          PageSize: PAGE_SIZE,
        },
      });

      setMessages(response.data.data);

      setTotalPages(
        Math.ceil(response.data.count / PAGE_SIZE)
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [activeTab, currentPage]);

  // ================= Modal =================

  const openMessage = (message) => {
    setSelectedMessage(message);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedMessage(null);
    setIsModalOpen(false);
  };

  // ================= Reply =================

  const createReply = async (replyText) => {
  try {
    const res = await api.post(
      `/admin/contact/reply?MessageId=${selectedMessage.id}`,
      {
        replyText,
        contactMessageId: selectedMessage.id,
      }
    );

    console.log(res.data);

    await fetchMessages();
    await fetchStats();

    closeModal();
  } catch (error) {
    console.log(error.response?.data);
    console.log(error.response?.status);
  }
};

  // ================= Update Reply =================

  const updateReply = async (replyId, replyText) => {
    try {
      await api.put(
        `/admin/contact/reply/${replyId}`,
        replyText
      );

      await fetchMessages();

      closeModal();
    } catch (error) {
      console.error(error);
    }
  };

  // ================= Delete Reply =================

  const deleteReply = async (replyId) => {
    try {
      await api.delete(
        `/admin/contact/reply/${replyId}`
      );

      await fetchMessages();
      await fetchStats();

      closeModal();
    } catch (error) {
      console.error(error);
    }
  };
  console.log(messages);
console.log(messages[0]);

  return (
  <div className="contact-page">

    <div className="cm-page-title">
      <h2>Contact Messages</h2>
      <p>Manage user inquiries and replies</p>
    </div>

    <ContactStats stats={stats} />

    <ContactFilters
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      setCurrentPage={setCurrentPage}
    />

    <div className="cm-card">

      {loading ? (
        <div className="skeleton-wrapper">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : (
        <ContactTable
          messages={messages}
          onView={openMessage}
        />
      )}

    </div>

    <div className="contact-pagination">
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        label={`Page ${currentPage} of ${totalPages}`}
      />
    </div>

    <ContactModal
      isOpen={isModalOpen}
      onClose={closeModal}
      message={selectedMessage}
      onCreateReply={createReply}
      onUpdateReply={updateReply}
      onDeleteReply={deleteReply}
    />

  </div>
);
}
import { useState, useEffect } from "react";
import "./FAQs.css";
import toast from "react-hot-toast";
import SkeletonCard from "../../components/common/SkeletonCard";

export default function FAQs() {
  const [sections, setSections] = useState([]);
  
const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] =
    useState(null);

  const [newFaq, setNewFaq] = useState({
    question: "",
    answer: "",
  });
  const [editingFaq, setEditingFaq] =
  useState(null);


 const handleAddFAQ = async (categoryName) => {
  try {
    setLoading(true);

    const token = localStorage.getItem("token");

    const response = await fetch(
      "/api/FAQ/CreateFAQ/admin/items",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

       body: JSON.stringify({
  question: newFaq.question,

  answer: newFaq.answer,

  categoryId:
    categoryMap[categoryName],

  displayOrder: 1,

  tags: ["faq"],
}),
      }
    );

    const data = await response.json();

    console.log(data);

    if (data.success) {
     toast.success("FAQ Added Successfully ✅");

      setNewFaq({
        question: "",
        answer: "",
      });

      setActiveCategory(null);

      window.location.reload();
    }
      } catch (error) {
        console.log(
          error.response?.data
        );

        console.log(error);

        toast.error("Failed To Add FAQ ❌");

      } finally {
        setLoading(false);
      }
      };
    const handleEditFAQ = async () => {
      try {
        setLoading(true);

    const token = localStorage.getItem("token");

    const response = await fetch(
      `/api/FAQ/UpdateFAQ/admin/items/${editingFaq.id}`,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          question: newFaq.question,

          answer: newFaq.answer,

          categoryId:
            categoryMap[
              editingFaq.categoryName
            ],

          displayOrder: 1,

          isActive: true,

          tags: ["faq"],
        }),
      }
    );

    const data = await response.json();

    if (data.success) {
      toast.success(
        "FAQ Updated Successfully "
      );

      setEditingFaq(null);

      setNewFaq({
        question: "",
        answer: "",
      });

      window.location.reload();
    }
  } catch (error) {
    console.log(error);

    toast.error(
      "Failed To Update FAQ ❌"
    );
  } finally {
    setLoading(false);
  }
};
const handleDeleteFAQ = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this FAQ?"
  );

  if (!confirmDelete) return;

  try {
    setLoading(true);

    const token = localStorage.getItem("token");

    const response = await fetch(
      `/api/FAQ/DeleteFAQ/admin/items/${id}`,
      {
        method: "DELETE",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (data.success) {
      toast.success(
        "FAQ Deleted Successfully ✅"
      );

      window.location.reload();
    }
  } catch (error) {
    console.log(error);

    toast.error(
      "Failed To Delete FAQ ❌"
    );
  } finally {
    setLoading(false);
  }
};
const categoryMap = {
  "Getting Started":
    "11111111-1111-1111-1111-111111111111",

  "Account & Profile":
    "22222222-2222-2222-2222-222222222222",

  "Properties Management":
    "33333333-3333-3333-3333-333333333333",

  "Images & Documents":
    "44444444-4444-4444-4444-444444444444",

  "Payments & Billing":
    "55555555-5555-5555-5555-555555555555",

  "Account Security":
    "66666666-6666-6666-6666-666666666666",

  "Technical Support":
    "77777777-7777-7777-7777-777777777777",

  "Privacy & Legal":
    "88888888-8888-8888-8888-888888888888",
};
  const role = localStorage.getItem("userRole");
  const isAdmin = role === "Admin";

  useEffect(() => {
fetch("/api/FAQ/GetFAQs/items")
      .then((res) => res.json())
      .then((data) => {
        console.log("FULL DATA:", data);
        console.log("FAQ COUNT:", data.data.length);

        if (data.success) {
          const grouped = data.data.reduce(
            (acc, faq) => {
              const category =
                faq.categoryName || "General";

              if (!acc[category]) {
                acc[category] = [];
              }

              acc[category].push(faq);

              return acc;
            },
            {}
          );

          setSections(
            Object.entries(grouped).map(
              ([title, questions]) => ({
                title,
                questions,
              })
            )
          );
        }
      })
      .catch((err) =>
        console.error(
          "Failed to fetch FAQs:",
          err
        )
      );
  }, []);

  return (
    <div className="faq-wrapper">
      <div className="faq-page">
        <div className="faq-header">
          <h1 className="faq-title">
            Frequently Asked <br />
            Questions
          </h1>
        </div>

        {sections.map((sec, index) => (
          <FAQSection
  key={index}
  section={sec}
  isAdmin={isAdmin}
  activeCategory={activeCategory}
  setActiveCategory={setActiveCategory}
  newFaq={newFaq}
  setNewFaq={setNewFaq}
  handleAddFAQ={handleAddFAQ}
loading={loading}

editingFaq={editingFaq}
setEditingFaq={setEditingFaq}
handleEditFAQ={handleEditFAQ}
handleDeleteFAQ={handleDeleteFAQ}
/>
        ))}
      </div>
    </div>
  );
}

/* ================= FAQ Section ================= */

function FAQSection({
  section,
  isAdmin,
  activeCategory,
  setActiveCategory,
  newFaq,
  setNewFaq,
  handleAddFAQ,
  loading,
  editingFaq,
  setEditingFaq,
  
  handleEditFAQ,
handleDeleteFAQ,
}) {
  return (
    <div className="faq-section">
      <div className="faq-section-header">
        <h2>{section.title}</h2>

        {isAdmin && (
          <div className="category-actions">
            <button
              onClick={() =>
                setActiveCategory(
                  activeCategory ===
                    section.title
                    ? null
                    : section.title
                )
              }
            >
              Add FAQ
            </button>
          </div>
        )}
      </div>

      {/* ADD FORM */}

      {activeCategory === section.title && (
        <div className="add-faq-form">
          <input
            type="text"
            placeholder="Question"
            value={newFaq.question}
            onChange={(e) =>
              setNewFaq({
                ...newFaq,
                question: e.target.value,
              })
            }
          />

          <textarea
            placeholder="Answer"
            value={newFaq.answer}
            onChange={(e) =>
              setNewFaq({
                ...newFaq,
                answer: e.target.value,
              })
            }
          ></textarea>

<button
  onClick={() =>
    editingFaq
      ? handleEditFAQ()
      : handleAddFAQ(section.title)
  }
  disabled={loading}
>
  {loading
    ? "Saving..."
    : editingFaq
    ? "Update FAQ"
    : "Save FAQ"}
</button>
       </div>
      )}

      {/* FAQS */}

      {section.questions.map((faq) => (
       <FAQItem
  key={faq.id}
  faq={faq}
  isAdmin={isAdmin}
  setNewFaq={setNewFaq}
  setEditingFaq={setEditingFaq}
  setActiveCategory={setActiveCategory}
  handleDeleteFAQ={handleDeleteFAQ}
/>
      ))}
    </div>
  );
}

/* ================= Accordion Item ================= */

function FAQItem({
  faq,
  isAdmin,
  setNewFaq,
  setEditingFaq,
  setActiveCategory,
  handleDeleteFAQ,
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`faq-item ${
        open ? "open" : ""
      }`}
    >
      <button
        className="faq-question"
        onClick={() => setOpen(!open)}
      >
        <span className="faq-q-text">
          {faq.question}
        </span>

        <span className="faq-icon">
          {open ? "−" : "+"}
        </span>
      </button>

      {open && (
        <p className="faq-answer">
          {faq.answer}
        </p>
      )}

      {isAdmin && (
        <div className="faq-admin-actions">
<button
  onClick={() => {
    setEditingFaq(faq);

    setNewFaq({
      question: faq.question,
      answer: faq.answer,
    });

    setActiveCategory(
      faq.categoryName
    );
  }}
>
  Edit
</button>
<button
  onClick={() =>
    handleDeleteFAQ(faq.id)
  }
>
  Delete
</button>        </div>
      )}
    </div>
  );
}
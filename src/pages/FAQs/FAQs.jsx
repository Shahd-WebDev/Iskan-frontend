import { useState, useEffect } from "react";
import "./FAQs.css";

export default function FAQs() {
  const [sections, setSections] = useState([]);

  useEffect(() => {
    fetch("/api/FAQ/GetFAQs/items")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const grouped = data.data.reduce((acc, faq) => {
            const category = faq.categoryName || "General";
            if (!acc[category]) acc[category] = [];
            acc[category].push({ q: faq.question, a: faq.answer });
            return acc;
          }, {});

          setSections(
            Object.entries(grouped).map(([title, questions]) => ({
              title,
              questions,
            }))
          );
        }
      })
      .catch((err) => console.error("Failed to fetch FAQs:", err));
  }, []);

  return (
    <div className="faq-wrapper">
      <div className="faq-page">
        <div className="faq-header">
          <h1 className="faq-title">
            Frequently Asked <br /> Questions
          </h1>
        </div>

        {sections.map((sec, index) => (
          <FAQSection key={index} section={sec} />
        ))}
      </div>
    </div>
  );
}

/* ================= FAQ Section ================= */
function FAQSection({ section }) {
  return (
    <div className="faq-section">
      <h2>{section.title}</h2>
      {section.questions.map((item, i) => (
        <FAQItem key={i} q={item.q} a={item.a} />
      ))}
    </div>
  );
}

 /* ================= Accordion Item ================= */
function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`faq-item ${open ? "open" : ""}`}>
      <button className="faq-question" onClick={() => setOpen(!open)}>
        <span className="faq-q-text">{q}</span>
        <span className="faq-icon">{open ? "−" : "+"}</span>
      </button>
      {open && <p className="faq-answer">{a}</p>}
    </div>
  );
}
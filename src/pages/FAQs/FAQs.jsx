import { useState } from "react";
import "./FAQs.css";

export default function FAQs() {
  const sections = [
    {
      title: "Upload & Share",
      questions: [
        {
          q: "Lorem ipsum dolor sit ame",
          a: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        },
        {
          q: "Lorem ipsum dolor sit ame",
          a: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        },
        {
          q: "Lorem ipsum dolor sit ame",
          a: "Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
        },
        {
          q: "Lorem ipsum dolor sit ame",
          a: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        },
      ],
    },
    {
      title: "Subscription & Payment",
      questions: [
        {
          q: "Lorem ipsum dolor sit ame",
          a: "Payment options are available monthly and yearly.",
        },
        {
          q: "Lorem ipsum dolor sit ame",
          a: "You can cancel anytime from your profile settings.",
        },
        {
          q: "Lorem ipsum dolor sit ame",
          a: "Your subscription renews automatically unless cancelled.",
        },
      ],
    },
    {
      title: "Integrations",
      questions: [
        {
          q: "Lorem ipsum dolor sit ame",
          a: "We integrate with Google Maps and property listing services.",
        },
        {
          q: "Lorem ipsum dolor sit ame",
          a: "More integrations will be added soon in future updates.",
        },
      ],
    },
  ];

  return (
    <div className="faq-wrapper">
      <div className="faq-page">
        <h1 className="faq-title">
          Frequently Asked <br /> Questions
        </h1>

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
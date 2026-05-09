import { useState } from "react";

function FAQCard({ faq }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="faq-card d-flex flex-column rounded-3">
      <h3 className="faq-question text-black mb-2">{faq.question}</h3>
      <p
        className="faq-answer mb-3"
        style={{
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: expanded ? "unset" : 2,
          WebkitBoxOrient: "vertical",
        }}
      >
        {faq.answer}
      </p>

      {expanded && (
        <p style={{ fontSize: "14px", color: "#0088FF", fontWeight: 600, margin: "20px 0px" }}>
          {faq.categoryName}
        </p>
      )}

      <button
        className="read-more-btn bg-white text-black align-self-start mt-auto"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? "Read Less" : "Read More"}
      </button>
    </div>
  );
}

export default FAQCard;

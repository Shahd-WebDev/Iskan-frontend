function FAQCard({ faq }) {
  return (
    <div className="faq-card d-flex  flex-column rounded-3 h-100">
      <h3 className="faq-question text-black mb-2">{faq.question}</h3>
      <p className="faq-answer mb-3 overflow-hidden" >{faq.answer}</p>
      <button className="read-more-btn bg-white text-black  align-self-start  mt-auto ">Read More</button>
    </div>
  );
}
export default  FAQCard
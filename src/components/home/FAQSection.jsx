import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import abstractDesign from "../../assets/home/Abstract Design.png";
import FAQCard from "../home/FAQCard";
import PaginationControls from "../../components/Pagination/Pagination";

const faqs = [
  { id: 1,  question: "How do I search for properties on Iskan?", answer: "Learn how to use our user-friendly search tools to find properties that match your criteria." },
  { id: 2,  question: "What documents do I need to Rent my property through Iskan?", answer: "Find out about the necessary documentation for listing your property with us." },
  { id: 3,  question: "How can I contact an Iskan Company?", answer: "Discover the different ways you can get in touch with our experienced agents." },
  { id: 4,  question: "How do I schedule a property viewing?", answer: "You can schedule a viewing directly through the property listing page or by contacting the agent." },
  { id: 5,  question: "Is my personal information kept secure on Iskan?", answer: "We use industry-standard encryption and security measures to protect your personal data." },
  { id: 6,  question: "Can I list my property for free on Iskan?", answer: "We offer both free and premium listing options. Visit our pricing page to learn more." },
  { id: 7,  question: "How long does it take to find a tenant through Iskan?", answer: "The time varies depending on location and property type, but most listings receive inquiries within days." },
  { id: 8,  question: "What payment methods does Iskan accept?", answer: "We accept credit cards, debit cards, and bank transfers for all transactions on the platform." },
  { id: 9,  question: "Can I save properties to view later?", answer: "Yes! You can bookmark any property by clicking the save icon and access them from your profile." },
  { id: 10, question: "How do I report a suspicious listing on Iskan?", answer: "Use the 'Report' button on any listing page and our team will review it within 24 hours." },
  { id: 11, question: "Can I negotiate the rent price through Iskan?", answer: "Yes, you can send offers and negotiate directly with the landlord through our messaging system." },
  { id: 12, question: "What is the difference between verified and unverified listings?", answer: "Verified listings have been inspected by our team to ensure accuracy of the information provided." },
  { id: 13, question: "How do I update my profile information?", answer: "Go to your account settings from the top menu and update any personal details you'd like to change." },
  { id: 14, question: "Does Iskan offer properties outside of Egypt?", answer: "Currently we focus on the Egyptian market, but we plan to expand to other regions soon." },
  { id: 15, question: "How do I delete my account on Iskan?", answer: "You can request account deletion from your profile settings. Our support team will process it within 3 days." },
  { id: 16, question: "Can I get notified when a new property matches my search?", answer: "Yes, enable alerts from the search results page and we'll notify you by email or SMS." },
  { id: 17, question: "What happens if a landlord cancels after I've paid?", answer: "We have a full refund policy in place. Contact our support team immediately and we'll resolve it." },
  { id: 18, question: "How do I leave a review for a property or agent?", answer: "After your stay or transaction, you'll receive an email prompting you to leave a review." },
  { id: 19, question: "Are there any hidden fees when renting through Iskan?", answer: "All fees are clearly displayed before you confirm any booking or transaction." },
  { id: 20, question: "Can I rent a property short-term through Iskan?", answer: "Yes, we offer both short-term and long-term rental options depending on the listing." },
  { id: 21, question: "How do I know if a property is still available?", answer: "Listing availability is updated in real-time. If a property is taken, it will be marked as unavailable." },
  { id: 22, question: "Can I apply for a mortgage through Iskan?", answer: "We partner with several banks and financial institutions to offer mortgage consultations and applications." },
  { id: 23, question: "How do I change my search filters?", answer: "Use the filter bar at the top of the search results page to adjust price, location, size, and more." },
  { id: 24, question: "Is there a mobile app for Iskan?", answer: "Yes, our app is available on both iOS and Android. Download it from the App Store or Google Play." },
  { id: 25, question: "What types of properties can I find on Iskan?", answer: "We list apartments, villas, rooms, offices, and commercial spaces across Egypt." },
  { id: 26, question: "How do I contact customer support?", answer: "You can reach us via live chat, email at support@iskan.com, or by calling our hotline." },
  { id: 27, question: "Can I share a property listing with someone?", answer: "Yes, every listing has a share button so you can send it via WhatsApp, email, or copy the link." },
  { id: 28, question: "How does Iskan verify landlords?", answer: "Landlords go through an ID verification process before their listings are approved on the platform." },
  { id: 29, question: "What should I do if I find incorrect information in a listing?", answer: "Click the 'Report an Issue' link on the listing page and describe the problem. We'll fix it quickly." },
  { id: 30, question: "Can I view a 3D tour of a property on Iskan?", answer: "Some listings include virtual 3D tours. Look for the 'Virtual Tour' badge on the listing image." },
];

const ITEMS_PER_PAGE = 3;
const TOTAL_PAGES = 10;

function FAQSection() {
  const [currentPage, setCurrentPage] = useState(1);

  const currentFaqs = faqs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <section className="faq-section">
      <div className="section-header d-flex justify-content-between align-items-start">
        <div>
          <div className="section-badge">
            <img src={abstractDesign} alt="Abstract Design" />
          </div>
          <h2 className="section-title  text-black">Frequently Asked Questions</h2>
          <p className="section-description">
            Find answers to common questions about Iskan's services, property
            listings, and the real estate process. We're here to provide clarity
            and assist you every step of the way.
          </p>
        </div>
        <button className="view-all-Faq  mt-auto ">View All FAQ's</button>
      </div>


      <div className="row g-3 mb-4">
        {currentFaqs.map((faq) => (
          <div key={faq.id} className="col-12 col-md-6 col-lg-4">
            <FAQCard faq={faq} />
          </div>
        ))}
      </div>

      <PaginationControls
        currentPage={currentPage}
        totalPages={TOTAL_PAGES}
        onPageChange={setCurrentPage}
        label={`${currentPage} of ${TOTAL_PAGES}`}
      />
    </section>
  );
}

export default FAQSection
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import HeroSection from "../../components/home/HeroSection";
import PropertiesSection from "../../components/home/PropertiesSection";
import FAQSection from "../../components/home/FAQSection";
import CTASection from "../../components/home/CTASection";
import "../Home/Home.css";

export default function Home() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      el?.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  return (
    <>
      <HeroSection />
      <PropertiesSection />
      <FAQSection />
      <CTASection />
      
    </>
  );
}
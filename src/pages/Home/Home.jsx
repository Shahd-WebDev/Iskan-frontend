import Layout from "../../components/layout/Layout";
import HeroSection from "../../components/home/HeroSection";
import PropertiesSection from "../../components/home/PropertiesSection";
import FAQSection from "../../components/home/FAQSection";
import CTASection from "../../components/home/CTASection";
import "../Home/Home.css";

export default function Home() {
  return (
    <>
      <HeroSection />
      <PropertiesSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
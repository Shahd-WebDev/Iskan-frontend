import SearchBar from "../../components/home/SearchBar";
import FiltersRow from "../home/FiltersRow";

function HeroSection() {
  return (
    <section className="hero-section">

      {/* 👇 container يوسّط المحتوى */}
      <div className="page-container">

        <div className="hero-content">
          <h1 className="hero-title">Find Your Dream Property</h1>

          <p className="hero-description">
            Welcome to Iskan, where your dream property awaits in every corner of our beautiful world.
            Explore our curated selection of properties, each offering a unique story and a chance to redefine your life.
            With categories to suit every dreamer, your journey
          </p>
        </div>

        <div className="search-section position-relative">
          <SearchBar />
          <FiltersRow />
        </div>

      </div>

    </section>
  );
}

export default HeroSection;
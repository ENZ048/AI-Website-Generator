import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import Brands from "./components/Brands.jsx";
import WorkPrinciples from "./components/WorkPrinciples.jsx";
import KeyFeatureSection from "./components/KeyFeatureSection.jsx";
import StatsCounter from "./components/StatsCounter.jsx";
import OfferingsGrid from "./components/OfferingsGrid.jsx";
import ThreeSteps from "./components/ThreeSteps.jsx";
import TestimonialsDraggable from "./components/TestimonialsDraggable.jsx";
import MaxReachAdvantage from "./components/MaxReachAdvantage.jsx";
import FAQSection from "./components/FAQSection.jsx";
import FooterNew from "./components/FooterNew.jsx";

function App() {
  return (
    <div className="min-h-screen bg-custom-background text-white font-sans">
      <div className="absolute inset-0 -z-10 bg-custom-radial" />
      <Header />
      <main>
        <Hero />
        <Brands />
        <WorkPrinciples />
        <KeyFeatureSection />
        <StatsCounter />
        <OfferingsGrid />
        <ThreeSteps />
        <TestimonialsDraggable />
        <MaxReachAdvantage />
        <FAQSection />
      </main>
      <FooterNew />
    </div>
  );
}

export default App;

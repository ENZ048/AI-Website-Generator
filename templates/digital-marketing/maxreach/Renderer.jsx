// src/templates/travel/maxreach/Renderer.jsx

import Header from "../../../components/Header.jsx";
import Hero from "../../../components/Hero.jsx";
import Brands from "../../../components/Brands.jsx"; // stays static
import WorkPrinciples from "../../../components/WorkPrinciples.jsx";
import KeyFeatureSection from "../../../components/KeyFeatureSection.jsx";
import StatsCounter from "../../../components/StatsCounter.jsx";
import OfferingsGrid from "../../../components/OfferingsGrid.jsx";
import ThreeSteps from "../../../components/ThreeSteps.jsx";
import TestimonialsDraggable from "../../../components/TestimonialsDraggable.jsx";
import MaxReachAdvantage from "../../../components/MaxReachAdvantage.jsx";
import FAQSection from "../../../components/FAQSection.jsx";
import FooterNew from "../../../components/FooterNew.jsx";

export default function Renderer({ content }) {
  const c = content || {};

  return (
    <div className="min-h-screen bg-custom-background font-sans text-white">
      <div className="bg-custom-radial absolute inset-0 -z-10" />

      <Header data={c.header} />

      <main>
        <Hero data={c.hero} />

        {/* static section */}
        <Brands />

        <WorkPrinciples data={c.workPrinciples} />
        <KeyFeatureSection data={c.keyFeature} />
        <StatsCounter data={c.statsCounter} />
        <OfferingsGrid data={c.offeringsGrid} />
        <ThreeSteps data={c.threeSteps} />
        <TestimonialsDraggable data={c.testimonials} />
        <MaxReachAdvantage data={c.maxReachAdvantage} />
        <FAQSection data={c.faq} />
      </main>

      <FooterNew data={c.footer} />
    </div>
  );
}

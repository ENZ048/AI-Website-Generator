// src/templates/travel/maxreach/Renderer.jsx

import Header from "./src/components/Header.jsx";
import Hero from "./src/components/Hero.jsx";
import Brands from "./src/components/Brands.jsx"; // stays static
import WorkPrinciples from "./src/components/WorkPrinciples.jsx";
import KeyFeatureSection from "./src/components/KeyFeatureSection.jsx";
import StatsCounter from "./src/components/StatsCounter.jsx";
import OfferingsGrid from "./src/components/OfferingsGrid.jsx";
import ThreeSteps from "./src/components/ThreeSteps.jsx";
import TestimonialsDraggable from "./src/components/TestimonialsDraggable.jsx";
import MaxReachAdvantage from "./src/components/MaxReachAdvantage.jsx";
import FAQSection from "./src/components/FAQSection.jsx";
import FooterNew from "./src/components/FooterNew.jsx";

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
        <KeyFeatureSection data={{ keyFeature: c.keyFeature, whyUs: c.whyUs }} />
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

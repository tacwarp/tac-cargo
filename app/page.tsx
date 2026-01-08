import { Navbar } from "@/components/landing/navbar";
import { HeroSection } from "@/components/landing/hero-section";
import { TrackingSection } from "@/components/landing/tracking-section";
import { CoreCompetencies } from "@/components/landing/core-competencies";
import { OperationalLogic } from "@/components/landing/operational-logic";
import { Testimonials } from "@/components/landing/testimonials";
import { About } from "@/components/landing/about";
import { StatsCTA } from "@/components/landing/stats-cta";
import { Footer } from "@/components/landing/footer";
import { ChatWidget } from "@/components/landing/chat-widget";
import { TrustedBy } from "@/components/landing/trusted-by";

export default function LandingPage() {
  return (
    <div className="bg-background selection:bg-primary/30 selection:text-foreground flex min-h-screen flex-col font-sans">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <TrustedBy />
        <TrackingSection />
        <CoreCompetencies />
        <OperationalLogic />
        <About />
        <Testimonials />
        <StatsCTA />
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}

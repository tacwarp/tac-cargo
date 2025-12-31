import { Navbar } from "@/components/landing/navbar"
import { Hero } from "@/components/landing/hero"
import { TrackingSection } from "@/components/landing/tracking-section"
import { Services } from "@/components/landing/services"
import { Process } from "@/components/landing/process"
import { Testimonials } from "@/components/landing/testimonials"
import { About } from "@/components/landing/about"
import { CTA } from "@/components/landing/cta"
import { Footer } from "@/components/landing/footer"
import { ChatWidget } from "@/components/landing/chat-widget"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col font-sans bg-background selection:bg-primary/30 selection:text-foreground">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <TrackingSection />
        <Services />
        <Process />
        <About />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
      <ChatWidget />
    </div>
  )
}

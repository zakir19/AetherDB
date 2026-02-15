import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import {
  HeroSection,
  StatsSection,
  FeaturesSection,
  ShowcaseSection,
  ThemesSection,
  CLISection,
  CTASection,
} from "@/components/landing/sections";
import { ScrollProgress } from "@/components/animations/motion-elements";
import { ClientHeroScene } from "@/components/three/client-hero-scene";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Navbar />

      <main className="relative">
        {/* Hero with WebGL background */}
        <div className="relative">
          <ClientHeroScene />
          <HeroSection />
        </div>

        <StatsSection />
        <FeaturesSection />
        <ShowcaseSection />
        <ThemesSection />
        <CLISection />
        <CTASection />
      </main>

      <Footer />
    </>
  );
}

import { PageContainer } from "@/widgets/page-container";
import { HeroSection } from "@/views/home/ui/hero-section";
import { AboutSection } from "@/views/home/ui/about-section";
import { LeadershipSection } from "@/views/home/ui/leadership-section";
import { AreasSection } from "@/views/home/ui/areas-section";
import { ValuesSection } from "@/views/home/ui/values-section";
import { TimelineSection } from "@/views/home/ui/timeline-section";
import { CultureSection } from "@/views/home/ui/culture-section";
import { StructureSection } from "@/views/home/ui/structure-section";
import { CtaSection } from "@/views/home/ui/cta-section";

export default function Home() {
  return (
    <PageContainer>
      <HeroSection />
      <AboutSection />
      <LeadershipSection />
      <AreasSection />
      <ValuesSection />
      <CultureSection />
      <TimelineSection />
      <StructureSection />
      <CtaSection />
    </PageContainer>
  );
}

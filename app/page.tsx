import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Manifesto } from "@/components/sections/Manifesto";
import { Capabilities } from "@/components/sections/Capabilities";
import { WebShowcase } from "@/components/sections/WebShowcase";
import { MobileShowcase } from "@/components/sections/MobileShowcase";
import { Process } from "@/components/sections/Process";
import { Contact } from "@/components/sections/Contact";
import { HazardTape } from "@/components/primitives/HazardTape";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <HazardTape
          reverse
          items={[
            "DESIGN",
            "ENGINEERING",
            "MOTION",
            "BRAND",
            "TYPOGRAPHY",
            "PRODUCT",
          ]}
        />
        <Manifesto />
        <Capabilities />
        <WebShowcase />
        <MobileShowcase />
        <Process />
      </main>
      <Contact />
    </>
  );
}

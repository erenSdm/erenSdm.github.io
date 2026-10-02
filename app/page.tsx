import Prism from "@/components/prism/Prism";
import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Intro } from "@/components/sections/Intro";
import { Services } from "@/components/sections/Services";
import { MobileShowcase } from "@/components/sections/MobileShowcase";
import { Systems } from "@/components/sections/Systems";
import { Process } from "@/components/sections/Process";
import { Contact } from "@/components/sections/Contact";

/*
 * Stage order for the fixed glass prism (data-prism):
 * hero → manifesto → services → mobile → systems → process → contact
 */
export default function Home() {
  return (
    <div className="font-plex relative bg-carbon">
      <Prism />
      <Navbar />
      <div className="relative z-[1]">
        <main>
          <Hero />
          <Intro />
          <Services />
          <MobileShowcase />
          <Systems />
          <Process />
        </main>
        <Contact />
      </div>
    </div>
  );
}

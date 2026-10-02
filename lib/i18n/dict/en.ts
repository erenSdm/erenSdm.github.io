export const en = {
  meta: {
    title: "MONOLITH — Digital Product Studio | Web & App Design",
    description:
      "MONOLITH is an Istanbul digital product studio. Web platforms, e-commerce, brand landing pages, mobile apps and design systems — every one of them a live build you can click into.",
  },
  nav: {
    items: [
      { id: "top", label: "Home" },
      { id: "services", label: "Services" },
      { id: "work", label: "Work" },
      { id: "process", label: "Process" },
      { id: "contact", label: "Contact" },
    ],
    cta: "Start a project",
    menu: "Menu",
    close: "Close",
    lang: "Switch language",
  },
  hero: {
    kicker: "Digital product studio — Istanbul",
    title: ["Interfaces", "built like", "hardware."],
    body: "MONOLITH designs and engineers websites and apps for brands that want to be remembered, not scrolled past. Strategy, interface, code and motion — under one roof.",
    cta: "See the work",
    secondary: "Services",
    liveBuilds: "live builds",
    ticker: [
      "Web platforms",
      "Dashboards",
      "E-commerce",
      "Brand landing pages",
      "Mobile apps",
      "Design systems",
      "Motion",
      "Frontend engineering",
    ],
  },
  intro: {
    kicker: "The studio",
    title: ["Five disciplines.", "One studio."],
    lead: "Five services that lock into each other:",
    body: "We map a product into |web platforms| and |storefronts|, give the brand a |landing page| with a spine, carry it into your pocket with |mobile apps|, and hold it all together with a |design system| that moves.",
    stats: [
      { key: "builds", label: "Live builds" },
      { key: "disciplines", label: "Disciplines" },
      { key: "fps", label: "Motion target" },
      { key: "templates", label: "Templates used" },
    ],
  },
  services: {
    kicker: "Services",
    title: "What we build",
    sub: "Each discipline below runs on a real build. Pick a project on the right — it's live, not a screenshot.",
    live: "Live",
    open: "Open",
    builds: "builds",
    items: {
      platforms: {
        title: "Web platforms & dashboards",
        tags: ["SaaS", "Dashboards", "Realtime data", "Dev tools"],
        body: "Data-dense products that stay calm under load. We design the information hierarchy first, then build the surface in React with charts, tables and command bars that respond like native software.",
        cta: "Explore platforms",
      },
      commerce: {
        title: "E-commerce",
        tags: ["Storefronts", "Product pages", "Checkout", "Drops"],
        body: "Storefronts where product photography and typography share the runway. From luxury catalogs to countdown drops, every flow is designed to move a customer from browse to bag.",
        cta: "Explore commerce",
      },
      brand: {
        title: "Brand landing pages",
        tags: ["Launches", "Campaigns", "Scroll stories", "Real clients"],
        body: "Landing pages with a point of view. Oversized type, scroll choreography and numbers that land — built for launches, fundraising rounds and companies that want to look as sharp as they are.",
        cta: "Explore landing pages",
      },
      mobile: {
        title: "Mobile apps",
        tags: ["iOS", "Android", "Fintech", "Health", "Messaging"],
        body: "App interfaces designed for the thumb, not the slide deck. Native-feeling motion, glanceable data and screens people actually open twice a day.",
        cta: "Explore apps",
      },
      systems: {
        title: "Design systems & motion",
        tags: ["Tokens", "Type scales", "Components", "Motion specs"],
        body: "Every build on this page runs on its own token set — color, type, spacing, easing. We hand that system over documented, so your team ships the next screen without us.",
        cta: "See all systems",
      },
    },
    systemsCaption: "accent systems, one per build",
  },
  work: {
    kicker: "Index",
    title: "All work",
    sub: "Every project in the studio, live. Tap any row to open the full build.",
    web: "Web",
    mobile: "Mobile",
    open: "Open build",
  },
  mobile: {
    label: "In your hand",
    title: "Mobile apps",
    subtitle: "Scroll to move from one screen to the next. Each phone runs the real app.",
    open: "Open app",
  },
  process: {
    kicker: "Process",
    title: "How the work happens",
    steps: [
      {
        n: "01",
        title: "Signal",
        body: "We start from the brief and the subject's real world — its materials, its vocabulary, its job.",
      },
      {
        n: "02",
        title: "Blueprint",
        body: "Tokens, type scale and a signature move. The one thing the work will be remembered by.",
      },
      {
        n: "03",
        title: "Build",
        body: "Real components, real motion, real content. We critique as we go and cut what doesn't serve.",
      },
      {
        n: "04",
        title: "Ship",
        body: "Responsive to mobile, accessible by default, fast under load. Handed over clean.",
      },
    ],
  },
  contact: {
    kicker: "Contact",
    title: ["Let's build", "something", "sharp."],
    body: "Have a product that deserves better than a template? Tell us what it does and who it's for — we reply within one working day.",
    cta: "Start a project",
    availabilityLabel: "Availability",
    availability: "Booking Q4 2026 — Q1 2027",
    emailLabel: "Direct",
    locationLabel: "Studio",
    location: "Istanbul, TR — remote worldwide",
  },
  footer: {
    tag: "Digital product studio",
    backToTop: "Back to top",
    colophon: "Built with Next.js, GSAP & too much coffee.",
  },
  common: {
    close: "Close",
    menu: "Menu",
    loading: "Loading",
  },
};

export type Dictionary = typeof en;

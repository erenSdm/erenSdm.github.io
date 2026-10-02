export const en = {
  meta: {
    title: "MONOLITH — Digital Product Studio | Web & App Design",
    description:
      "MONOLITH is an Istanbul digital product studio. Websites, mobile apps and backend automation — every one of them a live build you can click into.",
  },
  nav: {
    items: [
      { id: "services", label: "Websites" },
      { id: "mobile", label: "Mobile" },
      { id: "systems", label: "Automation" },
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
    title: ["Built", "to be", "remembered."],
    body: "Websites, mobile apps and the systems behind them — designed and engineered end to end by one small studio. Strategy, interface, code and motion, without the hand-offs.",
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
    title: ["One studio.", "Every layer."],
    lead: "MONOLITH is a full-stack studio: the same hands design the screen, write the interface and build the system behind it.",
    body: "Most products change hands three times between |design|, |frontend| and |backend|, and something gets lost at every handover. Here every layer is made at the same desk, so the motion you see on screen and the data moving behind it speak the same language.",
    parts: [
      {
        target: "services",
        title: "Websites",
        sub: "Platforms, stores & brand pages",
        body: "Landing pages with a point of view, storefronts, SaaS dashboards and real-time 3D scenes. Built with Next.js and React: fast, accessible and hard to forget.",
        tags: ["Next.js", "React", "Three.js", "GSAP"],
        cta: "See the websites",
      },
      {
        target: "mobile",
        title: "Mobile apps",
        sub: "iOS & Android interfaces",
        body: "App screens designed for the thumb: native-feeling transitions, data you read at a glance, and flows that work end to end, from sign-up to payment.",
        tags: ["iOS", "Android", "Interaction", "Prototyping"],
        cta: "See the apps",
      },
      {
        target: "systems",
        title: "Backend & automation",
        sub: "APIs, bots & AI",
        body: "The part behind the screen: APIs and databases, exchange and payment integrations, Telegram and WhatsApp bots, AI-powered search, and automations that take repetitive work off people's hands.",
        tags: ["API", "Webhooks", "AI / RAG", "Bots"],
        cta: "See the systems",
      },
    ],
  },
  services: {
    kicker: "Websites",
    title: "What we build",
    sub: "A hand-picked selection of our web builds, from live client sites to studio concepts. Every frame below is the real site running, not a screenshot. Scroll through or open one in full.",
    live: "Live",
    open: "Open",
  },
  mobile: {
    label: "In your hand",
    title: "Mobile apps",
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

export const en = {
  meta: {
    title: "Eren Aydemir",
    description:
      "Eren Aydemir is an Istanbul-based designer and full-stack developer. Websites, mobile apps and backend automation — every one of them a live build you can click into.",
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
    title: ["Built", "to be", "remembered."],
    body: "I design and build websites, mobile apps and the systems behind them, end to end.",
    cta: "See the work",
    secondary: "Services",
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
    kicker: "About me",
    title: ["Hi,", "I'm Eren."],
    lead: "With a broad range of skills, I can help you at every stage. Let's turn your ideas into systems that actually work, together.",
    points: [
      {
        title: "Design approach",
        body: "I start from the work itself, not a template. Typography, motion and detail that make an interface memorable without making it tiring to use.",
      },
      {
        title: "End-to-end development",
        body: "Interface, API, database and deployment: I build every layer myself. Nothing gets lost in handovers, because there are none.",
      },
      {
        title: "AI & automation",
        body: "I turn repetitive work into automations and scattered knowledge into AI-powered tools: bots, integrations and flows that give you time back.",
      },
    ],
    figure: {
      alt: "Black and white portrait of Eren Aydemir",
    },
    parts: [
      {
        target: "services",
        title: "Websites",
        body: "Landing pages with a point of view, storefronts, SaaS dashboards and real-time 3D scenes. Built with Next.js and React: fast, accessible and hard to forget.",
        tags: ["Next.js", "React", "Three.js", "GSAP"],
        cta: "See the websites",
      },
      {
        target: "mobile",
        title: "Mobile apps",
        body: "App screens designed for the thumb: native-feeling transitions, data you read at a glance, and flows that work end to end, from sign-up to payment.",
        tags: ["iOS", "Android", "Interaction", "Prototyping"],
        cta: "See the apps",
      },
      {
        target: "systems",
        title: "Backend & automation",
        body: "The part behind the screen: APIs and databases, exchange and payment integrations, Telegram and WhatsApp bots, AI-powered search, and automations that take repetitive work off people's hands.",
        tags: ["API", "Webhooks", "AI / RAG", "Bots"],
        cta: "See the systems",
      },
    ],
  },
  services: {
    kicker: "Websites",
    title: "Showcase",
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
        title: "Signal",
        body: "I start from the brief and the subject's real world — its materials, its vocabulary, its job.",
      },
      {
        title: "Blueprint",
        body: "Tokens, type scale and a signature move. The one thing the work will be remembered by.",
      },
      {
        title: "Build",
        body: "Real components, real motion, real content. I critique as I go and cut what doesn't serve.",
      },
      {
        title: "Ship",
        body: "Responsive to mobile, accessible by default, fast under load. Handed over clean.",
      },
    ],
  },
  contact: {
    kicker: "Contact",
    title: ["Let's build", "something", "sharp."],
    // index of the title line set in grey
    titleAccent: 1,
    cta: "Start a project",
    availabilityLabel: "Availability",
    availability: "Booking Q4 2026 — Q1 2027",
    emailLabel: "Direct",
    phoneLabel: "Phone",
    whatsapp: "Message on WhatsApp",
    locationLabel: "Based in",
    location: "Istanbul, TR — remote worldwide",
  },
  footer: {
    tag: "Designer & full-stack developer",
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

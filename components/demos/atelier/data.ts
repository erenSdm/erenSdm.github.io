export type Garment = {
  id: string;
  name: string;
  category: string;
  price: string;
  seed: string;
  w: number;
  h: number;
};

// The Collection — Automne/Hiver 2026, Collection XII.
export const collection: Garment[] = [
  {
    id: "I",
    name: "Vendôme Double-Cashmere Coat",
    category: "Outerwear",
    price: "€2,760",
    seed: "vendome",
    w: 1000,
    h: 1320,
  },
  {
    id: "II",
    name: "Marguerite Silk-Charmeuse Gown",
    category: "Eveningwear",
    price: "€2,180",
    seed: "marguerite",
    w: 1000,
    h: 1180,
  },
  {
    id: "III",
    name: "Colette Sculpted Wool Blazer",
    category: "Tailoring",
    price: "€1,090",
    seed: "colette",
    w: 1000,
    h: 1240,
  },
  {
    id: "IV",
    name: "Ondine Hand-Pleated Skirt",
    category: "Ready-to-wear",
    price: "€680",
    seed: "ondine",
    w: 1000,
    h: 1120,
  },
  {
    id: "V",
    name: "Aurore Duchesse-Satin Jacket",
    category: "Eveningwear",
    price: "€1,920",
    seed: "aurore",
    w: 1000,
    h: 1280,
  },
];

// Material notes for the featured piece.
export const featuredNotes: string[] = [
  "Double-faced ottoman wool, milled in Biella, Italy",
  "Hand-rolled hems, fastened with tonal horn toggles",
  "Fully canvassed and left unlined for a fluid drape",
  "Atelier-finished across roughly forty hours",
];

export const featuredSizes = ["34", "36", "38", "40", "42"];

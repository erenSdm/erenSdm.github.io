import { ALL_DEMOS, type Demo } from "@/lib/demos";

/**
 * The five studio disciplines the homepage is organised around. Every demo in
 * the manifest is sorted into one of them, so new entries in lib/demos.ts show
 * up under the right service card without touching this file.
 */
export type DisciplineKey =
  | "platforms"
  | "commerce"
  | "brand"
  | "mobile"
  | "systems";

export const DISCIPLINE_ORDER: DisciplineKey[] = [
  "platforms",
  "commerce",
  "brand",
  "mobile",
  "systems",
];

/* explicit placement for known builds; everything else is inferred */
const PINNED: Record<string, DisciplineKey> = {
  "saas-panel": "platforms",
  workspace: "platforms",
  platform: "platforms",
  atelier: "commerce",
  drops: "commerce",
  ledger: "brand",
  agency: "brand",
  motors: "brand",
  richcase: "platforms",
  venn: "brand",
  nixrad: "brand",
};

export function disciplineOf(demo: Demo): DisciplineKey {
  const pinned = PINNED[demo.slug];
  if (pinned) return pinned;
  if (demo.kind === "mobile") return "mobile";
  const hay = [...demo.stack, demo.domain.en].join(" ").toLowerCase();
  if (/commerce|shop|store|retail|catalog/.test(hay)) return "commerce";
  if (/dashboard|saas|panel|platform|console|admin|crm/.test(hay))
    return "platforms";
  return "brand";
}

/** demos grouped per discipline; "systems" draws from the whole manifest */
export function demosFor(key: DisciplineKey): Demo[] {
  if (key === "systems") return ALL_DEMOS;
  return ALL_DEMOS.filter((d) => disciplineOf(d) === key);
}

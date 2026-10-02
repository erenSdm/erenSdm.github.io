import { WEB_DEMOS, type Demo } from "@/lib/demos";

/**
 * The three kinds of website the "What we build" section is organised around.
 * Every web demo in the manifest is sorted into one of them, so new entries in
 * lib/demos.ts show up under the right card without touching this file.
 * Mobile apps and backend systems have their own homepage sections.
 */
export type DisciplineKey = "platforms" | "commerce" | "brand";

export const DISCIPLINE_ORDER: DisciplineKey[] = ["platforms", "commerce", "brand"];

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
  const hay = [...demo.stack, demo.domain.en].join(" ").toLowerCase();
  if (/commerce|shop|store|retail|catalog/.test(hay)) return "commerce";
  if (/dashboard|saas|panel|platform|console|admin|crm/.test(hay))
    return "platforms";
  return "brand";
}

/** web demos grouped per discipline */
export function demosFor(key: DisciplineKey): Demo[] {
  return WEB_DEMOS.filter((d) => disciplineOf(d) === key);
}

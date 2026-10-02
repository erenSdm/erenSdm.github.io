import { getDemo, type Demo } from "@/lib/demos";

/**
 * The curated web builds the "Websites" section shows, in display order.
 * The rest of the manifest stays reachable through its /demos routes.
 */
const FEATURED_SLUGS = ["richcase", "nixrad", "motors", "venn", "agency", "atelier"];

export const FEATURED_WEB: Demo[] = FEATURED_SLUGS.map((slug) => getDemo(slug)).filter(
  (d): d is Demo => !!d
);

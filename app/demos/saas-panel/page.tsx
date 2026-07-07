import type { Metadata } from "next";
import { HelmDashboard } from "@/components/demos/saas-panel/HelmDashboard";

export const metadata: Metadata = {
  title: "HELM — Edge Observability Console",
  description:
    "HELM tactical telemetry dashboard — real-time edge request volume, revenue, and live event stream for ORG-04.",
};

export default function SaasPanelDemoPage() {
  return (
    <div className="min-h-[100dvh] bg-ink">
      <HelmDashboard />
    </div>
  );
}

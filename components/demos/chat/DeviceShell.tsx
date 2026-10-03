import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

/**
 * Shared iOS app shell for the four mobile demos (RELAY, MINT, PULSE, WAVES).
 *
 * - Real iPhone: full-bleed 100dvh column, safe areas from env(safe-area-inset-*)
 *   (the route exports viewport-fit=cover).
 * - Inside the homepage PhoneFrame (iframe with ?embed=1): reserves room for the
 *   frame's status bar + Dynamic Island and home indicator.
 * - Desktop standalone: centred 430px device column.
 *
 * Exposes CSS vars `--safe-top` / `--safe-bottom` to every screen, and swaps the
 * site's display/mono faces for an SF-like system stack so the apps read native.
 */
const ios = Inter({
  subsets: ["latin"],
  variable: "--font-ios",
  display: "swap",
});

const IOS_STACK =
  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", var(--font-ios), system-ui, sans-serif';

// The site is a static export, so ?embed=1 is read in the browser. This runs
// inline before first paint and flags the shell; the embed/standalone styling
// below keys off [data-embed], which React never touches on hydration.
const EMBED_SCRIPT =
  'if(new URLSearchParams(location.search).get("embed")==="1")document.currentScript.parentElement.setAttribute("data-embed","")';

export function DeviceShell({
  children,
  background,
  tone = "dark",
}: {
  children: React.ReactNode;
  background: string;
  /** light apps sit on a soft neutral desktop backdrop instead of black */
  tone?: "light" | "dark";
}) {
  const backdrop = tone === "light" ? "#E4E6E9" : "#000";
  const deviceShadow =
    tone === "light"
      ? "0 40px 100px -30px rgba(20,24,32,0.35),0 0 0 1px rgba(20,24,32,0.06)"
      : "0 40px 120px -30px rgba(0,0,0,0.9),0 0 0 1px rgba(255,255,255,0.08)";
  return (
    <div
      suppressHydrationWarning
      className={cn(ios.variable, "ios-root flex min-h-[100dvh] w-full justify-center md:items-center")}
    >
      <script dangerouslySetInnerHTML={{ __html: EMBED_SCRIPT }} />
      <style>{`
        .ios-root{--safe-top:max(env(safe-area-inset-top),12px);--safe-bottom:max(env(safe-area-inset-bottom),10px);font-family:${IOS_STACK};-webkit-font-smoothing:antialiased;-webkit-tap-highlight-color:transparent;letter-spacing:-0.01em}
        @media (min-width:768px){.ios-root:not([data-embed]){--safe-top:22px;--safe-bottom:14px}.ios-root:not([data-embed]) .ios-device{height:min(932px,calc(100dvh - 48px));border-radius:44px;box-shadow:${deviceShadow}}}
        .ios-root[data-embed]{--safe-top:54px;--safe-bottom:22px}
        .ios-root .font-mono,.ios-root .font-display,.ios-root .label{font-family:${IOS_STACK};font-variant-numeric:tabular-nums;letter-spacing:-0.01em}
        .ios-root .font-display{font-weight:700;letter-spacing:-0.035em}
        .ios-root button,.ios-root a{touch-action:manipulation}
        html:has(.ios-root),html:has(.ios-root) body{background:${backdrop};overscroll-behavior:none}
        .ios-root{background:${backdrop}}
      `}</style>
      <div
        className="ios-device relative flex h-[100dvh] w-full max-w-[430px] flex-col overflow-hidden"
        style={{ background }}
      >
        {children}
      </div>
    </div>
  );
}

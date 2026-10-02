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

export function DeviceShell({
  children,
  embed,
  background,
}: {
  children: React.ReactNode;
  embed: boolean;
  background: string;
}) {
  return (
    <div
      className={cn(
        ios.variable,
        "ios-root flex min-h-[100dvh] w-full justify-center bg-black md:items-center",
        embed && "is-embed",
      )}
    >
      <style>{`
        .ios-root{--safe-top:max(env(safe-area-inset-top),12px);--safe-bottom:max(env(safe-area-inset-bottom),10px);font-family:${IOS_STACK};-webkit-font-smoothing:antialiased;-webkit-tap-highlight-color:transparent;letter-spacing:-0.01em}
        @media (min-width:768px){.ios-root:not(.is-embed){--safe-top:22px;--safe-bottom:14px}}
        .ios-root.is-embed{--safe-top:54px;--safe-bottom:22px}
        .ios-root .font-mono,.ios-root .font-display,.ios-root .label{font-family:${IOS_STACK};font-variant-numeric:tabular-nums;letter-spacing:-0.01em}
        .ios-root .font-display{font-weight:700;letter-spacing:-0.035em}
        .ios-root button,.ios-root a{touch-action:manipulation}
        html:has(.ios-root),html:has(.ios-root) body{background:#000;overscroll-behavior:none}
      `}</style>
      <div
        className={cn(
          "relative flex h-[100dvh] w-full max-w-[430px] flex-col overflow-hidden",
          !embed &&
            "md:h-[min(932px,calc(100dvh-48px))] md:rounded-[44px] md:shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.08)]",
        )}
        style={{ background }}
      >
        {children}
      </div>
    </div>
  );
}

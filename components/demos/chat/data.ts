/**
 * RELAY — seed data for the inbox, conversations, calls and the scripted
 * auto-replies each contact sends back. Everything lives in React state.
 */

export type ReactionKey = "heart" | "up" | "laugh" | "flame" | "check";

export type DeliveryStatus = "sending" | "sent" | "delivered" | "read";

export interface Person {
  id: string;
  name: string;
  /** avatar tint, index into AVATAR_TINTS */
  tint: number;
}

interface MessageBase {
  id: string;
  from: "me" | "them";
  /** author id for group chats (incoming only) */
  author?: string;
  /** day label used for separators */
  day: string;
  time: string;
  status?: DeliveryStatus;
  reactions?: { mine?: ReactionKey; theirs?: ReactionKey };
}

export type Message =
  | (MessageBase & { kind: "text"; text: string })
  | (MessageBase & {
      kind: "image";
      image: { seed: string; w: number; h: number; alt: string };
      text?: string;
    })
  | (MessageBase & { kind: "voice"; voice: { seconds: number; wave: number[] } });

export interface ScriptedReply {
  text: string;
  /** suggestions offered after this reply lands */
  suggestions?: string[];
  author?: string;
}

export interface Conversation {
  id: string;
  title: string;
  tint: number;
  group?: { members: Person[] };
  online: boolean;
  lastSeen?: string;
  pinned: boolean;
  muted?: boolean;
  unread: number;
  /** ordering key, larger is newer */
  updatedAt: number;
  /** label shown in the inbox when the last message is a seed */
  stamp: string;
  messages: Message[];
  suggestions: string[];
  script: ScriptedReply[];
}

export const AVATAR_TINTS = [
  { bg: "#DCE5FA", fg: "#1E3C93" }, // cobalt mist
  { bg: "#D7ECE3", fg: "#1C5A42" }, // sage
  { bg: "#F4E2D3", fg: "#76391A" }, // clay
  { bg: "#E1E5EB", fg: "#2B3749" }, // slate
  { bg: "#F3E6BC", fg: "#644C0C" }, // ochre
  { bg: "#F2DAE0", fg: "#7C2540" }, // rose
] as const;

/** deterministic waveform so SSR and client agree */
export function wave(seed: number, bars = 34): number[] {
  const out: number[] = [];
  let x = seed * 9301 + 49297;
  for (let i = 0; i < bars; i++) {
    x = (x * 9301 + 49297) % 233280;
    const r = x / 233280;
    const envelope = Math.sin((i / (bars - 1)) * Math.PI) * 0.55 + 0.35;
    out.push(Math.max(0.14, Math.min(1, r * envelope + 0.12)));
  }
  return out;
}

const STUDIO: Person[] = [
  { id: "selin", name: "Selin Kaya", tint: 5 },
  { id: "mert", name: "Mert Doğan", tint: 1 },
  { id: "jonas", name: "Jonas Reinholt", tint: 3 },
];

const RUN: Person[] = [
  { id: "ozan", name: "Ozan Taş", tint: 4 },
  { id: "ines", name: "Inès Barbier", tint: 2 },
];

export const ME = {
  name: "Deniz Aral",
  handle: "@deniz.aral",
  phone: "+90 532 418 07 63",
  tint: 0,
};

export const CONVERSATIONS: Conversation[] = [
  {
    id: "defne",
    title: "Defne Aksoy",
    tint: 2,
    online: true,
    pinned: true,
    unread: 2,
    updatedAt: 100,
    stamp: "14:32",
    suggestions: ["The 10:40 works", "Bring the film camera", "Is Çiya open Sundays?"],
    script: [
      {
        text: "Perfect. I'll grab simit at the pier, you're on tea duty.",
        suggestions: ["Deal", "Two sugars for me", "Which pier, Kadıköy?"],
      },
      {
        text: "Also Selin might join us after lunch, she's finishing a print run in Moda.",
        suggestions: ["The more the better", "Let's keep it small", "Tell her to come"],
      },
      {
        text: "Ok, packing my sketchbook. See you at the turnstiles at 10:25.",
        suggestions: ["See you there", "Running 5 min late", "Bring a jacket"],
      },
      {
        text: "Forecast says 19 degrees and windy on the water. Layers.",
        suggestions: ["Noted", "Scarf it is"],
      },
    ],
    messages: [
      { id: "d1", from: "them", kind: "text", day: "Yesterday", time: "21:48", text: "Are we still doing the island on Sunday or did work eat your weekend again" },
      { id: "d2", from: "me", kind: "text", day: "Yesterday", time: "21:52", status: "read", text: "Still on. I shipped the deck tonight so Sunday is fully mine" },
      { id: "d3", from: "them", kind: "text", day: "Yesterday", time: "21:53", text: "Finally. Büyükada or Heybeli?", reactions: { mine: "flame" } },
      { id: "d4", from: "me", kind: "text", day: "Yesterday", time: "21:55", status: "read", text: "Heybeli. Fewer crowds, and that bakery near the naval school" },
      {
        id: "d5",
        from: "them",
        kind: "image",
        day: "Today",
        time: "09:12",
        image: { seed: "relay-heybeli-pier", w: 640, h: 480, alt: "Ferry pier on a calm morning with boats moored along the water" },
        text: "Found my photo from last spring. Same plan?",
      },
      { id: "d6", from: "me", kind: "text", day: "Today", time: "09:20", status: "read", text: "That light. Yes, exactly that", reactions: { theirs: "heart" } },
      { id: "d7", from: "them", kind: "voice", day: "Today", time: "14:29", voice: { seconds: 23, wave: wave(7) } },
      { id: "d8", from: "them", kind: "text", day: "Today", time: "14:32", text: "Ferry options from Kabataş: 10:40 or 11:55. The early one gets us there before the lunch rush" },
    ],
  },
  {
    id: "studio",
    title: "Studio Kuzey",
    tint: 3,
    group: { members: STUDIO },
    online: false,
    pinned: true,
    unread: 5,
    updatedAt: 99,
    stamp: "13:07",
    suggestions: ["Looks great", "Can we see it on mobile?", "I'll review after 4"],
    script: [
      { author: "selin", text: "Pushed v3 with the tighter grid. Check the pricing table on 390 wide.", suggestions: ["On it", "Grid feels right"] },
      { author: "mert", text: "Client call moved to 16:30 by the way. Same link.", suggestions: ["Thanks Mert", "I'll be there"] },
      { author: "jonas", text: "Exported the motion specs, they're in the shared folder under /handoff.", suggestions: ["Perfect", "Which file?"] },
    ],
    messages: [
      { id: "s1", from: "them", author: "jonas", kind: "text", day: "Today", time: "11:41", text: "Morning. Type tests for the Kuzey Coffee rebrand are up" },
      { id: "s2", from: "me", kind: "text", day: "Today", time: "11:58", status: "read", text: "The condensed cut on the menu boards is strong" },
      { id: "s3", from: "them", author: "mert", kind: "text", day: "Today", time: "12:20", text: "Agreed. Client asked if we can keep the old green somewhere" },
      { id: "s4", from: "them", author: "selin", kind: "image", day: "Today", time: "12:44", image: { seed: "relay-kuzey-cups", w: 600, h: 600, alt: "Paper coffee cups lined up on a wooden counter" }, text: "Cup sleeve with the green as a single stripe" },
      { id: "s5", from: "them", author: "selin", kind: "text", day: "Today", time: "12:45", text: "Feels respectful without being nostalgic" },
      { id: "s6", from: "them", author: "jonas", kind: "text", day: "Today", time: "13:02", text: "That's the one", reactions: { theirs: "up" } },
      { id: "s7", from: "them", author: "mert", kind: "text", day: "Today", time: "13:07", text: "Deniz, can you mock it on the takeaway bag before the call?" },
    ],
  },
  {
    id: "jonas",
    title: "Jonas Reinholt",
    tint: 3,
    online: true,
    pinned: false,
    unread: 0,
    updatedAt: 98,
    stamp: "12:10",
    suggestions: ["Sounds good", "Send me the link", "Tomorrow?"],
    script: [
      { text: "Cool. I'll be on Berlin time until Thursday, so mornings work best.", suggestions: ["Mornings it is", "Thursday then"] },
      { text: "Sending the Figma link now, it's the second page.", suggestions: ["Got it", "Thanks"] },
    ],
    messages: [
      { id: "j1", from: "them", kind: "text", day: "Today", time: "11:52", text: "Do you have 20 minutes for the handoff walkthrough?" },
      { id: "j2", from: "me", kind: "text", day: "Today", time: "12:10", status: "read", text: "After 15:00 works. Send an invite?" },
    ],
  },
  {
    id: "kaan",
    title: "Kaan Öztürk",
    tint: 4,
    online: false,
    lastSeen: "last seen 11:24",
    pinned: false,
    unread: 1,
    updatedAt: 97,
    stamp: "11:24",
    suggestions: ["Saturday works", "Which court?", "I'll bring balls"],
    script: [
      { text: "Caddebostan courts, 9:30. Loser buys breakfast.", suggestions: ["You're on", "Make it 10"] },
      { text: "Booked. Court 4, the one without the crack in the baseline.", suggestions: ["Finally", "See you"] },
    ],
    messages: [
      { id: "k1", from: "me", kind: "text", day: "Tue", time: "19:03", status: "read", text: "That rematch is overdue" },
      { id: "k2", from: "them", kind: "text", day: "Today", time: "11:24", text: "Tennis Saturday? I've been practising my backhand, fair warning" },
    ],
  },
  {
    id: "mireille",
    title: "Mireille Okafor",
    tint: 1,
    online: false,
    lastSeen: "last seen yesterday",
    pinned: false,
    unread: 0,
    updatedAt: 96,
    stamp: "Yesterday",
    suggestions: ["These are beautiful", "Can I use one?", "Which lens?"],
    script: [
      { text: "Thank you. Shot it all on the 35mm, no edits beyond a bit of grain.", suggestions: ["It shows", "Teach me"] },
      { text: "Of course, credit me and it's yours.", suggestions: ["Promise", "Thank you"] },
    ],
    messages: [
      { id: "mi1", from: "them", kind: "image", day: "Yesterday", time: "18:40", image: { seed: "relay-lagos-street", w: 480, h: 640, alt: "Narrow street at dusk with warm windows and a cyclist" }, text: "Contact sheet from the Galata walk" },
      { id: "mi2", from: "me", kind: "text", day: "Yesterday", time: "19:12", status: "read", text: "This one is going on my wall", reactions: { theirs: "heart" } },
    ],
  },
  {
    id: "run",
    title: "Moda Sunday Run",
    tint: 1,
    group: { members: RUN },
    online: false,
    pinned: false,
    muted: true,
    unread: 0,
    updatedAt: 95,
    stamp: "Yesterday",
    suggestions: ["Count me in", "Pace?", "Skipping this week"],
    script: [
      { author: "ozan", text: "Easy pace, 5:40ish. Coffee at Kronotrop after.", suggestions: ["Perfect", "See you"] },
      { author: "ines", text: "I'll bring the route on my watch, 8.2 km along the coast.", suggestions: ["Nice", "Bit long for me"] },
    ],
    messages: [
      { id: "r1", from: "them", author: "ozan", kind: "text", day: "Yesterday", time: "20:15", text: "Meeting at the Moda pier, 07:45 sharp" },
      { id: "r2", from: "them", author: "ines", kind: "voice", day: "Yesterday", time: "20:31", voice: { seconds: 11, wave: wave(3) } },
    ],
  },
  {
    id: "tomas",
    title: "Tomás Ibarra",
    tint: 5,
    online: false,
    lastSeen: "last seen Wed",
    pinned: false,
    unread: 0,
    updatedAt: 94,
    stamp: "Wed",
    suggestions: ["Congrats", "When's the opening?", "Send photos"],
    script: [
      { text: "Opening is the 14th, 19:00. You're on the list plus one.", suggestions: ["Wouldn't miss it", "Who's playing?"] },
    ],
    messages: [
      { id: "t1", from: "them", kind: "text", day: "Wed", time: "16:02", text: "We got the space in Karaköy. Signing the lease Friday" },
      { id: "t2", from: "me", kind: "voice", day: "Wed", time: "16:10", status: "read", voice: { seconds: 18, wave: wave(11) } },
    ],
  },
  {
    id: "hira",
    title: "Hira Saeed",
    tint: 0,
    online: false,
    lastSeen: "last seen Mon",
    pinned: false,
    unread: 0,
    updatedAt: 93,
    stamp: "Mon",
    suggestions: ["Thanks again", "Coffee soon?"],
    script: [{ text: "Anytime. Thursday at Fazıl Bey's?", suggestions: ["Thursday works"] }],
    messages: [
      { id: "h1", from: "me", kind: "text", day: "Mon", time: "10:30", status: "read", text: "Your notes on the onboarding flow saved me a week" },
      { id: "h2", from: "them", kind: "text", day: "Mon", time: "10:44", text: "Glad they helped. The empty states were the real fix" },
    ],
  },
  {
    id: "baran",
    title: "Baran Erdem",
    tint: 2,
    online: false,
    lastSeen: "last seen 27 Sep",
    pinned: false,
    unread: 0,
    updatedAt: 92,
    stamp: "27 Sep",
    suggestions: ["Sent", "Let me check"],
    script: [{ text: "Got it, thank you. Settling up tonight.", suggestions: ["No rush"] }],
    messages: [
      { id: "b1", from: "them", kind: "text", day: "27 Sep", time: "22:10", text: "What was the total for the cabin? I owe you my share" },
      { id: "b2", from: "me", kind: "text", day: "27 Sep", time: "22:18", status: "read", text: "4,860 TL split three ways, so 1,620 each" },
    ],
  },
];

export interface CallEntry {
  id: string;
  name: string;
  tint: number;
  direction: "in" | "out" | "missed";
  video: boolean;
  when: string;
  duration?: string;
  count?: number;
}

export const CALLS: CallEntry[] = [
  { id: "c1", name: "Defne Aksoy", tint: 2, direction: "missed", video: false, when: "13:58", count: 2 },
  { id: "c2", name: "Studio Kuzey", tint: 3, direction: "out", video: true, when: "11:30", duration: "42:17" },
  { id: "c3", name: "Kaan Öztürk", tint: 4, direction: "in", video: false, when: "Yesterday", duration: "6:04" },
  { id: "c4", name: "Leyla Aral", tint: 5, direction: "in", video: true, when: "Yesterday", duration: "18:51" },
  { id: "c5", name: "Jonas Reinholt", tint: 3, direction: "missed", video: true, when: "Wed" },
  { id: "c6", name: "Tomás Ibarra", tint: 5, direction: "out", video: false, when: "Wed", duration: "2:39" },
  { id: "c7", name: "Hira Saeed", tint: 0, direction: "out", video: false, when: "Mon", duration: "11:12" },
  { id: "c8", name: "Baran Erdem", tint: 2, direction: "in", video: false, when: "27 Sep", duration: "0:48" },
];

/** photos offered in the composer's attach tray */
export const RECENT_PHOTOS = [
  { seed: "relay-tray-tea", alt: "Tea glasses on a tray" },
  { seed: "relay-tray-bosphorus", alt: "Bridge over the water at dusk" },
  { seed: "relay-tray-market", alt: "Market stall with fruit" },
  { seed: "relay-tray-sketch", alt: "Open sketchbook on a desk" },
  { seed: "relay-tray-cat", alt: "Street cat on a step" },
  { seed: "relay-tray-tram", alt: "Red tram on a busy street" },
];

export function initials(name: string): string {
  const parts = name.split(" ").filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase();
}

export function memberName(conv: Conversation, id?: string): string | undefined {
  return conv.group?.members.find((m) => m.id === id)?.name;
}

export function nowTime(): string {
  const d = new Date();
  return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
}

export function formatSeconds(s: number): string {
  const m = Math.floor(s / 60);
  return `${m}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
}

export function previewOf(m: Message): string {
  if (m.kind === "image") return m.text ? `Photo, ${m.text}` : "Photo";
  if (m.kind === "voice") return `Voice message, ${formatSeconds(m.voice.seconds)}`;
  return m.text;
}

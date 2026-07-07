/**
 * RELAY — conversation seed data.
 * A believable, specific exchange between two friends coordinating
 * a return trip to a Sunday ceramics market.
 */

export interface ChatContact {
  name: string;
  handle: string;
  avatar: string; // pravatar url
  presence: string; // last-active / status line
  online: boolean;
}

export type MessageKind = "text" | "image";

export interface Message {
  id: string;
  from: "them" | "me";
  kind: MessageKind;
  text?: string;
  image?: { src: string; w: number; h: number; alt: string };
  time: string;
  read?: boolean;
}

export const CONTACT: ChatContact = {
  name: "Priya Nair",
  handle: "priya.n",
  avatar: "https://i.pravatar.cc/120?img=47",
  presence: "Active now",
  online: true,
};

export const SEED_MESSAGES: Message[] = [
  {
    id: "m1",
    from: "them",
    kind: "text",
    text: "did you make it to the ceramics market on sunday? i kept thinking about that speckled glaze you showed me",
    time: "9:14",
  },
  {
    id: "m2",
    from: "me",
    kind: "text",
    text: "yeah, finally went. spent way more than i planned",
    time: "9:15",
    read: true,
  },
  {
    id: "m3",
    from: "them",
    kind: "text",
    text: "haha of course you did. show me the damage",
    time: "9:15",
  },
  {
    id: "m4",
    from: "me",
    kind: "image",
    image: {
      src: "https://picsum.photos/seed/relay-ceramics/640/480",
      w: 640,
      h: 480,
      alt: "Three handmade ceramic bowls and a small jug on a wooden table",
    },
    text: "three bowls and a little jug i absolutely did not need",
    time: "9:16",
    read: true,
  },
  {
    id: "m5",
    from: "them",
    kind: "text",
    text: "ok the small one on the left is unreal. which stall was it?",
    time: "9:17",
  },
  {
    id: "m6",
    from: "me",
    kind: "text",
    text: "corner by the flower cart. she's there every sunday morning until it sells out",
    time: "9:18",
    read: true,
  },
  {
    id: "m7",
    from: "them",
    kind: "text",
    text: "right, i'm going next weekend then. come with?",
    time: "9:18",
  },
  {
    id: "m8",
    from: "me",
    kind: "text",
    text: "obviously. i'll bring the coffee this time",
    time: "9:19",
    read: true,
  },
];

/**
 * WAVES — local catalog. Everything is deterministic (no Math.random) so it
 * renders identically on server and client.
 *
 * Every album owns an exact palette; the generative cover is drawn from it and
 * the player tints itself with the same values, so the chrome always matches
 * the artwork.
 */

export interface Palette {
  /** darkest tone: backgrounds */
  deep: string;
  /** mid tone: gradients, tinted surfaces */
  mid: string;
  /** brightest tone: controls, progress, active states */
  accent: string;
  /** text/icon colour that sits on top of `accent` */
  ink: string;
}

export type Motif =
  | "horizon"
  | "sun"
  | "grid"
  | "stripes"
  | "rings"
  | "rain"
  | "blocks"
  | "type"
  | "arcs"
  | "dots";

export interface Artist {
  id: string;
  name: string;
  origin: string;
  listeners: number;
  bio: string;
}

export interface Album {
  id: string;
  title: string;
  artistId: string;
  year: number;
  genre: string;
  kind: "Album" | "EP" | "Single";
  motif: Motif;
  palette: Palette;
  instrumental?: boolean;
}

export interface Track {
  id: string;
  title: string;
  albumId: string;
  artistId: string;
  duration: number;
  lyrics?: string[];
}

export interface Mix {
  id: string;
  title: string;
  owner: "waves" | "you";
  description: string;
  trackIds: string[];
  /** two album ids whose palettes blend into the cover */
  paletteFrom: [string, string];
}

/* ------------------------------------------------------------------ */
/* Artists                                                             */
/* ------------------------------------------------------------------ */

export const ARTISTS: Artist[] = [
  { id: "deniz-aras", name: "Deniz Aras", origin: "İzmir", listeners: 1284903, bio: "Nylon strings, harbour field recordings and a voice that sounds like the last ferry home." },
  { id: "temi-adebayo", name: "Temi Adebayo", origin: "Lagos", listeners: 3920417, bio: "Highlife guitar lines folded into slow, sun-heavy grooves." },
  { id: "mira-holm", name: "Mira Holm", origin: "Malmö", listeners: 862118, bio: "Modular synths grown in a greenhouse studio outside Malmö." },
  { id: "kaan-erdem", name: "Kaan Erdem & Lale", origin: "İstanbul", listeners: 547260, bio: "Anatolian psych duo: baglama through a fuzz pedal, drums recorded in a night train." },
  { id: "odile-marchand", name: "Odile Marchand", origin: "Paris", listeners: 1730552, bio: "Dream pop sung half in French, recorded to tape in the 9th arrondissement." },
  { id: "arjun-rao-trio", name: "Arjun Rao Trio", origin: "Mumbai", listeners: 298734, bio: "Piano trio writing small, weather-shaped pieces during the monsoon." },
  { id: "haru-nishida", name: "Haru Nishida", origin: "Tokyo", listeners: 641905, bio: "Ambient miniatures built from vending machines, trains and paper." },
  { id: "selin-aksoy", name: "Selin Aksoy", origin: "İstanbul", listeners: 2216480, bio: "Warm Turkish pop with strings arranged on the Kadıköy ferry." },
  { id: "halvorsens", name: "The Halvorsens", origin: "Bergen", listeners: 1102376, bio: "Three siblings, one van, very loud amplifiers." },
  { id: "lena-voss", name: "Lena Voss", origin: "Basel", listeners: 457091, bio: "Songs about trains, borders and the people waiting on the other side." },
];

/* ------------------------------------------------------------------ */
/* Albums                                                              */
/* ------------------------------------------------------------------ */

export const ALBUMS: Album[] = [
  { id: "kiyi", title: "Kıyı", artistId: "deniz-aras", year: 2025, genre: "Indie Folk", kind: "Album", motif: "horizon",
    palette: { deep: "#0B2E35", mid: "#1D6B70", accent: "#9EE6D2", ink: "#062226" } },
  { id: "low-sun", title: "Low Sun Over Lagos", artistId: "temi-adebayo", year: 2026, genre: "Afrobeats", kind: "Album", motif: "sun",
    palette: { deep: "#3A160A", mid: "#A9441A", accent: "#F6A85E", ink: "#2A0F05" } },
  { id: "glasshouse", title: "Glasshouse", artistId: "mira-holm", year: 2024, genre: "Electronic", kind: "Album", motif: "grid",
    palette: { deep: "#0F2B24", mid: "#2F7A5F", accent: "#BDE8C8", ink: "#0A1F19" } },
  { id: "gece-treni", title: "Gece Treni", artistId: "kaan-erdem", year: 2026, genre: "Anatolian Psych", kind: "Album", motif: "stripes",
    palette: { deep: "#0E1A30", mid: "#2B4777", accent: "#F0605D", ink: "#1F0707" } },
  { id: "velvet-static", title: "Velvet Static", artistId: "odile-marchand", year: 2025, genre: "Dream Pop", kind: "Album", motif: "rings",
    palette: { deep: "#330E1E", mid: "#8E2A50", accent: "#F4B3C6", ink: "#2A0A17" } },
  { id: "monsoon-index", title: "Monsoon Index", artistId: "arjun-rao-trio", year: 2023, genre: "Jazz", kind: "Album", motif: "rain", instrumental: true,
    palette: { deep: "#26230F", mid: "#7A6D24", accent: "#EAD47E", ink: "#1E1B08" } },
  { id: "soft-machinery", title: "Soft Machinery", artistId: "haru-nishida", year: 2026, genre: "Ambient", kind: "Album", motif: "blocks", instrumental: true,
    palette: { deep: "#0B1F3A", mid: "#275E9E", accent: "#AFD3F4", ink: "#071629" } },
  { id: "sonbahar", title: "İstanbul'da Sonbahar", artistId: "selin-aksoy", year: 2026, genre: "Turkish Pop", kind: "Album", motif: "type",
    palette: { deep: "#2A1608", mid: "#94541C", accent: "#F3C47F", ink: "#231205" } },
  { id: "copper-lung", title: "Copper Lung", artistId: "halvorsens", year: 2024, genre: "Indie Rock", kind: "Album", motif: "arcs",
    palette: { deep: "#24120A", mid: "#A8603A", accent: "#74C7BC", ink: "#0C2421" } },
  { id: "fernweh", title: "Fernweh", artistId: "lena-voss", year: 2026, genre: "Singer-Songwriter", kind: "Album", motif: "dots",
    palette: { deep: "#19240E", mid: "#56781E", accent: "#D6E874", ink: "#161F06" } },
  { id: "lodos", title: "Lodos", artistId: "deniz-aras", year: 2022, genre: "Indie Folk", kind: "EP", motif: "rings",
    palette: { deep: "#1B2329", mid: "#4C6470", accent: "#E8B38A", ink: "#23150C" } },
  { id: "terrarium", title: "Terrarium", artistId: "mira-holm", year: 2022, genre: "Electronic", kind: "EP", motif: "blocks",
    palette: { deep: "#13261F", mid: "#3C6B57", accent: "#F28C6B", ink: "#2A0F07" } },
];

/* ------------------------------------------------------------------ */
/* Tracks                                                              */
/* ------------------------------------------------------------------ */

function t(id: string, title: string, albumId: string, artistId: string, duration: number, lyrics?: string[]): Track {
  return { id, title, albumId, artistId, duration, lyrics };
}

export const TRACKS: Track[] = [
  t("poyraz", "Poyraz", "kiyi", "deniz-aras", 222, [
    "Sabah erken, iskele boş",
    "Rüzgar kuzeyden, adını taşır",
    "Bir çay daha, bir sigara daha",
    "Vapur geç kalır, ben hiç",
    "Poyraz eser, saçların dağılır",
    "Martılar bile susar o an",
    "Tut elimi, kıyıya kadar",
    "Gerisi denizin hikayesi",
    "Poyraz eser, ben kalırım",
    "Sen gidersen, dalga götürür",
  ]),
  t("tuzlu-su", "Tuzlu Su", "kiyi", "deniz-aras", 245, [
    "Tuzlu su, yaralarıma iyi gelir",
    "Annem öyle derdi, inanırdım",
    "Şimdi her yaz aynı koy",
    "Aynı taş, aynı serinlik",
    "Bir şarkı yarım kaldı orada",
    "Kum saatinde kayboldu",
    "Tuzlu su, bana bir şey söyle",
    "Geri dönmek kolay mı",
    "Ayaklarım ıslak, aklım sende",
    "Tuzlu su, tuzlu su",
  ]),
  t("marti-saati", "Martı Saati", "kiyi", "deniz-aras", 198),
  t("kiyida-kalanlar", "Kıyıda Kalanlar", "kiyi", "deniz-aras", 311),

  t("danfo-window", "Danfo Window", "low-sun", "temi-adebayo", 207, [
    "Yellow bus, window down",
    "Whole city humming one sound",
    "Conductor calling every stop",
    "I hold my bag, I hold my heart",
    "Danfo window, frame the sun",
    "Every face a song begun",
    "Traffic sweet like palm wine",
    "No rush, no rush, we arrive on time",
    "Danfo window, carry me",
    "Down to Lekki, down to the sea",
  ]),
  t("low-sun", "Low Sun", "low-sun", "temi-adebayo", 236, [
    "Low sun over Lagos",
    "Painting every roof in gold",
    "Mama selling suya on the corner",
    "Same story that the old men told",
    "Stay with me till the light goes",
    "Stay with me till the generator hums",
    "We don't need the morning",
    "We got the low sun",
    "Low sun, low sun",
    "Hold it like a drum",
    "Low sun over Lagos",
    "Keep the evening young",
  ]),
  t("mamas-radio", "Mama's Radio", "low-sun", "temi-adebayo", 252),
  t("third-mainland", "Third Mainland", "low-sun", "temi-adebayo", 219),
  t("harmattan-kiss", "Harmattan Kiss", "low-sun", "temi-adebayo", 271),

  t("condensation", "Condensation", "glasshouse", "mira-holm", 288),
  t("fern-logic", "Fern Logic", "glasshouse", "mira-holm", 213, [
    "Count the leaves in base of two",
    "Every spiral finds its way to you",
    "Water climbs the window slow",
    "Green is a signal I already know",
    "Fern logic, unfold",
    "Fern logic, unfold",
    "Growing in a loop",
    "Growing in a loop",
  ]),
  t("glasshouse-title", "Glasshouse", "glasshouse", "mira-holm", 302),
  t("night-watering", "Night Watering", "glasshouse", "mira-holm", 256),

  t("gece-treni-title", "Gece Treni", "gece-treni", "kaan-erdem", 262, [
    "Gece treni kalkar, ben uyanık",
    "Pencerede bozkır, yıldız yanık",
    "Kondüktör sorar, nereye böyle",
    "Bilmiyorum abi, sen bir yol söyle",
    "Raylar söyler eski türküyü",
    "Annemin sesi, köyün kuyusu",
    "Gece treni, durma sakın",
    "Sabah olursa her şey yakın",
    "Gece treni, gece treni",
    "Götür beni, götür beni",
  ]),
  t("haydarpasa", "Haydarpaşa", "gece-treni", "kaan-erdem", 231, [
    "Haydarpaşa'da son kez",
    "Merdivenlerde bekledim",
    "Elinde bir bavul, bir de söz",
    "Gelmedin, ben de gitmedim",
    "Gar saati hep aynı yerde",
    "Biz değiştik, o durdu",
    "Haydarpaşa, kapın kapalı",
    "İçimde bir tren yolu",
  ]),
  t("kompartiman-7", "Kompartıman 7", "gece-treni", "kaan-erdem", 280),
  t("son-durak", "Son Durak", "gece-treni", "kaan-erdem", 363),

  t("velvet-static-title", "Velvet Static", "velvet-static", "odile-marchand", 238, [
    "Turn the dial until it hums",
    "Somewhere between two stations",
    "Your voice comes through in crumbs",
    "Soft as velvet, full of patience",
    "Je t'entends, je t'entends",
    "Under all the noise",
    "Velvet static on the line",
    "Only you can make it shine",
    "Je t'entends, je t'entends",
    "Under all the noise",
  ]),
  t("pale-telephone", "Pale Telephone", "velvet-static", "odile-marchand", 249, [
    "Pale telephone on the kitchen wall",
    "Ringing twice and then not at all",
    "I painted it the colour of the sea",
    "So it would sound a little more like me",
    "Call me when the city sleeps",
    "Call me when the river keeps",
    "All the secrets that we threw",
    "Pale telephone, I'm still with you",
  ]),
  t("rue-des-martyrs", "Rue des Martyrs", "velvet-static", "odile-marchand", 204),
  t("slow-bloom", "Slow Bloom", "velvet-static", "odile-marchand", 317),

  t("monsoon-index-title", "Monsoon Index", "monsoon-index", "arjun-rao-trio", 402),
  t("chai-at-4am", "Chai at 4am", "monsoon-index", "arjun-rao-trio", 308),
  t("bandra-rain", "Bandra Rain", "monsoon-index", "arjun-rao-trio", 435),
  t("coda-for-lata", "Coda for Lata", "monsoon-index", "arjun-rao-trio", 267),

  t("soft-machinery-title", "Soft Machinery", "soft-machinery", "haru-nishida", 294),
  t("vending-light", "Vending Light", "soft-machinery", "haru-nishida", 192),
  t("yamanote-loop", "Yamanote Loop", "soft-machinery", "haru-nishida", 380),
  t("paper-fan", "Paper Fan", "soft-machinery", "haru-nishida", 227),

  t("sonbahar-title", "Sonbahar", "sonbahar", "selin-aksoy", 216, [
    "Yapraklar düşer Moda'ya",
    "Ben yine seni düşünürüm",
    "Bir simit, bir çay, bir de sen",
    "Eksik kalan tek şey bu",
    "Sonbahar, gel otur yanıma",
    "Anlat bana gidenleri",
    "Sonbahar, bu şehir senin",
    "Ben sadece misafiriyim",
    "Yapraklar düşer, ben düşmem",
    "Bu sefer düşmem",
  ]),
  t("kadikoy-vapuru", "Kadıköy Vapuru", "sonbahar", "selin-aksoy", 238, [
    "Kadıköy vapuru düdük çaldı",
    "Kalbim iskelede kaldı",
    "Martılara simit attım",
    "Bir tanesi seni andırdı",
    "Karşıya geçmek kolay",
    "Geri dönmek zor",
    "Kadıköy vapuru, bekle",
    "Biri daha geliyor",
  ]),
  t("bir-eylul-aksami", "Bir Eylül Akşamı", "sonbahar", "selin-aksoy", 254),
  t("cay-bahcesi", "Çay Bahçesi", "sonbahar", "selin-aksoy", 201),

  t("copper-lung-title", "Copper Lung", "copper-lung", "halvorsens", 224, [
    "Breathing through a copper lung",
    "Every word I've ever sung",
    "Turned to rust and turned to gold",
    "Turned to something I can hold",
    "Shout it louder, shout it down",
    "Shake the windows of this town",
    "Copper lung, copper lung",
    "Keep me loud and keep me young",
  ]),
  t("bergen-rain-song", "Bergen Rain Song", "copper-lung", "halvorsens", 242),
  t("floodlights", "Floodlights", "copper-lung", "halvorsens", 209, [
    "Floodlights on the football pitch",
    "Empty seats and a broken switch",
    "You and me on the halfway line",
    "Counting stars that never shine",
    "Turn them on, turn them on",
    "Let the whole valley see",
    "Floodlights, floodlights",
    "Shining down on you and me",
  ]),
  t("kitchen-radio", "Kitchen Radio", "copper-lung", "halvorsens", 277),

  t("fernweh-title", "Fernweh", "fernweh", "lena-voss", 232, [
    "There's a word for the ache",
    "Of a place you've never been",
    "I keep it folded in my coat",
    "Like a ticket in between",
    "Fernweh, fernweh",
    "Pulling at the seams",
    "Every border is a door",
    "Every door is a dream",
    "Fernweh, fernweh",
    "Take me where it leads",
  ]),
  t("platform-nine", "Platform Nine", "fernweh", "lena-voss", 258, [
    "Platform nine, quarter past",
    "Nothing good was built to last",
    "Still I wait with coffee cold",
    "Watching all the trains get old",
    "If you're on the next one in",
    "Wave once, let the day begin",
    "Platform nine, I'll be here",
    "Same bench, every year",
  ]),
  t("postcards-in-pencil", "Postcards in Pencil", "fernweh", "lena-voss", 195),
  t("blue-hour-basel", "Blue Hour, Basel", "fernweh", "lena-voss", 284),

  t("lodos-title", "Lodos", "lodos", "deniz-aras", 241),
  t("ada-vapuru", "Ada Vapuru", "lodos", "deniz-aras", 214),
  t("kuzguncuk", "Kuzguncuk", "lodos", "deniz-aras", 266),

  t("moss-clock", "Moss Clock", "terrarium", "mira-holm", 238),
  t("humidity", "Humidity", "terrarium", "mira-holm", 273),
  t("seed-bank", "Seed Bank", "terrarium", "mira-holm", 310),
];

/* ------------------------------------------------------------------ */
/* Mixes & playlists                                                   */
/* ------------------------------------------------------------------ */

export const MIXES: Mix[] = [
  { id: "sunset-commute", title: "Sunset Commute", owner: "waves", description: "Warm, unhurried songs for the ride home.",
    trackIds: ["low-sun", "kadikoy-vapuru", "platform-nine", "danfo-window", "tuzlu-su", "pale-telephone", "floodlights"],
    paletteFrom: ["low-sun", "sonbahar"] },
  { id: "deep-focus", title: "Deep Focus", owner: "waves", description: "Long instrumentals with nothing to sing along to.",
    trackIds: ["condensation", "soft-machinery-title", "monsoon-index-title", "night-watering", "yamanote-loop", "seed-bank", "chai-at-4am"],
    paletteFrom: ["soft-machinery", "glasshouse"] },
  { id: "turkce-indie", title: "Türkçe Indie", owner: "waves", description: "New Turkish songwriting, from İzmir to Haydarpaşa.",
    trackIds: ["poyraz", "gece-treni-title", "sonbahar-title", "haydarpasa", "kuzguncuk", "cay-bahcesi", "son-durak"],
    paletteFrom: ["gece-treni", "kiyi"] },
  { id: "rainy-window", title: "Rainy Window", owner: "waves", description: "Soft vocals and wet streets.",
    trackIds: ["bandra-rain", "velvet-static-title", "bergen-rain-song", "fernweh-title", "slow-bloom", "humidity"],
    paletteFrom: ["velvet-static", "monsoon-index"] },
  { id: "sunday-kitchen", title: "Sunday Kitchen", owner: "you", description: "Cooking, slowly.",
    trackIds: ["kitchen-radio", "mamas-radio", "rue-des-martyrs", "bir-eylul-aksami", "postcards-in-pencil", "paper-fan"],
    paletteFrom: ["copper-lung", "fernweh"] },
  { id: "long-run", title: "Long Run, Moda", owner: "you", description: "Tempo for the coastal path.",
    trackIds: ["copper-lung-title", "third-mainland", "kompartiman-7", "floodlights", "harmattan-kiss", "fern-logic"],
    paletteFrom: ["copper-lung", "low-sun"] },
];

/* ------------------------------------------------------------------ */
/* Shelves & library seeds                                             */
/* ------------------------------------------------------------------ */

export const JUMP_BACK_IN: { type: "album" | "mix"; id: string }[] = [
  { type: "mix", id: "turkce-indie" },
  { type: "album", id: "velvet-static" },
  { type: "album", id: "kiyi" },
  { type: "mix", id: "deep-focus" },
  { type: "album", id: "copper-lung" },
  { type: "album", id: "monsoon-index" },
];

export const RECENTLY_PLAYED = ["glasshouse", "kiyi", "copper-lung", "monsoon-index", "velvet-static", "lodos"];
export const NEW_RELEASES = ["gece-treni", "low-sun", "fernweh", "sonbahar", "soft-machinery"];
export const FEATURED_RELEASE = "gece-treni";

export const SAVED_ALBUM_IDS = ["kiyi", "velvet-static", "glasshouse", "monsoon-index", "copper-lung", "terrarium"];
export const FOLLOWED_ARTIST_IDS = ["deniz-aras", "odile-marchand", "mira-holm", "selin-aksoy", "halvorsens", "temi-adebayo"];
export const INITIAL_LIKED = ["poyraz", "pale-telephone", "low-sun", "condensation", "floodlights", "kadikoy-vapuru"];

/** Initial queue on load: Kıyı, starting at "Tuzlu Su". */
export const INITIAL_QUEUE = { trackIds: ["poyraz", "tuzlu-su", "marti-saati", "kiyida-kalanlar"], index: 1, context: "Kıyı", elapsed: 63 };

/* ------------------------------------------------------------------ */
/* Lookups & helpers                                                   */
/* ------------------------------------------------------------------ */

const albumMap = new Map(ALBUMS.map((a) => [a.id, a]));
const artistMap = new Map(ARTISTS.map((a) => [a.id, a]));
const trackMap = new Map(TRACKS.map((tr) => [tr.id, tr]));
const mixMap = new Map(MIXES.map((m) => [m.id, m]));

export const getAlbum = (id: string) => albumMap.get(id)!;
export const getArtist = (id: string) => artistMap.get(id)!;
export const getTrack = (id: string) => trackMap.get(id)!;
export const getMix = (id: string) => mixMap.get(id)!;

export const albumTracks = (albumId: string) => TRACKS.filter((tr) => tr.albumId === albumId);
export const artistAlbums = (artistId: string) =>
  ALBUMS.filter((a) => a.artistId === artistId).sort((a, b) => b.year - a.year);
export const artistTracks = (artistId: string) => TRACKS.filter((tr) => tr.artistId === artistId);

export const trackPalette = (trackId: string) => getAlbum(getTrack(trackId).albumId).palette;

export function formatTime(sec: number) {
  const s = Math.max(0, Math.floor(sec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export function formatTotal(sec: number) {
  const min = Math.round(sec / 60);
  if (min < 60) return `${min} min`;
  return `${Math.floor(min / 60)} hr ${min % 60} min`;
}

export const formatListeners = (n: number) => n.toLocaleString("en-US");

/** Artists featured in a mix, for its subtitle. */
export function mixArtists(mix: Mix) {
  const names: string[] = [];
  for (const id of mix.trackIds) {
    const name = getArtist(getTrack(id).artistId).name;
    if (!names.includes(name)) names.push(name);
  }
  return names;
}

/** Deterministic per-track waveform peaks in 0.18..1. */
export function peaks(seed: string, count: number) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  const out: number[] = [];
  for (let i = 0; i < count; i++) {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    const r = ((h ^ (h >>> 16)) >>> 0) / 4294967295;
    // envelope: quiet intro/outro, louder body
    const pos = i / (count - 1);
    const env = 0.45 + 0.55 * Math.sin(Math.PI * Math.min(1, pos * 1.15));
    // rounded: Math.sin can differ in the last bit between Node and the
    // browser, which would break SVG attribute hydration
    const v = Math.max(0.18, Math.min(1, env * (0.45 + r * 0.6)));
    out.push(Math.round(v * 1000) / 1000);
  }
  return out;
}

/** Timestamp (sec) of each lyric line, spread across the vocal section. */
export function lyricTimes(track: Track) {
  const lines = track.lyrics ?? [];
  const intro = Math.min(14, track.duration * 0.07);
  const outro = track.duration * 0.12;
  const span = track.duration - intro - outro;
  return lines.map((_, i) => intro + (span * i) / lines.length);
}

/** Lowercase, strip diacritics (incl. Turkish dotless i) for search. */
export function normalize(s: string) {
  return s
    .toLocaleLowerCase("tr")
    .replace(/ı/g, "i")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export interface Genre {
  name: string;
  albumId: string;
}

/** One tile per genre, coloured by its first album. */
export const GENRES: Genre[] = (() => {
  const seen = new Map<string, string>();
  for (const a of ALBUMS) if (!seen.has(a.genre)) seen.set(a.genre, a.id);
  return [...seen].map(([name, albumId]) => ({ name, albumId }));
})();

/**
 * HORIZON — workspace demo data.
 * A logged-in project console for the "Nebula" product team.
 * All names, ids, dates (2026) are hand-authored — no placeholders.
 */

export type Priority = "urgent" | "high" | "medium" | "low" | "none";
export type Status = "backlog" | "in_progress" | "in_review" | "done";

export interface Person {
  id: string;
  name: string;
  role: string;
}

export interface Label {
  name: string;
  color: string;
}

export interface Issue {
  id: string; // e.g. HZN-241
  title: string;
  status: Status;
  priority: Priority;
  labels: Label[];
  assignee: Person;
  comments: number;
  subtasks?: { done: number; total: number };
  due?: string; // e.g. "Jul 12"
  overdue?: boolean;
  points: number;
  blocked?: boolean;
}

/** Deterministic seeded avatar. */
export function avatar(id: string, size = 64): string {
  return `https://picsum.photos/seed/hzn-${id}/${size}/${size}`;
}

export const PEOPLE: Record<string, Person> = {
  maya: { id: "maya", name: "Maya Rodriguez", role: "Staff Engineer" },
  kenji: { id: "kenji", name: "Kenji Watanabe", role: "Product Design" },
  priya: { id: "priya", name: "Priya Nair", role: "Frontend" },
  lucas: { id: "lucas", name: "Lucas Meyer", role: "Backend" },
  sofia: { id: "sofia", name: "Sofia Almeida", role: "Design Systems" },
  theo: { id: "theo", name: "Theo Blackwood", role: "Platform" },
  ava: { id: "ava", name: "Ava Chen", role: "Growth Eng" },
  noah: { id: "noah", name: "Noah Kimura", role: "Mobile" },
};

// Label palette — deliberately avoids indigo (reserved for the UI accent).
export const L = {
  design: { name: "design", color: "#c084fc" },
  frontend: { name: "frontend", color: "#38bdf8" },
  backend: { name: "backend", color: "#34d399" },
  bug: { name: "bug", color: "#fb7185" },
  infra: { name: "infra", color: "#fbbf24" },
  research: { name: "research", color: "#f472b6" },
  a11y: { name: "a11y", color: "#2dd4bf" },
  api: { name: "api", color: "#60a5fa" },
  billing: { name: "billing", color: "#f59e0b" },
} satisfies Record<string, Label>;

export interface Column {
  status: Status;
  title: string;
  issues: Issue[];
}

export const COLUMNS: Column[] = [
  {
    status: "backlog",
    title: "Backlog",
    issues: [
      {
        id: "HZN-241",
        title: "Redesign onboarding checklist empty states",
        status: "backlog",
        priority: "medium",
        labels: [L.design, L.frontend],
        assignee: PEOPLE.kenji,
        comments: 4,
        subtasks: { done: 0, total: 3 },
        due: "Jul 18",
        points: 3,
      },
      {
        id: "HZN-238",
        title: "SCIM: support user deprovisioning webhooks",
        status: "backlog",
        priority: "high",
        labels: [L.backend, L.api],
        assignee: PEOPLE.lucas,
        comments: 2,
        points: 5,
      },
      {
        id: "HZN-236",
        title: "Keyboard nav skips collapsed board columns",
        status: "backlog",
        priority: "medium",
        labels: [L.a11y, L.bug],
        assignee: PEOPLE.priya,
        comments: 6,
        subtasks: { done: 1, total: 4 },
        points: 2,
      },
      {
        id: "HZN-231",
        title: "Spike: virtualized list for 5k+ issue boards",
        status: "backlog",
        priority: "low",
        labels: [L.research, L.frontend],
        assignee: PEOPLE.maya,
        comments: 1,
        points: 8,
      },
      {
        id: "HZN-229",
        title: "Usage-based billing — proration edge cases",
        status: "backlog",
        priority: "high",
        labels: [L.billing, L.backend],
        assignee: PEOPLE.ava,
        comments: 9,
        subtasks: { done: 0, total: 5 },
        due: "Jul 22",
        points: 5,
      },
      {
        id: "HZN-224",
        title: "Docs: cycle automation rules reference",
        status: "backlog",
        priority: "none",
        labels: [L.design],
        assignee: PEOPLE.sofia,
        comments: 0,
        points: 2,
      },
    ],
  },
  {
    status: "in_progress",
    title: "In Progress",
    issues: [
      {
        id: "HZN-219",
        title: "Realtime presence cursors on shared docs",
        status: "in_progress",
        priority: "high",
        labels: [L.frontend, L.infra],
        assignee: PEOPLE.priya,
        comments: 12,
        subtasks: { done: 3, total: 6 },
        due: "Jul 12",
        points: 8,
      },
      {
        id: "HZN-214",
        title: "Command palette — fuzzy search across projects",
        status: "in_progress",
        priority: "urgent",
        labels: [L.frontend],
        assignee: PEOPLE.maya,
        comments: 7,
        subtasks: { done: 5, total: 8 },
        due: "Jul 10",
        points: 5,
      },
      {
        id: "HZN-208",
        title: "Migrate notifications to event-sourced pipeline",
        status: "in_progress",
        priority: "high",
        labels: [L.backend, L.infra],
        assignee: PEOPLE.theo,
        comments: 5,
        subtasks: { done: 2, total: 4 },
        points: 13,
        blocked: true,
      },
      {
        id: "HZN-203",
        title: "Mobile: offline queue for issue edits",
        status: "in_progress",
        priority: "medium",
        labels: [L.api],
        assignee: PEOPLE.noah,
        comments: 3,
        subtasks: { done: 1, total: 3 },
        due: "Jul 15",
        points: 5,
      },
    ],
  },
  {
    status: "in_review",
    title: "In Review",
    issues: [
      {
        id: "HZN-197",
        title: "Roadmap timeline — quarter drag & drop",
        status: "in_review",
        priority: "high",
        labels: [L.frontend, L.design],
        assignee: PEOPLE.kenji,
        comments: 8,
        subtasks: { done: 4, total: 4 },
        due: "Jul 09",
        overdue: true,
        points: 8,
      },
      {
        id: "HZN-192",
        title: "Harden SSO callback against replay attacks",
        status: "in_review",
        priority: "urgent",
        labels: [L.backend, L.bug],
        assignee: PEOPLE.lucas,
        comments: 15,
        subtasks: { done: 3, total: 3 },
        points: 5,
      },
      {
        id: "HZN-188",
        title: "Tokenize spacing scale in design system",
        status: "in_review",
        priority: "low",
        labels: [L.design, L.a11y],
        assignee: PEOPLE.sofia,
        comments: 2,
        due: "Jul 14",
        points: 3,
      },
    ],
  },
  {
    status: "done",
    title: "Done",
    issues: [
      {
        id: "HZN-176",
        title: "Bulk-select & multi-assign on board view",
        status: "done",
        priority: "high",
        labels: [L.frontend],
        assignee: PEOPLE.priya,
        comments: 6,
        subtasks: { done: 5, total: 5 },
        points: 5,
      },
      {
        id: "HZN-171",
        title: "Cycle burndown widget with scope tracking",
        status: "done",
        priority: "medium",
        labels: [L.frontend, L.design],
        assignee: PEOPLE.maya,
        comments: 4,
        points: 5,
      },
      {
        id: "HZN-168",
        title: "Rate-limit the public issues API per token",
        status: "done",
        priority: "high",
        labels: [L.api, L.backend],
        assignee: PEOPLE.theo,
        comments: 3,
        points: 3,
      },
      {
        id: "HZN-162",
        title: "Fix avatar stack overflow on dense rows",
        status: "done",
        priority: "low",
        labels: [L.bug, L.frontend],
        assignee: PEOPLE.ava,
        comments: 1,
        points: 1,
      },
      {
        id: "HZN-159",
        title: "Import issues from CSV with column mapping",
        status: "done",
        priority: "medium",
        labels: [L.backend],
        assignee: PEOPLE.lucas,
        comments: 7,
        subtasks: { done: 4, total: 4 },
        points: 8,
      },
    ],
  },
];

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  count?: number;
  shortcut?: string;
}

export const NAV: NavItem[] = [
  { id: "inbox", label: "Inbox", icon: "inbox", count: 3, shortcut: "I" },
  { id: "my-issues", label: "My Issues", icon: "circle-user", shortcut: "M" },
  { id: "board", label: "Board", icon: "columns", shortcut: "B" },
  { id: "roadmap", label: "Roadmap", icon: "map", shortcut: "R" },
  { id: "cycles", label: "Cycles", icon: "orbit", shortcut: "C" },
  { id: "docs", label: "Docs", icon: "file-text", shortcut: "D" },
];

export interface Project {
  id: string;
  name: string;
  color: string;
  count: number;
}

export const PROJECTS: Project[] = [
  { id: "core", name: "Core Platform", color: "#6366f1", count: 24 },
  { id: "mobile", name: "Mobile App", color: "#34d399", count: 11 },
  { id: "billing", name: "Billing", color: "#f59e0b", count: 8 },
  { id: "growth", name: "Growth", color: "#f472b6", count: 6 },
  { id: "ds", name: "Design System", color: "#c084fc", count: 9 },
];

// People currently online, for the presence stack.
export const ONLINE: Person[] = [
  PEOPLE.maya,
  PEOPLE.priya,
  PEOPLE.kenji,
  PEOPLE.lucas,
  PEOPLE.theo,
];

export interface Activity {
  id: string;
  person: Person;
  action: string;
  target: string;
  time: string;
  kind: "move" | "comment" | "create" | "done" | "assign";
}

export const ACTIVITY: Activity[] = [
  {
    id: "a1",
    person: PEOPLE.maya,
    action: "moved",
    target: "HZN-214",
    time: "8m",
    kind: "move",
  },
  {
    id: "a2",
    person: PEOPLE.lucas,
    action: "commented on",
    target: "HZN-192",
    time: "21m",
    kind: "comment",
  },
  {
    id: "a3",
    person: PEOPLE.sofia,
    action: "merged",
    target: "HZN-188",
    time: "44m",
    kind: "done",
  },
  {
    id: "a4",
    person: PEOPLE.priya,
    action: "self-assigned",
    target: "HZN-236",
    time: "1h",
    kind: "assign",
  },
  {
    id: "a5",
    person: PEOPLE.theo,
    action: "flagged blocked",
    target: "HZN-208",
    time: "1h",
    kind: "comment",
  },
  {
    id: "a6",
    person: PEOPLE.ava,
    action: "opened",
    target: "HZN-229",
    time: "2h",
    kind: "create",
  },
  {
    id: "a7",
    person: PEOPLE.kenji,
    action: "requested review on",
    target: "HZN-197",
    time: "3h",
    kind: "move",
  },
];

// Cycle (sprint) summary — Cycle 24, two-week iteration.
export const CYCLE = {
  name: "Cycle 24",
  team: "Nebula",
  start: "Jul 6",
  end: "Jul 19",
  daysLeft: 8,
  scope: 96, // total points in scope
  completed: 42,
  inProgress: 31,
  percent: 44,
  // burndown: ideal-vs-actual remaining points across the cycle
  burndown: [96, 92, 88, 79, 74, 70, 61, 54, 54, 48],
};

export type CustomerRecord = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "active" | "pending" | "suspended" | "churned";
  role: "admin" | "manager" | "member" | "viewer";
  country: string;
  city: string;
  createdAt: string;
  spend: number;
};

export type InvoiceRecord = {
  id: string;
  invoice: string;
  customer: string;
  amount: number;
  currency: "USD" | "EUR" | "GBP" | "JPY";
  status: "paid" | "open" | "overdue" | "draft";
  method: "card" | "wire" | "ach" | "paypal";
  issuedAt: string;
  dueAt: string;
};

export type TaskRecord = {
  id: string;
  title: string;
  assignee: string;
  status: "todo" | "in_progress" | "review" | "done";
  priority: "low" | "medium" | "high" | "urgent";
  labels: string[];
  dueAt: string;
  progress: number;
};

function mulberry32(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const NOW = Date.UTC(2026, 5, 14);
const DAY = 86_400_000;

const FIRST = [
  "Liam",
  "Olivia",
  "Noah",
  "Emma",
  "Ava",
  "Elijah",
  "Sophia",
  "Mia",
  "Lucas",
  "Isabella",
  "Henry",
  "Camila",
  "Logan",
  "Harper",
  "Mason",
  "Aria",
  "Daniel",
  "Layla",
  "Ethan",
  "Chloe",
];
const LAST = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Garcia",
  "Miller",
  "Davis",
  "Wilson",
  "Anderson",
  "Thomas",
  "Taylor",
  "Moore",
  "Lee",
  "Perez",
  "Walker",
  "Hill",
  "Scott",
  "Torres",
  "Flores",
  "Allen",
];
const COUNTRY_CITY: Array<[string, string[]]> = [
  ["United States", ["New York", "San Francisco", "Austin", "Seattle"]],
  ["United Kingdom", ["London", "Manchester", "Bristol"]],
  ["Germany", ["Berlin", "Munich", "Hamburg"]],
  ["France", ["Paris", "Lyon", "Marseille"]],
  ["Canada", ["Toronto", "Vancouver", "Montreal"]],
  ["Australia", ["Sydney", "Melbourne", "Brisbane"]],
  ["Japan", ["Tokyo", "Osaka", "Kyoto"]],
  ["Netherlands", ["Amsterdam", "Rotterdam"]],
];
const STATUS: CustomerRecord["status"][] = [
  "active",
  "pending",
  "suspended",
  "churned",
];
const ROLE: CustomerRecord["role"][] = ["admin", "manager", "member", "viewer"];

function pick<T>(arr: readonly T[], rand: () => number): T {
  return arr[Math.floor(rand() * arr.length)] as T;
}

export function generateCustomers(count: number, seed = 7): CustomerRecord[] {
  const rand = mulberry32(seed);
  const list: CustomerRecord[] = [];
  for (let i = 0; i < count; i++) {
    const f = pick(FIRST, rand);
    const l = pick(LAST, rand);
    const [country, cities] = pick(COUNTRY_CITY, rand);
    const created = new Date(NOW - Math.floor(rand() * 720) * DAY);
    list.push({
      id: `cus_${String(i + 1).padStart(6, "0")}`,
      name: `${f} ${l}`,
      email: `${f.toLowerCase()}.${l.toLowerCase()}${Math.floor(rand() * 89 + 11)}@example.com`,
      phone: `+1 (${100 + Math.floor(rand() * 900)}) ${100 + Math.floor(rand() * 900)}-${1000 + Math.floor(rand() * 9000)}`,
      status: pick(STATUS, rand),
      role: pick(ROLE, rand),
      country,
      city: pick(cities, rand),
      createdAt: created.toISOString(),
      spend: Math.round(rand() * 9000 * 100) / 100 + 250,
    });
  }
  return list;
}

const INV_STATUS: InvoiceRecord["status"][] = [
  "paid",
  "open",
  "overdue",
  "draft",
];
const INV_METHOD: InvoiceRecord["method"][] = ["card", "wire", "ach", "paypal"];
const CURRENCIES: InvoiceRecord["currency"][] = ["USD", "EUR", "GBP", "JPY"];

export function generateInvoices(count: number, seed = 19): InvoiceRecord[] {
  const rand = mulberry32(seed);
  const list: InvoiceRecord[] = [];
  for (let i = 0; i < count; i++) {
    const f = pick(FIRST, rand);
    const l = pick(LAST, rand);
    const issued = NOW - Math.floor(rand() * 365) * DAY;
    const due = issued + (15 + Math.floor(rand() * 30)) * DAY;
    list.push({
      id: `inv_${String(i + 1).padStart(6, "0")}`,
      invoice: `INV-${2026000 + i}`,
      customer: `${f} ${l}`,
      amount: Math.round(rand() * 9500 * 100) / 100 + 50,
      currency: pick(CURRENCIES, rand),
      status: pick(INV_STATUS, rand),
      method: pick(INV_METHOD, rand),
      issuedAt: new Date(issued).toISOString(),
      dueAt: new Date(due).toISOString(),
    });
  }
  return list;
}

const TASK_STATUS: TaskRecord["status"][] = [
  "todo",
  "in_progress",
  "review",
  "done",
];
const TASK_PRIORITY: TaskRecord["priority"][] = [
  "low",
  "medium",
  "high",
  "urgent",
];
const LABELS = [
  "frontend",
  "backend",
  "design",
  "infra",
  "docs",
  "qa",
  "growth",
  "perf",
];
const TASK_TITLES = [
  "Implement OAuth2 flow",
  "Refactor checkout form",
  "Migrate database to RDS",
  "Audit accessibility on dashboard",
  "Design empty state illustrations",
  "Update brand color tokens",
  "Optimise virtualised tables",
  "Write release notes",
  "Investigate 5xx error spike",
  "Add billing analytics dashboard",
  "Plan Q3 roadmap",
  "Triage incoming bug reports",
];

export function generateTasks(count: number, seed = 31): TaskRecord[] {
  const rand = mulberry32(seed);
  const list: TaskRecord[] = [];
  for (let i = 0; i < count; i++) {
    const f = pick(FIRST, rand);
    const l = pick(LAST, rand);
    const labelCount = 1 + Math.floor(rand() * 3);
    const labels = new Set<string>();
    while (labels.size < labelCount) labels.add(pick(LABELS, rand));
    const due = NOW + (Math.floor(rand() * 60) - 10) * DAY;
    list.push({
      id: `tsk_${String(i + 1).padStart(6, "0")}`,
      title: pick(TASK_TITLES, rand),
      assignee: `${f} ${l}`,
      status: pick(TASK_STATUS, rand),
      priority: pick(TASK_PRIORITY, rand),
      labels: Array.from(labels),
      dueAt: new Date(due).toISOString(),
      progress: Math.floor(rand() * 100),
    });
  }
  return list;
}

export function formatCurrency(
  value: number,
  currency: string = "USD",
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(iso));
}

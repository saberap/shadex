import { z } from "zod";

export const CustomerSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  status: z.enum(["active", "pending", "suspended", "churned"]),
  role: z.enum(["admin", "manager", "member", "viewer"]),
  country: z.string(),
  city: z.string(),
  createdAt: z.string(),
});

export type Customer = z.infer<typeof CustomerSchema>;

const FIRST_NAMES = [
  "Liam",
  "Olivia",
  "Noah",
  "Emma",
  "Oliver",
  "Ava",
  "Elijah",
  "Charlotte",
  "James",
  "Sophia",
  "William",
  "Amelia",
  "Benjamin",
  "Isabella",
  "Lucas",
  "Mia",
  "Henry",
  "Evelyn",
  "Theodore",
  "Harper",
  "Jack",
  "Luna",
  "Levi",
  "Camila",
  "Alexander",
  "Gianna",
  "Jackson",
  "Elizabeth",
  "Mateo",
  "Eleanor",
  "Daniel",
  "Ella",
  "Michael",
  "Abigail",
  "Mason",
  "Sofia",
  "Sebastian",
  "Avery",
  "Ethan",
  "Scarlett",
  "Logan",
  "Emily",
  "Owen",
  "Aria",
  "Samuel",
  "Penelope",
  "Jacob",
  "Chloe",
  "Asher",
  "Layla",
];

const LAST_NAMES = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Rodriguez",
  "Martinez",
  "Hernandez",
  "Lopez",
  "Gonzalez",
  "Wilson",
  "Anderson",
  "Thomas",
  "Taylor",
  "Moore",
  "Jackson",
  "Martin",
  "Lee",
  "Perez",
  "Thompson",
  "White",
  "Harris",
  "Sanchez",
  "Clark",
  "Ramirez",
  "Lewis",
  "Robinson",
  "Walker",
  "Young",
  "Allen",
  "King",
  "Wright",
  "Scott",
  "Torres",
  "Nguyen",
  "Hill",
  "Flores",
];

const COUNTRIES = [
  {
    country: "United States",
    cities: ["New York", "San Francisco", "Austin", "Seattle", "Boston"],
  },
  {
    country: "United Kingdom",
    cities: ["London", "Manchester", "Bristol", "Edinburgh"],
  },
  { country: "Germany", cities: ["Berlin", "Munich", "Hamburg", "Frankfurt"] },
  { country: "France", cities: ["Paris", "Lyon", "Marseille", "Toulouse"] },
  {
    country: "Canada",
    cities: ["Toronto", "Vancouver", "Montreal", "Calgary"],
  },
  {
    country: "Australia",
    cities: ["Sydney", "Melbourne", "Brisbane", "Perth"],
  },
  { country: "Japan", cities: ["Tokyo", "Osaka", "Kyoto", "Yokohama"] },
  {
    country: "Brazil",
    cities: ["São Paulo", "Rio de Janeiro", "Brasília", "Salvador"],
  },
  { country: "Netherlands", cities: ["Amsterdam", "Rotterdam", "The Hague"] },
  { country: "Spain", cities: ["Madrid", "Barcelona", "Valencia", "Seville"] },
];

const STATUSES: Customer["status"][] = [
  "active",
  "pending",
  "suspended",
  "churned",
];
const ROLES: Customer["role"][] = ["admin", "manager", "member", "viewer"];

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

let cache: Customer[] | null = null;

export function getCustomers(): Customer[] {
  if (cache) return cache;
  const rand = mulberry32(20260614);
  const pick = <T>(arr: readonly T[]) =>
    arr[Math.floor(rand() * arr.length)] as T;

  const now = Date.UTC(2026, 5, 14);
  const dayMs = 86_400_000;

  const list: Customer[] = [];
  for (let i = 0; i < 1200; i++) {
    const first = pick(FIRST_NAMES);
    const last = pick(LAST_NAMES);
    const loc = pick(COUNTRIES);
    const city = pick(loc.cities);
    const created = new Date(now - Math.floor(rand() * 720) * dayMs);
    const phoneA = 100 + Math.floor(rand() * 900);
    const phoneB = 100 + Math.floor(rand() * 900);
    const phoneC = 1000 + Math.floor(rand() * 9000);
    const id = `cus_${(i + 1).toString().padStart(5, "0")}`;
    list.push({
      id,
      name: `${first} ${last}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}${Math.floor(rand() * 90 + 10)}@example.com`,
      phone: `+1 (${phoneA}) ${phoneB}-${phoneC}`,
      status: pick(STATUSES),
      role: pick(ROLES),
      country: loc.country,
      city,
      createdAt: created.toISOString(),
    });
  }
  cache = list;
  return list;
}

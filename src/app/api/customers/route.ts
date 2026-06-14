import { NextResponse } from "next/server";
import { type Customer, getCustomers } from "./mock-db";

const SEARCHABLE_FIELDS: (keyof Customer)[] = [
  "name",
  "email",
  "phone",
  "country",
  "city",
  "id",
];

const FILTERABLE_FIELDS: (keyof Customer)[] = [
  "status",
  "role",
  "country",
  "city",
];

function compareValues(a: unknown, b: unknown, direction: "asc" | "desc") {
  if (a === b) return 0;
  if (a === null || a === undefined) return 1;
  if (b === null || b === undefined) return -1;
  let result = 0;
  if (typeof a === "number" && typeof b === "number") {
    result = a - b;
  } else {
    result = String(a).localeCompare(String(b), undefined, {
      numeric: true,
      sensitivity: "base",
    });
  }
  return direction === "asc" ? result : -result;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const pageSize = Math.min(
    500,
    Math.max(1, Number(searchParams.get("pageSize")) || 20),
  );
  const search = (searchParams.get("search") ?? "").trim().toLowerCase();
  const sort = searchParams.get("sort") as keyof Customer | null;
  const direction =
    (searchParams.get("direction") as "asc" | "desc") === "desc"
      ? "desc"
      : "asc";

  let rows = getCustomers().slice();

  if (search) {
    rows = rows.filter((row) =>
      SEARCHABLE_FIELDS.some((field) =>
        String(row[field]).toLowerCase().includes(search),
      ),
    );
  }

  for (const field of FILTERABLE_FIELDS) {
    const raw = searchParams.get(field);
    if (!raw) continue;
    const values = raw
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
    if (values.length === 0) continue;
    rows = rows.filter((row) => values.includes(String(row[field])));
  }

  if (sort) {
    rows.sort((a, b) => compareValues(a[sort], b[sort], direction));
  }

  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const offset = (page - 1) * pageSize;
  const data = rows.slice(offset, offset + pageSize);

  // Simulate a small network delay so the loading state is visible.
  await new Promise((resolve) => setTimeout(resolve, 220));

  return NextResponse.json({
    data,
    total,
    page,
    pageSize,
    totalPages,
  });
}

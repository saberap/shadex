import type { Column } from "@tanstack/react-table";

export function getColumnLabel<TData, TValue>(
  column: Column<TData, TValue>,
): string {
  const meta = column.columnDef.meta;
  if (meta?.label) return meta.label;
  const header = column.columnDef.header;
  if (typeof header === "string") return header;
  return column.id;
}

export function formatRecordsRange(
  pageIndex: number,
  pageSize: number,
  total: number,
): string {
  if (total === 0) return "No records";
  const start = pageIndex * pageSize + 1;
  const end = Math.min((pageIndex + 1) * pageSize, total);
  return `Showing ${start.toLocaleString()}–${end.toLocaleString()} of ${total.toLocaleString()} records`;
}

export function getPageNumbers(
  current: number,
  totalPages: number,
  delta = 1,
): (number | "...")[] {
  if (totalPages <= 1) return [1];
  const range: (number | "...")[] = [];
  const left = Math.max(2, current - delta);
  const right = Math.min(totalPages - 1, current + delta);

  range.push(1);
  if (left > 2) range.push("...");

  for (let i = left; i <= right; i++) range.push(i);

  if (right < totalPages - 1) range.push("...");
  if (totalPages > 1) range.push(totalPages);

  return range;
}

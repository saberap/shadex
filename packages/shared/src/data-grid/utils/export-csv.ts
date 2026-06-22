import type { Table } from "@tanstack/react-table";

function escapeCsv(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function exportTableToCsv<TData>(
  table: Table<TData>,
  filename = "export.csv",
): void {
  const visibleColumns = table
    .getAllLeafColumns()
    .filter(
      (c) =>
        c.getIsVisible() &&
        c.id !== "__select__" &&
        c.id !== "__actions__" &&
        c.id !== "__expand__",
    );

  const headers = visibleColumns.map((c) => {
    const label = c.columnDef.meta?.label;
    if (label) return label;
    if (typeof c.columnDef.header === "string") return c.columnDef.header;
    return c.id;
  });

  const rows = table.getCoreRowModel().rows.map((row) =>
    visibleColumns.map((c) => {
      const cell = row.getValue(c.id);
      return escapeCsv(cell);
    }),
  );

  const csv = [
    headers.map(escapeCsv).join(","),
    ...rows.map((r) => r.join(",")),
  ].join("\n");

  const blob = new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

import type { Table } from "@tanstack/react-table";

/**
 * Excel export is delivered as an "SYLK-style" tab-separated `.xls` file —
 * Excel opens it transparently with no extra dependency. Swap with `xlsx`
 * when a real binary workbook is required.
 */
export function exportTableToExcel<TData>(
  table: Table<TData>,
  filename = "export.xls",
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

  const encode = (v: unknown) =>
    v === null || v === undefined
      ? ""
      : String(v)
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");

  const rows = table.getCoreRowModel().rows.map((row) => {
    return `<tr>${visibleColumns
      .map((c) => `<td>${encode(row.getValue(c.id))}</td>`)
      .join("")}</tr>`;
  });

  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:x="urn:schemas-microsoft-com:office:excel"
      xmlns="http://www.w3.org/TR/REC-html40">
      <head><meta charset="utf-8" /></head>
      <body>
        <table>
          <thead><tr>${headers.map((h) => `<th>${encode(h)}</th>`).join("")}</tr></thead>
          <tbody>${rows.join("")}</tbody>
        </table>
      </body>
    </html>`;

  const blob = new Blob([html], { type: "application/vnd.ms-excel" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

import type { Table } from "@tanstack/react-table";

/**
 * Print-to-PDF using a hidden iframe — no extra dependency. Swap with
 * `jspdf` + `jspdf-autotable` when richer layout control is required.
 */
export function exportTableToPdf<TData>(
  table: Table<TData>,
  filename = "خروجی",
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
    <html>
      <head>
        <title>${encode(filename)}</title>
        <meta charset="utf-8" />
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; padding: 24px; color: #111; }
          h1 { font-size: 18px; margin: 0 0 16px; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; }
          th, td { padding: 8px 10px; text-align: start; border-bottom: 1px solid #e5e7eb; }
          th { background: #f9fafb; font-weight: 600; }
          tr:nth-child(even) td { background: #fafafa; }
        </style>
      </head>
      <body>
        <h1>${encode(filename)}</h1>
        <table>
          <thead><tr>${headers.map((h) => `<th>${encode(h)}</th>`).join("")}</tr></thead>
          <tbody>${rows.join("")}</tbody>
        </table>
      </body>
    </html>`;

  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) {
    document.body.removeChild(iframe);
    return;
  }
  doc.open();
  doc.write(html);
  doc.close();

  iframe.onload = () => {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 500);
  };
}

# DataGrid

A production-grade, reusable, ThemeForest-quality DataGrid system built entirely
on shadcn/ui. Composable, fully typed, server-aware, and good for everything
from a 20-row admin list to a 10k-row virtualized table.

## Highlights

- Pure shadcn/ui — no external UI libraries
- Generic, strictly-typed `DataGrid<TData>` component
- Sorting, filtering (text / number / boolean / select / date), search
- Pagination (client and server)
- Inline editing for text / number / select cells
- Expandable detail rows
- Column visibility, alignment and ordering
- Bulk + row actions
- Loading / empty / error states (skeleton, card, retry)
- Virtualization for 10k+ rows via `@tanstack/react-virtual`
- Server-side mode with `manualPagination / manualSorting / manualFiltering`
- URL state sync (Next.js App Router compatible)
- CSV / Excel / PDF export
- Dark mode, accessible, RTL-friendly

## Quick start

```tsx
import { DataGrid } from "@/shared/components/data-grid";
import type { DataGridColumnDef } from "@/shared/components/data-grid";

type Customer = { id: string; name: string; email: string };

const columns: DataGridColumnDef<Customer>[] = [
  { accessorKey: "id", header: "ID", meta: { label: "ID" } },
  { accessorKey: "name", header: "Name", meta: { label: "Name" } },
  { accessorKey: "email", header: "Email", meta: { label: "Email" } },
];

export function Example({ data }: { data: Customer[] }) {
  return <DataGrid data={data} columns={columns} />;
}
```

## Server mode

```tsx
<DataGrid
  serverSide
  data={query.data?.data ?? []}
  columns={columns}
  totalRows={query.data?.total ?? 0}
  pageIndex={pageIndex}
  pageSize={pageSize}
  sorting={sorting}
  filters={filters}
  search={search}
  onPaginationChange={setPagination}
  onSortingChange={setSorting}
  onFiltersChange={setFilters}
  onSearchChange={setSearch}
  isLoading={query.isLoading}
  isFetching={query.isFetching}
  isError={query.isError}
  onRetry={() => query.refetch()}
/>
```

## URL sync

```tsx
import { useUrlState } from "@/shared/components/data-grid";

const { state, update } = useUrlState({ defaultPageSize: 20 });

<DataGrid
  serverSide
  pageIndex={state.pageIndex}
  pageSize={state.pageSize}
  sorting={state.sorting}
  search={state.search}
  onPaginationChange={(p) => update(p)}
  onSortingChange={(s) => update({ sorting: s, pageIndex: 0 })}
  onSearchChange={(s) => update({ search: s, pageIndex: 0 })}
  {/* … */}
/>
```

## Folder layout

```
data-grid/
├── data-grid.tsx               // <DataGrid /> entry point
├── data-grid-toolbar.tsx       // search + view + export + bulk actions
├── data-grid-pagination.tsx    // page navigation + size selector
├── data-grid-column-filter.tsx // per-column filter popover
├── data-grid-row-actions.tsx   // shadcn DropdownMenu actions
├── data-grid-editable-cell.tsx // inline editing helper
├── data-grid-expandable-row.tsx// chevron + sub-row helper
├── data-grid-view-options.tsx  // column visibility
├── data-grid-empty-state.tsx   // empty / error card
├── data-grid-loading.tsx       // spinner
├── data-grid-skeleton.tsx      // skeleton rows
├── data-grid-provider.tsx      // context
├── hooks/                      // useDataGrid, useServerDataGrid, useUrlState
├── utils/                      // export, query string, helpers
├── types/                      // public + internal types
├── constants/                  // sizes, defaults
└── examples/                   // 11 turn-key tables
```

## Demo route

Open `/components/data-grid` (registered in `(Protected)`) to see all 11
examples — basic, sortable, filterable, editable, expandable, virtualized,
CRM, finance, tasks, server-side, and URL-synced.

## API endpoint

`/api/customers` exposes a 1,200-row in-memory mock DB with pagination,
sorting, search and filter support:

```
GET /api/customers?page=1&pageSize=20&search=john&sort=name&direction=asc&status=active
```

Response:

```json
{ "data": [], "total": 1200, "page": 1, "pageSize": 20, "totalPages": 60 }
```

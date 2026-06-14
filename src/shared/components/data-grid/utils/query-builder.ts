import type {
  DataGridFiltersState,
  DataGridSortingState,
} from "../types/table.types";

export type QueryBuilderInput = {
  pageIndex: number;
  pageSize: number;
  sorting?: DataGridSortingState;
  filters?: DataGridFiltersState;
  search?: string;
  extra?: Record<string, string | number | boolean | undefined | null>;
};

export function buildQueryString(input: QueryBuilderInput): string {
  const params = new URLSearchParams();

  params.set("page", String(input.pageIndex + 1));
  params.set("pageSize", String(input.pageSize));

  if (input.search) params.set("search", input.search);

  const sort = input.sorting?.[0];
  if (sort) {
    params.set("sort", sort.id);
    params.set("direction", sort.desc ? "desc" : "asc");
  }

  if (input.filters) {
    for (const f of input.filters) {
      if (f.value === undefined || f.value === null || f.value === "") continue;
      if (Array.isArray(f.value)) {
        if (f.value.length === 0) continue;
        params.set(f.id, f.value.join(","));
      } else {
        params.set(f.id, String(f.value));
      }
    }
  }

  if (input.extra) {
    for (const [k, v] of Object.entries(input.extra)) {
      if (v === undefined || v === null || v === "") continue;
      params.set(k, String(v));
    }
  }

  return params.toString();
}

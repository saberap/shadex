"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import {
  DEFAULT_PAGE_INDEX,
  DEFAULT_PAGE_SIZE,
  URL_KEYS,
} from "../constants/data-grid.constants";
import type { DataGridSortingState } from "../types/table.types";

export type UrlGridState = {
  pageIndex: number;
  pageSize: number;
  search: string;
  sorting: DataGridSortingState;
};

type UseUrlStateOptions = {
  defaultPageSize?: number;
};

export function useUrlState(options: UseUrlStateOptions = {}) {
  const { defaultPageSize = DEFAULT_PAGE_SIZE } = options;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const state: UrlGridState = useMemo(() => {
    const pageParam = Number(searchParams.get(URL_KEYS.page));
    const sizeParam = Number(searchParams.get(URL_KEYS.pageSize));
    const sortId = searchParams.get(URL_KEYS.sort);
    const direction = searchParams.get(URL_KEYS.direction);

    return {
      pageIndex:
        Number.isFinite(pageParam) && pageParam > 0
          ? pageParam - 1
          : DEFAULT_PAGE_INDEX,
      pageSize:
        Number.isFinite(sizeParam) && sizeParam > 0
          ? sizeParam
          : defaultPageSize,
      search: searchParams.get(URL_KEYS.search) ?? "",
      sorting: sortId ? [{ id: sortId, desc: direction === "desc" }] : [],
    };
  }, [searchParams, defaultPageSize]);

  const update = useCallback(
    (patch: Partial<UrlGridState>) => {
      const params = new URLSearchParams(searchParams.toString());

      const next: UrlGridState = { ...state, ...patch };

      if (next.pageIndex > 0) {
        params.set(URL_KEYS.page, String(next.pageIndex + 1));
      } else {
        params.delete(URL_KEYS.page);
      }

      if (next.pageSize !== defaultPageSize) {
        params.set(URL_KEYS.pageSize, String(next.pageSize));
      } else {
        params.delete(URL_KEYS.pageSize);
      }

      if (next.search) {
        params.set(URL_KEYS.search, next.search);
      } else {
        params.delete(URL_KEYS.search);
      }

      const sort = next.sorting[0];
      if (sort) {
        params.set(URL_KEYS.sort, sort.id);
        params.set(URL_KEYS.direction, sort.desc ? "desc" : "asc");
      } else {
        params.delete(URL_KEYS.sort);
        params.delete(URL_KEYS.direction);
      }

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams, state, defaultPageSize],
  );

  return { state, update };
}

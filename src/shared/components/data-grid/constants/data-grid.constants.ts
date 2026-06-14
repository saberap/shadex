export const DEFAULT_PAGE_SIZES = [10, 20, 50, 100] as const;

export const DEFAULT_PAGE_SIZE = 10;

export const DEFAULT_PAGE_INDEX = 0;

export const DEFAULT_DEBOUNCE_MS = 300;

export const VIRTUAL_ROW_HEIGHT = 48;

export const VIRTUAL_OVERSCAN = 8;

export const COLUMN_MIN_WIDTH = 60;

export const COLUMN_DEFAULT_WIDTH = 160;

export const COLUMN_MAX_WIDTH = 800;

export const URL_KEYS = {
  page: "page",
  pageSize: "pageSize",
  search: "search",
  sort: "sort",
  direction: "direction",
} as const;

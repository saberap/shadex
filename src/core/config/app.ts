export type Direction = "ltr" | "rtl";
export type Locale = "en" | "fa";

export interface AppConfig {
  direction: Direction;
  locale: Locale;
}

/**
 * App-level display configuration.
 * Change `direction` and `locale` here to switch between LTR/RTL layouts and fonts.
 *
 * direction: "ltr" → Inter font, left-to-right
 * direction: "rtl" → Vazirmatn font, right-to-left
 */
export const appConfig: AppConfig = {
  direction: "rtl",
  locale: "fa",
};

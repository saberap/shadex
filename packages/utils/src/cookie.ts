interface IClientCookie {
  theme: string;
  sessionId: string;
  LoggedIn: string;
  "X-XSRF-TOKEN": string;
}

type TClientCookie = keyof IClientCookie;

export const setClientCookie = <T = string>(
  name: TClientCookie,
  value: T,
  options: {
    days?: number;
    hours?: number;
    minutes?: number;
    path?: string;
    domain?: string;
    secure?: boolean;
    sameSite?: "strict" | "lax" | "none";
  } = {},
): void => {
  if (typeof document === "undefined") return;

  let expires = "";
  if (options.days || options.hours || options.minutes) {
    const date = new Date();
    if (options.days)
      date.setTime(date.getTime() + options.days * 24 * 60 * 60 * 1000);
    if (options.hours)
      date.setTime(date.getTime() + options.hours * 60 * 60 * 1000);
    if (options.minutes)
      date.setTime(date.getTime() + options.minutes * 60 * 1000);
    expires = `; expires=${date.toUTCString()}`;
  }

  const valueStr = typeof value === "string" ? value : JSON.stringify(value);

  const cookieParts = [
    `${encodeURIComponent(name)}=${encodeURIComponent(valueStr)}`,
    expires,
    options.path ? `; path=${options.path}` : "; path=/",
    options.domain ? `; domain=${options.domain}` : "",
    options.secure ? "; Secure" : "",
    options.sameSite ? `; SameSite=${options.sameSite}` : "; SameSite=Lax",
  ].filter(Boolean);
  // biome-ignore lint/suspicious/noDocumentCookie: Controlled cookie setting
  document.cookie = cookieParts.join("");
};

export const getClientCookie = <T>(
  name: TClientCookie,
  fallback?: T,
): T | null => {
  if (typeof document === "undefined") return fallback ?? null;

  const nameEQ = `${encodeURIComponent(name)}=`;
  const ca = document.cookie.split(";");

  for (let c of ca) {
    while (c.charAt(0) === " ") c = c.substring(1);
    if (c.indexOf(nameEQ) === 0) {
      const rawValue = decodeURIComponent(c.substring(nameEQ.length));
      if (
        typeof fallback === "string" ||
        (fallback === undefined && rawValue[0] !== "{" && rawValue[0] !== "[")
      ) {
        return rawValue as unknown as T;
      }
      try {
        return JSON.parse(rawValue) as T;
      } catch {
        return rawValue as unknown as T;
      }
    }
  }

  return fallback ?? null;
};

export const deleteCookie = (
  name: TClientCookie,
  path = "/",
  domain?: string,
): void => {
  setClientCookie(name, "", { days: -1, path, domain });
};

export const hasClientCookie = (name: TClientCookie): boolean => {
  return getClientCookie(name, null) !== null;
};

export const getAllClientCookies = (): Record<string, unknown> => {
  if (typeof document === "undefined") return {};

  const cookies: Record<string, unknown> = {};
  if (!document.cookie) return cookies;

  document.cookie.split(";").forEach((part) => {
    const [keyRaw, ...valueParts] = part.split("=");
    const key = decodeURIComponent(keyRaw.trim());
    const rawValue = decodeURIComponent(valueParts.join("="));
    try {
      cookies[key] = JSON.parse(rawValue);
    } catch {
      cookies[key] = rawValue;
    }
  });

  return cookies;
};

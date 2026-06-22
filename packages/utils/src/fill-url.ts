export function fillUrl(url: string, params?: Record<string, unknown>): string {
  if (!params || Object.keys(params).length === 0) {
    return url.replace(/\/:[^/]+/g, "");
  }

  let filledUrl = Object.entries(params).reduce((acc, [key, val]) => {
    if (val !== null && val !== undefined && val !== "") {
      return acc.replace(`:${key}`, encodeURIComponent(String(val)));
    }
    return acc;
  }, url);

  filledUrl = filledUrl.replace(/\/:[^/]+/g, "");
  filledUrl = filledUrl.replace(/\/+/g, "/");

  return filledUrl;
}

/**
 * Fills URL with path parameters and removes optional parameters that are not provided.
 *
 * @example
 * fillUrl('/api/:id/:action', { id: '123', action: 'edit' })
 * // Returns: '/api/123/edit'
 *
 * @example
 * fillUrl('/api/:id/:action', { id: '123' })
 * // Returns: '/api/123' (removes :action since it's not provided)
 *
 * @param url - The URL template with :param placeholders
 * @param params - Object containing parameter values
 * @returns The filled URL with optional parameters removed
 */
export function fillUrl(url: string, params?: Record<string, unknown>): string {
  if (!params || Object.keys(params).length === 0) {
    // If no params provided, remove all optional path parameters
    return url.replace(/\/:[^/]+/g, "");
  }

  // First, replace provided parameter values
  let filledUrl = Object.entries(params).reduce((acc, [key, val]) => {
    // Only replace if value is not null, undefined, or empty string
    if (val !== null && val !== undefined && val !== "") {
      return acc.replace(`:${key}`, encodeURIComponent(String(val)));
    }
    return acc;
  }, url);

  // Remove remaining path parameters (those that weren't provided)
  filledUrl = filledUrl.replace(/\/:[^/]+/g, "");

  // Clean up any double slashes
  filledUrl = filledUrl.replace(/\/+/g, "/");

  return filledUrl;
}

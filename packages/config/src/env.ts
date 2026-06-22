/**
 * Runtime Environment Configuration
 *
 * This module provides runtime environment variables that can be configured
 * when running Docker containers, instead of being baked in at build time.
 *
 * For server-side code: Uses process.env directly (always up-to-date)
 * For client-side code: Fetches from /api/config endpoint
 */

// Define public environment variable keys
export const PUBLIC_ENV_KEYS = [
  "NEXT_PUBLIC_API_BASE_URL",
  "NEXT_PUBLIC_USE_API_PROXY",
] as const;

export type PublicEnvKey = (typeof PUBLIC_ENV_KEYS)[number];
export type PublicEnvConfig = Record<PublicEnvKey, string>;

// Default values for environment variables
const DEFAULT_ENV: PublicEnvConfig = {
  NEXT_PUBLIC_API_BASE_URL: "",
  NEXT_PUBLIC_USE_API_PROXY: "false",
};

// Client-side cache for environment variables
let clientEnvCache: PublicEnvConfig | null = null;
let fetchPromise: Promise<PublicEnvConfig> | null = null;

/**
 * Get environment variable value (server-side only)
 * Use this in Server Components, API routes, and server-side code
 */
export function getServerEnv(key: PublicEnvKey): string {
  return process.env[key] || DEFAULT_ENV[key];
}

/**
 * Get all server environment variables
 */
export function getServerEnvConfig(): PublicEnvConfig {
  const config = { ...DEFAULT_ENV };
  for (const key of PUBLIC_ENV_KEYS) {
    const value = process.env[key];
    if (value) {
      config[key] = value;
    }
  }
  return config;
}

/**
 * Fetch runtime environment config from API (client-side)
 * Caches the result to avoid multiple fetches
 */
export async function fetchClientEnvConfig(): Promise<PublicEnvConfig> {
  if (clientEnvCache) {
    return clientEnvCache;
  }

  if (fetchPromise) {
    return fetchPromise;
  }

  fetchPromise = fetch("/api/config", {
    cache: "default",
    next: { revalidate: 300 }, // 5 minutes
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Failed to fetch config: ${res.status}`);
      }
      return res.json();
    })
    .then((data: Partial<PublicEnvConfig>) => {
      clientEnvCache = { ...DEFAULT_ENV, ...data };
      return clientEnvCache;
    })
    .catch((error) => {
      console.error("Error fetching runtime config:", error);
      clientEnvCache = { ...DEFAULT_ENV };
      for (const key of PUBLIC_ENV_KEYS) {
        const buildTimeValue = process.env[key];
        if (buildTimeValue) {
          clientEnvCache[key] = buildTimeValue;
        }
      }
      return clientEnvCache;
    })
    .finally(() => {
      fetchPromise = null;
    });

  return fetchPromise;
}

/**
 * Get client environment synchronously (returns cached or build-time value)
 * Use this when you need synchronous access and can't use async/await
 */
export function getClientEnvSync(key: PublicEnvKey): string {
  if (clientEnvCache) {
    return clientEnvCache[key];
  }
  return process.env[key] || DEFAULT_ENV[key];
}

/**
 * Initialize client environment config
 * Call this early in your app initialization
 */
export function initClientEnvConfig(config: Partial<PublicEnvConfig>): void {
  clientEnvCache = { ...DEFAULT_ENV, ...config };
}

/**
 * Check if running on server or client
 */
export const isServer = typeof window === "undefined";

/**
 * Universal env getter - works on both server and client
 * On server: Returns process.env value directly
 * On client: Returns cached value (must call initClientEnvConfig first)
 */
export function getEnv(key: PublicEnvKey): string {
  if (isServer) {
    return getServerEnv(key);
  }
  return getClientEnvSync(key);
}

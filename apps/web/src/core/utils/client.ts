import { AxiosAdapter, HttpClient } from "@repo/utils";
import type { AxiosRequestConfig } from "axios";

const apiConfig: AxiosRequestConfig = {
  baseURL:
    typeof window !== "undefined" &&
    process.env.NEXT_PUBLIC_USE_API_PROXY === "true"
      ? "/api/proxy"
      : process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 60000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "Accept-Language": "fa",
  },
};

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  console.warn(
    "⚠️  SSL certificate validation disabled for development environment",
  );
}

export const httpClient = new HttpClient(new AxiosAdapter(apiConfig));

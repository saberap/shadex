import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import type { IError } from "@/core/types/api";
import { createIErrorFromUnknown } from "@/core/types/api";
import { toast } from "sonner";
import { deleteCookie } from "./client-cookie";

export type MethodType = "get" | "post" | "put" | "delete" | "patch";

/**
 * HttpAdapter interface defines the shape for any HTTP library adapter.
 * It allows swapping out implementations (e.g., fetch, axios) with minimal changes.
 */
export interface HttpAdapter {
  instance: AxiosInstance;
  request<T = unknown, R = AxiosResponse<T>>(
    config: AxiosRequestConfig,
  ): Promise<R>;
}

/**
 * AxiosAdapter wraps an AxiosInstance to conform to HttpAdapter.
 */
export class AxiosAdapter implements HttpAdapter {
  public instance: AxiosInstance;

  constructor(config: AxiosRequestConfig) {
    this.instance = axios.create(config);
    this.setupInterceptors();
  }

  private isRedirecting = false;

  private setupInterceptors() {
    // Request interceptor for logging or headers
    this.instance.interceptors.request.use(
      (config) => {
        return config;
      },
      (error: AxiosError) => {
        console.error("[HTTP Request Error]", error);

        // Normalize error to IError and show toast
        const normalized: IError = createIErrorFromUnknown(
          error?.response?.data ?? error,
        );
        try {
          toast.error(normalized.detail || normalized.title);
        } catch (_) {
          // swallow toast errors
        }

        return Promise.reject(normalized);
      },
    );

    // Response interceptor for logging errors
    this.instance.interceptors.response.use(
      (response) => response.data,
      (error: AxiosError) => {
        console.error(
          "[HTTP Response Error]",
          error.response?.status,
          error.response?.data || error.message,
        );

        // Handle 401 Unauthorized - redirect to login
        if (error.response?.status === 401) {
          if (typeof window !== "undefined" && !this.isRedirecting) {
            this.isRedirecting = true;
            deleteCookie("LoggedIn");
            deleteCookie("X-XSRF-TOKEN");
            setTimeout(() => {
              window.location.href = "/auth/entry-screen";
            }, 200);
          }
          return Promise.reject(
            createIErrorFromUnknown(error?.response?.data ?? error),
          );
        }

        // Normalize error to IError and show toast
        const normalized: IError = createIErrorFromUnknown(
          error?.response?.data ?? error,
        );
        try {
          toast.error(normalized.detail || normalized.title);
        } catch (_) {
          // swallow toast errors
        }

        return Promise.reject(normalized);
      },
    );
  }
  public request<T = unknown, R = AxiosResponse<T>>(
    config: AxiosRequestConfig,
  ): Promise<R> {
    return this.instance.request<T, R>(config);
  }
}
/**
 * HttpClient is a wrapper that uses an HttpAdapter for requests,
 * providing a consistent interface for API communication.
 */
export class HttpClient {
  private adapter: HttpAdapter;

  constructor(adapter: HttpAdapter) {
    this.adapter = adapter;
  }

  /** Generic GET request */
  public get<T = unknown>(url: string, config?: AxiosRequestConfig) {
    return this.adapter.request<T>({ method: "GET", url, ...config });
  }

  /** Generic POST request */
  public post<T = unknown, D = unknown>(
    url: string,
    data: D,
    config?: AxiosRequestConfig,
  ) {
    return this.adapter.request<T>({ method: "POST", url, data, ...config });
  }

  /** Generic PUT request */
  public put<T = unknown, D = unknown>(
    url: string,
    data: D,
    config?: AxiosRequestConfig,
  ) {
    return this.adapter.request<T>({ method: "PUT", url, data, ...config });
  }

  /** Generic PATCH request */
  public patch<T = unknown, D = unknown>(
    url: string,
    data: D,
    config?: AxiosRequestConfig,
  ) {
    return this.adapter.request<T>({ method: "PATCH", url, data, ...config });
  }

  /** Generic DELETE request */
  public delete<T = unknown>(url: string, config?: AxiosRequestConfig) {
    return this.adapter.request<T>({ method: "DELETE", url, ...config });
  }
}

/**
 * Example: Create a singleton HttpClient with AxiosAdapter
 */
const apiConfig: AxiosRequestConfig = {
  // Use proxy when enabled via environment variable to avoid SameSite cookie issues
  baseURL:
    typeof window !== "undefined" &&
    process.env.NEXT_PUBLIC_USE_API_PROXY === "true"
      ? "/api/proxy"
      : process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 60000,
  // Ensure cookies are sent with cross-site requests when needed
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "Accept-Language": "fa",
  },
};

// In development, bypass SSL certificate validation for self-signed certificates
if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  console.warn(
    "⚠️  SSL certificate validation disabled for development environment",
  );
}

export const httpClient = new HttpClient(new AxiosAdapter(apiConfig));

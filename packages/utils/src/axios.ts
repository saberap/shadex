import type { IError } from "@repo/types";
import { createIErrorFromUnknown } from "@repo/types";
import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import { toast } from "sonner";
import { deleteCookie } from "./cookie";

export type MethodType = "get" | "post" | "put" | "delete" | "patch";

export interface HttpAdapter {
  instance: AxiosInstance;
  request<T = unknown, R = AxiosResponse<T>>(
    config: AxiosRequestConfig,
  ): Promise<R>;
}

export class AxiosAdapter implements HttpAdapter {
  public instance: AxiosInstance;

  constructor(config: AxiosRequestConfig) {
    this.instance = axios.create(config);
    this.setupInterceptors();
  }

  private isRedirecting = false;

  private setupInterceptors() {
    this.instance.interceptors.request.use(
      (config) => config,
      (error: AxiosError) => {
        console.error("[HTTP Request Error]", error);
        const normalized: IError = createIErrorFromUnknown(
          error?.response?.data ?? error,
        );
        try {
          toast.error(normalized.detail || normalized.title);
        } catch (_) {}
        return Promise.reject(normalized);
      },
    );

    this.instance.interceptors.response.use(
      (response) => response.data,
      (error: AxiosError) => {
        console.error(
          "[HTTP Response Error]",
          error.response?.status,
          error.response?.data || error.message,
        );

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

        const normalized: IError = createIErrorFromUnknown(
          error?.response?.data ?? error,
        );
        try {
          toast.error(normalized.detail || normalized.title);
        } catch (_) {}
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

export class HttpClient {
  private adapter: HttpAdapter;

  constructor(adapter: HttpAdapter) {
    this.adapter = adapter;
  }

  public get<T = unknown>(url: string, config?: AxiosRequestConfig) {
    return this.adapter.request<T>({ method: "GET", url, ...config });
  }

  public post<T = unknown, D = unknown>(
    url: string,
    data: D,
    config?: AxiosRequestConfig,
  ) {
    return this.adapter.request<T>({ method: "POST", url, data, ...config });
  }

  public put<T = unknown, D = unknown>(
    url: string,
    data: D,
    config?: AxiosRequestConfig,
  ) {
    return this.adapter.request<T>({ method: "PUT", url, data, ...config });
  }

  public patch<T = unknown, D = unknown>(
    url: string,
    data: D,
    config?: AxiosRequestConfig,
  ) {
    return this.adapter.request<T>({ method: "PATCH", url, data, ...config });
  }

  public delete<T = unknown>(url: string, config?: AxiosRequestConfig) {
    return this.adapter.request<T>({ method: "DELETE", url, ...config });
  }
}

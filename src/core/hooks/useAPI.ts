/** biome-ignore-all lint/correctness/useHookAtTopLevel: We Can't do any thing */
import type {
  InfiniteData,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { AxiosRequestConfig } from "axios";
import { apis } from "@/core/services/apis";
import type { IError } from "@/core/types/api";
import type { MethodType } from "@/core/utils/client";
import { httpClient } from "@/core/utils/client";
import { fillUrl } from "@/core/utils/fill-url";
import { jsonToFormData } from "@/core/utils/jsonToFormData";
import { queryClient } from "@/shared/providers/QueryClientProvider";

const cfgToClientMethodMapper: Record<string, MethodType> = {
  GET: "get",
  POST: "post",
  PUT: "put",
  PATCH: "patch",
  DELETE: "delete",
};

type Services = typeof apis;
type Scope = keyof Services;
type Endpoint<S extends Scope> = keyof Services[S];
type ServiceDef<S extends Scope, M extends Endpoint<S>> = Services[S][M] & {
  url: string;
  method: string;
};

// Helpers
type ApiPathParams<S extends Scope, M extends Endpoint<S>> =
  ServiceDef<S, M> extends { pathParams: infer P } ? P : undefined;
type ApiParams<S extends Scope, M extends Endpoint<S>> =
  ServiceDef<S, M> extends { params: infer P } ? P : undefined;
type ApiRequestBody<S extends Scope, M extends Endpoint<S>> =
  ServiceDef<S, M> extends { request: infer R } ? R : undefined;
type ApiResponseBody<S extends Scope, M extends Endpoint<S>> =
  ServiceDef<S, M> extends { response: infer R }
    ? R extends (...args: unknown[]) => infer ReturnType
      ? ReturnType
      : R
    : unknown;

type TPathParams<S extends Scope, M extends Endpoint<S>> = {
  pathParams?: ApiPathParams<S, M>;
};
type TParams<S extends Scope, M extends Endpoint<S>> = {
  params?: ApiParams<S, M>;
};
type TAxiosConfig = {
  axiosConfig?: AxiosRequestConfig;
};
type TIsFormData = {
  isFormData?: boolean;
};
type TIsUrlEncoded = {
  isUrlEncoded?: boolean;
};
type TCustomQueryKey = {
  queryKey?: readonly unknown[];
};

/**
 * وقتی `true` است، toast خطا توسط client.ts نمایش داده نمی‌شود.
 *
 * ⚠️ مسئولیت نمایش خطا با شماست — حتماً حالت `isError` را هندل کنید.
 * پیشنهاد: از کامپوننت `ErrorDisplay` به‌جای المنت اصلی استفاده کنید:
 *
 * @example
 * ```tsx
 * import { ErrorDisplay } from "@/shared/components/error-display";
 *
 * const { data, isError, refetch } = useAPI(["transactions", "transactionHistory"], {
 *   disableToastError: true,
 * });
 *
 * if (isError) {
 *   return (
 *     <ErrorDisplay
 *       variant="section"
 *       title="خطا در دریافت تراکنش‌ها"
 *       onRetry={refetch}
 *     />
 *   );
 * }
 * ```
 */
type TDisableToastError = {
  disableToastError?: boolean;
};

type TIsInfinity = {
  isInfinity?: boolean;
};

type TInfiniteQueryConfig<TPageParam = unknown> = {
  initialPageParam?: TPageParam;
  getNextPageParam?: (
    lastPage: unknown,
    allPages: unknown[],
  ) => TPageParam | undefined | null;
  getPreviousPageParam?: (
    firstPage: unknown,
    allPages: unknown[],
  ) => TPageParam | undefined | null;
};

// ✅ اینجا تغییر کرد → هم آرایه و هم آرایه از آرایه‌ها رو ساپورت می‌کنیم
type TInvalidateKey = {
  invalidateKey?: readonly unknown[] | readonly (readonly unknown[])[];
};

type IsGetEndpoint<S extends Scope, M extends Endpoint<S>> =
  ServiceDef<S, M> extends { method: "GET" } ? true : false;

// تایپ برای آپشن‌های اضافی mutation
type MutationCallOptions<S extends Scope, M extends Endpoint<S>> = {
  params?: ApiParams<S, M>;
  pathParams?: ApiPathParams<S, M>;
  axiosConfig?: AxiosRequestConfig;
};

// Wrapper type for mutation variables
type MutationVariables<S extends Scope, M extends Endpoint<S>> = {
  body: ApiRequestBody<S, M>;
  options?: MutationCallOptions<S, M>;
};

type InfiniteApiReturnType<S extends Scope, M extends Endpoint<S>> = Omit<
  UseInfiniteQueryResult<InfiniteData<ApiResponseBody<S, M>>, IError>,
  "refetch"
> & {
  refetch: (overrides?: {
    pathParams?: ApiPathParams<S, M>;
    params?: ApiParams<S, M>;
    axiosConfig?: AxiosRequestConfig;
  }) => Promise<InfiniteData<ApiResponseBody<S, M>>>;
  invalidate: () => Promise<void>;
};

type ApiReturnType<S extends Scope, M extends Endpoint<S>> =
  IsGetEndpoint<S, M> extends true
    ? Omit<UseQueryResult<ApiResponseBody<S, M>, IError>, "refetch"> & {
        refetch: (overrides?: {
          pathParams?: ApiPathParams<S, M>;
          params?: ApiParams<S, M>;
          axiosConfig?: AxiosRequestConfig;
        }) => Promise<ApiResponseBody<S, M>>;
        invalidate: () => Promise<void>;
      }
    : Omit<
        UseMutationResult<
          ApiResponseBody<S, M>,
          IError,
          MutationVariables<S, M>
        >,
        "mutate" | "mutateAsync"
      > & {
        mutate: (
          body: ApiRequestBody<S, M>,
          options?: MutationCallOptions<S, M>,
        ) => void;
        mutateAsync: (
          body: ApiRequestBody<S, M>,
          options?: MutationCallOptions<S, M>,
        ) => Promise<ApiResponseBody<S, M>>;
      };

type ApiOptionsType<S extends Scope, M extends Endpoint<S>> =
  IsGetEndpoint<S, M> extends true
    ?
        | (Omit<
            UseQueryOptions<
              ApiResponseBody<S, M>,
              IError,
              ApiResponseBody<S, M>
            >,
            "queryKey" | "queryFn"
          > &
            TPathParams<S, M> &
            TParams<S, M> &
            TAxiosConfig &
            TCustomQueryKey &
            TInvalidateKey &
            TDisableToastError & { isInfinity?: false })
        | (Omit<
            UseInfiniteQueryOptions<
              ApiResponseBody<S, M>,
              IError,
              ApiResponseBody<S, M>
            >,
            "queryKey" | "queryFn"
          > &
            TPathParams<S, M> &
            TParams<S, M> &
            TAxiosConfig &
            TCustomQueryKey &
            TInvalidateKey &
            TIsInfinity &
            TInfiniteQueryConfig &
            TDisableToastError)
    : UseMutationOptions<ApiResponseBody<S, M>, IError, ApiRequestBody<S, M>> &
        TPathParams<S, M> &
        TParams<S, M> &
        TAxiosConfig &
        TIsFormData &
        TIsUrlEncoded &
        TInvalidateKey &
        TDisableToastError;

/**
 * Hook برای کار با API ها با قابلیت Type Safety کامل
 *
 * @example استفاده معمولی (GET)
 * ```tsx
 * const { data, isLoading, error } = useAPI(["account", "statement"], {
 *   params: { accountNumber: "123" }
 * });
 * // data: IStatement[]
 * ```
 *
 * @example استفاده از Infinite Query
 * ```tsx
 * const { data, fetchNextPage, hasNextPage } = useAPI(["account", "statement"], {
 *   isInfinity: true,
 *   params: { accountNumber: "123" },
 *   initialPageParam: 0,
 *   getNextPageParam: (lastPage, allPages) => {
 *     return lastPage.length > 0 ? allPages.length : undefined;
 *   }
 * });
 * // data: InfiniteData<IStatement[]> با data.pages
 * ```
 *
 * @example استفاده از Mutation
 * ```tsx
 * const { mutate, isLoading } = useAPI(["account", "transactionReasons"]);
 * mutate({ amount: 1000, sourceAccount: "123", ... });
 * ```
 *
 * @see {@link /docs/useAPI_usage_guide.md} برای اطلاعات کامل
 * @see {@link /docs/useAPI_infinite_query_guide.md} برای راهنمای Infinite Query
 */

// Overload signatures برای type safety
export function useAPI<S extends Scope, M extends Endpoint<S>>(
  key: [S, M],
  options: ApiOptionsType<S, M> & { isInfinity: true },
): InfiniteApiReturnType<S, M>;

export function useAPI<S extends Scope, M extends Endpoint<S>>(
  key: [S, M],
  options?: ApiOptionsType<S, M> & { isInfinity?: false },
): ApiReturnType<S, M>;

export function useAPI<S extends Scope, M extends Endpoint<S>>(
  key: [S, M],
  options?: any,
): any {
  const [scope, endpoint] = key;
  const queryClient = useQueryClient();

  if (!scope || !endpoint) {
    console.warn("Invalid API key provided to useAPI:", key);
    return {
      data: undefined,
      error: null,
      isLoading: false,
      isSuccess: false,
      isError: false,
      mutate: () => Promise.resolve(),
      mutateAsync: () => Promise.resolve(),
    };
  }

  const cfg: any = apis[scope][endpoint];

  const queryKey =
    options?.queryKey ||
    ([scope, endpoint, options?.pathParams, options?.params] as const);

  // 👇 تابع واحد برای invalidate کردن (چه آرایه باشه چه چند آرایه)
  const invalidateQueries = async () => {
    const keys = Array.isArray(options?.invalidateKey?.[0])
      ? (options.invalidateKey as readonly (readonly unknown[])[])
      : options?.invalidateKey
        ? [options.invalidateKey as readonly unknown[]]
        : [];

    if (keys.length > 0) {
      for (const keyArr of keys) {
        await queryClient.invalidateQueries({
          predicate: (query) => {
            const qk = query.queryKey;
            return (
              Array.isArray(qk) &&
              Array.isArray(keyArr) &&
              keyArr.every((k, i) => qk[i] === k)
            );
          },
        });
      }
    } else {
      await queryClient.invalidateQueries({ queryKey: [scope, endpoint] });
    }
  };

  // ---------------------- GET ----------------------
  if (cfg?.method === "GET") {
    // ✅ اگر isInfinity === true باشه از useInfiniteQuery استفاده کن
    if (options?.isInfinity) {
      const infiniteQueryResult = useInfiniteQuery({
        queryKey,
        queryFn: ({ pageParam }) =>
          httpClient.get(fillUrl(cfg.url, options?.pathParams), {
            params: { ...options?.params, ...(pageParam || {}) },
            ...options?.axiosConfig,
            ...(options?.disableToastError ? { _disableToastError: true } : {}),
          }),
        initialPageParam: options?.initialPageParam ?? undefined,
        getNextPageParam: options?.getNextPageParam,
        getPreviousPageParam: options?.getPreviousPageParam,
        ...options,
      });

      const customRefetch = async (overrides?: {
        pathParams?: unknown;
        params?: unknown;
        axiosConfig?: AxiosRequestConfig;
      }) => {
        if (!overrides) {
          const res = await infiniteQueryResult.refetch();
          if (options?.invalidateKey) await invalidateQueries();
          return res;
        }

        const url = fillUrl(
          cfg.url,
          overrides?.pathParams ?? options?.pathParams,
        );
        const res = await httpClient.get(url, {
          params: overrides?.params ?? options?.params,
          ...(overrides?.axiosConfig ?? options?.axiosConfig),
        });

        const newQueryKey =
          options?.queryKey ||
          ([
            scope,
            endpoint,
            overrides?.pathParams ?? options?.pathParams,
            overrides?.params ?? options?.params,
          ] as const);

        try {
          queryClient.setQueryData(newQueryKey, res);
        } catch {}

        await invalidateQueries();
        return res;
      };

      return {
        ...infiniteQueryResult,
        refetch: customRefetch,
        invalidate: invalidateQueries,
      };
    }

    // ✅ در غیر این صورت از useQuery معمولی استفاده کن
    const queryResult = useQuery({
      queryKey,
      queryFn: () =>
        httpClient.get(fillUrl(cfg.url, options?.pathParams), {
          params: options?.params,
          ...options?.axiosConfig,
          ...(options?.disableToastError ? { _disableToastError: true } : {}),
        }),
      ...options,
    });

    const customRefetch = async (overrides?: {
      pathParams?: unknown;
      params?: unknown;
      axiosConfig?: AxiosRequestConfig;
    }) => {
      if (!overrides) {
        const res = await queryResult.refetch();
        if (options?.invalidateKey) await invalidateQueries();
        return res;
      }

      const url = fillUrl(
        cfg.url,
        overrides?.pathParams ?? options?.pathParams,
      );
      const res = await httpClient.get(url, {
        params: overrides?.params ?? options?.params,
        ...(overrides?.axiosConfig ?? options?.axiosConfig),
      });

      const newQueryKey =
        options?.queryKey ||
        ([
          scope,
          endpoint,
          overrides?.pathParams ?? options?.pathParams,
          overrides?.params ?? options?.params,
        ] as const);

      try {
        queryClient.setQueryData(newQueryKey, res);
      } catch {}

      await invalidateQueries();
      return res;
    };

    return {
      ...queryResult,
      refetch: customRefetch,
      invalidate: invalidateQueries,
    };
  }

  // ---------------------- MUTATION ----------------------
  const { onSuccess: userOnSuccess, ...restOptions } = options || {};

  const mutation = useMutation({
    mutationFn: (variables: { body: any; options?: any }) => {
      const { body, options: callOptions } = variables;
      const method = cfgToClientMethodMapper[cfg?.method || "POST"];

      // pathParams و params از callOptions یا options اصلی گرفته میشن
      const finalPathParams = callOptions?.pathParams ?? options?.pathParams;
      const finalParams = callOptions?.params ?? options?.params;
      const mergedAxiosConfig = {
        ...options?.axiosConfig,
        ...callOptions?.axiosConfig,
        params: finalParams,
        ...(options?.disableToastError ? { _disableToastError: true } : {}),
      };

      const url = fillUrl(cfg?.url || "", finalPathParams);

      if (method === "delete") {
        return httpClient[method](url, mergedAxiosConfig);
      }

      let finalBody = body;
      let finalAxiosConfig = mergedAxiosConfig;

      if (options?.isFormData) {
        finalBody = jsonToFormData(body);
        // Content-Type توسط interceptor در client.ts حذف می‌شود
        // تا مرورگر خودش multipart/form-data با boundary صحیح ست کند
      } else if (options?.isUrlEncoded) {
        const params = new URLSearchParams();
        Object.entries(body || {}).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            params.append(key, String(value));
          }
        });
        finalBody = params;
        finalAxiosConfig = {
          ...mergedAxiosConfig,
          headers: {
            ...mergedAxiosConfig?.headers,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        };
      }

      return httpClient[method as "post" | "put" | "patch"](
        url,
        finalBody,
        finalAxiosConfig,
      );
    },

    onSuccess: async (...args) => {
      await invalidateQueries();
      if (userOnSuccess) userOnSuccess(...args);
    },

    ...restOptions,
  });

  // Wrapper functions برای API بهتر
  const wrappedMutate = (body: any, callOptions?: any) => {
    mutation.mutate({ body, options: callOptions });
  };

  const wrappedMutateAsync = (body: any, callOptions?: any) => {
    return mutation.mutateAsync({ body, options: callOptions });
  };

  return {
    ...mutation,
    mutate: wrappedMutate,
    mutateAsync: wrappedMutateAsync,
  };
}

/**
 * تابع برای invalidate کردن چندین query key به صورت مستقیم
 *
 * @example
 * ```tsx
 * import { invalidateKey } from "@/core/hooks/useAPI";
 *
 * // invalidate کردن یک یا چند query key
 * await invalidateKey([
 *   ["account", "balance"],
 *   ["account", "accountList"]
 * ]);
 * ```
 *
 * @param keys - آرایه‌ای از query key ها که باید invalidate شوند
 */
export const invalidateKey = async (
  keys: readonly (readonly unknown[])[],
): Promise<void> => {
  if (!keys || keys.length === 0) {
    console.warn("No keys provided to invalidateKeys");
    return;
  }

  for (const keyArr of keys) {
    await queryClient.invalidateQueries({
      predicate: (query) => {
        const qk = query.queryKey;
        return (
          Array.isArray(qk) &&
          Array.isArray(keyArr) &&
          keyArr.every((k, i) => qk[i] === k)
        );
      },
    });
  }
};

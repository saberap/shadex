/** biome-ignore-all lint/correctness/useHookAtTopLevel: We Can't do any thing */

import type { IError } from "@repo/types";
import type { MethodType } from "@repo/utils";
import { fillUrl, jsonToFormData } from "@repo/utils";
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
import { httpClient } from "@/core/utils/client";
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

type ApiPathParams<S extends Scope, M extends Endpoint<S>> = ServiceDef<
  S,
  M
> extends { pathParams: infer P }
  ? P
  : undefined;
type ApiParams<S extends Scope, M extends Endpoint<S>> = ServiceDef<
  S,
  M
> extends { params: infer P }
  ? P
  : undefined;
type ApiRequestBody<S extends Scope, M extends Endpoint<S>> = ServiceDef<
  S,
  M
> extends { request: infer R }
  ? R
  : undefined;
type ApiResponseBody<S extends Scope, M extends Endpoint<S>> = ServiceDef<
  S,
  M
> extends { response: infer R }
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
type TAxiosConfig = { axiosConfig?: AxiosRequestConfig };
type TIsFormData = { isFormData?: boolean };
type TIsUrlEncoded = { isUrlEncoded?: boolean };
type TCustomQueryKey = { queryKey?: readonly unknown[] };
type TDisableToastError = { disableToastError?: boolean };
type TIsInfinity = { isInfinity?: boolean };
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
type TInvalidateKey = {
  invalidateKey?: readonly unknown[] | readonly (readonly unknown[])[];
};

type IsGetEndpoint<S extends Scope, M extends Endpoint<S>> = ServiceDef<
  S,
  M
> extends { method: "GET" }
  ? true
  : false;

type MutationCallOptions<S extends Scope, M extends Endpoint<S>> = {
  params?: ApiParams<S, M>;
  pathParams?: ApiPathParams<S, M>;
  axiosConfig?: AxiosRequestConfig;
};

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

type ApiReturnType<S extends Scope, M extends Endpoint<S>> = IsGetEndpoint<
  S,
  M
> extends true
  ? Omit<UseQueryResult<ApiResponseBody<S, M>, IError>, "refetch"> & {
      refetch: (overrides?: {
        pathParams?: ApiPathParams<S, M>;
        params?: ApiParams<S, M>;
        axiosConfig?: AxiosRequestConfig;
      }) => Promise<ApiResponseBody<S, M>>;
      invalidate: () => Promise<void>;
    }
  : Omit<
      UseMutationResult<ApiResponseBody<S, M>, IError, MutationVariables<S, M>>,
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

type ApiOptionsType<S extends Scope, M extends Endpoint<S>> = IsGetEndpoint<
  S,
  M
> extends true
  ?
      | (Omit<
          UseQueryOptions<ApiResponseBody<S, M>, IError, ApiResponseBody<S, M>>,
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
  // biome-ignore lint/suspicious/noExplicitAny: implementation overload needs any
  options?: any,
  // biome-ignore lint/suspicious/noExplicitAny: implementation overload needs any
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

  // biome-ignore lint/suspicious/noExplicitAny: API config shape varies per endpoint
  const cfg: any = apis[scope][endpoint];

  const queryKey =
    options?.queryKey ||
    ([scope, endpoint, options?.pathParams, options?.params] as const);

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

  if (cfg?.method === "GET") {
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

  const { onSuccess: userOnSuccess, ...restOptions } = options || {};

  const mutation = useMutation({
    // biome-ignore lint/suspicious/noExplicitAny: mutation variables are dynamically typed
    mutationFn: (variables: { body: any; options?: any }) => {
      const { body, options: callOptions } = variables;
      const method = cfgToClientMethodMapper[cfg?.method || "POST"];

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

  // biome-ignore lint/suspicious/noExplicitAny: public API wrapper accepts any body shape
  const wrappedMutate = (body: any, callOptions?: any) => {
    mutation.mutate({ body, options: callOptions });
  };

  // biome-ignore lint/suspicious/noExplicitAny: public API wrapper accepts any body shape
  const wrappedMutateAsync = (body: any, callOptions?: any) => {
    return mutation.mutateAsync({ body, options: callOptions });
  };

  return {
    ...mutation,
    mutate: wrappedMutate,
    mutateAsync: wrappedMutateAsync,
  };
}

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

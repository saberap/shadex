# AI Agent Development Guide

This guide is for Claude and any other AI coding agent working in this repository. Before implementing changes, use this project's existing structure and primitives as the source of truth. Do not invent parallel patterns unless the user explicitly asks for them.

## Non-Negotiable Rules

- Build UI with the existing shadcn components in `src/shared/components/ui`.
- Do not recreate common UI such as buttons, inputs, dialogs, sheets, tables, tabs, selects, drawers, toasts, or cards with raw HTML when a project component exists.
- Use `lucide-react` for icons.
- Use `cn` from `@/core/utils/cn` to compose class names.
- Use `useAPI` from `@/core/hooks/useAPI` for client-side API calls. Do not call `axios`, `fetch`, or `httpClient` directly from feature components.
- Add new endpoint definitions under `src/core/services/**/apis.ts`, then register the service scope in `src/core/services/apis.ts`.
- Before any Next.js-specific change, read the relevant version-matched docs in `node_modules/next/dist/docs/`. This project uses Next.js `16.2.7`.

## Project Structure

```txt
src/
  app/                         # App Router routes, layouts, pages
  core/
    config/                    # App and environment configuration
    hooks/                     # Core hooks such as useAPI and use-mobile
    services/                  # API endpoint definitions
    types/                     # Shared types such as Req, Res, IError
    utils/                     # Utilities such as cn, fillUrl, http client
  shared/
    components/ui/             # shadcn components
    providers/                 # Global providers such as QueryClientProvider
  styles/
    globals.css                # Tailwind v4, shadcn theme variables, global styles
```

The main TypeScript alias is `@/* -> ./src/*`.

Common imports:

```tsx
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { useAPI } from "@/core/hooks/useAPI";
import { cn } from "@/core/utils/cn";
```

## Next.js Rules

- `page.tsx` and `layout.tsx` files are Server Components by default.
- Add `"use client"` only when a file needs state, event handlers, `useAPI`, React Query, browser APIs, or client hooks.
- Global providers are already wired in `src/app/layout.tsx`: `QueryClientProvider` and `ThemeProvider`.
- Create routes in `src/app`.
- Keep reusable code under `src/core` or `src/shared`; do not bury shared utilities inside route folders without a clear reason.

## UI And shadcn

The project already has these shadcn components:

`accordion`, `alert`, `alert-dialog`, `avatar`, `badge`, `breadcrumb`, `button`, `button-group`, `card`, `carousel`, `chart`, `checkbox`, `collapsible`, `combobox`, `command`, `context-menu`, `dialog`, `drawer`, `dropdown-menu`, `empty`, `field`, `input`, `input-group`, `item`, `label`, `pagination`, `popover`, `progress`, `radio-group`, `scroll-area`, `select`, `separator`, `sheet`, `sidebar`, `skeleton`, `slider`, `sonner`, `spinner`, `switch`, `table`, `tabs`, `textarea`, `tooltip`, `typography`.

UI rules:

- Compose with existing primitives instead of repeating raw HTML for primary UI.
- Use `Skeleton` or `Spinner` for loading states.
- Use the existing `sonner` integration for toasts.
- Use `Label`, `Input`, `Textarea`, `Select`, `Checkbox`, `RadioGroup`, `Field`, and other shadcn form primitives for forms.
- Use `Table` and, when needed, `@tanstack/react-table` for data tables.
- Use theme variables from `src/styles/globals.css`. Avoid hard-coded colors unless there is a specific reason.
- App direction and locale come from `src/core/config/app.ts`; consider `rtl`/`ltr` behavior when building layout.

Example:

```tsx
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

export function UserCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
      </CardHeader>
      <CardContent>
        <Button type="button">Refresh</Button>
      </CardContent>
    </Card>
  );
}
```

## API Contract

All endpoints must be defined in `src/core/services`.

Current pattern:

```ts
import { Req, Res } from "@/core/types/api";

export const authApis = {
  login: {
    method: "POST",
    url: "/auth/login",
    request: Req<{
      username: string;
      password: string;
    }>(),
    response: Res<{
      roles: string[];
      groups: string[];
      resources: string[];
    }>(),
  },
} as const;
```

Register the scope in `src/core/services/apis.ts`:

```ts
import { type AuthApiDefs, authApis } from "./auth/apis";

export const apis = {
  auth: authApis,
} as const;

export type ApiDefinitions = {
  auth: AuthApiDefs;
};
```

Use the existing type helpers from `@/core/types/api` for request, response, path params, and query params when available. For dynamic URLs, define placeholders such as `"/users/:id"` and pass values through `pathParams` in `useAPI`.

## Using useAPI

For GET requests:

```tsx
"use client";

import { useAPI } from "@/core/hooks/useAPI";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";

export function Profile() {
  const { data, isLoading, isError, refetch } = useAPI(["user", "profile"]);

  if (isLoading) return <Skeleton className="h-24 w-full" />;
  if (isError) {
    return (
      <Button type="button" variant="outline" onClick={() => refetch()}>
        Retry
      </Button>
    );
  }

  return <div>{data?.name}</div>;
}
```

For mutations:

```tsx
"use client";

import { useAPI } from "@/core/hooks/useAPI";
import { Button } from "@/shared/components/ui/button";

export function LoginButton() {
  const { mutateAsync, isPending } = useAPI(["auth", "login"]);

  const handleLogin = async () => {
    await mutateAsync({
      username: "demo",
      password: "secret",
    });
  };

  return (
    <Button type="button" disabled={isPending} onClick={handleLogin}>
      Login
    </Button>
  );
}
```

Important `useAPI` options:

- `params`: query string params
- `pathParams`: URL placeholder values
- `queryKey`: custom React Query key
- `invalidateKey`: invalidate one or more queries after mutation
- `isFormData`: automatically convert the body to `FormData`
- `isUrlEncoded`: send `application/x-www-form-urlencoded`
- `isInfinity`: use infinite query for GET endpoints
- `disableToastError`: disable the default error toast; if used, always render an error state in the UI

## HTTP And Environment

- `httpClient` in `src/core/utils/client.ts` wraps axios and owns error normalization, toast handling, and 401 redirects.
- Feature code should not use `httpClient` directly unless it is infrastructure-level code. The normal path is `useAPI`.
- `NEXT_PUBLIC_API_BASE_URL` and `NEXT_PUBLIC_USE_API_PROXY` control the base URL behavior.
- Related docs:
  - `docs/api_proxy_usage_guide.md`
  - `docs/runtime_env_variables_guide.md`

## State And Providers

- React Query is provided by `src/shared/providers/QueryClientProvider.tsx` and mounted in the root layout.
- If global state is needed, read the Zustand docs first:
  - `docs/zustand_usage_guide.md`
  - `docs/zustand_setup_summary.md`
  - `docs/zustand_ssr_fix_guide.md`

## Internal Docs To Read

Before changing a specific area, read the matching internal guide:

- API: `docs/useAPI_usage_guide.md`
- Infinite query: `docs/useAPI_infinite_query_guide.md`
- shadcn: `docs/shadcn_usage_guide.md`
- Forms: `docs/form_builder_usage_guide.md`
- Environment and proxy: `docs/runtime_env_variables_guide.md`, `docs/api_proxy_usage_guide.md`
- Documentation index: `docs/INDEX.md`

## Code Quality

- TypeScript is strict; do not weaken types.
- Use `@/...` imports.
- Before adding a dependency, check whether the project already has a suitable component, utility, or package.
- Keep interactive components small and client-side; keep pages and layouts as Server Components when possible.
- After code changes, run at least `npm run lint`. For larger changes, run `npm run build`.

## Do Not Do This

- Do not write direct API calls with `axios.get`, `fetch`, or `httpClient` in feature components.
- Do not replace existing shadcn components with raw HTML.
- Do not move `src/shared/components/ui` paths without a very strong reason.
- Do not bypass the theme with inline hard-coded colors.
- Do not rely on external Next.js docs or training memory; use the version-matched docs in `node_modules/next/dist/docs/`.

# AI Agent Development Guide

This file defines strict coding rules for any AI agent working in this repository.
These rules are mandatory and override default behavior unless explicitly instructed otherwise.

---

# 1. Core Principle

Always follow the existing project architecture and patterns.
Do NOT invent new abstractions, patterns, or tooling unless explicitly requested.

---

# 2. UI Rules (STRICT)

- Use existing shadcn components from:
  `src/shared/components/ui`

- NEVER recreate UI components using raw HTML if a shadcn equivalent exists:
  - button, input, dialog, sheet, table, tabs, select, drawer, toast, card, etc.

- Use:
  - `lucide-react` for icons
  - `cn` from `@/core/utils/cn` for class composition

---

# 3. API Rules (CRITICAL)

- NEVER use:
  - fetch
  - axios
  - httpClient (directly in feature code)

- ALWAYS use:
  `useAPI` from `@/core/hooks/useAPI`

- All endpoints MUST be defined in:
  `src/core/services/**/apis.ts`

- Then register them in:
  `src/core/services/apis.ts`

---

# 4. Project Structure (TRUST THIS)

src/
  app/                 → routes (Next.js App Router)
  core/
    config/           → config
    hooks/            → useAPI, utilities hooks
    services/         → API definitions
    types/            → shared types
    utils/            → helpers (cn, http, etc.)
  shared/
    components/ui/    → shadcn UI components
    providers/        → global providers
  styles/
    globals.css       → theme + Tailwind v4

Alias:
@/* → src/*

---

# 5. Next.js Rules

- Server Components by default
- Use `"use client"` ONLY when needed:
  - state
  - event handlers
  - useAPI
  - browser APIs

- Keep pages and layouts server-side when possible

---

# 6. State Management

- React Query is already configured
- Use provided providers in layout
- Follow Zustand guides in /docs if needed

---

# 7. Styling Rules

- Use theme variables from `globals.css`
- Avoid hard-coded colors
- Respect RTL/LTR config from `src/core/config/app.ts`

---

# 8. Internal Docs Priority

Before implementing features, check:

- API: `docs/useAPI_usage_guide.md`
- Infinite queries: `docs/useAPI_infinite_query_guide.md`
- shadcn: `docs/shadcn_usage_guide.md`
- Forms: `docs/form_builder_usage_guide.md`
- Env: `docs/runtime_env_variables_guide.md`
- API proxy: `docs/api_proxy_usage_guide.md`

---

# 9. Code Quality Rules

- TypeScript must remain strict
- Use `@/...` imports only
- Do NOT add dependencies if existing tools solve the problem
- Keep components small and focused
- Prefer server components where possible

---

# 10. FORBIDDEN PRACTICES (HARD RULES)

- ❌ fetch / axios / httpClient in feature code
- ❌ raw HTML instead of shadcn components
- ❌ bypassing `useAPI`
- ❌ inline hard-coded colors
- ❌ moving shared structure without strong reason
- ❌ duplicating existing utilities/components

---

# 11. Agent Behavior Rule

When uncertain:
- inspect existing codebase patterns first
- prefer consistency over creativity
- never introduce new architecture unless explicitly asked

# 12. Feature-Based Architecture (MANDATORY)

This project follows a strict feature-based architecture.

---

## 1. Core Rule (VERY IMPORTANT)

❌ NEVER implement business logic, UI, or feature code directly inside `src/app`.

✔️ The `src/app` directory MUST ONLY:
- define routes
- define layouts
- import feature entry points

NO EXCEPTIONS.

---

## 2. Feature Location Rule

All features MUST be created inside:

src/features/<feature-name>/

Each feature is fully self-contained and may include:
- components
- hooks
- services
- types
- utils

---

## 3. App Directory Rule (STRICT)

Inside `src/app`:

✔️ Allowed:
- page.tsx
- layout.tsx
- loading.tsx
- error.tsx

✔️ Allowed content:
- importing a feature component only
- composing features

❌ Forbidden:
- writing UI logic
- writing API calls
- creating components
- defining business logic
- using useAPI directly for feature logic

---

## 4. Example (Correct Pattern)

### src/app/dashboard/page.tsx
```tsx
import { DashboardFeature } from "@/features/dashboard";

export default function Page() {
  return <DashboardFeature />;
}
# Turborepo Monorepo Migration

## What Changed

The project has been migrated from a single Next.js application into a
Turborepo-based pnpm monorepo. All existing functionality, routes, UI
behaviour, and business logic are preserved.

---

## New Structure

```
shadcn-panel/                  ← monorepo root
│
├── apps/
│   └── web/                   ← Next.js application (was: src/ at root)
│       ├── src/
│       │   ├── app/           ← routes only (unchanged)
│       │   ├── features/      ← feature modules (unchanged)
│       │   ├── shared/
│       │   │   ├── components/layout/  ← app-specific shell
│       │   │   └── providers/          ← QueryClientProvider (uses @repo/api)
│       │   └── styles/        ← globals.css with @source directives
│       ├── next.config.ts     ← transpilePackages added
│       └── components.json    ← shadcn CLI config
│
├── packages/
│   ├── ui/          @repo/ui         ← 44 shadcn components + cn + useIsMobile
│   ├── api/         @repo/api        ← Axios client, useAPI, queryClient, service defs
│   ├── types/       @repo/types      ← IError, IResponse, shared API types
│   ├── config/      @repo/config     ← appConfig (RTL/LTR), env helpers
│   ├── shared/      @repo/shared     ← DataGrid, FileUpload
│   └── validation/  @repo/validation ← Zod schemas (auth, common)
│
├── turbo.json
├── pnpm-workspace.yaml
├── tsconfig.base.json
└── biome.json
```

---

## Getting Started After Migration

### 1. Remove old npm artifacts

```bash
# At the monorepo root
rm -rf node_modules package-lock.json
```

### 2. Install pnpm (if not already installed)

```bash
npm install -g pnpm
```

### 3. Remove original src/ at root (now lives in apps/web/)

```bash
rm -rf src/ public/ next.config.ts postcss.config.mjs tsconfig.json
```

### 4. Install all workspace dependencies

```bash
pnpm install
```

### 5. Run the app

```bash
pnpm dev          # starts all apps (only web in this case)
```

Or target a specific app:

```bash
pnpm --filter @repo/web dev
```

---

## Import Changes

| Before | After |
|--------|-------|
| `@/shared/components/ui/button` | `@repo/ui` |
| `@/core/utils/cn` | `@repo/ui` (cn is re-exported) |
| `@/core/hooks/useAPI` | `@repo/api` |
| `@/core/hooks/use-mobile` | `@repo/ui` |
| `@/core/types/api` | `@repo/types` |
| `@/core/config` | `@repo/config` |
| `@/core/services/apis` | `@repo/api` |
| `@/shared/components/data-grid` | `@repo/shared` |
| `@/shared/components/file-upload` | `@repo/shared` |

---

## Adding a New shadcn Component

```bash
cd apps/web
pnpm dlx shadcn@latest add <component>
```

Then move the generated file from `apps/web/src/shared/components/ui/` to
`packages/ui/src/` and add its export to `packages/ui/src/index.ts`.

---

## Adding a New Feature

Follow the existing pattern — all business logic stays inside `apps/web/src/features/`:

```
apps/web/src/features/<feature-name>/
├── components/
├── hooks/
├── services/
├── types/
└── index.ts
```

---

## Adding API Endpoints

1. Create `packages/api/src/modules/<scope>.ts`
2. Register it in `packages/api/src/modules/index.ts`
3. Use `useAPI(["<scope>", "<endpoint>"])` in your feature hook

---

## Turborepo Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in dev mode |
| `pnpm build` | Build all apps and packages |
| `pnpm typecheck` | Type-check all packages |
| `pnpm lint` | Biome check across the workspace |
| `pnpm check` | Biome check + auto-fix |
| `pnpm format` | Biome format across the workspace |

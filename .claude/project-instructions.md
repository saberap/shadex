# Claude Project Instructions

Claude must follow the project guide in `docs/AI_AGENT_GUIDE.md` before making code changes.

Priority rules:

- Use existing shadcn components from `@/shared/components/ui/*` for UI.
- Use `useAPI` from `@/core/hooks/useAPI` for client-side API calls.
- Define API endpoints in `src/core/services/**/apis.ts` and register scopes in `src/core/services/apis.ts`.
- Keep routing in `src/app`; keep reusable code in `src/core` and `src/shared`.
- Read the relevant installed Next.js docs in `node_modules/next/dist/docs/` before changing Next.js-specific code.
- Run `npm run lint` after code changes when possible.

This file exists for Claude-style editor extensions that look inside the `.claude` folder. The canonical full guide remains `docs/AI_AGENT_GUIDE.md`, and root-level `CLAUDE.md` imports both files.

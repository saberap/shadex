<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes - APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project Instructions For AI Agents

Before changing code in this project, read [docs/AI_AGENT_GUIDE.md](docs/AI_AGENT_GUIDE.md).

Core rule: build new UI and features from the existing project primitives:

- Use shadcn components from `@/shared/components/ui/*`.
- Use `useAPI` from `@/core/hooks/useAPI` for client-side API calls.
- Define API endpoints in `src/core/services/**/apis.ts` and register scopes in `src/core/services/apis.ts`.
- Keep route files in `src/app`; keep reusable app code under `src/core` and `src/shared`.
- Follow the installed Next.js docs in `node_modules/next/dist/docs/`, not outdated framework assumptions.

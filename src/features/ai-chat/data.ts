import type { Conversation, Folder, Message, Model } from "./types";

const now = new Date();
const h = (hours: number) => new Date(now.getTime() - hours * 3_600_000);
const d = (days: number) => new Date(now.getTime() - days * 86_400_000);

export const MODELS: Model[] = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    description: "Most capable multimodal model",
    contextLength: "128K",
    speed: "medium",
    cost: "medium",
  },
  {
    id: "gpt-4-1",
    name: "GPT-4.1",
    provider: "OpenAI",
    description: "Improved reasoning and coding",
    contextLength: "256K",
    speed: "medium",
    cost: "high",
  },
  {
    id: "claude-sonnet",
    name: "Claude Sonnet",
    provider: "Anthropic",
    description: "Balanced performance and speed",
    contextLength: "200K",
    speed: "fast",
    cost: "medium",
  },
  {
    id: "claude-opus",
    name: "Claude Opus",
    provider: "Anthropic",
    description: "Exceptional performance for complex tasks",
    contextLength: "200K",
    speed: "slow",
    cost: "high",
  },
  {
    id: "gemini-2-5-pro",
    name: "Gemini 2.5 Pro",
    provider: "Google",
    description: "Advanced reasoning with 1M context",
    contextLength: "1M",
    speed: "medium",
    cost: "medium",
  },
  {
    id: "gemini-flash",
    name: "Gemini Flash",
    provider: "Google",
    description: "Ultra-fast and highly efficient",
    contextLength: "1M",
    speed: "fast",
    cost: "low",
  },
];

export const mockFolders: Folder[] = [
  { id: "f1", name: "Marketing", color: "bg-rose-500" },
  { id: "f2", name: "Development", color: "bg-blue-500" },
  { id: "f3", name: "Research", color: "bg-violet-500" },
  { id: "f4", name: "Clients", color: "bg-emerald-500" },
];

export const mockConversations: Conversation[] = [
  // Pinned
  {
    id: "pin-1",
    title: "Q4 Sales Analysis Dashboard",
    model: "claude-opus",
    preview: "Create a comprehensive revenue breakdown by region and product line…",
    createdAt: d(3),
    updatedAt: h(2),
    pinned: true,
    archived: false,
    favorite: false,
    shared: true,
    messageCount: 14,
    activity: ["image", "file"],
  },
  {
    id: "pin-2",
    title: "API Architecture Review",
    model: "gpt-4o",
    preview: "Analyzing the microservices topology and identifying bottlenecks…",
    createdAt: d(5),
    updatedAt: h(5),
    pinned: true,
    archived: false,
    favorite: true,
    shared: false,
    folderId: "f2",
    messageCount: 22,
  },
  // Today
  {
    id: "today-1",
    title: "Database Schema Optimization",
    model: "claude-sonnet",
    preview: "Add composite indexing for multi-tenant query performance…",
    createdAt: h(1),
    updatedAt: h(1),
    pinned: false,
    archived: false,
    favorite: false,
    shared: false,
    folderId: "f2",
    messageCount: 8,
    activity: ["file"],
  },
  {
    id: "today-2",
    title: "React Performance Profiling",
    model: "claude-opus",
    preview: "Identified 3 major render bottlenecks in the dashboard layout…",
    createdAt: h(2),
    updatedAt: h(2),
    pinned: false,
    archived: false,
    favorite: false,
    shared: false,
    folderId: "f2",
    messageCount: 11,
  },
  {
    id: "today-3",
    title: "Marketing Email Campaign",
    model: "gpt-4o",
    preview: "Here are 5 compelling subject lines with A/B test variants…",
    createdAt: h(4),
    updatedAt: h(4),
    pinned: false,
    archived: false,
    favorite: true,
    shared: false,
    folderId: "f1",
    messageCount: 6,
  },
  // Yesterday
  {
    id: "yest-1",
    title: "Product Roadmap Planning",
    model: "claude-opus",
    preview: "Prioritized features for Q1 2025 based on user feedback data…",
    createdAt: d(1),
    updatedAt: d(1),
    pinned: false,
    archived: false,
    favorite: false,
    shared: true,
    messageCount: 18,
  },
  {
    id: "yest-2",
    title: "SQL Query Optimization",
    model: "gpt-4o",
    preview: "Reduced query execution time by 40% with proper index hints…",
    createdAt: d(1),
    updatedAt: d(1),
    pinned: false,
    archived: false,
    favorite: false,
    shared: false,
    folderId: "f2",
    messageCount: 9,
  },
  {
    id: "yest-3",
    title: "Competitive Analysis Report",
    model: "gemini-2-5-pro",
    preview: "Analyzed 8 competitors in the B2B SaaS analytics space…",
    createdAt: d(1),
    updatedAt: d(1),
    pinned: false,
    archived: false,
    favorite: false,
    shared: false,
    folderId: "f3",
    messageCount: 7,
    activity: ["file"],
  },
  {
    id: "yest-4",
    title: "TypeScript Migration Guide",
    model: "claude-sonnet",
    preview: "Step-by-step migration path from JavaScript with minimal disruption…",
    createdAt: d(1),
    updatedAt: d(1),
    pinned: false,
    archived: false,
    favorite: false,
    shared: false,
    folderId: "f2",
    messageCount: 15,
  },
  // Last 7 Days
  {
    id: "w7-1",
    title: "Customer Segmentation Model",
    model: "gemini-2-5-pro",
    preview: "K-means clustering on 50K users revealed 6 distinct personas…",
    createdAt: d(3),
    updatedAt: d(3),
    pinned: false,
    archived: false,
    favorite: false,
    shared: false,
    folderId: "f3",
    messageCount: 12,
    activity: ["image"],
  },
  {
    id: "w7-2",
    title: "CI/CD Pipeline Setup",
    model: "claude-sonnet",
    preview: "GitHub Actions workflow with multi-environment deployment stages…",
    createdAt: d(4),
    updatedAt: d(4),
    pinned: false,
    archived: false,
    favorite: false,
    shared: false,
    folderId: "f2",
    messageCount: 20,
    activity: ["file"],
  },
  {
    id: "w7-3",
    title: "Landing Page Copy",
    model: "gpt-4-1",
    preview: "Three hero copy variants optimized for SaaS conversion rates…",
    createdAt: d(5),
    updatedAt: d(5),
    pinned: false,
    archived: false,
    favorite: false,
    shared: false,
    folderId: "f1",
    messageCount: 8,
  },
  {
    id: "w7-4",
    title: "Error Monitoring Strategy",
    model: "claude-opus",
    preview: "Sentry configuration with custom alerting and PagerDuty integration…",
    createdAt: d(6),
    updatedAt: d(6),
    pinned: false,
    archived: false,
    favorite: false,
    shared: false,
    messageCount: 5,
  },
  {
    id: "w7-5",
    title: "Data Visualization Design",
    model: "gemini-flash",
    preview: "Created 4 chart prototypes for the analytics dashboard module…",
    createdAt: d(6),
    updatedAt: d(6),
    pinned: false,
    archived: false,
    favorite: false,
    shared: false,
    messageCount: 10,
    activity: ["image"],
  },
  // Last 30 Days
  {
    id: "m30-1",
    title: "Machine Learning Pipeline",
    model: "gemini-2-5-pro",
    preview: "TensorFlow Serving with Docker and Kubernetes auto-scaling…",
    createdAt: d(14),
    updatedAt: d(14),
    pinned: false,
    archived: false,
    favorite: false,
    shared: false,
    folderId: "f3",
    messageCount: 25,
    activity: ["file"],
  },
  {
    id: "m30-2",
    title: "Business Intelligence Report",
    model: "claude-opus",
    preview: "Revenue trends show 23% YoY growth with strong enterprise uptake…",
    createdAt: d(16),
    updatedAt: d(16),
    pinned: false,
    archived: false,
    favorite: false,
    shared: true,
    messageCount: 13,
    activity: ["image", "file"],
  },
  {
    id: "m30-3",
    title: "Authentication System Design",
    model: "gpt-4o",
    preview: "JWT + refresh token rotation with Redis session management…",
    createdAt: d(20),
    updatedAt: d(20),
    pinned: false,
    archived: false,
    favorite: false,
    shared: false,
    folderId: "f2",
    messageCount: 17,
  },
  {
    id: "m30-4",
    title: "Content Strategy Framework",
    model: "gpt-4-1",
    preview: "12-month editorial calendar aligned with product launch milestones…",
    createdAt: d(22),
    updatedAt: d(22),
    pinned: false,
    archived: false,
    favorite: true,
    shared: false,
    folderId: "f1",
    messageCount: 9,
  },
  {
    id: "m30-5",
    title: "Onboarding Flow Optimization",
    model: "claude-sonnet",
    preview: "A/B test results show 34% improvement with progressive disclosure…",
    createdAt: d(28),
    updatedAt: d(28),
    pinned: false,
    archived: false,
    favorite: false,
    shared: false,
    messageCount: 11,
    activity: ["image"],
  },
];

// Demo messages for "today-1" conversation (showcases all content types)
export const mockMessages: Record<string, Message[]> = {
  "today-1": [
    {
      id: "m1",
      conversationId: "today-1",
      role: "user",
      content:
        "Can you help me design a scalable database schema for a multi-tenant SaaS application? We expect to onboard thousands of organizations.",
      type: "text",
      createdAt: h(1.5),
    },
    {
      id: "m2",
      conversationId: "today-1",
      role: "assistant",
      content:
        "I've analyzed your requirements and recommend a **shared schema with Row-Level Security (RLS)** approach for your SaaS application.\n\n## Key Benefits\n- **Cost efficiency**: Single database instance reduces infrastructure spend\n- **Simplified migrations**: Schema changes apply globally across all tenants\n- **Better resource utilization**: Connection pooling works across organizations\n\n## Architecture Overview\nYour database should include:\n1. A central `organizations` table for tenant management\n2. An `organization_id` foreign key on all tenant-specific tables\n3. PostgreSQL RLS policies to enforce strict data isolation\n4. Composite indexes for tenant-scoped query performance",
      type: "text",
      thinkingSteps: [
        { id: "t1", content: "Analyzing multi-tenant architecture patterns: shared schema vs schema-per-tenant vs database-per-tenant" },
        { id: "t2", content: "Evaluating Row-Level Security (RLS) performance characteristics at scale with PostgreSQL" },
        { id: "t3", content: "Considering connection pooling with PgBouncer for thousands of concurrent tenants" },
        { id: "t4", content: "Drafting indexing strategy for `organization_id` foreign key columns" },
      ],
      createdAt: h(1.4),
    },
    {
      id: "m3",
      conversationId: "today-1",
      role: "user",
      content: "Can you write the actual PostgreSQL schema with RLS policies and proper indexes?",
      type: "text",
      createdAt: h(1.2),
    },
    {
      id: "m4",
      conversationId: "today-1",
      role: "assistant",
      content: "Here's a production-ready PostgreSQL schema with RLS policies:",
      type: "code",
      codeContent: {
        language: "sql",
        filename: "schema.sql",
        code: `-- Multi-Tenant SaaS Schema with Row-Level Security

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Core tenant table
CREATE TABLE organizations (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(255) NOT NULL,
  slug        VARCHAR(100) UNIQUE NOT NULL,
  plan        VARCHAR(50)  NOT NULL DEFAULT 'free',
  settings    JSONB        NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Users with org isolation
CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email           VARCHAR(255) NOT NULL,
  full_name       VARCHAR(255),
  role            VARCHAR(50)  NOT NULL DEFAULT 'member',
  avatar_url      TEXT,
  last_login      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Composite index for tenant-scoped email lookup
CREATE UNIQUE INDEX idx_users_org_email  ON users(organization_id, email);
CREATE INDEX        idx_users_org_id     ON users(organization_id);
CREATE INDEX        idx_users_last_login ON users(organization_id, last_login DESC);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Isolation policy (set app.current_org_id on each connection)
CREATE POLICY users_tenant_isolation ON users
  USING (organization_id = current_setting('app.current_org_id')::UUID);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();`,
      },
      createdAt: h(1.1),
    },
    {
      id: "m5",
      conversationId: "today-1",
      role: "user",
      content: "Great! Can you compare the three multi-tenancy strategies in a table?",
      type: "text",
      createdAt: h(0.8),
    },
    {
      id: "m6",
      conversationId: "today-1",
      role: "assistant",
      content: "Here's a comprehensive comparison of the three main multi-tenancy strategies:",
      type: "table",
      tableContent: {
        columns: [
          { key: "feature", label: "Criteria" },
          { key: "shared", label: "Shared Schema + RLS" },
          { key: "schemaPer", label: "Schema Per Tenant" },
          { key: "dbPer", label: "Database Per Tenant" },
        ],
        rows: [
          { feature: "Infrastructure Cost", shared: "Low", schemaPer: "Medium", dbPer: "High" },
          { feature: "Data Isolation", shared: "Good (RLS)", schemaPer: "Strong", dbPer: "Complete" },
          { feature: "Max Tenants", shared: "Unlimited", schemaPer: "~1,000", dbPer: "~100" },
          { feature: "Migration Complexity", shared: "Low", schemaPer: "Medium", dbPer: "High" },
          { feature: "Query Performance", shared: "Good w/ indexes", schemaPer: "Excellent", dbPer: "Excellent" },
          { feature: "Connection Pooling", shared: "Easy", schemaPer: "Moderate", dbPer: "Complex" },
          { feature: "Compliance (GDPR)", shared: "Manageable", schemaPer: "Good", dbPer: "Best" },
          { feature: "Recommended For", shared: "Most SaaS", schemaPer: "Mid-market", dbPer: "Enterprise" },
        ],
      },
      createdAt: h(0.6),
    },
    {
      id: "m7",
      conversationId: "today-1",
      role: "user",
      content: "Can you show me a chart of query performance benchmarks across these strategies?",
      type: "text",
      createdAt: h(0.4),
    },
    {
      id: "m8",
      conversationId: "today-1",
      role: "assistant",
      content: "Here are benchmark results from a 100K tenant simulation (queries per second, p99 latency in ms):",
      type: "chart",
      chartContent: {
        type: "bar",
        title: "Multi-Tenancy Performance Benchmarks",
        data: [
          { strategy: "Shared + RLS", qps: 8400, p99_ms: 12, setup_days: 2 },
          { strategy: "Schema Per Tenant", qps: 11200, p99_ms: 8, setup_days: 14 },
          { strategy: "DB Per Tenant", qps: 12800, p99_ms: 6, setup_days: 45 },
        ],
        keys: [
          { key: "qps", color: "hsl(var(--chart-1))" },
          { key: "p99_ms", color: "hsl(var(--chart-2))" },
        ],
      },
      createdAt: h(0.2),
    },
  ],
};

export const aiResponses = {
  default: `That's a great question! Let me break this down for you.

Based on your requirements, here's my analysis:

**Key Considerations**

The most important factors to evaluate are performance, maintainability, and scalability. Each approach has distinct trade-offs that depend on your specific use case and team constraints.

**My Recommendation**

I'd suggest starting with the simplest approach that meets your current needs, then optimizing iteratively as you gather real-world usage data. Premature optimization can add significant complexity without proportional benefit.

**Next Steps**
1. Define your success metrics clearly before implementing
2. Set up monitoring to measure the baseline
3. Implement the solution with observability built in
4. Review and iterate based on real data

Would you like me to dive deeper into any specific aspect of this?`,

  coding: `Here's a clean, production-ready implementation:

\`\`\`typescript
import { useCallback, useEffect, useRef, useState } from "react"

interface Config<T> {
  fetcher: (signal: AbortSignal) => Promise<T>
  initialData?: T
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
}

export function useAsync<T>({ fetcher, initialData, onSuccess, onError }: Config<T>) {
  const [data, setData] = useState<T | undefined>(initialData)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  const execute = useCallback(async () => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setIsLoading(true)
    setError(null)

    try {
      const result = await fetcher(controller.signal)
      if (!controller.signal.aborted) {
        setData(result)
        onSuccess?.(result)
      }
    } catch (err) {
      if (!controller.signal.aborted) {
        const error = err instanceof Error ? err : new Error(String(err))
        setError(error)
        onError?.(error)
      }
    } finally {
      if (!controller.signal.aborted) setIsLoading(false)
    }
  }, [fetcher, onSuccess, onError])

  useEffect(() => { execute() }, [execute])
  useEffect(() => () => { abortRef.current?.abort() }, [])

  return { data, error, isLoading, refetch: execute }
}
\`\`\`

This implementation handles cancellation, avoids state updates on unmounted components, and provides a clean refetch mechanism. The generic type parameter ensures full TypeScript inference throughout your application.`,

  analysis: `Here's my analysis of the data:

**Summary of Findings**

The data reveals several important patterns worth highlighting:

| Metric | Current | Target | Gap |
|--------|---------|--------|-----|
| Conversion Rate | 3.2% | 5.0% | -1.8pp |
| Avg Session Time | 4m 12s | 6m 00s | -1m 48s |
| Bounce Rate | 52% | 35% | +17pp |
| Revenue/User | $42 | $65 | -$23 |

**Key Insights**

The conversion funnel shows the largest drop-off at the pricing page (68% exit rate). Users who engage with the interactive demo show 4.2x higher conversion rates.

**Recommended Actions**
1. Redesign the pricing page with social proof and comparison table
2. Add an in-product trial that delays payment friction
3. Implement behavioral retargeting for pricing page exits
4. A/B test a usage-based pricing model for SMB segment

Implementing these changes could conservatively improve conversion by 40-60% based on industry benchmarks.`,
};

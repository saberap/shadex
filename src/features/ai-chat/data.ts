import type { Conversation, Folder, Message, Model } from "./types";

const now = new Date();
const h = (hours: number) => new Date(now.getTime() - hours * 3_600_000);
const d = (days: number) => new Date(now.getTime() - days * 86_400_000);

export const MODELS: Model[] = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    description: "توانمندترین مدل چندوجهی",
    contextLength: "128K",
    speed: "medium",
    cost: "medium",
  },
  {
    id: "gpt-4-1",
    name: "GPT-4.1",
    provider: "OpenAI",
    description: "استدلال و کدنویسی بهبودیافته",
    contextLength: "256K",
    speed: "medium",
    cost: "high",
  },
  {
    id: "claude-sonnet",
    name: "Claude Sonnet",
    provider: "Anthropic",
    description: "تعادل میان عملکرد و سرعت",
    contextLength: "200K",
    speed: "fast",
    cost: "medium",
  },
  {
    id: "claude-opus",
    name: "Claude Opus",
    provider: "Anthropic",
    description: "عملکرد فوق‌العاده برای کارهای پیچیده",
    contextLength: "200K",
    speed: "slow",
    cost: "high",
  },
  {
    id: "gemini-2-5-pro",
    name: "Gemini 2.5 Pro",
    provider: "Google",
    description: "استدلال پیشرفته با زمینه ۱ میلیون توکن",
    contextLength: "1M",
    speed: "medium",
    cost: "medium",
  },
  {
    id: "gemini-flash",
    name: "Gemini Flash",
    provider: "Google",
    description: "بسیار سریع و بهینه",
    contextLength: "1M",
    speed: "fast",
    cost: "low",
  },
];

export const mockFolders: Folder[] = [
  { id: "f1", name: "بازاریابی", color: "bg-rose-500" },
  { id: "f2", name: "توسعه", color: "bg-blue-500" },
  { id: "f3", name: "تحقیقات", color: "bg-violet-500" },
  { id: "f4", name: "مشتریان", color: "bg-emerald-500" },
];

export const mockConversations: Conversation[] = [
  // Pinned
  {
    id: "pin-1",
    title: "داشبورد تحلیل فروش سه‌ماهه چهارم",
    model: "claude-opus",
    preview: "تفکیک جامع درآمد بر اساس منطقه و خط محصول بساز…",
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
    title: "بازبینی معماری API",
    model: "gpt-4o",
    preview: "تحلیل توپولوژی میکروسرویس‌ها و شناسایی گلوگاه‌ها…",
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
    title: "بهینه‌سازی اسکیمای پایگاه داده",
    model: "claude-sonnet",
    preview: "افزودن ایندکس ترکیبی برای عملکرد کوئری چندمستأجری…",
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
    title: "پروفایلینگ عملکرد React",
    model: "claude-opus",
    preview: "۳ گلوگاه عمده رندر در چیدمان داشبورد شناسایی شد…",
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
    title: "کمپین ایمیل بازاریابی",
    model: "gpt-4o",
    preview: "۵ موضوع جذاب به همراه نسخه‌های تست A/B…",
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
    title: "برنامه‌ریزی نقشه راه محصول",
    model: "claude-opus",
    preview: "اولویت‌بندی قابلیت‌های سه‌ماهه اول ۲۰۲۵ بر اساس داده‌های بازخورد کاربر…",
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
    title: "بهینه‌سازی کوئری SQL",
    model: "gpt-4o",
    preview: "زمان اجرای کوئری با راهنمایی‌های ایندکس مناسب ۴۰٪ کاهش یافت…",
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
    title: "گزارش تحلیل رقابتی",
    model: "gemini-2-5-pro",
    preview: "تحلیل ۸ رقیب در حوزه تحلیل B2B SaaS…",
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
    title: "راهنمای مهاجرت به TypeScript",
    model: "claude-sonnet",
    preview: "مسیر مهاجرت گام‌به‌گام از JavaScript با کمترین اختلال…",
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
    title: "مدل بخش‌بندی مشتری",
    model: "gemini-2-5-pro",
    preview: "خوشه‌بندی K-means روی ۵۰ هزار کاربر، ۶ پرسونای متمایز را نشان داد…",
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
    title: "راه‌اندازی پایپ‌لاین CI/CD",
    model: "claude-sonnet",
    preview: "گردش‌کار GitHub Actions با مراحل استقرار چندمحیطه…",
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
    title: "متن صفحه فرود",
    model: "gpt-4-1",
    preview: "سه نسخه متن سرتیتر بهینه‌شده برای نرخ تبدیل SaaS…",
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
    title: "استراتژی مانیتورینگ خطا",
    model: "claude-opus",
    preview: "پیکربندی Sentry با هشدارهای سفارشی و یکپارچه‌سازی PagerDuty…",
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
    title: "طراحی مصورسازی داده",
    model: "gemini-flash",
    preview: "۴ پروتوتایپ نمودار برای ماژول داشبورد تحلیلی ساخته شد…",
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
    title: "پایپ‌لاین یادگیری ماشین",
    model: "gemini-2-5-pro",
    preview: "TensorFlow Serving با Docker و مقیاس‌دهی خودکار Kubernetes…",
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
    title: "گزارش هوش تجاری",
    model: "claude-opus",
    preview: "روند درآمد ۲۳٪ رشد سالانه با پذیرش قوی سازمانی نشان می‌دهد…",
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
    title: "طراحی سامانه احراز هویت",
    model: "gpt-4o",
    preview: "JWT با چرخش توکن تجدید و مدیریت نشست Redis…",
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
    title: "چارچوب استراتژی محتوا",
    model: "gpt-4-1",
    preview: "تقویم سرمقاله ۱۲ ماهه هم‌راستا با نقاط عطف عرضه محصول…",
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
    title: "بهینه‌سازی جریان آن‌بوردینگ",
    model: "claude-sonnet",
    preview: "نتایج تست A/B بهبود ۳۴٪ با افشای تدریجی را نشان می‌دهد…",
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
        "می‌توانی به من کمک کنی یک اسکیمای پایگاه داده مقیاس‌پذیر برای یک اپلیکیشن SaaS چندمستأجری طراحی کنم؟ انتظار داریم هزاران سازمان را پذیرش کنیم.",
      type: "text",
      createdAt: h(1.5),
    },
    {
      id: "m2",
      conversationId: "today-1",
      role: "assistant",
      content:
        "نیازمندی‌های شما را تحلیل کردم و رویکرد **اسکیمای مشترک با امنیت سطح ردیف (RLS)** را برای اپلیکیشن SaaS شما توصیه می‌کنم.\n\n## مزایای کلیدی\n- **کارایی هزینه**: یک نمونه پایگاه داده هزینه زیرساخت را کاهش می‌دهد\n- **مهاجرت‌های ساده‌تر**: تغییرات اسکیما به‌صورت سراسری بر همه مستأجرها اعمال می‌شود\n- **بهره‌برداری بهتر از منابع**: استخر اتصال میان سازمان‌ها کار می‌کند\n\n## نمای کلی معماری\nپایگاه داده شما باید شامل موارد زیر باشد:\n1. یک جدول مرکزی `organizations` برای مدیریت مستأجرها\n2. کلید خارجی `organization_id` روی همه جداول مختص مستأجر\n3. سیاست‌های RLS پست‌گرس برای اعمال جداسازی سخت داده‌ها\n4. ایندکس‌های ترکیبی برای عملکرد کوئری در محدوده مستأجر",
      type: "text",
      thinkingSteps: [
        { id: "t1", content: "تحلیل الگوهای معماری چندمستأجری: اسکیمای مشترک در برابر اسکیما به‌ازای هر مستأجر در برابر پایگاه داده به‌ازای هر مستأجر" },
        { id: "t2", content: "ارزیابی ویژگی‌های عملکرد امنیت سطح ردیف (RLS) در مقیاس بزرگ با PostgreSQL" },
        { id: "t3", content: "بررسی استخر اتصال با PgBouncer برای هزاران مستأجر همزمان" },
        { id: "t4", content: "پیش‌نویس استراتژی ایندکس‌گذاری برای ستون‌های کلید خارجی `organization_id`" },
      ],
      createdAt: h(1.4),
    },
    {
      id: "m3",
      conversationId: "today-1",
      role: "user",
      content: "می‌توانی اسکیمای واقعی PostgreSQL را به همراه سیاست‌های RLS و ایندکس‌های مناسب بنویسی؟",
      type: "text",
      createdAt: h(1.2),
    },
    {
      id: "m4",
      conversationId: "today-1",
      role: "assistant",
      content: "این یک اسکیمای PostgreSQL آماده تولید همراه با سیاست‌های RLS است:",
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
      content: "عالی! می‌توانی این سه استراتژی چندمستأجری را در یک جدول مقایسه کنی؟",
      type: "text",
      createdAt: h(0.8),
    },
    {
      id: "m6",
      conversationId: "today-1",
      role: "assistant",
      content: "این یک مقایسه جامع از سه استراتژی اصلی چندمستأجری است:",
      type: "table",
      tableContent: {
        columns: [
          { key: "feature", label: "معیار" },
          { key: "shared", label: "اسکیمای مشترک + RLS" },
          { key: "schemaPer", label: "اسکیما به‌ازای هر مستأجر" },
          { key: "dbPer", label: "پایگاه داده به‌ازای هر مستأجر" },
        ],
        rows: [
          { feature: "هزینه زیرساخت", shared: "کم", schemaPer: "متوسط", dbPer: "زیاد" },
          { feature: "جداسازی داده", shared: "خوب (RLS)", schemaPer: "قوی", dbPer: "کامل" },
          { feature: "حداکثر مستأجر", shared: "نامحدود", schemaPer: "~۱٬۰۰۰", dbPer: "~۱۰۰" },
          { feature: "پیچیدگی مهاجرت", shared: "کم", schemaPer: "متوسط", dbPer: "زیاد" },
          { feature: "عملکرد کوئری", shared: "خوب با ایندکس", schemaPer: "عالی", dbPer: "عالی" },
          { feature: "استخر اتصال", shared: "آسان", schemaPer: "متوسط", dbPer: "پیچیده" },
          { feature: "انطباق (GDPR)", shared: "قابل مدیریت", schemaPer: "خوب", dbPer: "بهترین" },
          { feature: "توصیه‌شده برای", shared: "اغلب SaaS‌ها", schemaPer: "بازار میانی", dbPer: "سازمانی" },
        ],
      },
      createdAt: h(0.6),
    },
    {
      id: "m7",
      conversationId: "today-1",
      role: "user",
      content: "می‌توانی یک نمودار از معیارهای عملکرد کوئری در این استراتژی‌ها به من نشان دهی؟",
      type: "text",
      createdAt: h(0.4),
    },
    {
      id: "m8",
      conversationId: "today-1",
      role: "assistant",
      content: "این نتایج بنچمارک از یک شبیه‌سازی ۱۰۰ هزار مستأجری است (کوئری در ثانیه، تأخیر p99 بر حسب میلی‌ثانیه):",
      type: "chart",
      chartContent: {
        type: "bar",
        title: "بنچمارک‌های عملکرد چندمستأجری",
        data: [
          { strategy: "مشترک + RLS", qps: 8400, p99_ms: 12, setup_days: 2 },
          { strategy: "اسکیما به‌ازای هر مستأجر", qps: 11200, p99_ms: 8, setup_days: 14 },
          { strategy: "پایگاه داده به‌ازای هر مستأجر", qps: 12800, p99_ms: 6, setup_days: 45 },
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
  default: `سؤال بسیار خوبی است! اجازه بدهید آن را برایتان تجزیه‌وتحلیل کنم.

بر اساس نیازمندی‌های شما، تحلیل من این است:

**ملاحظات کلیدی**

مهم‌ترین عوامل برای ارزیابی، عملکرد، قابلیت نگهداری و مقیاس‌پذیری هستند. هر رویکرد، مزایا و معایب متمایزی دارد که به مورد استفاده مشخص شما و محدودیت‌های تیم بستگی دارد.

**توصیه من**

پیشنهاد می‌کنم با ساده‌ترین رویکردی که نیازهای فعلی شما را برآورده می‌کند آغاز کنید و سپس به‌تدریج با جمع‌آوری داده‌های واقعی استفاده، آن را بهینه‌سازی کنید. بهینه‌سازی زودهنگام می‌تواند پیچیدگی قابل‌توجهی را بدون منفعت متناسب اضافه کند.

**گام‌های بعدی**
1. پیش از پیاده‌سازی، معیارهای موفقیت خود را به‌وضوح تعریف کنید
2. مانیتورینگ را برای اندازه‌گیری خط پایه راه‌اندازی کنید
3. راه‌حل را با قابلیت مشاهده‌پذیری داخلی پیاده‌سازی کنید
4. بر اساس داده‌های واقعی بررسی و تکرار کنید

آیا می‌خواهید در جنبه خاصی از این موضوع عمیق‌تر شویم؟`,

  coding: `این یک پیاده‌سازی تمیز و آماده تولید است:

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

این پیاده‌سازی لغو را مدیریت می‌کند، از به‌روزرسانی state در کامپوننت‌های unmount شده جلوگیری می‌کند و یک مکانیزم refetch تمیز فراهم می‌کند. پارامتر نوع جنریک، استنتاج کامل TypeScript را در سراسر اپلیکیشن شما تضمین می‌کند.`,

  analysis: `این تحلیل من از داده‌ها است:

**خلاصه یافته‌ها**

داده‌ها چندین الگوی مهم را آشکار می‌کنند که شایان توجه‌اند:

| معیار | فعلی | هدف | فاصله |
|--------|---------|--------|-----|
| نرخ تبدیل | ۳٫۲٪ | ۵٫۰٪ | -۱٫۸pp |
| میانگین زمان نشست | ۴ دقیقه ۱۲ ثانیه | ۶ دقیقه ۰۰ ثانیه | -۱ دقیقه ۴۸ ثانیه |
| نرخ پرش | ۵۲٪ | ۳۵٪ | +۱۷pp |
| درآمد به ازای کاربر | ۴۲ دلار | ۶۵ دلار | -۲۳ دلار |

**بینش‌های کلیدی**

قیف تبدیل بزرگ‌ترین افت را در صفحه قیمت‌گذاری نشان می‌دهد (نرخ خروج ۶۸٪). کاربرانی که با دموی تعاملی درگیر می‌شوند، نرخ تبدیل ۴٫۲ برابر بالاتری دارند.

**اقدامات توصیه‌شده**
1. صفحه قیمت‌گذاری را با اثبات اجتماعی و جدول مقایسه بازطراحی کنید
2. یک نسخه آزمایشی درون‌محصولی اضافه کنید تا اصطکاک پرداخت به تأخیر بیفتد
3. هدف‌گیری مجدد رفتاری را برای خروجی‌های صفحه قیمت‌گذاری پیاده‌سازی کنید
4. یک مدل قیمت‌گذاری مبتنی بر استفاده را برای بخش SMB تست A/B کنید

اعمال این تغییرات می‌تواند بر اساس بنچمارک‌های صنعتی، نرخ تبدیل را به‌صورت محافظه‌کارانه ۴۰ تا ۶۰٪ بهبود دهد.`,
};

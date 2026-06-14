import type { Plan } from "./types";

export const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    description: "For individuals and side projects getting started.",
    price: 19,
    cta: "Get started",
    includedTitle: "What's included:",
    features: [
      { label: "Up to 3 projects" },
      { label: "5GB storage with CDN" },
      {
        label: "Community support",
        hint: "Get help from peers on our public forum.",
      },
      { label: "Basic usage analytics" },
      { label: "Single-user workspace" },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    description: "Everything you need to ship fast. Limited-time launch rate.",
    price: 29,
    originalPrice: 49,
    savings: "Save 41% — $20 off every month",
    cta: "Claim this deal",
    featured: true,
    includedTitle: "Everything in Starter, plus:",
    features: [
      { label: "Unlimited projects" },
      {
        label: "100GB storage with global CDN",
        hint: "Edge-cached across 200+ locations worldwide.",
      },
      {
        label: "Priority support (4h SLA)",
        hint: "Guaranteed response within 4 business hours.",
      },
      { label: "Advanced analytics with funnels" },
      { label: "Up to 10 team members" },
      {
        label: "Custom domains with auto-SSL",
        hint: "Bring your own domain with auto-renewing certificates.",
      },
      { label: "REST and GraphQL API access" },
    ],
  },
  {
    id: "team",
    name: "Team",
    description: "For scaling teams that need SSO and compliance.",
    price: 79,
    cta: "Start free trial",
    includedTitle: "Everything in Pro, plus:",
    features: [
      { label: "Unlimited storage" },
      { label: "24/7 phone and chat support" },
      {
        label: "SAML SSO with directory sync",
        hint: "Works with Okta, Azure AD, and Google Workspace.",
      },
      { label: "Up to 50 team members" },
      {
        label: "Audit logs with 1-year retention",
        hint: "Tamper-evident records of every workspace action.",
      },
      { label: "Role-based access control (RBAC)" },
    ],
  },
];

export const OFFER_DURATION_SECONDS =
  2 * 24 * 60 * 60 + 14 * 60 * 60 + 13 * 60 + 17;

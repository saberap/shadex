export type PlanFeature = {
  label: string;
  hint?: string;
};

export type Plan = {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  savings?: string;
  cta: string;
  featured?: boolean;
  includedTitle: string;
  features: PlanFeature[];
};

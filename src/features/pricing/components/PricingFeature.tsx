import { OFFER_DURATION_SECONDS, plans } from "../data";
import { CountdownTimer } from "./CountdownTimer";
import { PricingCard } from "./PricingCard";

export function PricingFeature() {
  return (
    <section className="py-8 sm:py-12">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center space-y-3">
          <p className="text-xs font-semibold tracking-[0.22em] text-muted-foreground">
            LIMITED TIME LAUNCH
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Lock in your rate before it expires
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed sm:text-base">
            Save 41% on Pro when you sign up before the launch promo ends.
            <br className="hidden sm:block" />
            Rate locked for 12 months after signup.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3 lg:items-start">
          {plans.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              slot={
                plan.featured ? (
                  <CountdownTimer durationSeconds={OFFER_DURATION_SECONDS} />
                ) : null
              }
            />
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          All plans include a 14-day free trial. No credit card required. Cancel
          anytime.
        </p>
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import { Check } from "lucide-react";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple, transparent pricing for every type of duelist.",
};

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "For casual players getting started.",
    features: [
      "Card database access",
      "3 saved decks",
      "Basic deck builder",
      "Meta overview",
    ],
    cta: "Get Started",
    href: "/deck-builder",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$9",
    period: "per month",
    description: "For competitive players who want every edge.",
    features: [
      "Everything in Free",
      "Unlimited saved decks",
      "AI Deck Doctor",
      "Full meta analytics",
      "Price tracker & alerts",
      "Export to YDK / Untap",
    ],
    cta: "Start Pro",
    href: "/deck-builder",
    highlighted: true,
  },
  {
    name: "Team",
    price: "$24",
    period: "per month",
    description: "For content creators and team organizers.",
    features: [
      "Everything in Pro",
      "Up to 5 members",
      "Shared deck library",
      "Team analytics dashboard",
      "Priority support",
    ],
    cta: "Contact Us",
    href: "/contact",
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <Container className="py-10">
      <div className="mx-auto mb-10 max-w-xl text-center">
        <PageHeader
          title="Pricing"
          description="Simple, transparent pricing. No hidden fees."
          className="pb-0 [&>*]:mx-auto"
        />
      </div>

      <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`flex flex-col rounded-[var(--radius-lg)] border p-6 ${
              plan.highlighted
                ? "border-[var(--color-primary)] bg-[var(--color-primary-muted)]"
                : "border-[var(--color-border)] bg-[var(--color-surface-1)]"
            }`}
          >
            {plan.highlighted && (
              <span className="mb-4 w-fit rounded-full bg-[var(--color-primary)] px-2.5 py-0.5 text-xs font-medium text-[var(--color-primary-foreground)]">
                Most Popular
              </span>
            )}
            <div className="mb-5">
              <h2 className="text-base font-semibold text-[var(--color-foreground)]">{plan.name}</h2>
              <div className="mt-1.5 flex items-baseline gap-1">
                <span className="text-3xl font-semibold text-[var(--color-foreground)]">{plan.price}</span>
                <span className="text-sm text-[var(--color-foreground-muted)]">/{plan.period}</span>
              </div>
              <p className="mt-2 text-sm text-[var(--color-foreground-muted)]">{plan.description}</p>
            </div>

            <ul className="mb-6 flex flex-1 flex-col gap-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm text-[var(--color-foreground-muted)]">
                  <Check className="mt-0.5 size-4 shrink-0 text-[var(--color-success)]" />
                  {feature}
                </li>
              ))}
            </ul>

            <a
              href={plan.href}
              className={`inline-flex items-center justify-center rounded-[var(--radius-md)] px-4 py-2 text-sm font-medium transition-colors ${
                plan.highlighted
                  ? "bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-hover)]"
                  : "border border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-foreground)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-3)]"
              }`}
            >
              {plan.cta}
            </a>
          </div>
        ))}
      </div>

      <p className="mt-10 text-center text-sm text-[var(--color-foreground-muted)]">
        All plans include a 14-day free trial. No credit card required.
      </p>
    </Container>
  );
}

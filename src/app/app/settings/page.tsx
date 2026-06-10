import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { SectionHeader } from "@/components/layout/section-header";

export const metadata: Metadata = { title: "Settings" };

const settingSections = [
  {
    title: "Account",
    description: "Manage your profile and credentials.",
    fields: ["Display Name", "Email Address", "Password"],
  },
  {
    title: "Preferences",
    description: "Customize your DeckForge experience.",
    fields: ["Default Format", "Card Art Language", "Price Currency"],
  },
  {
    title: "Notifications",
    description: "Control when and how you receive alerts.",
    fields: ["Price Alerts", "Meta Updates", "New Features"],
  },
];

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Settings" description="Manage your account and preferences." />

      <div className="flex max-w-2xl flex-col gap-8">
        {settingSections.map((section) => (
          <section key={section.title}>
            <SectionHeader
              title={section.title}
              description={section.description}
              className="mb-3"
            />
            <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-1)]">
              {section.fields.map((field, i) => (
                <div
                  key={field}
                  className={`flex items-center justify-between gap-4 px-5 py-4 ${
                    i < section.fields.length - 1 ? "border-b border-[var(--color-border)]" : ""
                  }`}
                >
                  <div>
                    <p className="text-sm font-medium text-[var(--color-foreground)]">{field}</p>
                    <p className="text-xs text-[var(--color-foreground-subtle)]">Not configured</p>
                  </div>
                  <button className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-1.5 text-xs font-medium text-[var(--color-foreground-muted)] transition-colors hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-3)] hover:text-[var(--color-foreground)]">
                    Edit
                  </button>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Danger zone */}
        <section>
          <SectionHeader
            title="Danger Zone"
            description="Irreversible actions for your account."
            className="mb-3"
          />
          <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-danger)]/25 bg-[var(--color-surface-1)] px-5 py-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-[var(--color-foreground)]">Delete Account</p>
                <p className="text-xs text-[var(--color-foreground-muted)]">
                  Permanently delete your account and all associated data.
                </p>
              </div>
              <button className="rounded-[var(--radius-md)] border border-[var(--color-danger)]/30 px-3 py-1.5 text-xs font-medium text-[var(--color-danger)] transition-colors hover:bg-[var(--color-danger)]/10">
                Delete
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

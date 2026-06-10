import { Sidebar } from "@/components/layout/sidebar";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-bg-base)]">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 shrink-0 items-center border-b border-[var(--color-border)] bg-[var(--color-bg-surface)] px-6">
          <Breadcrumbs />
        </header>

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}

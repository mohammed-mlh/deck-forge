"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { cn } from "@/lib/utils";

interface SiteLayoutProps {
  children: React.ReactNode;
}

export function SiteLayout({ children }: SiteLayoutProps) {
  const pathname = usePathname();
  const isBuilder = pathname.startsWith("/deck-builder");

  return (
    <div
      className={cn(
        "flex flex-col bg-[var(--color-bg-base)]",
        isBuilder ? "h-screen overflow-hidden" : "min-h-screen"
      )}
    >
      <Navbar />
      <main
        className={cn(
          "flex-1",
          isBuilder ? "min-h-0 overflow-hidden" : "p-6"
        )}
      >
        {children}
      </main>
      {!isBuilder && <Footer />}
    </div>
  );
}

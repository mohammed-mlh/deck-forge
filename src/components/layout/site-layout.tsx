"use client";

import { usePathname } from "next/navigation";
import { CyberBackground } from "@/components/layout/cyber-background";
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
        "relative flex flex-col",
        isBuilder ? "h-screen overflow-hidden bg-(--color-bg-base)" : "min-h-screen"
      )}
    >
      {!isBuilder && <CyberBackground />}

      <div className={cn("relative z-10 flex flex-1 flex-col", !isBuilder && "min-h-screen")}>
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
    </div>
  );
}

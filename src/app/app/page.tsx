import type { Metadata } from "next";
import { DashboardOverview } from "@/components/app/dashboard-overview";

export const metadata: Metadata = { title: "Dashboard" };

export default function AppDashboardPage() {
  return <DashboardOverview />;
}

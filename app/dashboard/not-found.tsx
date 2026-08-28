import type { Metadata } from "next";

import { NotFoundPanel } from "@/components/marketing/not-found-panel";

export const metadata: Metadata = {
  title: "Page Not Found | PC Xpress",
};

export default function DashboardNotFound() {
  return <NotFoundPanel />;
}

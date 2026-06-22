import { AppShell } from "@/components/app-shell";

/** Shared shell for all authenticated pages. */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}

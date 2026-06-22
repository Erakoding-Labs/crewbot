"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  BookOpen,
  Bot,
  ChevronRight,
  LogOut,
} from "lucide-react";

import { cn } from "@/lib/utils";

const NAV = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Team", href: "/team", icon: Users },
  { label: "Investors", href: "/investors", icon: TrendingUp },
  { label: "Learning Hub", href: "/learning", icon: BookOpen },
  { label: "AI Copilot", href: "/copilot", icon: Bot },
];

/** Sidebar contents — reused by both the desktop rail and the mobile drawer. */
export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-base font-bold text-primary-foreground">
          F
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-foreground">FounderOS</p>
          <p className="text-xs text-muted-foreground">XYZ corp.</p>
        </div>
      </div>

      <div className="mx-6 border-t border-border" />

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV.map(({ label, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/10 text-foreground"
                  : "text-muted-foreground hover:bg-surface-hover hover:text-foreground"
              )}
            >
              <Icon className="h-[18px] w-[18px]" />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
            </Link>
          );
        })}
      </nav>

      {/* User / sign out */}
      <div className="mt-auto px-6 py-5">
        <p className="text-sm font-medium text-foreground">Akshay</p>
        <p className="mb-4 text-xs text-muted-foreground">akshaycrln@gmail.com</p>
        <button
          onClick={() => router.push("/login")}
          className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  );
}

/** Fixed desktop sidebar rail. */
export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[280px] border-r border-border bg-sidebar md:block">
      <SidebarContent />
    </aside>
  );
}

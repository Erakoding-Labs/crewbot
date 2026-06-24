"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  Compass,
  MessageSquare,
  Bell,
  BookOpen,
  Bot,
  Settings,
  ChevronRight,
  LogOut,
  User as UserIcon,
  Building2,
  Briefcase,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store/store";

const NAV = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Team", href: "/team", icon: Users },
  { label: "Discover", href: "/discover", icon: Compass },
  { label: "Investors", href: "/investors", icon: TrendingUp },
  { label: "Messages", href: "/messages", icon: MessageSquare },
  { label: "Notifications", href: "/notifications", icon: Bell, badge: true },
  { label: "Learning Hub", href: "/learning", icon: BookOpen },
  { label: "AI Copilot", href: "/copilot", icon: Bot },
];

/** Sidebar contents — reused by both the desktop rail and the mobile drawer. */
export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, unreadNotificationCount, getStartup, logout } = useStore();

  const unread = unreadNotificationCount();
  const startup = getStartup(currentUser?.startupId);

  // Recruitment is a founder-only surface — only the owner of a startup sees it.
  const isFounder = !!startup && startup.ownerId === currentUser?.id;
  const secondaryNav = [
    { label: "My Profile", href: "/profile", icon: UserIcon },
    { label: "My Startup", href: "/startup", icon: Building2 },
    ...(isFounder
      ? [{ label: "Recruitment", href: "/recruitment", icon: Briefcase }]
      : []),
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  const linkClass = (href: string) => {
    const active = pathname === href;
    return cn(
      "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
      active
        ? "bg-primary/10 text-foreground"
        : "text-muted-foreground hover:bg-surface-hover hover:text-foreground"
    );
  };

  return (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-base font-bold text-primary-foreground">
          C
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-foreground">Crewboot</p>
          <p className="text-xs text-muted-foreground">{startup?.name ?? "No startup yet"}</p>
        </div>
      </div>

      <div className="mx-6 border-t border-border" />

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4 scrollbar-thin">
        {NAV.map(({ label, href, icon: Icon, badge }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} onClick={onNavigate} className={linkClass(href)}>
              <Icon className="h-[18px] w-[18px]" />
              <span className="flex-1">{label}</span>
              {badge && unread > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground">
                  {unread}
                </span>
              )}
              {active && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
            </Link>
          );
        })}

        <div className="my-2 mx-3 border-t border-border" />

        {secondaryNav.map(({ label, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} onClick={onNavigate} className={linkClass(href)}>
              <Icon className="h-[18px] w-[18px]" />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
            </Link>
          );
        })}
      </nav>

      {/* User / sign out */}
      <div className="mt-auto px-6 py-5">
        <p className="text-sm font-medium text-foreground">{currentUser?.name ?? "Guest"}</p>
        <p className="mb-4 truncate text-xs text-muted-foreground">
          {currentUser?.email ?? ""}
        </p>
        <button
          onClick={() => {
            logout();
            router.push("/login");
          }}
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

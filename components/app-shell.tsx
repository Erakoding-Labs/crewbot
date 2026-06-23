"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

import { Sidebar, SidebarContent } from "@/components/sidebar";
import { AppStateProvider } from "@/components/app-state";
import { useStore } from "@/lib/store/store";

/**
 * Layout wrapper for every authenticated page: fixed sidebar on desktop,
 * slide-in drawer on mobile, and the scrolling main content area.
 * Also acts as the auth guard — redirects to /login when logged out.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const { ready, currentUser } = useStore();
  const router = useRouter();

  React.useEffect(() => {
    if (ready && !currentUser) router.replace("/login");
  }, [ready, currentUser, router]);

  // Avoid flashing protected content before the session is known.
  if (!ready || !currentUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  return (
    <AppStateProvider>
      <div className="min-h-screen bg-background">
        <Sidebar />

        {/* Mobile top bar */}
        <div className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-sidebar px-4 py-3 md:hidden">
          <button
            aria-label="Open menu"
            onClick={() => setDrawerOpen(true)}
            className="rounded-md p-1 text-foreground hover:bg-surface-hover"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
              F
            </div>
            <span className="text-sm font-semibold">FounderOS</span>
          </div>
        </div>

        {/* Mobile drawer */}
        {drawerOpen && (
          <div className="md:hidden">
            <div
              className="fixed inset-0 z-40 bg-black/60"
              onClick={() => setDrawerOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 z-50 w-[280px] border-r border-border bg-sidebar">
              <button
                aria-label="Close menu"
                onClick={() => setDrawerOpen(false)}
                className="absolute right-3 top-4 rounded-md p-1 text-muted-foreground hover:bg-surface-hover"
              >
                <X className="h-5 w-5" />
              </button>
              <SidebarContent onNavigate={() => setDrawerOpen(false)} />
            </div>
          </div>
        )}

        {/* Main content */}
        <main className="md:pl-[280px]">
          <div className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8 lg:px-10">
            {children}
          </div>
        </main>

        <MadeWithPill />
      </div>
    </AppStateProvider>
  );
}

/** Floating bottom-right badge. */
function MadeWithPill() {
  return (
    <div className="fixed bottom-5 right-5 z-20 flex items-center gap-2 rounded-full border border-border bg-popover/90 px-4 py-2 text-sm text-foreground shadow-lg backdrop-blur">
      <span className="flex h-4 w-4 items-center justify-center rounded-sm bg-primary text-[10px] font-bold text-primary-foreground">
        F
      </span>
      Made with FounderOS
    </div>
  );
}

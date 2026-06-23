"use client";

import { useRouter } from "next/navigation";
import { Bell, Check, UserPlus, MessageSquare, Info } from "lucide-react";

import { cn, timeAgo } from "@/lib/utils";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store/store";
import type { NotificationType } from "@/lib/types";

const ICONS: Record<NotificationType, React.ElementType> = {
  join_request: UserPlus,
  request_accepted: Check,
  request_declined: Info,
  message: MessageSquare,
  system: Info,
};

export default function NotificationsPage() {
  const router = useRouter();
  const {
    db,
    currentUser,
    getUser,
    getStartup,
    respondToRequest,
    markNotificationRead,
    markAllNotificationsRead,
  } = useStore();

  if (!currentUser) return null;

  const myNotifs = db.notifications
    .filter((n) => n.userId === currentUser.id)
    .sort((a, b) => b.timestamp - a.timestamp);

  // Pending requests to startups I own (founder actions).
  const incomingRequests = db.joinRequests.filter((r) => {
    const s = getStartup(r.startupId);
    return r.status === "pending" && s?.ownerId === currentUser.id;
  });

  return (
    <>
      <PageHeader
        title="Notifications"
        subtitle="Updates, requests, and ways to stand out"
        actions={
          myNotifs.some((n) => !n.read) ? (
            <Button variant="outline" onClick={markAllNotificationsRead}>
              Mark all read
            </Button>
          ) : undefined
        }
      />

      {/* Incoming join requests */}
      {incomingRequests.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Requests to your startup
          </h2>
          <div className="space-y-3">
            {incomingRequests.map((r) => {
              const requester = getUser(r.requesterId);
              const startup = getStartup(r.startupId);
              return (
                <Card key={r.id} className="p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-medium text-foreground">
                        {requester?.name} wants to join {startup?.name}
                      </p>
                      <p className="text-sm text-muted-foreground">{r.message || "No message provided."}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => respondToRequest(r.id, false)}>
                        Decline
                      </Button>
                      <Button onClick={() => respondToRequest(r.id, true)}>Accept</Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      {/* Feed */}
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        All notifications
      </h2>
      {myNotifs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Bell className="mb-2 h-8 w-8" />
          You&apos;re all caught up.
        </div>
      ) : (
        <div className="space-y-2">
          {myNotifs.map((n) => {
            const Icon = ICONS[n.type];
            return (
              <button
                key={n.id}
                onClick={() => {
                  markNotificationRead(n.id);
                  if (n.href) router.push(n.href);
                }}
                className={cn(
                  "flex w-full items-start gap-3 rounded-xl border border-border p-4 text-left transition-colors hover:bg-surface-hover",
                  n.read ? "bg-surface/40" : "bg-surface"
                )}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className={cn("font-medium", n.read ? "text-muted-foreground" : "text-foreground")}>
                      {n.title}
                    </p>
                    <span className="shrink-0 text-xs text-muted-foreground">{timeAgo(n.timestamp)}</span>
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">{n.body}</p>
                </div>
                {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />}
              </button>
            );
          })}
        </div>
      )}
    </>
  );
}

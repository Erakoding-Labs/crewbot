"use client";

import * as React from "react";
import { Users, Briefcase } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TagBadge } from "@/components/badges";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useStore } from "@/lib/store/store";
import type { Startup } from "@/lib/types";

/** Startup card on Discover with a request-to-join action. */
export function StartupCard({ startup }: { startup: Startup }) {
  const { currentUser, db, requestToJoin } = useStore();
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [roleId, setRoleId] = React.useState("");

  // PRD rule: a user may belong to only one startup unless their current
  // startup has granted permission to join others.
  const alreadyInStartup = !!currentUser?.startupId;
  const blockedByExclusivity = alreadyInStartup && !currentUser?.canJoinOthers;

  const existingRequest = db.joinRequests.find(
    (r) => r.startupId === startup.id && r.requesterId === currentUser?.id
  );

  const selectedRole = startup.openRoles.find((r) => r.id === roleId);

  const submit = () => {
    requestToJoin(startup.id, message.trim(), roleId || undefined);
    setMessage("");
    setRoleId("");
    setOpen(false);
  };

  return (
    <Card className="flex flex-col p-5 transition-colors hover:bg-surface-hover">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-semibold text-foreground">{startup.name}</p>
          <p className="text-sm text-muted-foreground">{startup.industry}</p>
        </div>
        <TagBadge label={startup.stage} filled />
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{startup.description}</p>

      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Users className="h-4 w-4" /> {startup.teamSize}
        </span>
        <span className="flex items-center gap-1.5">
          <Briefcase className="h-4 w-4" /> {startup.openRoles.length} open roles
        </span>
      </div>

      <div className="mt-4 border-t border-border pt-4">
        {existingRequest ? (
          <Button variant="outline" className="w-full" disabled>
            Application {existingRequest.status}
          </Button>
        ) : (
          <Button
            className="w-full"
            variant="outline"
            disabled={blockedByExclusivity}
            onClick={() => setOpen(true)}
          >
            {blockedByExclusivity ? "Locked to current startup" : "Apply to join"}
          </Button>
        )}
        {blockedByExclusivity && (
          <p className="mt-2 text-xs text-muted-foreground">
            Your current startup hasn&apos;t permitted joining others.
          </p>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply to {startup.name}</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">{startup.description}</p>

          <div className="space-y-4">
            {startup.openRoles.length > 0 && (
              <div className="space-y-1.5">
                <label className="text-sm text-muted-foreground">Role you&apos;re applying for</label>
                <select
                  value={roleId}
                  onChange={(e) => setRoleId(e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">General interest (no specific role)</option>
                  {startup.openRoles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title}
                    </option>
                  ))}
                </select>
                {selectedRole?.description && (
                  <p className="text-xs text-muted-foreground">{selectedRole.description}</p>
                )}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm text-muted-foreground">Why you&apos;re a great fit</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="Introduce yourself, your relevant experience, and why this startup. This is what the founder reviews."
                autoFocus
                className="flex w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={submit} disabled={!message.trim()}>
              Send application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

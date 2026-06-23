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
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/store/store";
import type { Startup } from "@/lib/types";

/** Startup card on Discover with a request-to-join action. */
export function StartupCard({ startup }: { startup: Startup }) {
  const { currentUser, db, requestToJoin } = useStore();
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");

  // PRD rule: a user may belong to only one startup unless their current
  // startup has granted permission to join others.
  const alreadyInStartup = !!currentUser?.startupId;
  const blockedByExclusivity = alreadyInStartup && !currentUser?.canJoinOthers;

  const existingRequest = db.joinRequests.find(
    (r) => r.startupId === startup.id && r.requesterId === currentUser?.id
  );

  const submit = () => {
    requestToJoin(startup.id, message.trim());
    setMessage("");
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
            Request {existingRequest.status}
          </Button>
        ) : (
          <Button
            className="w-full"
            variant="outline"
            disabled={blockedByExclusivity}
            onClick={() => setOpen(true)}
          >
            {blockedByExclusivity ? "Locked to current startup" : "Request to join"}
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
            <DialogTitle>Request to join {startup.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Message to the founder</label>
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell them why you're a great fit"
              autoFocus
            />
          </div>
          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={submit}>Send request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

"use client";

import { CheckSquare, Clock, MessageSquare, Pencil } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import type { User } from "@/lib/types";

interface TeamMemberCardProps {
  member: User;
  /** Team role/title within the startup (e.g. "CTO"). */
  role: string;
  isOwner: boolean;
  isSelf: boolean;
  done: number;
  pending: number;
  /** Founder-only: edit this member's role. */
  canManage: boolean;
  onMessage: () => void;
  onEditRole: () => void;
}

/** Roster tile: member identity, team role, workload, and quick actions. */
export function TeamMemberCard({
  member,
  role,
  isOwner,
  isSelf,
  done,
  pending,
  canManage,
  onMessage,
  onEditRole,
}: TeamMemberCardProps) {
  return (
    <Card className="flex flex-col p-5">
      <div className="flex items-start gap-3">
        <UserAvatar user={member} className="h-11 w-11 text-base" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate font-semibold text-foreground">{member.name}</p>
            {isOwner && (
              <span className="rounded-md bg-primary/15 px-1.5 py-0.5 text-[11px] font-medium text-primary">
                Owner
              </span>
            )}
          </div>
          <p className="truncate text-sm text-muted-foreground">
            {role || "No role set"}
          </p>
        </div>
        {canManage && (
          <button
            type="button"
            aria-label={`Edit ${member.name}'s role`}
            onClick={onEditRole}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
          >
            <Pencil className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <CheckSquare className="h-4 w-4 text-emerald-400" />
          {done} done
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="h-4 w-4" />
          {pending} pending
        </span>
      </div>

      {!isSelf && (
        <Button variant="outline" size="sm" className="mt-4 w-full" onClick={onMessage}>
          <MessageSquare className="h-4 w-4" /> Message
        </Button>
      )}
    </Card>
  );
}

"use client";

import { MapPin, MessageSquare, Linkedin, Globe, Check, X } from "lucide-react";

import { cn, timeAgo } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TagBadge } from "@/components/badges";
import { USER_ROLE_LABELS, type JoinRequest, type User } from "@/lib/types";

/** A single application on the founder's Recruitment board. */
export function ApplicantCard({
  request,
  applicant,
  onAccept,
  onDecline,
  onMessage,
}: {
  request: JoinRequest;
  applicant?: User;
  onAccept: () => void;
  onDecline: () => void;
  onMessage: () => void;
}) {
  const pending = request.status === "pending";

  return (
    <Card className="flex flex-col p-5">
      {/* Header: applicant identity + applied role */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-base font-semibold",
              applicant?.avatarColor ?? "bg-primary/20 text-primary"
            )}
          >
            {applicant?.name.charAt(0) ?? "?"}
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-foreground">
              {applicant?.name ?? "Unknown applicant"}
            </p>
            <p className="text-sm text-primary">
              {applicant ? USER_ROLE_LABELS[applicant.role] : "—"}
            </p>
          </div>
        </div>
        <span className="shrink-0 text-xs text-muted-foreground">
          {timeAgo(request.createdAt)}
        </span>
      </div>

      {/* Applied-for role + status */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <TagBadge label={request.roleTitle ?? "General interest"} filled />
        {!pending && (
          <span
            className={cn(
              "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium capitalize",
              request.status === "accepted"
                ? "bg-emerald-500/15 text-emerald-400"
                : "bg-red-500/15 text-red-400"
            )}
          >
            {request.status}
          </span>
        )}
      </div>

      {/* The applicant's pitch */}
      <p className="mt-3 text-sm text-muted-foreground">
        {request.message || "No message provided."}
      </p>

      {/* Skills */}
      {applicant && applicant.skills.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {applicant.skills.slice(0, 5).map((s) => (
            <TagBadge key={s} label={s} />
          ))}
        </div>
      )}

      {/* Meta: location + links */}
      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-muted-foreground">
        {applicant?.location && (
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" /> {applicant.location}
          </span>
        )}
        {applicant?.linkedin && (
          <a
            href={applicant.linkedin}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-primary hover:underline"
          >
            <Linkedin className="h-4 w-4" /> LinkedIn
          </a>
        )}
        {applicant?.portfolio && (
          <a
            href={applicant.portfolio}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-primary hover:underline"
          >
            <Globe className="h-4 w-4" /> Portfolio
          </a>
        )}
      </div>

      {/* Actions */}
      <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
        {pending ? (
          <>
            <Button onClick={onAccept} className="flex-1 sm:flex-none">
              <Check className="h-4 w-4" /> Accept
            </Button>
            <Button variant="outline" onClick={onDecline} className="flex-1 sm:flex-none">
              <X className="h-4 w-4" /> Decline
            </Button>
            <Button variant="ghost" onClick={onMessage} className="flex-1 sm:flex-none">
              <MessageSquare className="h-4 w-4" /> Message
            </Button>
          </>
        ) : (
          <Button variant="outline" onClick={onMessage} className="w-full sm:w-auto">
            <MessageSquare className="h-4 w-4" /> Message
          </Button>
        )}
      </div>
    </Card>
  );
}

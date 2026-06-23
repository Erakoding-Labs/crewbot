"use client";

import { useRouter } from "next/navigation";
import { MapPin, MessageSquare } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TagBadge } from "@/components/badges";
import { useStore } from "@/lib/store/store";
import { USER_ROLE_LABELS, type User } from "@/lib/types";

/** Person card used on Discover — avatar, role, skills, and a message action. */
export function UserCard({ user }: { user: User }) {
  const router = useRouter();
  const { currentUser, getOrCreateConversation } = useStore();

  const message = () => {
    const conv = getOrCreateConversation(user.id);
    router.push(`/messages?c=${conv.id}`);
  };

  return (
    <Card className="flex flex-col p-5 transition-colors hover:bg-surface-hover">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-full text-base font-semibold",
            user.avatarColor
          )}
        >
          {user.name.charAt(0)}
        </div>
        <div className="min-w-0">
          <p className="truncate font-semibold text-foreground">{user.name}</p>
          <p className="text-sm text-primary">{USER_ROLE_LABELS[user.role]}</p>
        </div>
      </div>

      {user.bio && (
        <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{user.bio}</p>
      )}

      {user.skills.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {user.skills.slice(0, 4).map((s) => (
            <TagBadge key={s} label={s} />
          ))}
        </div>
      )}

      {user.location && (
        <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          {user.location}
        </p>
      )}

      <div className="mt-4 border-t border-border pt-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={message}
          disabled={currentUser?.id === user.id}
        >
          <MessageSquare className="h-4 w-4" />
          {currentUser?.id === user.id ? "This is you" : "Message"}
        </Button>
      </div>
    </Card>
  );
}

import { cn } from "@/lib/utils";
import type { User } from "@/lib/types";

/** Initial tile using the user's seeded avatar color. Falls back for empty slots. */
export function UserAvatar({
  user,
  className,
}: {
  user?: Pick<User, "name" | "avatarColor"> | null;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold",
        user?.avatarColor ?? "bg-secondary text-muted-foreground",
        className
      )}
    >
      {user ? user.name.charAt(0).toUpperCase() : "?"}
    </div>
  );
}

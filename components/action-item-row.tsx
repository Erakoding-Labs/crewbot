import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { PriorityBadge } from "@/components/badges";
import type { ActionItem } from "@/lib/types";

const dotColor: Record<ActionItem["priority"], string> = {
  High: "bg-red-500",
  Medium: "bg-amber-500",
  Low: "bg-gray-500",
};

/** Row in the Action Items list: colored dot, title, description, priority badge. */
export function ActionItemRow({ item }: { item: ActionItem }) {
  return (
    <Card className="bg-surface/60 p-4 transition-colors hover:bg-surface-hover">
      <div className="flex items-start gap-3">
        <span className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", dotColor[item.priority])} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <p className="font-semibold text-foreground">{item.title}</p>
            <PriorityBadge priority={item.priority} />
          </div>
          <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
            {item.description}
          </p>
        </div>
      </div>
    </Card>
  );
}

import { cn } from "@/lib/utils";
import type { Priority, InsightCategory } from "@/lib/types";

/** Priority pill — High = red, Medium = amber, Low = gray. */
export function PriorityBadge({ priority }: { priority: Priority }) {
  const styles: Record<Priority, string> = {
    High: "bg-red-500/15 text-red-400",
    Medium: "bg-amber-500/15 text-amber-400",
    Low: "bg-gray-500/15 text-gray-400",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        styles[priority]
      )}
    >
      {priority}
    </span>
  );
}

/** Stage / sector tag. Filled (violet) for stages, outlined for sectors. */
export function TagBadge({
  label,
  filled = false,
}: {
  label: string;
  filled?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        filled
          ? "bg-primary/15 text-primary"
          : "border border-border text-muted-foreground"
      )}
    >
      {label}
    </span>
  );
}

/** Colored category label for Copilot insights. */
export function InsightCategoryLabel({
  category,
}: {
  category: InsightCategory;
}) {
  const styles: Record<InsightCategory, string> = {
    Team: "bg-blue-500/15 text-blue-400",
    Funding: "bg-primary/15 text-primary",
    Learning: "bg-emerald-500/15 text-emerald-400",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        styles[category]
      )}
    >
      {category}
    </span>
  );
}

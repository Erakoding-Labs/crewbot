import { Card } from "@/components/ui/card";
import { InsightCategoryLabel } from "@/components/badges";
import type { Insight } from "@/lib/types";

/** A single Copilot insight: category label, title, and truncated body. */
export function InsightCard({ insight }: { insight: Insight }) {
  return (
    <Card className="bg-surface/60 p-4 transition-colors hover:bg-surface-hover">
      <div className="flex gap-3">
        <div className="pt-0.5">
          <InsightCategoryLabel category={insight.category} />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-foreground">{insight.title}</p>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {insight.body}
          </p>
        </div>
      </div>
    </Card>
  );
}

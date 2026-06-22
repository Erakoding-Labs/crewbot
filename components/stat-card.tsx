import type { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconClassName?: string;
}

/** Compact metric tile used in the dashboard stats row. */
export function StatCard({ label, value, icon: Icon, iconClassName }: StatCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <Icon className={iconClassName ?? "h-5 w-5 text-muted-foreground"} />
      </div>
      <p className="mt-3 text-3xl font-bold text-foreground">{value}</p>
    </Card>
  );
}

import Link from "next/link";
import { ArrowUpRight, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconClassName?: string;
  /** When set, the whole tile becomes a link to this page. */
  href?: string;
}

/** Compact metric tile used in the dashboard stats row. */
export function StatCard({ label, value, icon: Icon, iconClassName, href }: StatCardProps) {
  const body = (
    <Card
      className={cn(
        "p-5",
        href && "group transition-colors hover:border-primary/40 hover:bg-surface-hover"
      )}
    >
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <Icon className={iconClassName ?? "h-5 w-5 text-muted-foreground"} />
      </div>
      <div className="mt-3 flex items-end justify-between">
        <p className="text-3xl font-bold text-foreground">{value}</p>
        {href && (
          <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
        )}
      </div>
    </Card>
  );

  return href ? (
    <Link href={href} className="block">
      {body}
    </Link>
  ) : (
    body
  );
}

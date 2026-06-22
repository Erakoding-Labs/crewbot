"use client";

import { Bookmark, MapPin, DollarSign } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { TagBadge } from "@/components/badges";
import { useAppState } from "@/components/app-state";
import type { Investor } from "@/lib/types";

/** Investor profile card with a bookmark toggle wired to shared app state. */
export function InvestorCard({ investor }: { investor: Investor }) {
  const { savedInvestors, toggleSavedInvestor } = useAppState();
  const saved = savedInvestors.has(investor.id);

  return (
    <Card className="flex flex-col p-5 transition-colors hover:bg-surface-hover">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-secondary text-sm font-semibold text-foreground">
            {investor.name.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-foreground">{investor.name}</p>
            <p className="text-sm text-muted-foreground">
              {investor.role} at {investor.firm}
            </p>
          </div>
        </div>
        <button
          aria-label={saved ? "Remove from saved" : "Save investor"}
          onClick={() => toggleSavedInvestor(investor.id)}
          className="rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
        >
          <Bookmark
            className={cn("h-5 w-5", saved && "fill-primary text-primary")}
          />
        </button>
      </div>

      <p className="mt-4 line-clamp-2 text-sm text-muted-foreground">
        {investor.bio}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {investor.stages.map((s) => (
          <TagBadge key={s} label={s} filled />
        ))}
        {investor.sectors.map((s) => (
          <TagBadge key={s} label={s} />
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <MapPin className="h-4 w-4" />
          {investor.location}
        </span>
        <span className="flex items-center gap-1">
          <DollarSign className="h-4 w-4" />
          {investor.checkSize}
        </span>
      </div>

      <div className="mt-4 border-t border-border pt-4 text-sm text-muted-foreground">
        Portfolio: {investor.portfolio.join(", ")}
      </div>
    </Card>
  );
}

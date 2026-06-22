"use client";

import { Star, ExternalLink, Clock, Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { useAppState } from "@/components/app-state";
import type { Resource } from "@/lib/types";

/** Colored letter tile based on the first letter of the author. */
function AuthorTile({ author }: { author: string }) {
  const palette = [
    "bg-emerald-500/20 text-emerald-400",
    "bg-blue-500/20 text-blue-400",
    "bg-primary/20 text-primary",
    "bg-amber-500/20 text-amber-400",
  ];
  const idx = author.charCodeAt(0) % palette.length;
  return (
    <div
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-md text-sm font-semibold",
        palette[idx]
      )}
    >
      {author.charAt(0)}
    </div>
  );
}

interface ResourceCardProps {
  resource: Resource;
  /** Featured cards show the star next to the title. */
  variant?: "featured" | "list";
}

/** Learning resource card with a completion-circle toggle (shared state). */
export function ResourceCard({ resource, variant = "list" }: ResourceCardProps) {
  const { completedResources, toggleCompletedResource } = useAppState();
  const completed = completedResources.has(resource.id);

  return (
    <Card className="p-4 transition-colors hover:bg-surface-hover">
      <div className="flex items-start gap-3">
        <AuthorTile author={resource.author} />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              {variant === "featured" && (
                <Star className="h-4 w-4 shrink-0 fill-amber-400 text-amber-400" />
              )}
              <p className="font-semibold text-foreground">{resource.title}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open resource"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
              <button
                aria-label={completed ? "Mark incomplete" : "Mark complete"}
                onClick={() => toggleCompletedResource(resource.id)}
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full border transition-colors",
                  completed
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : "border-muted-foreground/50 text-transparent hover:border-foreground"
                )}
              >
                <Check className="h-3 w-3" />
              </button>
            </div>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            {resource.description}
          </p>

          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
            <span>{resource.author}</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {resource.duration}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

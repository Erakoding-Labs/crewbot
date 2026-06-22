"use client";

import * as React from "react";
import { Search, Star } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { ResourceCard } from "@/components/resource-card";
import { FilterPills, type FilterOption } from "@/components/filter-pills";
import { Input } from "@/components/ui/input";

import { resources } from "@/lib/mock/resources";
import type { ResourceCategory } from "@/lib/types";

const CATEGORIES: ResourceCategory[] = [
  "Product",
  "Growth",
  "Fundraising",
  "Strategy",
  "Team",
  "Fundamentals",
  "AI",
];

export default function LearningPage() {
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState("All");

  const featured = resources.filter((r) => r.featured);

  // Build category pills with live counts.
  const pills: FilterOption[] = [
    { label: "All", value: "All" },
    ...CATEGORIES.map((c) => ({
      label: c,
      value: c,
      count: resources.filter((r) => r.category === c).length,
    })),
  ];

  const filtered = resources.filter((r) => {
    const matchesCat = category === "All" || r.category === category;
    const q = query.toLowerCase();
    const matchesQuery =
      !q ||
      r.title.toLowerCase().includes(q) ||
      r.author.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  return (
    <>
      <PageHeader
        title="Learning Hub"
        subtitle="Curated resources to level up as a founder"
      />

      {/* Featured */}
      <h2 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <Star className="h-4 w-4 text-amber-400" /> Featured Resources
      </h2>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {featured.map((r) => (
          <ResourceCard key={r.id} resource={r} variant="featured" />
        ))}
      </div>

      {/* Search + category filters */}
      <div className="mt-8 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search resources..."
            className="pl-9"
          />
        </div>
        <FilterPills options={pills} active={category} onChange={setCategory} />
      </div>

      {/* Full list */}
      <div className="mt-6 space-y-3">
        {filtered.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">
            No resources match your search.
          </p>
        ) : (
          filtered.map((r) => <ResourceCard key={r.id} resource={r} />)
        )}
      </div>
    </>
  );
}

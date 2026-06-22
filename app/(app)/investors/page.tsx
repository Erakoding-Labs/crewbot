"use client";

import * as React from "react";
import { Search } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { InvestorCard } from "@/components/investor-card";
import { FilterPills, type FilterOption } from "@/components/filter-pills";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAppState } from "@/components/app-state";

import { investors } from "@/lib/mock/investors";
import type { Investor, Stage } from "@/lib/types";

const STAGE_FILTERS: FilterOption[] = [
  { label: "All", value: "All" },
  { label: "Pre-Seed", value: "Pre-Seed" },
  { label: "Seed", value: "Seed" },
  { label: "Series A", value: "Series A" },
  { label: "Series B", value: "Series B" },
];

export default function InvestorsPage() {
  const { savedInvestors } = useAppState();
  const [query, setQuery] = React.useState("");
  const [stage, setStage] = React.useState("All");

  /** Apply search + stage filter to a list of investors. */
  const filter = (list: Investor[]) =>
    list.filter((inv) => {
      const matchesStage =
        stage === "All" || inv.stages.includes(stage as Stage);
      const q = query.toLowerCase();
      const matchesQuery =
        !q ||
        inv.name.toLowerCase().includes(q) ||
        inv.firm.toLowerCase().includes(q) ||
        inv.sectors.some((s) => s.toLowerCase().includes(q)) ||
        inv.bio.toLowerCase().includes(q);
      return matchesStage && matchesQuery;
    });

  const all = filter(investors);
  const saved = filter(investors.filter((i) => savedInvestors.has(i.id)));

  const Grid = ({ list }: { list: Investor[] }) =>
    list.length === 0 ? (
      <p className="py-16 text-center text-muted-foreground">
        No investors match your filters.
      </p>
    ) : (
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {list.map((inv) => (
          <InvestorCard key={inv.id} investor={inv} />
        ))}
      </div>
    );

  return (
    <>
      <PageHeader
        title="Investors"
        subtitle="Discover and connect with the right investors for your stage"
      />

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Investors</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
        </TabsList>

        {/* Search + stage filters (shared across both tabs) */}
        <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search investors..."
              className="pl-9"
            />
          </div>
          <FilterPills options={STAGE_FILTERS} active={stage} onChange={setStage} />
        </div>

        <TabsContent value="all">
          <Grid list={all} />
        </TabsContent>
        <TabsContent value="saved">
          <Grid list={saved} />
        </TabsContent>
      </Tabs>
    </>
  );
}

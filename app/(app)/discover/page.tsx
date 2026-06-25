"use client";

import * as React from "react";
import { Search, Users, Building2 } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { UserCard } from "@/components/user-card";
import { StartupCard } from "@/components/startup-card";
import { FilterPills, type FilterOption } from "@/components/filter-pills";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useStore } from "@/lib/store/store";
import { USER_ROLE_LABELS, type UserRole } from "@/lib/types";

const ROLE_FILTERS: FilterOption[] = [
  { label: "All", value: "All" },
  ...(Object.entries(USER_ROLE_LABELS) as [UserRole, string][]).map(([value, label]) => ({
    label,
    value,
  })),
];

export default function DiscoverPage() {
  const { db, currentUser } = useStore();
  const [query, setQuery] = React.useState("");
  const [role, setRole] = React.useState("All");

  const q = query.toLowerCase();

  const people = db.users
    .filter((u) => u.id !== currentUser?.id)
    // Respect the "discoverable" privacy setting (defaults to true).
    .filter((u) => db.settings[u.id]?.discoverable !== false)
    .filter((u) => role === "All" || u.role === role)
    .filter(
      (u) =>
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.bio.toLowerCase().includes(q) ||
        u.location.toLowerCase().includes(q) ||
        u.skills.some((s) => s.toLowerCase().includes(q)) ||
        (u.interests ?? []).some((i) => i.toLowerCase().includes(q))
    );

  const startups = db.startups
    .filter((s) => s.id !== currentUser?.startupId)
    .filter(
      (s) =>
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.industry.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
    );

  return (
    <>
      <PageHeader
        title="Discover"
        subtitle="Find founders, team members, investors, mentors, and service providers"
      />

      <Tabs defaultValue="people">
        <TabsList>
          <TabsTrigger value="people">
            <Users className="mr-1.5 h-4 w-4" /> People
          </TabsTrigger>
          <TabsTrigger value="startups">
            <Building2 className="mr-1.5 h-4 w-4" /> Startups
          </TabsTrigger>
        </TabsList>

        <div className="relative mt-6">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, skill, industry, or location..."
            className="pl-9"
          />
        </div>

        <TabsContent value="people">
          <div className="mb-6">
            <FilterPills options={ROLE_FILTERS} active={role} onChange={setRole} />
          </div>
          {people.length === 0 ? (
            <p className="py-16 text-center text-muted-foreground">No people match your filters.</p>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {people.map((u) => <UserCard key={u.id} user={u} />)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="startups">
          {startups.length === 0 ? (
            <p className="py-16 text-center text-muted-foreground">No startups match your search.</p>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {startups.map((s) => <StartupCard key={s.id} startup={s} />)}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </>
  );
}

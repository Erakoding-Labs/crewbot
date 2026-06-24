"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Briefcase, Plus, X, Users, Inbox, Building2, Compass } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { ApplicantCard } from "@/components/applicant-card";
import { FilterPills, type FilterOption } from "@/components/filter-pills";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useStore } from "@/lib/store/store";
import type { OpenRole, RequestStatus } from "@/lib/types";

const STATUS_FILTERS: FilterOption[] = [
  { label: "Pending", value: "pending" },
  { label: "Accepted", value: "accepted" },
  { label: "Declined", value: "declined" },
  { label: "All", value: "All" },
];

export default function RecruitmentPage() {
  const router = useRouter();
  const {
    ready,
    currentUser,
    db,
    getStartup,
    getUser,
    updateStartup,
    respondToRequest,
    getOrCreateConversation,
  } = useStore();

  const startup = getStartup(currentUser?.startupId);
  const isFounder = !!startup && startup.ownerId === currentUser?.id;

  // Founder-only surface — bounce anyone who reaches the URL directly.
  React.useEffect(() => {
    if (ready && currentUser && !isFounder) router.replace("/dashboard");
  }, [ready, currentUser, isFounder, router]);

  const [statusFilter, setStatusFilter] = React.useState("pending");

  if (!currentUser || !startup || !isFounder) return null;

  const requests = db.joinRequests
    .filter((r) => r.startupId === startup.id)
    .sort((a, b) => b.createdAt - a.createdAt);

  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const visible =
    statusFilter === "All"
      ? requests
      : requests.filter((r) => r.status === (statusFilter as RequestStatus));

  const message = (userId: string) => {
    const conv = getOrCreateConversation(userId);
    router.push(`/messages?c=${conv.id}`);
  };

  const applicantsForRole = (roleId: string) =>
    requests.filter((r) => r.roleId === roleId).length;

  return (
    <>
      <PageHeader
        title="Recruitment"
        subtitle={`Review applications and manage open roles at ${startup.name}`}
        actions={
          <Button asChild variant="outline">
            <Link href="/startup">
              <Building2 className="h-4 w-4" /> Startup page
            </Link>
          </Button>
        }
      />

      {/* Quick stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatTile icon={Inbox} label="Pending" value={pendingCount} />
        <StatTile icon={Users} label="Total applications" value={requests.length} />
        <StatTile icon={Briefcase} label="Open roles" value={startup.openRoles.length} />
      </div>

      <Tabs defaultValue="applications">
        <TabsList>
          <TabsTrigger value="applications">
            <Inbox className="mr-1.5 h-4 w-4" /> Applications
          </TabsTrigger>
          <TabsTrigger value="roles">
            <Briefcase className="mr-1.5 h-4 w-4" /> Open Roles
          </TabsTrigger>
        </TabsList>

        {/* Applications */}
        <TabsContent value="applications">
          <div className="mb-6">
            <FilterPills options={STATUS_FILTERS} active={statusFilter} onChange={setStatusFilter} />
          </div>

          {visible.length === 0 ? (
            <EmptyState
              icon={Inbox}
              title="No applications here yet"
              body={
                statusFilter === "pending"
                  ? "When people apply to your open roles, they'll show up here for review."
                  : "Nothing matches this filter."
              }
              action={
                <Button asChild variant="outline">
                  <Link href="/discover">
                    <Compass className="h-4 w-4" /> Find candidates on Discover
                  </Link>
                </Button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {visible.map((r) => (
                <ApplicantCard
                  key={r.id}
                  request={r}
                  applicant={getUser(r.requesterId)}
                  onAccept={() => respondToRequest(r.id, true)}
                  onDecline={() => respondToRequest(r.id, false)}
                  onMessage={() => message(r.requesterId)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Open roles management */}
        <TabsContent value="roles">
          <RolesManager
            roles={startup.openRoles}
            applicantsForRole={applicantsForRole}
            onChange={(openRoles) => updateStartup(startup.id, { openRoles })}
          />
        </TabsContent>
      </Tabs>
    </>
  );
}

/* ---------- Stat tile ---------- */
function StatTile({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
}) {
  return (
    <Card className="flex items-center gap-3 p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-bold leading-none text-foreground">{value}</p>
        <p className="mt-1 truncate text-xs text-muted-foreground">{label}</p>
      </div>
    </Card>
  );
}

/* ---------- Empty state ---------- */
function EmptyState({
  icon: Icon,
  title,
  body,
  action,
}: {
  icon: React.ElementType;
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
      <Icon className="mb-3 h-8 w-8 text-muted-foreground" />
      <p className="font-medium text-foreground">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{body}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/* ---------- Roles manager ---------- */
function RolesManager({
  roles,
  applicantsForRole,
  onChange,
}: {
  roles: OpenRole[];
  applicantsForRole: (roleId: string) => number;
  onChange: (roles: OpenRole[]) => void;
}) {
  const [title, setTitle] = React.useState("");
  const [desc, setDesc] = React.useState("");

  const addRole = () => {
    if (!title.trim()) return;
    onChange([
      ...roles,
      { id: `r-${Date.now()}`, title: title.trim(), description: desc.trim() },
    ]);
    setTitle("");
    setDesc("");
  };

  const removeRole = (id: string) => onChange(roles.filter((r) => r.id !== id));

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      {/* Existing roles */}
      <div className="space-y-3 lg:col-span-3">
        {roles.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="No open roles yet"
            body="Post a role so people can apply to it from Discover."
          />
        ) : (
          roles.map((r) => (
            <Card key={r.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-foreground">{r.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{r.description}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {applicantsForRole(r.id)} application
                    {applicantsForRole(r.id) === 1 ? "" : "s"}
                  </p>
                </div>
                <button
                  aria-label={`Remove ${r.title}`}
                  onClick={() => removeRole(r.id)}
                  className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Add new role */}
      <Card className="h-fit p-5 lg:col-span-2">
        <h3 className="mb-3 text-sm font-semibold text-foreground">Post a new role</h3>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-sm text-muted-foreground">Role title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Frontend Developer"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm text-muted-foreground">Description</label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={4}
              placeholder="What they'll own, the stack, and what makes a great fit."
              className="flex w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <Button onClick={addRole} disabled={!title.trim()} className="w-full">
            <Plus className="h-4 w-4" /> Add role
          </Button>
        </div>
      </Card>
    </div>
  );
}

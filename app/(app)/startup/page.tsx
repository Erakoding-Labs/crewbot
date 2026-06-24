"use client";

import * as React from "react";
import Link from "next/link";
import { Globe, Users, Plus, X, Briefcase } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TagBadge } from "@/components/badges";
import { useStore } from "@/lib/store/store";
import type { OpenRole, Stage, Startup } from "@/lib/types";

const STAGES: Stage[] = ["Pre-Seed", "Seed", "Series A", "Series B"];

export default function StartupPage() {
  const { currentUser, getStartup, createStartup, updateStartup } = useStore();
  const startup = getStartup(currentUser?.startupId);
  const isOwner = !!startup && startup.ownerId === currentUser?.id;
  const [editing, setEditing] = React.useState(false);

  if (!currentUser) return null;

  // No startup yet → create flow.
  if (!startup) return <CreateStartup onCreate={createStartup} />;

  return (
    <>
      <PageHeader
        title="My Startup"
        subtitle={isOwner ? "Manage your company profile" : "Your startup"}
        actions={
          isOwner && !editing ? (
            <>
              <Button asChild variant="outline">
                <Link href="/recruitment">
                  <Briefcase className="h-4 w-4" /> Recruitment
                </Link>
              </Button>
              <Button onClick={() => setEditing(true)}>Edit startup</Button>
            </>
          ) : undefined
        }
      />

      {editing ? (
        <EditStartup
          startup={startup}
          onCancel={() => setEditing(false)}
          onSave={(patch) => {
            updateStartup(startup.id, patch);
            setEditing(false);
          }}
        />
      ) : (
        <Card className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">{startup.name}</h2>
              <p className="text-sm text-muted-foreground">{startup.industry}</p>
            </div>
            <TagBadge label={startup.stage} filled />
          </div>

          <p className="mt-4 text-sm text-muted-foreground">{startup.description}</p>

          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4" /> {startup.teamSize} team members
            </span>
            {startup.website && (
              <a href={startup.website} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-primary hover:underline">
                <Globe className="h-4 w-4" /> {startup.website.replace(/^https?:\/\//, "")}
              </a>
            )}
          </div>

          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Open Roles ({startup.openRoles.length})
              </h3>
              {isOwner && (
                <Link
                  href="/recruitment"
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  Review applications <Briefcase className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
            {startup.openRoles.length === 0 ? (
              <p className="text-sm text-muted-foreground">No open roles right now.</p>
            ) : (
              <div className="space-y-2">
                {startup.openRoles.map((r) => (
                  <div key={r.id} className="rounded-lg border border-border bg-surface p-4">
                    <p className="font-medium text-foreground">{r.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{r.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      )}
    </>
  );
}

/* ---------- Create ---------- */
function CreateStartup({ onCreate }: { onCreate: ReturnType<typeof useStore>["createStartup"] }) {
  const [form, setForm] = React.useState({
    name: "",
    industry: "",
    description: "",
    stage: "Pre-Seed" as Stage,
    website: "",
    teamSize: 1,
  });

  return (
    <>
      <PageHeader title="Create your startup" subtitle="Set up your company profile to start building your crew" />
      <Card className="max-w-2xl p-6">
        <div className="space-y-4">
          <LabeledInput label="Startup name" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} />
          <LabeledInput label="Industry" value={form.industry} onChange={(v) => setForm((f) => ({ ...f, industry: v }))} />
          <div>
            <label className="mb-1.5 block text-sm text-muted-foreground">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={3}
              className="flex w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm text-muted-foreground">Stage</label>
              <select
                value={form.stage}
                onChange={(e) => setForm((f) => ({ ...f, stage: e.target.value as Stage }))}
                className="flex h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-muted-foreground">Team size</label>
              <Input
                type="number"
                min={1}
                value={form.teamSize}
                onChange={(e) => setForm((f) => ({ ...f, teamSize: Number(e.target.value) || 1 }))}
              />
            </div>
          </div>
          <LabeledInput label="Website" value={form.website} onChange={(v) => setForm((f) => ({ ...f, website: v }))} />
          <Button disabled={!form.name.trim()} onClick={() => onCreate(form)}>
            Create startup
          </Button>
        </div>
      </Card>
    </>
  );
}

/* ---------- Edit ---------- */
function EditStartup({
  startup,
  onCancel,
  onSave,
}: {
  startup: Startup;
  onCancel: () => void;
  onSave: (patch: Partial<Startup>) => void;
}) {
  const [form, setForm] = React.useState({
    name: startup.name,
    industry: startup.industry,
    description: startup.description,
    stage: startup.stage,
    website: startup.website,
    teamSize: startup.teamSize,
    openRoles: startup.openRoles as OpenRole[],
  });
  const [roleTitle, setRoleTitle] = React.useState("");
  const [roleDesc, setRoleDesc] = React.useState("");

  const addRole = () => {
    if (!roleTitle.trim()) return;
    setForm((f) => ({
      ...f,
      openRoles: [...f.openRoles, { id: `r-${Date.now()}`, title: roleTitle.trim(), description: roleDesc.trim() }],
    }));
    setRoleTitle("");
    setRoleDesc("");
  };

  return (
    <Card className="max-w-2xl p-6">
      <div className="space-y-4">
        <LabeledInput label="Startup name" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} />
        <LabeledInput label="Industry" value={form.industry} onChange={(v) => setForm((f) => ({ ...f, industry: v }))} />
        <div>
          <label className="mb-1.5 block text-sm text-muted-foreground">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            rows={3}
            className="flex w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm text-muted-foreground">Stage</label>
            <select
              value={form.stage}
              onChange={(e) => setForm((f) => ({ ...f, stage: e.target.value as Stage }))}
              className="flex h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-muted-foreground">Team size</label>
            <Input
              type="number"
              min={1}
              value={form.teamSize}
              onChange={(e) => setForm((f) => ({ ...f, teamSize: Number(e.target.value) || 1 }))}
            />
          </div>
        </div>
        <LabeledInput label="Website" value={form.website} onChange={(v) => setForm((f) => ({ ...f, website: v }))} />

        {/* Open roles editor */}
        <div>
          <label className="mb-1.5 block text-sm text-muted-foreground">Open roles</label>
          <div className="mb-3 space-y-2">
            {form.openRoles.map((r) => (
              <div key={r.id} className="flex items-start justify-between gap-2 rounded-lg border border-border bg-surface p-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{r.title}</p>
                  <p className="text-xs text-muted-foreground">{r.description}</p>
                </div>
                <button onClick={() => setForm((f) => ({ ...f, openRoles: f.openRoles.filter((x) => x.id !== r.id) }))}>
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <Input value={roleTitle} onChange={(e) => setRoleTitle(e.target.value)} placeholder="Role title" />
            <Input value={roleDesc} onChange={(e) => setRoleDesc(e.target.value)} placeholder="Short description" />
            <Button type="button" variant="outline" onClick={addRole}>
              <Plus className="h-4 w-4" /> Add role
            </Button>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={() => onSave(form)}>Save</Button>
        </div>
      </div>
    </Card>
  );
}

function LabeledInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm text-muted-foreground">{label}</label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

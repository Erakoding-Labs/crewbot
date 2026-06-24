"use client";

import * as React from "react";
import Link from "next/link";
import { MapPin, Linkedin, Link2, Briefcase, X, Building2, Compass } from "lucide-react";

import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TagBadge } from "@/components/badges";
import { useStore } from "@/lib/store/store";
import { USER_ROLE_LABELS } from "@/lib/types";

export default function ProfilePage() {
  const { currentUser, updateProfile } = useStore();
  const [editing, setEditing] = React.useState(false);

  // Local editable copy.
  const [form, setForm] = React.useState({
    name: "",
    location: "",
    bio: "",
    experience: "",
    linkedin: "",
    portfolio: "",
    skills: [] as string[],
  });
  const [skillInput, setSkillInput] = React.useState("");

  React.useEffect(() => {
    if (currentUser)
      setForm({
        name: currentUser.name,
        location: currentUser.location,
        bio: currentUser.bio,
        experience: currentUser.experience,
        linkedin: currentUser.linkedin,
        portfolio: currentUser.portfolio,
        skills: currentUser.skills,
      });
  }, [currentUser, editing]);

  if (!currentUser) return null;

  const save = () => {
    updateProfile(form);
    setEditing(false);
  };

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !form.skills.includes(s)) {
      setForm((f) => ({ ...f, skills: [...f.skills, s] }));
    }
    setSkillInput("");
  };

  return (
    <>
      <PageHeader
        title="My Profile"
        subtitle="How others see you on Crewboot"
        actions={
          editing ? (
            <>
              <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
              <Button onClick={save}>Save</Button>
            </>
          ) : (
            <>
              {currentUser.startupId ? (
                <Button asChild variant="outline">
                  <Link href="/startup">
                    <Building2 className="h-4 w-4" /> My Startup
                  </Link>
                </Button>
              ) : (
                <Button asChild variant="outline">
                  <Link href="/discover">
                    <Compass className="h-4 w-4" /> Find a startup
                  </Link>
                </Button>
              )}
              <Button onClick={() => setEditing(true)}>Edit profile</Button>
            </>
          )
        }
      />

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "flex h-16 w-16 items-center justify-center rounded-full text-2xl font-semibold",
              currentUser.avatarColor
            )}
          >
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">{currentUser.name}</h2>
            <p className="text-primary">{USER_ROLE_LABELS[currentUser.role]}</p>
            <p className="text-sm text-muted-foreground">{currentUser.email}</p>
          </div>
        </div>

        {!editing ? (
          <div className="mt-6 space-y-5">
            <Field label="Bio" value={currentUser.bio} />
            <Field label="Experience" value={currentUser.experience} icon={<Briefcase className="h-4 w-4" />} />
            <Field label="Location" value={currentUser.location} icon={<MapPin className="h-4 w-4" />} />
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Skills</p>
              {currentUser.skills.length ? (
                <div className="flex flex-wrap gap-2">
                  {currentUser.skills.map((s) => <TagBadge key={s} label={s} filled />)}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No skills added yet.</p>
              )}
            </div>
            <div className="flex flex-wrap gap-4">
              {currentUser.linkedin && (
                <a href={currentUser.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm text-primary hover:underline">
                  <Linkedin className="h-4 w-4" /> LinkedIn
                </a>
              )}
              {currentUser.portfolio && (
                <a href={currentUser.portfolio} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm text-primary hover:underline">
                  <Link2 className="h-4 w-4" /> Portfolio
                </a>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            <EditField label="Name" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} />
            <EditArea label="Bio" value={form.bio} onChange={(v) => setForm((f) => ({ ...f, bio: v }))} />
            <EditArea label="Experience" value={form.experience} onChange={(v) => setForm((f) => ({ ...f, experience: v }))} />
            <EditField label="Location" value={form.location} onChange={(v) => setForm((f) => ({ ...f, location: v }))} />
            <EditField label="LinkedIn URL" value={form.linkedin} onChange={(v) => setForm((f) => ({ ...f, linkedin: v }))} />
            <EditField label="Portfolio URL" value={form.portfolio} onChange={(v) => setForm((f) => ({ ...f, portfolio: v }))} />

            <div>
              <label className="mb-1.5 block text-sm text-muted-foreground">Skills</label>
              <div className="mb-2 flex flex-wrap gap-2">
                {form.skills.map((s) => (
                  <span key={s} className="inline-flex items-center gap-1 rounded-md bg-primary/15 px-2 py-0.5 text-xs text-primary">
                    {s}
                    <button onClick={() => setForm((f) => ({ ...f, skills: f.skills.filter((x) => x !== s) }))}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
                  placeholder="Add a skill and press Enter"
                />
                <Button type="button" variant="outline" onClick={addSkill}>Add</Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </>
  );
}

function Field({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="flex items-center gap-1.5 text-sm text-foreground">
        {icon}
        {value || <span className="text-muted-foreground">Not set</span>}
      </p>
    </div>
  );
}

function EditField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm text-muted-foreground">{label}</label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function EditArea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm text-muted-foreground">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="flex w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
    </div>
  );
}

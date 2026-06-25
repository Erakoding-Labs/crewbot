"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Rocket,
  Users,
  TrendingUp,
  Lightbulb,
  Wrench,
  Clock,
  Sparkles,
  Check,
  ArrowLeft,
  ArrowRight,
  X,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/store/store";
import {
  AVAILABILITY_OPTIONS,
  INTEREST_OPTIONS,
  USER_ROLE_DESCRIPTIONS,
  USER_ROLE_LABELS,
  type Availability,
  type UserRole,
} from "@/lib/types";

const ROLE_ICONS: Record<UserRole, LucideIcon> = {
  founder: Rocket,
  team_member: Users,
  investor: TrendingUp,
  mentor: Lightbulb,
  service_provider: Wrench,
};

const ROLE_ORDER: UserRole[] = [
  "founder",
  "team_member",
  "investor",
  "mentor",
  "service_provider",
];

const STEPS = ["Your role", "Skills", "Availability", "Interests"];

export default function OnboardingPage() {
  const router = useRouter();
  const { ready, currentUser, updateProfile } = useStore();

  const [step, setStep] = React.useState(0);
  const [role, setRole] = React.useState<UserRole | null>(null);
  const [skills, setSkills] = React.useState<string[]>([]);
  const [skillInput, setSkillInput] = React.useState("");
  const [availability, setAvailability] = React.useState<Availability | null>(null);
  const [interests, setInterests] = React.useState<string[]>([]);

  // Guard: must be signed in; skip the wizard if already done.
  React.useEffect(() => {
    if (!ready) return;
    if (!currentUser) router.replace("/login");
    else if (currentUser.onboarded) router.replace("/dashboard");
  }, [ready, currentUser, router]);

  if (!ready || !currentUser || currentUser.onboarded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  const addSkill = (raw?: string) => {
    const s = (raw ?? skillInput).trim();
    if (s && !skills.includes(s)) setSkills((p) => [...p, s]);
    setSkillInput("");
  };
  const removeSkill = (s: string) => setSkills((p) => p.filter((x) => x !== s));
  const toggleInterest = (i: string) =>
    setInterests((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]));

  const canAdvance =
    step === 0 ? !!role : step === 2 ? !!availability : true;
  const isLast = step === STEPS.length - 1;

  const finish = () => {
    updateProfile({
      role: role ?? currentUser.role,
      skills,
      availability: availability ?? undefined,
      interests,
      onboarded: true,
    });
    router.replace("/dashboard");
  };

  const skip = () => {
    updateProfile({
      role: role ?? currentUser.role,
      skills,
      availability: availability ?? undefined,
      interests,
      onboarded: true,
    });
    router.replace("/dashboard");
  };

  const next = () => (isLast ? finish() : setStep((s) => s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
            C
          </div>
          <span className="text-lg font-semibold">Crewboot</span>
        </div>
        <button
          onClick={skip}
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Skip for now
        </button>
      </header>

      {/* Body */}
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-5 pb-28 pt-4 sm:px-6">
        {/* Progress */}
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Step {step + 1} of {STEPS.length} · {STEPS[step]}
            </span>
            <span>{Math.round(((step + 1) / STEPS.length) * 100)}%</span>
          </div>
          <div className="flex gap-1.5">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-colors",
                  i <= step ? "bg-primary" : "bg-secondary"
                )}
              />
            ))}
          </div>
        </div>

        {/* Step 1 — Role */}
        {step === 0 && (
          <Step
            title="What brings you to Crewboot?"
            subtitle="We'll tailor your matches around this. You can change it later."
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {ROLE_ORDER.map((r) => {
                const Icon = ROLE_ICONS[r];
                const active = role === r;
                return (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className={cn(
                      "flex items-start gap-3 rounded-xl border p-4 text-left transition-colors",
                      active
                        ? "border-primary bg-primary/10"
                        : "border-border bg-surface hover:bg-surface-hover"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                        active ? "bg-primary text-primary-foreground" : "bg-primary/15 text-primary"
                      )}
                    >
                      <Icon className="h-[18px] w-[18px]" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground">{USER_ROLE_LABELS[r]}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {USER_ROLE_DESCRIPTIONS[r]}
                      </p>
                    </div>
                    {active && <Check className="ml-auto h-4 w-4 shrink-0 text-primary" />}
                  </button>
                );
              })}
            </div>
          </Step>
        )}

        {/* Step 2 — Skills */}
        {step === 1 && (
          <Step
            title="What are you great at?"
            subtitle="Add a few skills so the right people and teams can find you."
          >
            <div className="flex gap-2">
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill();
                  }
                }}
                placeholder="e.g. React, Sales, Fundraising — press Enter"
                autoFocus
              />
              <Button type="button" variant="outline" onClick={() => addSkill()}>
                Add
              </Button>
            </div>

            {skills.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {skills.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1 rounded-md bg-primary/15 px-2 py-1 text-sm text-primary"
                  >
                    {s}
                    <button onClick={() => removeSkill(s)} aria-label={`Remove ${s}`}>
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <p className="mb-2 mt-6 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Suggestions
            </p>
            <div className="flex flex-wrap gap-2">
              {SKILL_SUGGESTIONS.filter((s) => !skills.includes(s)).map((s) => (
                <button
                  key={s}
                  onClick={() => addSkill(s)}
                  className="rounded-md border border-border bg-surface px-2.5 py-1 text-sm text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
                >
                  + {s}
                </button>
              ))}
            </div>
          </Step>
        )}

        {/* Step 3 — Availability */}
        {step === 2 && (
          <Step
            title="How much time can you commit?"
            subtitle="This helps us match you to the right kind of opportunity."
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {AVAILABILITY_OPTIONS.map((a) => {
                const active = availability === a;
                return (
                  <button
                    key={a}
                    onClick={() => setAvailability(a)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border p-4 text-left transition-colors",
                      active
                        ? "border-primary bg-primary/10"
                        : "border-border bg-surface hover:bg-surface-hover"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                        active ? "bg-primary text-primary-foreground" : "bg-primary/15 text-primary"
                      )}
                    >
                      <Clock className="h-[18px] w-[18px]" />
                    </div>
                    <span className="font-medium text-foreground">{a}</span>
                    {active && <Check className="ml-auto h-4 w-4 text-primary" />}
                  </button>
                );
              })}
            </div>
          </Step>
        )}

        {/* Step 4 — Interests */}
        {step === 3 && (
          <Step
            title="What are you interested in?"
            subtitle="Pick the spaces you'd love to work in. Choose as many as you like."
          >
            <div className="flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map((i) => {
                const active = interests.includes(i);
                return (
                  <button
                    key={i}
                    onClick={() => toggleInterest(i)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "border-transparent bg-primary text-primary-foreground"
                        : "border-border bg-surface text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                    )}
                  >
                    {active && <Check className="h-3.5 w-3.5" />}
                    {i}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
              <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <p className="text-sm text-muted-foreground">
                That&apos;s it — we&apos;ll use your role, skills, availability, and interests to
                surface the most relevant people and teams on Discover.
              </p>
            </div>
          </Step>
        )}
      </main>

      {/* Sticky footer nav */}
      <footer className="fixed inset-x-0 bottom-0 border-t border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-3 px-5 py-4 sm:px-6">
          <Button variant="ghost" onClick={back} disabled={step === 0}>
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <Button onClick={next} disabled={!canAdvance}>
            {isLast ? (
              <>
                <Check className="h-4 w-4" /> Finish & enter Crewboot
              </>
            ) : (
              <>
                Continue <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </footer>
    </div>
  );
}

const SKILL_SUGGESTIONS = [
  "Product",
  "Engineering",
  "Design",
  "Growth",
  "Sales",
  "Marketing",
  "Fundraising",
  "Operations",
  "Data",
];

function Step({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        {title}
      </h1>
      <p className="mt-2 text-muted-foreground">{subtitle}</p>
      <div className="mt-8">{children}</div>
    </div>
  );
}

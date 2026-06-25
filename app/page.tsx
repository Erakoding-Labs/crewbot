import Link from "next/link";
import {
  Users,
  Rocket,
  MessagesSquare,
  Compass,
  ArrowRight,
  TrendingUp,
  Lightbulb,
  Wrench,
  UserPlus,
  ClipboardList,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  USER_ROLE_DESCRIPTIONS,
  USER_ROLE_LABELS,
  type UserRole,
} from "@/lib/types";

/** Public landing page — explains what Crewboot is, who it's for, and how it works. */
export default function LandingPage() {
  const features = [
    { icon: Users, title: "Build a serious team", body: "Find co-founders and teammates who are on a mission — not collecting connections like a social club." },
    { icon: Compass, title: "Discover the right people", body: "Search founders, team members, investors, mentors, and service providers — filtered to your space." },
    { icon: Rocket, title: "Move your startup forward", body: "Track team progress, assign tasks, and surface the investors interested in you." },
    { icon: MessagesSquare, title: "Talk directly", body: "Message anyone on the platform, accept requests, and keep momentum without leaving the app." },
  ];

  const roleIcons: Record<UserRole, LucideIcon> = {
    founder: Rocket,
    team_member: Users,
    investor: TrendingUp,
    mentor: Lightbulb,
    service_provider: Wrench,
  };
  const roleOrder: UserRole[] = [
    "founder",
    "team_member",
    "investor",
    "mentor",
    "service_provider",
  ];

  const steps = [
    { icon: UserPlus, title: "Create your account", body: "Sign up free in seconds — just your name, email, and a password." },
    { icon: ClipboardList, title: "Tell us about you", body: "A quick 4-step setup: your role, skills, availability, and interests." },
    { icon: Sparkles, title: "Get matched & build", body: "Land in your dashboard and connect with the most relevant people and teams." },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
              C
            </div>
            <span className="text-lg font-semibold">Crewboot</span>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost">
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign up free</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 pb-20 pt-20 text-center sm:pt-24">
        <p className="mb-4 inline-flex rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted-foreground">
          Free for founders — build your crew
        </p>
        <h1 className="text-balance text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
          Find your{" "}
          <span className="text-primary">co-founders &amp; team</span>{" "}
          and build faster
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Crewboot is the operating system for early-stage founders. Find serious teammates,
          talk to investors, learn fast, and get AI guidance — all in one focused home, matched
          to your role, skills, and interests.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/signup">
              Get started free <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
            <Link href="/login">I have an account</Link>
          </Button>
        </div>
      </section>

      {/* Who it's for */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Built for everyone in the startup journey</h2>
          <p className="mt-3 text-muted-foreground">
            Tell us who you are when you sign up, and we&apos;ll tailor your matches.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {roleOrder.map((r) => {
            const Icon = roleIcons[r];
            return (
              <div key={r} className="rounded-xl border border-border bg-surface p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold text-foreground">{USER_ROLE_LABELS[r]}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{USER_ROLE_DESCRIPTIONS[r]}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-border bg-sidebar/40">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold tracking-tight">How it works</h2>
            <p className="mt-3 text-muted-foreground">From sign-up to your first connection in minutes.</p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.title} className="relative rounded-xl border border-border bg-surface p-6">
                <span className="absolute right-5 top-5 text-3xl font-bold text-border">
                  {i + 1}
                </span>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <s.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold text-foreground">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Everything in one place</h2>
          <p className="mt-3 text-muted-foreground">No more juggling spreadsheets, CRMs, and bookmarks.</p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl border border-border bg-surface p-6">
              <f.icon className="h-6 w-6 text-primary" />
              <h3 className="mt-4 font-semibold text-foreground">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="rounded-2xl border border-primary/30 bg-primary/10 px-6 py-14 text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to build your crew?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Join Crewboot free and get matched with the people who can help you move faster.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/signup">
              Get started free <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Crewboot — Let&apos;s create something meaningful to scale.
      </footer>
    </div>
  );
}

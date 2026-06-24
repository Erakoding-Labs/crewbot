import Link from "next/link";
import { Users, Rocket, MessagesSquare, Compass, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

/** Public landing page — vision + CTA to sign up (PRD). */
export default function LandingPage() {
  const features = [
    { icon: Users, title: "Build a serious team", body: "Find co-founders and team members who are on a mission — not collecting people like a social club." },
    { icon: Compass, title: "Discover the right people", body: "Search founders, investors, mentors, and service providers in your field." },
    { icon: Rocket, title: "Move your startup forward", body: "Track team progress, assign tasks, and surface the investors interested in you." },
    { icon: MessagesSquare, title: "Talk directly", body: "Message anyone on the platform. Accept requests. Keep momentum while you're away." },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
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
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 pb-16 pt-20 text-center">
        <p className="mb-4 inline-flex rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted-foreground">
          Free for founders — build your crew
        </p>
        <h1 className="text-balance text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
          Waste no time finding your{" "}
          <span className="text-primary">co-founders & team</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Crewboot helps early-stage founders find serious team members, talk to investors,
          and get the knowledge they need to move forward — all in one place.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/signup">
              Get started free <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/login">I have an account</Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
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

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Crewboot — Let&apos;s create something meaningful to scale.
      </footer>
    </div>
  );
}
